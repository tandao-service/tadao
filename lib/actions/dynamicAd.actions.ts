"use server"

import { CreateAdShopParams, CreateBookmarkParams, CreatePackagesParams, DeleteAdParams, DeleteBookmarkParams, DeleteCategoryParams, DeletePackagesParams, GetAdsByUserParams, GetAlldynamicAdParams, GetRelatedAdsBySubCategoryParams, UpdateAbuseParams, UpdateBookmarkedParams, UpdateCallsParams, UpdateInquiriesParams, UpdatePackagesParams, UpdateShareParams, UpdateStatusParams, UpdateVideoParams, UpdateViewsParams, UpdateWhatsappParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Category from "../database/models/category.model"
import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"
import Packages from "../database/models/packages.model"
import Bookmark from "../database/models/bookmark.model"
import Ad from "../database/models/ad.model"
import nodemailer from 'nodemailer';
import DynamicAd from "../database/models/dynamicAd.model"
import User from "../database/models/user.model"
import { createTransaction } from "./transactions.actions"
import Subcategory from "../database/models/subcategory.model"
import { PipelineStage } from "mongoose"
import { requireCanPostAd } from "@/lib/actions/subscription.guard"


const populateAd = (query: any) => {
  return query
    .populate({ path: 'subcategory', model: Subcategory, select: 'fields' })
    .populate({ path: 'organizer', model: User, select: '_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified token notifications' })
    .populate({ path: 'plan', model: Packages, select: '_id name color imageUrl' })
}

export const fetchDynamicAds = async () => {
  try {
    await connectToDatabase();
    const response = await DynamicAd.find();

    if (!response) throw new Error('Data not found')

    return JSON.parse(JSON.stringify(response))
  } catch (error) {
    handleError(error)
  }
}


function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
function periodToDays(periodKey: string) {
  if (periodKey === "1 week") return 7;
  if (periodKey === "1 month") return 30;
  if (periodKey === "3 months") return 90;
  if (periodKey === "6 months") return 180;
  if (periodKey === "1 year") return 360;
  return 30;
}
function normalizePeriodKey(period: string) {
  const p = String(period || "").toLowerCase().trim();

  if (p.includes("week")) return "1 week";
  if (p.includes("3") && p.includes("month")) return "3 months";
  if (p.includes("6")) return "6 months";
  if (p.includes("year") || p.includes("12")) return "1 year";
  if (p.includes("month")) return "1 month";

  return "1 month"; // safe default
}

export const createData = async ({
  userId,
  subcategory,
  formData,
  planId,
  periodPack,
  path,
}: CreateAdShopParams) => {
  try {
    await connectToDatabase();

    const organizer = await User.findById(userId);
    if (!organizer) throw new Error("Organizer not found");

    const pkg = await Packages.findById(planId);
    if (!pkg) throw new Error("Package not found");


    const now = new Date();
    const isFree = String(pkg.name).toLowerCase() === "free";

    // ✅ server truth: period + amount
    const periodKey = normalizePeriodKey(periodPack);

    const prices = Array.isArray(pkg.price) ? pkg.price : [];
    const priceRow = prices.find(
      (x: any) => String(x.period).toLowerCase() === periodKey
    );
    const amountDue = Number(priceRow?.amount || 0);

    if (!isFree && amountDue <= 0) {
      throw new Error(`Invalid pricing for ${pkg.name} / ${periodKey}`);
    }

    // ✅ server truth: expiry + status
    const days = periodToDays(periodKey);
    const expirelyDate = addDays(now, days);
    const adstatusFinal = isFree ? "Active" : "Pending";

    // ✅ entitlements -> boost
    const ent = pkg.entitlements || {};
    const boost = {
      isTop: Number(ent.topDays || 0) > 0,
      topUntil: Number(ent.topDays || 0) > 0 ? addDays(now, Number(ent.topDays)) : null,

      isFeatured: Number(ent.featuredDays || 0) > 0,
      featuredUntil: Number(ent.featuredDays || 0) > 0 ? addDays(now, Number(ent.featuredDays)) : null,

      autoRenewHours: ent.autoRenewHours ?? null,
    };
    // 🔒 HARD GATE — server decides
    const gate = await requireCanPostAd(userId);

    if (!gate.allowed) {
      // create a transaction ONLY, do NOT create ad
      return {
        blocked: true,
        reason: gate.reason,
        planId: gate.planId,
      };
    }

    const response = await DynamicAd.create({
      data: formData,
      priority: pkg.priority,
      expirely: expirelyDate,
      adstatus: adstatusFinal,
      organizer: userId,
      subcategory,
      plan: pkg._id,
      boost,
    });

    revalidatePath(path);

    const populatedResponse = await populateAd(DynamicAd.findById(response._id));
    return JSON.parse(JSON.stringify(await populatedResponse));
  } catch (error) {
    handleError(error);
  }
};
// GET ALL Ad
// GET ALL Ad  ✅ UPDATED: uses aggregate() so Featured/Top boosts only work while active
export async function getAlldynamicAd({
  limit = 20,
  page,
  queryObject,
}: GetAlldynamicAdParams) {
  try {
    await connectToDatabase();

    const parseCurrencyToNumber = (value: string): number =>
      Number(String(value || "").replace(/,/g, ""));

    const conditionsAdstatus = { adstatus: "Active" };

    // Dynamically build conditions from queryObject
    const dynamicConditions: any = {};

    Object.entries(queryObject || {}).forEach(([key, value]) => {
      if (!value) return;

      switch (key) {
        case "price": {
          const [minPrice, maxPrice] = String(value).split("-");
          dynamicConditions["data.price"] = {
            $gte: parseCurrencyToNumber(minPrice),
            $lte: parseCurrencyToNumber(maxPrice),
          };
          break;
        }

        case "query": {
          if (value === "bids") {
            // ✅ NOTE: if your biddingEnabled/biddingEndsAt are TOP-LEVEL (as in your schema), use these:
            dynamicConditions["biddingEnabled"] = true;
            dynamicConditions["biddingEndsAt"] = { $gte: new Date() };

            // If you actually stored them inside `data`, swap to:
            // dynamicConditions["data.biddingEnabled"] = true;
            // dynamicConditions["data.biddingEndsAt"] = { $gte: new Date() };
          } else {
            dynamicConditions["$or"] = [
              { "data.title": { $regex: value, $options: "i" } },
              { "data.description": { $regex: value, $options: "i" } },
            ];
          }
          break;
        }

        // ignore these (they are not DynamicAd.data fields)
        case "membership":
        case "privacypolicy":
        case "source":
        case "action":
        case "Ad":
        case "Profile":
        case "sortby":
          break;

        default:
          dynamicConditions[`data.${key}`] = { $regex: value, $options: "i" };
      }
    });

    // Membership-based conditions
    let conditions: any = { ...conditionsAdstatus, ...dynamicConditions };

    if ((queryObject.membership as string) === "verified") {
      const verifiedUsers = await User.find({ "verified.accountverified": true }).select("_id");
      conditions.organizer = { $in: verifiedUsers.map((u) => u._id) };
    } else if ((queryObject.membership as string) === "unverified") {
      const unverifiedUsers = await User.find({ "verified.accountverified": false }).select("_id");
      conditions.organizer = { $in: unverifiedUsers.map((u) => u._id) };
    }

    const skipAmount = (Number(page) - 1) * limit;
    const now = new Date();

    // ✅ Sorting rules:
    // 1) Featured (active) first
    // 2) Top (active) next
    // 3) priority desc
    // 4) then sortby: new/lowest/highest/default
    const sortby = String(queryObject?.sortby || "recommeded");

    let tailSort: any = { createdAt: -1 }; // default newest

    if (sortby === "lowest") tailSort = { "data.price": 1, createdAt: -1 };
    else if (sortby === "highest") tailSort = { "data.price": -1, createdAt: -1 };
    else if (sortby === "new" || sortby === "recommeded") tailSort = { createdAt: -1 };

    const pipeline: any[] = [
      { $match: conditions },

      // ✅ compute active boost booleans
      {
        $addFields: {
          featuredActive: {
            $and: [
              { $eq: ["$boost.isFeatured", true] },
              { $gt: ["$boost.featuredUntil", now] },
            ],
          },
          topActive: {
            $and: [
              { $eq: ["$boost.isTop", true] },
              { $gt: ["$boost.topUntil", now] },
            ],
          },
        },
      },

      // ✅ final sort: boost -> priority -> chosen tail sort
      {
        $sort: {
          featuredActive: -1,
          "boost.featuredUntil": -1,

          topActive: -1,
          "boost.topUntil": -1,

          priority: -1,
          ...tailSort,
        },
      },

      { $skip: skipAmount },
      { $limit: limit },
    ];

    const adsRaw = await DynamicAd.aggregate(pipeline);

    // ✅ populate after aggregate
    const populatedAds = await DynamicAd.populate(adsRaw, [
      { path: "subcategory", model: Subcategory, select: "fields" },
      {
        path: "organizer",
        model: User,
        select:
          "_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified token notifications",
      },
      { path: "plan", model: Packages, select: "_id name color imageUrl" },
    ]);

    const AdCount = await DynamicAd.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(populatedAds)),
      totalPages: Math.ceil(AdCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
export async function getAlldynamicAd_({ limit = 20, page, queryObject
}: GetAlldynamicAdParams) {
  try {
    await connectToDatabase()
    const parseCurrencyToNumber = (value: string): number => {
      // Remove any commas from the string and convert to number
      return Number(value.replace(/,/g, ""));
    };

    const conditionsAdstatus = { adstatus: "Active" };

    // Dynamically build conditions from queryObject
    const dynamicConditions: any = {};

    Object.entries(queryObject || {}).forEach(([key, value]) => {
      if (value) {
        switch (key) {
          case 'price':
            const [minPrice, maxPrice] = (value as string).split("-");
            dynamicConditions["data.price"] = {
              $gte: parseCurrencyToNumber(minPrice),
              $lte: parseCurrencyToNumber(maxPrice)
            };
            break;

          case 'query':
            if (value === "bids") {
              dynamicConditions["data.biddingEnabled"] = true; // must have bidding enabled
              dynamicConditions["data.biddingEndsAt"] = { $gte: new Date() }; // not expired yet

            } else {
              dynamicConditions["$or"] = [
                { "data.title": { $regex: value, $options: 'i' } },
                { "data.description": { $regex: value, $options: 'i' } }
              ];
            }


            break;
          case 'membership':
            break;
          case 'privacypolicy':
            break;
          case 'source':
            break;
          case 'action':
            break;
          case 'Ad':
            break;
          case 'Profile':
            break;
          case 'sortby':
            break;
          default:
            dynamicConditions[`data.${key}`] = { $regex: value, $options: 'i' };
        }
      }
    });

    // Membership-based conditions
    let conditions = { ...conditionsAdstatus, ...dynamicConditions };
    if (queryObject.membership as string === "verified") {
      const verifiedUsers = await User.find({ "verified.accountverified": true });
      const verifiedUserIds = verifiedUsers.map(user => user._id);
      conditions = {
        ...conditions,
        organizer: { $in: verifiedUserIds },
      };
    } else if (queryObject.membership as string === "unverified") {
      const unverifiedUsers = await User.find({ "verified.accountverified": false });
      const unverifiedUserIds = unverifiedUsers.map(user => user._id);
      conditions = {
        ...conditions,
        organizer: { $in: unverifiedUserIds },
      };
    }

    const skipAmount = (Number(page) - 1) * limit
    let AdQuery: any = [];
    if (queryObject.sortby === "recommeded") {
      AdQuery = DynamicAd.find(conditions)
        .sort({ priority: -1, createdAt: -1 }) // Both sorted in descending order
        .skip(skipAmount)
        .limit(limit)

    } else if (queryObject.sortby === "new") {
      AdQuery = DynamicAd.find(conditions)
        .sort({ priority: -1, createdAt: -1 }) // Both sorted in descending order
        .skip(skipAmount)
        .limit(limit)
    } else if (queryObject.sortby === "lowest") {
      AdQuery = DynamicAd.find(conditions)
        .sort({ priority: -1, "data.price": 1 })
        .skip(skipAmount)
        .limit(limit)
    } else if (queryObject.sortby === "highest") {
      AdQuery = DynamicAd.find(conditions)
        .sort({ priority: -1, "data.price": -1 }) // Both sorted in descending order
        .skip(skipAmount)
        .limit(limit)
    } else {

      AdQuery = DynamicAd.find(conditions)
        .sort({ priority: -1, "data.price": -1 })
        .skip(skipAmount)
        .limit(limit)
    }
    const Ads = await populateAd(AdQuery);
    const AdCount = await DynamicAd.countDocuments(conditions)
    //console.log(Ads);
    return {
      data: JSON.parse(JSON.stringify(Ads)),
      totalPages: Math.ceil(AdCount / limit),
    }

  } catch (error) {
    handleError(error)
  }
}



// GET RELATED Ad: Ad WITH SAME CATEGORY
export async function getRelatedAdByCategory({
  subcategory,
  adId,
  limit = 16,
  page,
}: GetRelatedAdsBySubCategoryParams) {
  try {
    await connectToDatabase()
    console.log(subcategory)
    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ "data.subcategory": subcategory }, { _id: { $ne: adId } }, { adstatus: "Active" }] }

    const AdQuery = DynamicAd.find(conditions)
      //  .sort({ createdAt: 'desc' })
      .sort({ priority: -1, createdAt: -1 })
      .skip(skipAmount)
      .limit(limit)

    const Ads = await populateAd(AdQuery)
    const AdCount = await DynamicAd.countDocuments(conditions)
    //console.log(JSON.parse(JSON.stringify(Ads)))
    return { data: JSON.parse(JSON.stringify(Ads)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}

// GET Ad BY ORGANIZER
export async function getAdByUser({ userId, limit = 20, page, sortby, myshop }: GetAdsByUserParams) {
  try {

    await connectToDatabase()
    let conditions = {}

    if (myshop) {
      conditions = { organizer: userId }

    } else {

      const status = "Active";
      conditions = { $and: [{ organizer: userId }, { adstatus: status }] };

    }

    const skipAmount = (page - 1) * limit
    let AdQuery: any = [];
    if (sortby === "recommeded") {
      AdQuery = DynamicAd.find(conditions)
        .sort({ priority: -1, createdAt: -1 }) // Both sorted in descending order
        .skip(skipAmount)
        .limit(limit)
    } else if (sortby === "new") {
      AdQuery = DynamicAd.find(conditions)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skipAmount)
        .limit(limit)
    } else if (sortby === "lowest") {
      AdQuery = DynamicAd.find(conditions)
        .sort({ priority: -1, price: 1 })
        .skip(skipAmount)
        .limit(limit)
    } else if (sortby === "highest") {
      AdQuery = DynamicAd.find(conditions)
        .sort({ priority: -1, price: -1 })
        .skip(skipAmount)
        .limit(limit)
    }


    const Ads = await populateAd(AdQuery)
    const AdCount = await DynamicAd.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(Ads)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}

// GET ONE Ad BY ID
export async function getAdById(adId: string) {
  try {
    await connectToDatabase()

    const Ads = await populateAd(DynamicAd.findById(adId))

    if (!Ads) throw new Error('Ad not found')

    return JSON.parse(JSON.stringify(Ads))
  } catch (error) {
    handleError(error)
  }
}
// UPDATE
export async function updatevideo({ _id, youtube, path }: UpdateVideoParams) {
  try {
    await connectToDatabase();

    // Find the category by its ID and update the name field only
    const updatedadVideo = await DynamicAd.findByIdAndUpdate(
      _id,
      { youtube }, // Update only the name field
      { new: true }
    );

    // Revalidate the path (assuming it's a separate function)
    revalidatePath(path);

    // Return the updated category
    return JSON.parse(JSON.stringify(updatedadVideo));
  } catch (error) {
    handleError(error);
    // Handle error appropriately (e.g., throw or return error response)
    throw error;
  }
}
// UPDATE
export async function updateview({ _id, views, path }: UpdateViewsParams) {
  try {
    await connectToDatabase();

    // Find the category by its ID and update the name field only
    const updateAdViews = await DynamicAd.findByIdAndUpdate(
      _id,
      { views }, // Update only the name field
      { new: true }
    );

    // Revalidate the path (assuming it's a separate function)
    revalidatePath(path);

    // Return the updated category
    return JSON.parse(JSON.stringify(updateAdViews));
  } catch (error) {
    handleError(error);
    // Handle error appropriately (e.g., throw or return error response)
    throw error;
  }
}
// UPDATE
export async function updatecalls({ _id, calls, path }: UpdateCallsParams) {
  try {
    await connectToDatabase();

    // Find the category by its ID and update the name field only
    const updateAdCalls = await DynamicAd.findByIdAndUpdate(
      _id,
      { calls }, // Update only the name field
      { new: true }
    );

    // Revalidate the path (assuming it's a separate function)
    revalidatePath(path);

    // Return the updated category
    return JSON.parse(JSON.stringify(updateAdCalls));
  } catch (error) {
    handleError(error);
    // Handle error appropriately (e.g., throw or return error response)
    throw error;
  }
}
// UPDATE
export async function updatewhatsapp({ _id, whatsapp, path }: UpdateWhatsappParams) {
  try {
    await connectToDatabase();

    // Find the category by its ID and update the name field only
    const updateAdwhatsapp = await DynamicAd.findByIdAndUpdate(
      _id,
      { whatsapp }, // Update only the name field
      { new: true }
    );

    // Revalidate the path (assuming it's a separate function)
    revalidatePath(path);

    // Return the updated category
    return JSON.parse(JSON.stringify(updateAdwhatsapp));
  } catch (error) {
    handleError(error);
    // Handle error appropriately (e.g., throw or return error response)
    throw error;
  }
}
// UPDATE
export async function updateinquiries({ _id, inquiries, path }: UpdateInquiriesParams) {
  try {
    await connectToDatabase();

    // Find the category by its ID and update the name field only
    const updateAdinquiries = await DynamicAd.findByIdAndUpdate(
      _id,
      { inquiries }, // Update only the name field
      { new: true }
    );

    // Revalidate the path (assuming it's a separate function)
    revalidatePath(path);

    // Return the updated category
    return JSON.parse(JSON.stringify(updateAdinquiries));
  } catch (error) {
    handleError(error);
    // Handle error appropriately (e.g., throw or return error response)
    throw error;
  }
}
// UPDATE
export async function updateshared({ _id, shared, path }: UpdateShareParams) {
  try {
    await connectToDatabase();

    // Find the category by its ID and update the name field only
    const updateAdshare = await DynamicAd.findByIdAndUpdate(
      _id,
      { shared }, // Update only the name field
      { new: true }
    );

    // Revalidate the path (assuming it's a separate function)
    revalidatePath(path);

    // Return the updated category
    return JSON.parse(JSON.stringify(updateAdshare));
  } catch (error) {
    handleError(error);
    // Handle error appropriately (e.g., throw or return error response)
    throw error;
  }
}
// UPDATE
export async function updatebookmarked({ _id, bookmarked, path }: UpdateBookmarkedParams) {
  try {
    await connectToDatabase();

    // Find the category by its ID and update the name field only
    const updateAdbookmarked = await DynamicAd.findByIdAndUpdate(
      _id,
      { bookmarked }, // Update only the name field
      { new: true }
    );

    // Revalidate the path (assuming it's a separate function)
    revalidatePath(path);

    // Return the updated category
    return JSON.parse(JSON.stringify(updateAdbookmarked));
  } catch (error) {
    handleError(error);
    // Handle error appropriately (e.g., throw or return error response)
    throw error;
  }
}
export async function updateabused({ _id, abused, path }: UpdateAbuseParams) {
  try {
    await connectToDatabase();

    // Find the category by its ID and update the name field only
    const updateAdabused = await DynamicAd.findByIdAndUpdate(
      _id,
      { abused }, // Update only the name field
      { new: true }
    );

    // Revalidate the path (assuming it's a separate function)
    revalidatePath(path);

    // Return the updated category
    return JSON.parse(JSON.stringify(updateAdabused));
  } catch (error) {
    handleError(error);
    // Handle error appropriately (e.g., throw or return error response)
    throw error;
  }
}

export async function updateStatus({ _id, adstatus, path }: UpdateStatusParams) {
  try {
    await connectToDatabase();

    // Find the category by its ID and update the name field only
    const updateAdabused = await DynamicAd.findByIdAndUpdate(
      _id,
      { adstatus }, // Update only the name field
      { new: true }
    );

    // Revalidate the path (assuming it's a separate function)
    revalidatePath(path);

    // Return the updated category
    return JSON.parse(JSON.stringify(updateAdabused));
  } catch (error) {
    handleError(error);
    // Handle error appropriately (e.g., throw or return error response)
    throw error;
  }
}

export async function updateBanAll(phone: string, adstatus: string) {
  try {
    await connectToDatabase();

    // Find ad by phone number and update the adstatus
    const updateAdabused = await DynamicAd.findOneAndUpdate(
      { phone }, // Ensure it's an object
      { adstatus }, // Update the adstatus field
      { new: true } // Return the updated document
    );

    if (!updateAdabused) {
      throw new Error("Ad not found for the given phone number");
    }

    return JSON.parse(JSON.stringify(updateAdabused));
  } catch (error) {
    console.error("Error updating ad status:", error);
    throw error; // Ensure errors are properly handled
  }
}


// UPDATE
export async function updateAd(userId: string, _id: string, formData: any) {
  try {
    await connectToDatabase();

    const AdToUpdate = await DynamicAd.findById(_id);
    if (!AdToUpdate || AdToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized or Ad not found');
    }

    await DynamicAd.findByIdAndUpdate(
      _id,
      { data: formData },
      { new: true }
    );

    // Refetch and populate the updated ad
    const populatedUpdatedAd = await populateAd(DynamicAd.findById(_id));

    return JSON.parse(JSON.stringify(await populatedUpdatedAd));
  } catch (error) {
    handleError(error);
  }
}

export async function removeImageUrl(adId: string, imageUrl: string) {
  try {
    await connectToDatabase()
    const AdToUpdate = await DynamicAd.updateOne(
      { _id: adId },
      { $pull: { 'data.imageUrls': imageUrl } }
    );
    const url = new URL(imageUrl);
    const filename = url.pathname.split('/').pop();
    try {
      if (filename) {
        const utapi = new UTApi();
        await utapi.deleteFiles(filename);
      }
    } catch {

    }
    return JSON.parse(JSON.stringify(AdToUpdate))
  } catch (error) {
    console.error('Error removing image URL:', error);
  }
}


export const getAdsCount = async (category: string, subcategory: string, fields: string[]): Promise<any[]> => {
  try {
    await connectToDatabase();

    const results: any[] = [];

    for (const field of fields) {
      // Initialize the aggregation pipeline for each field
      const pipeline: PipelineStage[] = [
        {
          $addFields: {
            isCategoryMatch: { $eq: ["$data.category", category] } // Check if the category matches the specified category
          }
        },
        {
          $match: { isCategoryMatch: true, adstatus: 'Active' } // Filter documents where the category matches and status is Active
        }
      ];

      // Add subcategory match condition if subcategory is provided
      if (subcategory) {
        pipeline.push({
          $match: { "data.subcategory": subcategory }
        });
      }

      // Group by the current field
      pipeline.push({
        $group: {
          _id: `$data.${field}`, // Group by the current field
          adCount: { $sum: 1 } // Calculate the count of ads for each field value
        }
      });

      // Execute the aggregation pipeline for the current field
      const fieldResult = await DynamicAd.aggregate(pipeline);

      // Format and add the result for the current field
      results.push(...fieldResult.map((result: any) => ({
        field,
        value: result._id,
        adCount: result.adCount
      })));
    }

    // Sort the results alphabetically by field and value
    results.sort((a: any, b: any) => {
      const fieldComparison = a.field.localeCompare(b.field);
      if (fieldComparison !== 0) return fieldComparison;
      return String(a.value).localeCompare(String(b.value));
    });

    return results;
  } catch (error) {
    console.error('Error fetching ads count:', error);
    throw new Error('Failed to fetch ads count');
  }
};





export const getAdsCountAllRegion = async () => {
  try {
    await connectToDatabase(); // Replace with your MongoDB connection string

    let matchConditions: any = {};
    // if (subcategory) {
    //  matchConditions['data.subcategory'] = subcategory;
    //}

    const adsCountPerRegion = await DynamicAd.aggregate([
      {
        $match: matchConditions
      },
      {
        $group: {
          _id: {
            region: '$data.region',
            area: '$data.area'
          },
          adCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.region': 1 } // Sort by area alphabetically
      },
      {
        $project: {
          _id: 0,
          area: '$_id.area',
          region: '$_id.region',
          adCount: 1
        }
      }
    ]);

    // return adsCountPerRegion;
    //  console.log(adsCountPerRegion)

    return JSON.parse(JSON.stringify(adsCountPerRegion));
  } catch (error) {
    handleError(error);
    return [];
  } finally {
    // Ensure the connection is closed after the operation
  }
};

export const getAdsCountPerRegion = async (category: string, subcategory?: string) => {
  try {
    await connectToDatabase(); // Replace with your MongoDB connection string

    let matchConditions: any = { 'data.category': category, adstatus: 'Active' };
    if (subcategory) {
      matchConditions['data.subcategory'] = subcategory;
    }

    const adsCountPerRegion = await DynamicAd.aggregate([
      {
        $match: matchConditions
      },
      {
        $group: {
          _id: {
            region: '$data.region',
            area: '$data.area'
          },
          adCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.region': 1 } // Sort by area alphabetically
      },
      {
        $project: {
          _id: 0,
          area: '$_id.area',
          region: '$_id.region',
          adCount: 1
        }
      }
    ]);

    // return adsCountPerRegion;
    //  console.log(adsCountPerRegion)

    return JSON.parse(JSON.stringify(adsCountPerRegion));
  } catch (error) {
    handleError(error);
    return [];
  } finally {
    // Ensure the connection is closed after the operation
  }
};
export async function updateCreatedAt(_id: string) {
  try {
    await connectToDatabase();

    const update = await DynamicAd.findByIdAndUpdate(
      _id,
      {
        createdAt: new Date()
      },
      { new: true }
    );

    return JSON.parse(JSON.stringify(update));
  } catch (error) {
    handleError(error);
    throw error;
  }
}
export const getAdsCountPerVerifiedTrue = async (category: string, subcategory: string) => {
  try {
    await connectToDatabase();


    let matchConditions: any = { 'data.category': category, adstatus: 'Active' };
    if (subcategory) {
      matchConditions['data.subcategory'] = subcategory;
    }
    const AdsCountPerVerified = await DynamicAd.aggregate([
      {
        $match: matchConditions
      },
      // Lookup to join with the User collection
      {
        $lookup: {
          from: "users",
          localField: "organizer",
          foreignField: "_id",
          as: "user"
        }
      },
      // Unwind the user array
      {
        $unwind: "$user"
      },
      // Match only verified users
      {
        $match: {
          "user.verified.accountverified": true
        }
      },
      // Group by UserID and count ads
      {
        $group: {
          _id: "$category",
          totalAds: { $sum: 1 }
        }
      },
      // Project to rename fields if needed
      {
        $project: {
          userId: "$_id",
          totalAds: 1,
          _id: 0
        }
      }
    ]);

    // console.log(AdsCountPerVerified);

    return JSON.parse(JSON.stringify(AdsCountPerVerified));
  } catch (error) {
    handleError(error);
  }
};

export const getAdsCountPerVerifiedFalse = async (category: string, subcategory: string) => {
  try {
    await connectToDatabase();


    let matchConditions: any = { 'data.category': category, adstatus: 'Active' };
    if (subcategory) {
      matchConditions['data.subcategory'] = subcategory;
    }
    const AdsCountPerVerified = await DynamicAd.aggregate([
      {
        $match: matchConditions
      },
      // Lookup to join with the User collection
      {
        $lookup: {
          from: "users",
          localField: "organizer",
          foreignField: "_id",
          as: "user"
        }
      },
      // Unwind the user array
      {
        $unwind: "$user"
      },
      // Match only verified users
      {
        $match: {
          "user.verified.accountverified": false
        }
      },
      // Group by UserID and count ads
      {
        $group: {
          _id: "$category",
          totalAds: { $sum: 1 }
        }
      },
      // Project to rename fields if needed
      {
        $project: {
          userId: "$_id",
          totalAds: 1,
          _id: 0
        }
      }
    ]);

    // console.log(AdsCountPerVerified);

    return JSON.parse(JSON.stringify(AdsCountPerVerified));
  } catch (error) {
    handleError(error);
  }
};
// UPDATE

export async function getTrendingProducts(timeFrame: string) {

  const endDate = new Date();
  let startDate = new Date(); // Initialize startDate as a Date object.

  // Calculate startDate based on the timeFrame
  switch (timeFrame) {
    case 'day':
      startDate.setDate(endDate.getDate() - 1); // Subtract 1 day
      break;
    case 'week':
      startDate.setDate(endDate.getDate() - 7); // Subtract 7 days
      break;
    case 'month':
      startDate.setMonth(endDate.getMonth() - 1); // Subtract 1 month
      break;
    default:
      startDate.setDate(endDate.getDate() - 7); // Default to 7 days
  }

  const products = await DynamicAd.find({
    createdAt: { $gte: startDate, $lte: endDate },
  })
    .sort({
      views: -1,
      //  whatsapp: -1,
      // bookmarked: -1,
      // shared: -1,
      // inquiries: -1,
      // call: -1,
    })
    .limit(3); // Limit to top 10 products

  return JSON.parse(JSON.stringify(products));
}

export async function getTotalProducts() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Aggregate total sizes in stock
    const stockAggregation = await DynamicAd.aggregate([
      // { $unwind: '$features' }, // Decompose features array
      {
        $group: {
          _id: null,
          totalWorth: { $sum: '$data.price' }, // Sum up stock for all sizes
          // totalWorth: { $sum: { $multiply: ['$features.stock', '$price'] } }, // Calculate total worth
        },
      },
    ]);

    //const totalStock = stockAggregation.length > 0 ? stockAggregation[0].totalStock : 0;
    const totalWorth = stockAggregation.length > 0 ? stockAggregation[0].totalWorth : 0;

    // Count total products
    const totalProducts = await DynamicAd.countDocuments();

    return {
      //totalStock,
      totalWorth,
      totalProducts,
    };
  } catch (error) {
    console.error('Error fetching total sizes and products:', error);
    throw new Error('Unable to fetch product totals');
  }
}

export async function deleteAd({ adId, deleteImages, path }: DeleteAdParams) {
  try {
    await connectToDatabase();

    // 1) Delete the DB record first (so we can read its coverThumbUrl safely)
    const deletedAd = await DynamicAd.findByIdAndDelete(adId);

    // 2) Collect file keys to delete (UploadThing keys, not URLs)
    const keysToDelete: string[] = [];

    if (Array.isArray(deleteImages) && deleteImages.length > 0) {
      keysToDelete.push(...deleteImages.filter(Boolean));
    }

    const coverKey = deletedAd?.data?.coverThumbUrl;
    if (coverKey) keysToDelete.push(coverKey);

    // 3) Deduplicate + delete
    const uniqueKeys = Array.from(new Set(keysToDelete));

    if (uniqueKeys.length > 0) {
      const utapi = new UTApi();
      await utapi.deleteFiles(uniqueKeys);
    }

    if (deletedAd) revalidatePath(path);
    return deletedAd;
  } catch (error) {
    handleError(error);
  }
}
interface PlaceBidParams {
  adId: string;
  userId: string;
  username: string;
  amount: number;
  path?: string; // optional revalidation
}
export async function getAllAds() {
  try {
    await connectToDatabase();
    const allAds = await DynamicAd.find({ adstatus: "Active" });


    // Safely return the count for the given subcategory and type
    return JSON.parse(JSON.stringify(allAds));;

  } catch (error) {
    handleError(error);
    return 0;
  }
}
export const placeBid = async ({
  adId,
  userId,
  username,
  amount,
  path
}: PlaceBidParams) => {
  try {
    await connectToDatabase();

    // Fetch the ad first
    const ad = await DynamicAd.findById(adId);
    // Prevent owner from bidding on own ad
    if (String(ad.organizer._id) === String(userId)) {
      throw new Error("You cannot bid on your own ad");
    }

    // Check if bidding period has expired
    if (ad.data.biddingEndsAt && new Date(ad.data.biddingEndsAt) < new Date()) {
      throw new Error("Bidding period has ended");
    }

    // Ensure bids is an array
    const bids = Array.isArray(ad.bids) ? ad.bids : [];

    // Get current highest bid
    const highest = bids.length
      ? Math.max(...bids.map((b: any) => b.amount))
      : 0;
    const minIncrement = ad.data.bidIncrement || 1000;

    if (amount <= Number(highest) || amount < (Number(highest) + Number(minIncrement))) {
      throw new Error(`Bid must be at least Ksh ${Number(highest) + Number(minIncrement)}`);
    }

    // Create new bid object
    const newBid = {
      amount,
      userId,
      username,
      timestamp: new Date()
    };

    // Push bid using findByIdAndUpdate
    const updatedAd = await DynamicAd.findByIdAndUpdate(
      adId,
      { $push: { bids: newBid } },
      { new: true } // return the updated document
    );

    if (!updatedAd) {
      throw new Error("Failed to update ad with new bid");
    }


    return {
      success: true,
      message: "Bid placed successfully",
      updatedBids: JSON.parse(JSON.stringify(updatedAd.bids))
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong"
    };
  }
};

export const getAllBidsGroupedByAd = async () => {
  try {
    await connectToDatabase();

    // First, find ads with populated bids.userId
    const ads = await DynamicAd.find(
      { bids: { $exists: true, $ne: [] } },
      { _id: 1, bids: 1, "data.title": 1, "data.imageUrls": 1 }
    )
      .populate({
        path: "bids.userId",
        model: User,
        select: "_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified token notifications",
      });

    // Now map and group them
    const grouped = ads.map((ad) => ({
      adId: ad._id.toString(),
      title: ad.data.title,
      thumbnail: ad.data.imageUrls[0] || null,
      bids: ad.bids.map((bid: any) => ({
        _id: bid._id?.toString?.(),
        userId: bid.userId, // This is now populated with full user details
        amount: bid.amount,
        timestamp: bid.timestamp,
        username: bid.username,
        isWinner: bid.isWinner,
        isAbusive: bid.isAbusive,
      })),
    }));

    return { success: true, data: JSON.parse(JSON.stringify(grouped.reverse())) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};


export const getAllBids = async () => {
  try {
    await connectToDatabase();

    const ads = await DynamicAd.find(
      { bids: { $exists: true, $ne: [] } },
      { _id: 1, bids: 1 }
    );
    const allBids = ads
      .flatMap((ad) =>
        ad.bids?.map((bid: any) => ({
          amount: bid.amount,
          timestamp: bid.timestamp,
          username: bid.username,
          isWinner: bid.isWinner,
          isAbusive: bid.isAbusive,
          _id: bid._id?.toString?.(),
          adId: ad._id.toString(),
        })) || []
      )
      .reverse();
    console.log(allBids);
    return { success: true, data: JSON.parse(JSON.stringify(allBids)) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
export const getBidsByOrganizer = async (organizerId: string) => {
  try {
    await connectToDatabase();

    // Find all ads posted by this organizer
    const ads = await DynamicAd.find(
      { organizer: organizerId },
      { _id: 1, title: 1, bids: 1 }
    );

    const allBids = ads
      .flatMap((ad) =>
        ad.bids?.map((bid: any) => ({
          ...bid,
          adId: ad._id.toString(),
          adTitle: ad.title,
        })) || []
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // sort latest first

    return { success: true, data: JSON.parse(JSON.stringify(allBids)) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
export const removeBid = async (bidId: string) => {
  try {
    await connectToDatabase();

    const ad = await DynamicAd.findOneAndUpdate(
      { 'bids._id': bidId },
      { $pull: { bids: { _id: bidId } } },
      { new: true }
    );

    if (!ad) throw new Error('Bid not found');

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const markWinner = async (bidId: string) => {
  try {
    await connectToDatabase();
    const ad = await DynamicAd.findOne({ 'bids._id': bidId });

    if (!ad) throw new Error('Bid not found');

    // Update all bids' isWinner field
    ad.bids = ad.bids.map((bid: any) => ({
      ...bid,
      isWinner: bid._id.toString() === bidId,
    }));

    await ad.save();

    const winningBid = ad.bids.find((b: any) => b._id.toString() === bidId);
    if (winningBid?.userId && winningBid?.email) {
      let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, // Your SMTP host
        port: 587, // Use 587 for TLS
        secure: false, // True if using port 465
        auth: {
          user: process.env.SMTP_USER, // Your SMTP user
          pass: process.env.SMTP_PASS, // Your SMTP password
        }
      });

      const mailOptions = {
        from: '"Tadao" <support@tadaomarket.com>',
        to: winningBid.email,
        subject: '🎉 You have won the bid!',
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f7f7f7; border-radius: 8px; color: #333;">
     <div style="text-align: center; margin-bottom: 30px;">
  <span style="display: inline-flex; align-items: center; gap: 6px;">
  <img src="https://tadaomarket.com/logo.png" alt="Tadao Logo" style="height: 24px; width: auto; display: block;" />
  <span style="font-size: 14px; font-weight: bold; color: #FF914C;">Tadao</span>
</span>
</div>
    
    <h2 style="color: #FF914C;">You've Received a New Inquiry</h2>

      <p>Hello,</p>

      <p>You have a new message regarding your Bidding</p>
    
      <div style="margin: 20px 0; padding: 15px; background-color: #fff; border-left: 4px solid #FF914C; border-radius: 5px;">
        <p style="margin: 0;"> Congratulations ${winningBid.username}, your bid of Ksh ${winningBid.amount} has won!</p>
      </div>


  
      <p style="margin-top: 30px;">Please respond to this inquiry by logging into your Tadao account.</p>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 12px; color: #999;">This email was sent by Tadao (<a href="https://tadaomarket.com" style="color: #999;">tadaomarket.com</a>).</p>
    </div>
    `,
      };

      try {
        const response = await transporter.sendMail(mailOptions);
        //console.log('Email sent:', response);
        return "success";
      } catch (error) {
        console.error('Error sending email:', error);
        return "Failed";
      }

    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

function unslugify(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}


type ListingQuery = {
  regionSlug: string;
  category?: string;
  subcategory?: string;
  page?: number;
  limit?: number;
  min?: number;
  max?: number;
  sort?: "recommeded" | "new" | "lowest" | "highest" | "price_asc" | "price_desc";
  membership?: "verified" | "unverified";
};

export async function getAdsForRegionListing({
  regionSlug,
  category,
  subcategory,
  page = 1,
  limit = 24,
  min,
  max,
  sort = "recommeded",
  membership,
}: ListingQuery) {
  await connectToDatabase();

  const regionNames = regionCandidates(regionSlug); // ✅ key fix

  let conditions: any = {
    adstatus: "Active",
    "data.region": { $in: regionNames }, // ✅ match both hyphen + space versions
  };

  if (category) conditions["data.category"] = category;
  if (subcategory) conditions["data.subcategory"] = subcategory;

  if (min !== undefined || max !== undefined) {
    conditions["data.price"] = {};
    if (min !== undefined) conditions["data.price"].$gte = min;
    if (max !== undefined) conditions["data.price"].$lte = max;
  }

  if (membership === "verified") {
    const verifiedUsers = await User.find({ "verified.accountverified": true }).select("_id");
    conditions.organizer = { $in: verifiedUsers.map((u) => u._id) };
  } else if (membership === "unverified") {
    const unverifiedUsers = await User.find({ "verified.accountverified": false }).select("_id");
    conditions.organizer = { $in: unverifiedUsers.map((u) => u._id) };
  }

  const skipAmount = (page - 1) * limit;

  let sortObj: any = { priority: -1, createdAt: -1 };
  if (sort === "lowest" || sort === "price_asc") sortObj = { priority: -1, "data.price": 1, createdAt: -1 };
  if (sort === "highest" || sort === "price_desc") sortObj = { priority: -1, "data.price": -1, createdAt: -1 };
  if (sort === "new") sortObj = { priority: -1, createdAt: -1 };

  const query = DynamicAd.find(conditions).sort(sortObj).skip(skipAmount).limit(limit);

  const [items, total] = await Promise.all([
    populateAd(query),
    DynamicAd.countDocuments(conditions),
  ]);

  return {
    items: JSON.parse(JSON.stringify(items)),
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    regionName: regionNames[0], // just for display
  };
}

export type ListingMapEntry = {
  category?: string;      // DynamicAd.data.category
  subcategory?: string;   // DynamicAd.data.subcategory
  title: string;
  icon: string;             // H1 title
};

function slugify(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Builds a Jiji-style listing map from DB subcategories.
 * slug example: "cars-vans-and-pickups-for-sale"
 */
export async function getListingMapFromDB(): Promise<Record<string, ListingMapEntry>> {
  await connectToDatabase();

  const subcats = await Subcategory.find({})
    .populate({ path: "category", model: Category })
    .select("subcategory category imageUrl")
    .lean();

  const map: Record<string, ListingMapEntry> = {};

  const stripIntent = (name: string) =>
    name
      .replace(/\s+for\s+sale\s*$/i, "")
      .replace(/\s+for\s+rent\s*$/i, "")
      .trim();

  const detectMode = (name: string): "sale" | "rent" => {
    const n = name.toLowerCase();
    if (/\bfor\s+rent\b/.test(n) || /\brent\b/.test(n)) return "rent";
    if (/\bfor\s+sale\b/.test(n) || /\bsale\b/.test(n)) return "sale";
    return "sale";
  };

  const normalize = (v: string) => v.trim().toLowerCase();

  const specialListings: Array<{
    category: string;
    subcategory: string;
    slug: string;
    title: string;
  }> = [
      {
        category: "Donations",
        subcategory: "Donated Items",
        slug: "donations",
        title: "Donations",
      },
      {
        category: "Lost and Found",
        subcategory: "Lost and Found Items",
        slug: "lost-and-found",
        title: "Lost & Found",
      },
    ];

  for (const s of subcats as any[]) {
    const rawSub = String(s?.subcategory || "").trim();
    const catDoc = s?.category;
    const catName = String(catDoc?.category || catDoc?.name || "").trim();

    if (!catName || !rawSub) continue;

    const icon = Array.isArray(s?.imageUrl) ? (s.imageUrl[0] || "") : "";

    const special = specialListings.find(
      (item) =>
        normalize(item.category) === normalize(catName) &&
        normalize(item.subcategory) === normalize(rawSub)
    );

    if (special) {
      map[special.slug] = {
        category: catName,
        subcategory: rawSub,
        title: special.title,
        icon,
      };
      continue;
    }

    const mode = detectMode(rawSub);
    const cleanSub = stripIntent(rawSub);
    const suffix = mode === "rent" ? "for-rent" : "for-sale";

    const listingSlug = `${slugify(cleanSub)}-${suffix}`;
    const title = `${cleanSub} ${mode === "rent" ? "for Rent" : "for Sale"}`;

    map[listingSlug] = {
      category: catName,
      subcategory: rawSub,
      title,
      icon,
    };
  }

  return map;
}
// lib/actions/dynamicAd.actions.ts
export async function getRelatedAdsServer({
  subcategory,
  adId,
  limit = 8,
  skip = 0,
}: {
  subcategory: string;
  adId: string;
  limit?: number;
  skip?: number;
}) {
  await connectToDatabase();

  // const { adId, category, subcategory, limit = 8 } = params;

  const conditions: any = {
    adstatus: "Active",
    _id: { $ne: adId },
  };

  //if (category) conditions["data.category"] = category;
  if (subcategory) conditions["data.subcategory"] = subcategory;

  const items = await populateAd(
    DynamicAd.find(conditions)
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit)
  );

  return JSON.parse(JSON.stringify(items));
}
// lib/actions/dynamicAd.actions.ts

export async function getHomeFeed(params?: {
  promotedLimit?: number; // how many featured/top you want on homepage
  normalLimit?: number;   // how many normal ads after promoted
  category?: string;      // optional filter (Vehicle/Property/etc)
  region?: string;        // optional filter, expects DB region format e.g "Nairobi"
}) {
  await connectToDatabase();

  const promotedLimit = Math.max(1, Number(params?.promotedLimit ?? 24));
  const normalLimit = Math.max(1, Number(params?.normalLimit ?? 48));

  const now = new Date();

  // ✅ Keep match small and index-friendly
  const baseMatch: any = { adstatus: "Active" };

  if (params?.category) baseMatch["data.category"] = params.category;
  if (params?.region) baseMatch["data.region"] = params.region;

  // ✅ 1) Promoted pipeline (Featured then Top then priority then new)
  const promotedPipeline: any[] = [
    { $match: baseMatch },
    {
      $addFields: {
        featuredActive: {
          $and: [
            { $eq: ["$boost.isFeatured", true] },
            { $gt: ["$boost.featuredUntil", now] },
          ],
        },
        topActive: {
          $and: [
            { $eq: ["$boost.isTop", true] },
            { $gt: ["$boost.topUntil", now] },
          ],
        },
      },
    },
    {
      $match: {
        $or: [{ featuredActive: true }, { topActive: true }],
      },
    },
    {
      $sort: {
        featuredActive: -1,
        "boost.featuredUntil": -1,
        topActive: -1,
        "boost.topUntil": -1,
        priority: -1,
        createdAt: -1,
      },
    },
    { $limit: promotedLimit },
  ];

  const promotedRaw = await DynamicAd.aggregate(promotedPipeline);

  // ✅ Collect promoted IDs to exclude from normal list
  const promotedIds = promotedRaw.map((x: any) => x._id);

  // ✅ 2) Normal pipeline (priority + new), excluding promoted
  const normalPipeline: any[] = [
    {
      $match: {
        ...baseMatch,
        ...(promotedIds.length ? { _id: { $nin: promotedIds } } : {}),
      },
    },
    {
      $sort: {
        priority: -1,
        createdAt: -1,
      },
    },
    { $limit: normalLimit },
  ];

  const normalRaw = await DynamicAd.aggregate(normalPipeline);

  // ✅ Populate both (aggregate => populate after)
  const populateSpec = [
    { path: "subcategory", model: Subcategory, select: "fields" },
    {
      path: "organizer",
      model: User,
      select:
        "_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified token notifications",
    },
    { path: "plan", model: Packages, select: "_id name color imageUrl" },
  ];

  const promoted = await DynamicAd.populate(promotedRaw, populateSpec);
  const normal = await DynamicAd.populate(normalRaw, populateSpec);

  return {
    promoted: JSON.parse(JSON.stringify(promoted)),
    normal: JSON.parse(JSON.stringify(normal)),
  };
}

// lib/actions/dynamicAd.actions.ts

// lib/actions/dynamicAd.actions.ts

type SidebarOptions = {
  subcategoryCounts: Record<string, number>;
  counties: string[];
  towns: string[];
  townsByCounty: Record<string, string[]>;
  makes: string[];
  models: string[];
  totalInCategory: number;
};

function safeTrim(v: any) {
  return String(v ?? "").trim();
}
// ✅ Always read from data.*, because your ads are stored inside `data`
function pickCountyExpr() {
  return { $ifNull: ["$data.county", { $ifNull: ["$data.location", ""] }] };
}
function pickTownExpr() {
  return { $ifNull: ["$data.town", { $ifNull: ["$data.area", ""] }] };
}
function pickSubcatExpr() {
  return { $ifNull: ["$data.subcategory", ""] };
}
function pickMakeExpr() {
  return { $ifNull: ["$data.make", ""] };
}
function pickModelExpr() {
  return { $ifNull: ["$data.model", ""] };
}
function normalizeRegionLabel(input: string) {
  return String(input || "")
    .trim()
    .replace(/\s+/g, " ")      // collapse spaces
    .replace(/\s*-\s*/g, "-"); // normalize hyphen spacing
}

/** "elgeyo-marakwet" => ["Elgeyo-Marakwet", "Elgeyo Marakwet"] */
function regionCandidates(regionSlug: string) {
  const slug = String(regionSlug || "").trim().toLowerCase();

  // slug to "Title Case" words, but keep hyphens
  const titleWithHyphen = slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");

  const withSpaces = titleWithHyphen.replace(/-/g, " ");
  const withHyphens = titleWithHyphen; // "Elgeyo-Marakwet"

  return Array.from(
    new Set([normalizeRegionLabel(withHyphens), normalizeRegionLabel(withSpaces)]),
  );
}
export async function getListingSidebarOptions(args: {
  category: string;
  subcategory?: string;
  regionSlug?: string;

  min?: number;
  max?: number;
  membership?: "verified" | "unverified";

  county?: string;
  town?: string;

  make?: string;
  model?: string;

  q?: string;

  // optional extras (safe to ignore if unused)
  type?: string;
  brand?: string;
}): Promise<SidebarOptions> {
  await connectToDatabase();

  const category = safeTrim(args.category);
  const subcategory = safeTrim(args.subcategory);

  const min = typeof args.min === "number" ? args.min : undefined;
  const max = typeof args.max === "number" ? args.max : undefined;

  const county = safeTrim(args.county);
  const town = safeTrim(args.town);

  const make = safeTrim(args.make);
  const model = safeTrim(args.model);

  const q = safeTrim(args.q);

  const type = safeTrim((args as any).type);
  const brand = safeTrim((args as any).brand);

  // ✅ Base match (category + region + active only)
  const regionSlug = safeTrim(args.regionSlug);
  console.log(regionSlug)
  const regionNames = regionSlug ? regionCandidates(regionSlug) : [];

  const matchBase: any = {
    adstatus: "Active",
    "data.category": category,
  };

  if (regionNames.length) matchBase["data.region"] = { $in: regionNames };

  // ✅ membership uses organizer lookup (same as your getAlldynamicAd)
  if (args.membership === "verified") {
    const verifiedUsers = await User.find({ "verified.accountverified": true }).select("_id");
    matchBase.organizer = { $in: verifiedUsers.map((u) => u._id) };
  } else if (args.membership === "unverified") {
    const unverifiedUsers = await User.find({ "verified.accountverified": false }).select("_id");
    matchBase.organizer = { $in: unverifiedUsers.map((u) => u._id) };
  }

  if (min !== undefined || max !== undefined) {
    matchBase["data.price"] = {};
    if (min !== undefined) matchBase["data.price"].$gte = min;
    if (max !== undefined) matchBase["data.price"].$lte = max;
  }

  // ✅ location filters
  if (county) matchBase["data.county"] = county;
  if (town) {
    matchBase.$and = matchBase.$and || [];
    matchBase.$and.push({ $or: [{ "data.town": town }, { "data.area": town }] });
  }

  // ✅ vehicle filters
  if (make) matchBase["data.make"] = make;
  if (model) matchBase["data.model"] = model;

  // ✅ non-vehicle filters (only if present)
  if (type) matchBase["data.type"] = type;
  if (brand) matchBase["data.brand"] = brand;

  // ✅ search query
  if (q) {
    matchBase.$and = matchBase.$and || [];
    matchBase.$and.push({
      $or: [
        { "data.title": { $regex: q, $options: "i" } },
        { "data.description": { $regex: q, $options: "i" } },
      ],
    });
  }

  // ✅ Options are locked to current listing subcategory (so dropdowns make sense)
  const matchForOptions = subcategory
    ? { ...matchBase, "data.subcategory": subcategory }
    : matchBase;

  const pipeline: any[] = [
    {
      $facet: {
        bySubcategory: [
          { $match: matchBase },
          { $group: { _id: pickSubcatExpr(), c: { $sum: 1 } } },
        ],
        total: [
          { $match: matchBase },
          { $count: "n" },
        ],

        counties: [
          { $match: matchForOptions },
          { $group: { _id: pickCountyExpr() } },
        ],
        towns: [
          { $match: matchForOptions },
          { $group: { _id: pickTownExpr() } },
        ],
        townsByCounty: [
          { $match: matchForOptions },
          { $group: { _id: { county: pickCountyExpr(), town: pickTownExpr() }, c: { $sum: 1 } } },
        ],
        makes: [
          { $match: matchForOptions },
          { $group: { _id: pickMakeExpr() } },
        ],
        models: [
          { $match: matchForOptions },
          { $group: { _id: pickModelExpr() } },
        ],
      },
    },
  ];

  const [out] = await DynamicAd.aggregate(pipeline);

  const subcategoryCounts: Record<string, number> = {};
  for (const row of out?.bySubcategory || []) {
    const k = safeTrim(row?._id);
    if (!k) continue;
    subcategoryCounts[k] = Number(row?.c || 0);
  }

  const counties = (out?.counties || [])
    .map((x: any) => safeTrim(x?._id))
    .filter(Boolean)
    .sort((a: string, b: string) => a.localeCompare(b));

  const towns = (out?.towns || [])
    .map((x: any) => safeTrim(x?._id))
    .filter(Boolean)
    .sort((a: string, b: string) => a.localeCompare(b));

  const townsByCounty: Record<string, string[]> = {};
  for (const row of out?.townsByCounty || []) {
    const c = safeTrim(row?._id?.county);
    const t = safeTrim(row?._id?.town);
    if (!c || !t) continue;
    townsByCounty[c] = townsByCounty[c] || [];
    townsByCounty[c].push(t);
  }
  for (const c of Object.keys(townsByCounty)) {
    townsByCounty[c] = Array.from(new Set(townsByCounty[c])).sort((a, b) => a.localeCompare(b));
  }

  const makes = (out?.makes || [])
    .map((x: any) => safeTrim(x?._id))
    .filter(Boolean)
    .sort((a: string, b: string) => a.localeCompare(b));

  const models = (out?.models || [])
    .map((x: any) => safeTrim(x?._id))
    .filter(Boolean)
    .sort((a: string, b: string) => a.localeCompare(b));

  const totalInCategory = Number(out?.total?.[0]?.n || 0);

  return {
    subcategoryCounts,
    counties,
    towns,
    townsByCounty,
    makes,
    models,
    totalInCategory,
  };
}