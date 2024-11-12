'use server'

import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '@/lib/database'
import Ad, { IAd } from '@/lib/database/models/ad.model'
import User from '@/lib/database/models/user.model'
import Category from '@/lib/database/models/category.model'
import Packages from '@/lib/database/models/packages.model'
import { handleError } from '@/lib/utils'
import { UTApi } from "uploadthing/server"
import { Document, Schema, model, models  } from "mongoose";

import {
  CreateAdParams,
  UpdateAdParams,
  DeleteAdParams,
  GetAllAdsParams,
  GetAdsByUserParams,
  GetRelatedAdsByCategoryParams,
  deleteImageParams,
  UpdateVideoParams,
  UpdateViewsParams,
  UpdateCallsParams,
  UpdateInquiriesParams,
  UpdateWhatsappParams,
  UpdateBookmarkedParams,
  UpdateShareParams,
  UpdateAbuseParams,
} from '@/types'
import Transaction from '../database/models/transaction.model'
import { Model } from 'mongoose'
import { ObjectId } from 'mongodb'
import { createTransaction } from './transactionstatus'


const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

const populateAd = (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified fcmToken' })
    .populate({ path: 'category', model: Category, select: '_id name' })
    .populate({ path: 'plan', model: Packages, select: '_id name color imageUrl' })
}

// CREATE
export async function createAd({ userId, planId, ad, path, pricePack, periodPack }: CreateAdParams) {
  try {
    await connectToDatabase()

   const organizer = await User.findById(userId)
    
    if (!organizer) throw new Error('Organizer not found')

    const newAd = await Ad.create({ ...ad, category: ad.categoryId, organizer: userId, plan: planId })
   if(newAd.adstatus==="Pending"){
    const trans = {
      orderTrackingId: newAd._id,
      amount: pricePack,
      plan: newAd.plan.name,
      planId: newAd.plan._id,
      period: periodPack,
      buyerId: userId,
      merchantId: userId,
      status:newAd.adstatus,
      createdAt: new Date(),
    };
  //  console.log(trans);
    const newTransaction = await createTransaction(trans);
   }
   
   
    revalidatePath(path)
   
    return JSON.parse(JSON.stringify(newAd))
  } catch (error) {
    handleError(error)
  }
}

// GET ONE Ad BY ID
export async function getAdById(adId: string) {
  try {
    await connectToDatabase()

    const Ads = await populateAd(Ad.findById(adId))

    if (!Ads) throw new Error('Ad not found')

    return JSON.parse(JSON.stringify(Ads))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export async function updateAd({ userId, ad, path }: UpdateAdParams) {
  try {
    await connectToDatabase()

    const AdToUpdate = await Ad.findById(ad._id)
    if (!AdToUpdate || AdToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized or Ad not found')
    }

    const updatedAd = await Ad.findByIdAndUpdate(
      ad._id,
      { ...ad, category: ad.categoryId },
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedAd))
  } catch (error) {
    handleError(error)
  }
}
// UPDATE
export async function updatevideo({ _id, youtube, path }: UpdateVideoParams) {
  try {
    await connectToDatabase();
    
    // Find the category by its ID and update the name field only
    const updatedadVideo = await Ad.findByIdAndUpdate(
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
    const updateAdViews = await Ad.findByIdAndUpdate(
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
    const updateAdCalls = await Ad.findByIdAndUpdate(
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
    const updateAdwhatsapp = await Ad.findByIdAndUpdate(
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
    const updateAdinquiries = await Ad.findByIdAndUpdate(
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
    const updateAdshare = await Ad.findByIdAndUpdate(
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
    const updateAdbookmarked = await Ad.findByIdAndUpdate(
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
    const updateAdabused = await Ad.findByIdAndUpdate(
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
// DELETE
export async function deleteAd({ adId, deleteImages, path }: DeleteAdParams) {
  try {
  
    if (deleteImages) {
        const utapi = new UTApi();
      await utapi.deleteFiles(deleteImages);
    }
    await connectToDatabase()
    const deletedAd = await Ad.findByIdAndDelete(adId)
    if (deletedAd) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}

// DELETE

export async function deleteSingleImage({ deleteImage, path }: deleteImageParams) {
  try {
  
    if (deleteImage) {
        const utapi = new UTApi();
        const deletedAd = await utapi.deleteFiles(deleteImage);
        if (deletedAd) revalidatePath(path)
    }
   
  } catch (error) {
    handleError(error)
  }
}

// GET ALL Ad
export async function getAllAd({ query, limit = 20, page, category, subcategory, sortby,make,vehiclemodel,yearfrom,yearto,Price,vehiclecolor,vehiclecondition,address, membership,vehicleTransmissions,vehicleFuelTypes,vehicleBodyTypes,vehicleEngineSizesCC,vehicleexchangeposible,vehicleSeats,vehicleregistered,vehiclesecordCondition,vehicleyear,Types,bedrooms,bathrooms,furnishing,amenities,toilets,parking,status,area,landuse,propertysecurity,floors,estatename,houseclass}: GetAllAdsParams) {
  try {
    await connectToDatabase()
   
    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
    const subcategoryCondition = subcategory ? { subcategory: { $regex: subcategory, $options: 'i' } } : {}
    const makeCondition = (make && make !== "all") ? { make: { $regex: make, $options: 'i' } } : {};
    const colorCondition = (vehiclecolor && vehiclecolor !== "all") ? { vehiclecolor: { $regex: vehiclecolor, $options: 'i' } } : {};
    const modelCondition = vehiclemodel ? { vehiclemodel: { $regex: vehiclemodel, $options: 'i' } } : {}
    const VstatusCondition = (vehiclecondition && vehiclecondition !== "all") ? { vehiclecondition: { $regex: vehiclecondition, $options: 'i' } } : {}
    const transmissionCondition = (vehicleTransmissions && vehicleTransmissions !== "all") ? { vehicleTransmissions: { $regex: vehicleTransmissions, $options: 'i' } } : {}
    const fuelCondition = (vehicleFuelTypes && vehicleFuelTypes !== "all") ? { vehicleFuelTypes: { $regex: vehicleFuelTypes, $options: 'i' } } : {}
    const bodyCondition = (vehicleBodyTypes && vehicleBodyTypes !== "all") ? { vehicleBodyTypes: { $regex: vehicleBodyTypes, $options: 'i' } } : {}
    const ccCondition = (vehicleEngineSizesCC && vehicleEngineSizesCC !== "all") ? { vehicleEngineSizesCC: { $regex: vehicleEngineSizesCC, $options: 'i' } } : {}
    const vehicleyearCondition = (vehicleyear && vehicleyear !== "all") ? { vehicleyear: { $regex: vehicleyear, $options: 'i' } } : {}
    const seatsCondition = (vehicleSeats && vehicleSeats !== "all") ? { vehicleSeats: { $regex: vehicleSeats, $options: 'i' } } : {}
    const exchangeCondition = (vehicleexchangeposible && vehicleexchangeposible !== "all") ? { vehicleexchangeposible: { $regex: vehicleexchangeposible, $options: 'i' } } : {}
    const registeredCondition = (vehicleregistered && vehicleregistered !== "all") ? { vehicleregistered: { $regex: vehicleregistered, $options: 'i' } } : {}
    const secondCondition = (vehiclesecordCondition && vehiclesecordCondition !== "all") ? { vehiclesecordCondition: { $regex: vehiclesecordCondition, $options: 'i' } } : {}
    const bathroomsCondition = (bathrooms && bathrooms !== "all") ? { bathrooms: { $regex: bathrooms, $options: 'i' } } : {}
    const furnishingCondition = (furnishing && furnishing !== "all") ? { furnishing: { $regex: furnishing, $options: 'i' } } : {}
    const bedroomsCondition = (bedrooms && bedrooms !== "all") ? { bedrooms: { $regex: bedrooms, $options: 'i' } } : {}
    const amenitiesCondition = (amenities && amenities.length > 0) ? { amenities: { $regex: amenities, $options: 'i' } } : {}
    const toiletsCondition = (toilets && toilets !== "all") ? { toilets: { $regex: toilets, $options: 'i' } } : {}
    const parkingCondition = (parking && parking !== "all") ? { parking: { $regex: parking, $options: 'i' } } : {}
    const statusCondition = (status && status !== "all") ? { status: { $regex: status, $options: 'i' } } : {}
    const areaCondition = (area && area !== "all") ? { area: { $regex: area, $options: 'i' } } : {}
    const useCondition = (landuse && landuse !== "all") ? { landuse: { $regex: landuse, $options: 'i' } } : {}
    const TypesCondition = (Types && Types !== "all") ? { Types: { $regex: Types, $options: 'i' } } : {}
    const securityCondition = (propertysecurity && propertysecurity !== "all") ? { propertysecurity: { $regex: propertysecurity, $options: 'i' } } : {}
    const floorsCondition = (floors && floors !== "all") ? { floors: { $regex: floors, $options: 'i' } } : {}
    const estatenameCondition = (estatename && estatename !== "all") ? { estatename: { $regex: estatename, $options: 'i' } } : {}
    const houseclassCondition = (houseclass && houseclass !== "all") ? { houseclass: { $regex: houseclass, $options: 'i' } } : {}
    const regionCondition = address ? { address: { $regex: address, $options: 'i' } } : {}
 
    const conditionsAdstatus = { adstatus: "Active" }

    let yearCondition =  {}
    if(yearto && yearfrom){
   yearCondition = yearto ? { vehicleyear: { $gte: parseInt(yearfrom), $lte: parseInt(yearto) } } : {}

}
    const [minPrice, maxPrice] = Price.split("-");
    const priceCondition = minPrice && maxPrice ? { price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } } : {}
    const categoryCondition = category ? await getCategoryByName(category) : null
 // Fetch verified users
 let conditions={};
 if(membership==="verified"){
    const verifiedUsers = await User.find({ "verified.accountverified": true });
    // Extract IDs of verified users
    const verifiedUserIds = verifiedUsers.map(user => user._id);
   // console.log(verifiedUserIds)
      conditions = {
      $and: [conditionsAdstatus,titleCondition, categoryCondition ? { category: categoryCondition._id } : {},subcategoryCondition,makeCondition,modelCondition,yearCondition,priceCondition,colorCondition,statusCondition,regionCondition,transmissionCondition,fuelCondition,bodyCondition,ccCondition,seatsCondition,exchangeCondition,registeredCondition,secondCondition,vehicleyearCondition,VstatusCondition,bathroomsCondition,bedroomsCondition,amenitiesCondition,toiletsCondition,parkingCondition, areaCondition,useCondition,TypesCondition,securityCondition,floorsCondition,estatenameCondition,houseclassCondition, { organizer: { $in: verifiedUserIds } }],
    }

 }else if (membership==="unverified"){
  const verifiedUsers = await User.find({ "verified.accountverified": false });
  // Extract IDs of verified users
  const verifiedUserIds = verifiedUsers.map(user => user._id);

    conditions = {
    $and: [conditionsAdstatus,titleCondition, categoryCondition ? { category: categoryCondition._id } : {},subcategoryCondition,makeCondition,modelCondition,yearCondition,priceCondition,colorCondition,statusCondition,regionCondition,transmissionCondition, fuelCondition,bodyCondition,ccCondition,seatsCondition,exchangeCondition,registeredCondition,secondCondition,furnishingCondition,vehicleyearCondition,VstatusCondition,bedroomsCondition,amenitiesCondition,toiletsCondition,parkingCondition,areaCondition,useCondition,TypesCondition,securityCondition,floorsCondition,estatenameCondition,houseclassCondition, { organizer: { $in: verifiedUserIds } }],
  }
 }else{

   conditions = {
    $and: [conditionsAdstatus,titleCondition, categoryCondition ? { category: categoryCondition._id } : {},subcategoryCondition,makeCondition,modelCondition,yearCondition,priceCondition,colorCondition,statusCondition,regionCondition,transmissionCondition,fuelCondition,bodyCondition,ccCondition,seatsCondition,exchangeCondition,registeredCondition,secondCondition,furnishingCondition,vehicleyearCondition,VstatusCondition,bedroomsCondition,amenitiesCondition,toiletsCondition,parkingCondition,areaCondition,useCondition,TypesCondition,securityCondition,floorsCondition,estatenameCondition,houseclassCondition],
  }
 }
   
    
    const skipAmount = (Number(page) - 1) * limit
    let AdQuery:any=[];
   
if(sortby==="recommeded"){
   AdQuery = Ad.find(conditions)
  // .sort({ priority: 'desc' })
  .sort({ priority: -1, createdAt: -1 }) // Both sorted in descending order
      .skip(skipAmount)
      .limit(limit)
}else if(sortby==="new"){
  AdQuery = Ad.find(conditions)
  .sort({ priority: -1, createdAt: -1 }) // Both sorted in descending order
      .skip(skipAmount)
      .limit(limit)
}else if(sortby==="lowest"){
  AdQuery = Ad.find(conditions)
 // .sort({ price: 'asc' })
  .sort({ priority: -1, price: 1 })
  .skip(skipAmount)
  .limit(limit)
}else if(sortby==="highest"){
  AdQuery = Ad.find(conditions)
 // .sort({ price: 'desc' })
  .sort({ priority: -1, price: -1 }) // Both sorted in descending order
  .skip(skipAmount)
  .limit(limit)
}else {
 
  AdQuery = Ad.find(conditions)
  .sort({ priority: -1, price: -1 })
  .skip(skipAmount)
  .limit(limit)
}


      const Ads = await populateAd(AdQuery);
   
      const AdCount = await Ad.countDocuments(conditions)
   
      return {
        data: JSON.parse(JSON.stringify(Ads)),
        totalPages: Math.ceil(AdCount / limit),
      }
    
  } catch (error) {
    handleError(error)
  }
}


export async function getListingsNearLocation({ query, limit = 20, page, category, subcategory, sortby,make,vehiclemodel,yearfrom,yearto,Price,vehiclecolor,vehiclecondition,longitude,latitude,vehicleTransmissions,vehicleFuelTypes,vehicleBodyTypes,vehicleEngineSizesCC,vehicleSeats,vehicleregistered,vehicleexchangeposible,vehiclesecordCondition,vehicleyear,Types,bedrooms,bathrooms,furnishing,amenities,toilets,parking,status,area,landuse,propertysecurity,floors,estatename,houseclass}: GetAllAdsParams) {
  try {
  await connectToDatabase()
  if(longitude && latitude){
    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
    const subcategoryCondition = subcategory ? { subcategory: { $regex: subcategory, $options: 'i' } } : {}
    const makeCondition = (make && make !== "all") ? { make: { $regex: make, $options: 'i' } } : {};
    const colorCondition = (vehiclecolor && vehiclecolor !== "all") ? { vehiclecolor: { $regex: vehiclecolor, $options: 'i' } } : {};
    const modelCondition = vehiclemodel ? { vehiclemodel: { $regex: vehiclemodel, $options: 'i' } } : {}
    const VstatusCondition = (vehiclecondition && vehiclecondition !== "all") ? { vehiclecondition: { $regex: vehiclecondition, $options: 'i' } } : {}
    const transmissionCondition = (vehicleTransmissions && vehicleTransmissions !== "all") ? { vehicleTransmissions: { $regex: vehicleTransmissions, $options: 'i' } } : {}
    const fuelCondition = (vehicleFuelTypes && vehicleFuelTypes !== "all") ? { vehicleFuelTypes: { $regex: vehicleFuelTypes, $options: 'i' } } : {}
    const bodyCondition = (vehicleBodyTypes && vehicleBodyTypes !== "all") ? { vehicleBodyTypes: { $regex: vehicleBodyTypes, $options: 'i' } } : {}
    const ccCondition = (vehicleEngineSizesCC && vehicleEngineSizesCC !== "all") ? { vehicleEngineSizesCC: { $regex: vehicleEngineSizesCC, $options: 'i' } } : {}
    const seatsCondition = (vehicleSeats && vehicleSeats !== "all") ? { vehicleSeats: { $regex: vehicleSeats, $options: 'i' } } : {}
    const vehicleyearCondition = (vehicleyear && vehicleyear !== "all") ? { vehicleyear: { $regex: vehicleyear, $options: 'i' } } : {}
    const exchangeCondition = (vehicleexchangeposible && vehicleexchangeposible !== "all") ? { vehicleexchangeposible: { $regex: vehicleexchangeposible, $options: 'i' } } : {}
    const registeredCondition = (vehicleregistered && vehicleregistered !== "all") ? { vehicleregistered: { $regex: vehicleregistered, $options: 'i' } } : {}
    const secondCondition = (vehiclesecordCondition && vehiclesecordCondition !== "all") ? { vehiclesecordCondition: { $regex: vehiclesecordCondition, $options: 'i' } } : {}
    const TypesCondition = (Types && Types !== "all") ? { Types: { $regex: Types, $options: 'i' } } : {}
    const bathroomsCondition = (bathrooms && bathrooms !== "all") ? { bathrooms: { $regex: bathrooms, $options: 'i' } } : {}
    const furnishingCondition = (furnishing && furnishing !== "all") ? { furnishing: { $regex: furnishing, $options: 'i' } } : {}
    const bedroomsCondition = (bedrooms && bedrooms !== "all") ? { bedrooms: { $regex: bedrooms, $options: 'i' } } : {}
    const amenitiesCondition = (amenities && amenities.length > 0) ? { amenities: { $regex: amenities, $options: 'i' } } : {}
    const toiletsCondition = (toilets && toilets !== "all") ? { toilets: { $regex: toilets, $options: 'i' } } : {}
    const parkingCondition = (parking && parking !== "all") ? { parking: { $regex: parking, $options: 'i' } } : {}
    const statusCondition = (status && status !== "all") ? { status: { $regex: status, $options: 'i' } } : {}
    const areaCondition = (area && area !== "all") ? { area: { $regex: area, $options: 'i' } } : {}
    const useCondition = (landuse && landuse !== "all") ? { landuse: { $regex: landuse, $options: 'i' } } : {}
    const securityCondition = (propertysecurity && propertysecurity !== "all") ? { propertysecurity: { $regex: propertysecurity, $options: 'i' } } : {}
    const floorsCondition = (floors && floors !== "all") ? { floors: { $regex: floors, $options: 'i' } } : {}
    const estatenameCondition = (estatename && estatename !== "all") ? { estatename: { $regex: estatename, $options: 'i' } } : {}
    const houseclassCondition = (houseclass && houseclass !== "all") ? { houseclass: { $regex: houseclass, $options: 'i' } } : {}
    const conditionsAdstatus = { adstatus: "Active" }
    let yearCondition =  {};
    if(yearto && yearfrom){
   yearCondition = yearto ? { vehicleyear: { $gte: parseInt(yearfrom), $lte: parseInt(yearto) } } : {}

}
const [minPrice, maxPrice] = Price.split("-");
const priceCondition = minPrice && maxPrice ? { price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } } : {}
    const categoryCondition = category ? await getCategoryByName(category) : null
    
   const conditions = {
     $and: [conditionsAdstatus,titleCondition, categoryCondition ? { category: categoryCondition._id } : {},subcategoryCondition,makeCondition,modelCondition,yearCondition,priceCondition,colorCondition,statusCondition,transmissionCondition,fuelCondition,bodyCondition,ccCondition,seatsCondition,exchangeCondition,registeredCondition,secondCondition,vehicleyearCondition,VstatusCondition,bathroomsCondition,bedroomsCondition,amenitiesCondition,toiletsCondition,parkingCondition, areaCondition,useCondition,TypesCondition,securityCondition,floorsCondition,estatenameCondition,houseclassCondition,furnishingCondition],
   }  

 const ads = await Ad.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
      spherical: true,
      distanceField: "calcDistance",
      query: conditions, // Filter by subcategory
      key: "geometry" // Specify the name of the index to use
    }
  }
]);
//console.log(ads)
 // Step 2: Populate the aggregated results
 const populatedAds = await Ad.populate(ads, [
  { path: 'organizer', model: User, select: '_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified fcmToken' },
  { path: 'category', model: Category, select: '_id name' },
  { path: 'plan', model: Packages, select: '_id name color imageUrl' }
]);

const AdCount = await Ad.countDocuments(conditions);
//const AdCount = await Ad.countDocuments(conditions)
   
return {
  data: JSON.parse(JSON.stringify(populatedAds)),
  totalPages: Math.ceil(AdCount / limit),
}
  }
} catch (error) {
  console.error("Error:", error);
  throw error;
}
 
}


// GET Ad BY ORGANIZER
export async function getAdByUser({ userId, limit = 20, page , sortby, myshop}: GetAdsByUserParams) {
  try {
  
    await connectToDatabase()
    let conditions={}
  
if(myshop){
  conditions = { organizer: userId }
 
}else{
  
  const status = "Active";
   conditions = { $and: [{ organizer: userId }, { adstatus: status }] };
  
}
   
    const skipAmount = (page - 1) * limit
    let AdQuery:any=[];
if(sortby==="recommeded"){
   AdQuery = Ad.find(conditions)
    // .sort({ priority: 'desc' })
    .sort({ priority: -1, createdAt: -1 }) // Both sorted in descending order
      .skip(skipAmount)
      .limit(limit)
}else if(sortby==="new"){
  AdQuery = Ad.find(conditions)
     // .sort({ createdAt: 'desc' })
      .sort({ priority: -1, createdAt: -1 })
      .skip(skipAmount)
      .limit(limit)
}else if(sortby==="lowest"){
  AdQuery = Ad.find(conditions)
//  .sort({ price: 'asc' })
  .sort({ priority: -1, price: 1 })
  .skip(skipAmount)
  .limit(limit)
}else if(sortby==="highest"){
  AdQuery = Ad.find(conditions)
 // .sort({ price: 'desc' })
  .sort({ priority: -1, price: -1 })
  .skip(skipAmount)
  .limit(limit)
}
  

    const Ads = await populateAd(AdQuery)
    const AdCount = await Ad.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(Ads)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}

// GET RELATED Ad: Ad WITH SAME CATEGORY
export async function getRelatedAdByCategory({
  categoryId,
  subcategory,
  adId,
  limit = 16,
  page,
}: GetRelatedAdsByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: categoryId }, { subcategory: subcategory }, { _id: { $ne: adId } }, { adstatus: "Active" }] }

    const AdQuery = Ad.find(conditions)
    //  .sort({ createdAt: 'desc' })
      .sort({ priority: -1, createdAt: -1 })
      .skip(skipAmount)
      .limit(limit)

    const Ads = await populateAd(AdQuery)
    const AdCount = await Ad.countDocuments(conditions)
//console.log(JSON.parse(JSON.stringify(Ads)))
    return { data: JSON.parse(JSON.stringify(Ads)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
export const getAdsCountPersecondCondition = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      },
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$vehiclesecordCondition", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPerCC = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      },
      {
        $group: {
          _id: "$vehicleEngineSizesCC", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);
    adsCountPerSubcategory.sort((a, b) => a._id.localeCompare(b._id));
    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPerExchange = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      }
      ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active'}// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$vehicleexchangeposible", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPerBodyType = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$vehicleBodyTypes", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};



export const getAdsCountPerarea = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$area", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPerstatus = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active'}// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$status", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPerparking = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$parking", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPertoilets = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$toilets", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPeramenities = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$amenities", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPerfurnishing = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active'}// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$furnishing", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPerbathrooms = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$bathrooms", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPerbedrooms = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$bedrooms", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPerRegistered = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$vehicleregistered", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPerSeats = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$vehicleSeats", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPerSubcategory = async (category: string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      },
      {
        $match: { adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$subcategory", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};



export const getAdsCountPerCondition = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      },
      {
        $group: {
          _id: "$vehiclecondition", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);
//console.log(JSON.parse(JSON.stringify(adsCountPerSubcategory)))
    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};


export const getAdsCountPerFuel = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      },
      {
        $group: {
          _id: "$vehicleFuelTypes", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};

export const getAdsCountPerTransmission = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$vehicleTransmissions", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};

export const getAdsCountPerColor = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$vehiclecolor", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};





export const getAdsCountPerRegion = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();
    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    let  adsCountPerSubcategory:any=[];
    if (subcategory) {
       adsCountPerSubcategory = await Ad.aggregate([
        {
          $addFields: {
            isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
          }
        },
        {
          $match: { isCategoryMatch: true } // Filter documents where the category matches
        } ,
        {
          $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
        },
          {
            $group: {
              _id: "$address", // Group by the subcategory field // Group by both category and address fields
              adCount: { $sum: 1 } // Calculate the count of ads for each category-address pair
            }
          }
      ]);
  
    // Sort the array alphabetically by the _id field (address)
    adsCountPerSubcategory.sort((a:any, b:any) => a._id.localeCompare(b._id));

    }else{
       adsCountPerSubcategory = await Ad.aggregate([
        {
          $addFields: {
            isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
          }
        },
        {
          $match: { isCategoryMatch: true } // Filter documents where the category matches
        },
        {
          $match: { adstatus: 'Active' }// Filter documents where the category matches
        },
          {
            $group: {
              _id: "$address", // Group by the subcategory field // Group by both category and address fields
              adCount: { $sum: 1 } // Calculate the count of ads for each category-address pair
            }
          }
      ]);
  
    // Sort the array alphabetically by the _id field (address)
    adsCountPerSubcategory.sort((a:any, b:any) => a._id.localeCompare(b._id));

    }
    
    

  
    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};

export const getAdsCountPerMake = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      } ,
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$make", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);
//console.log(JSON.parse(JSON.stringify(adsCountPerSubcategory)))
    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPerVerifiedTrue = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();
    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);


    let  AdsCountPerVerified:any=[];
    if (subcategory) {
       AdsCountPerVerified = await Ad.aggregate([
        {
          $addFields: {
            isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
          }
        },
        {
          $match: { isCategoryMatch: true } // Filter documents where the category matches
        },
        {
          $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
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
  
    }else{
       AdsCountPerVerified = await Ad.aggregate([
        {
          $addFields: {
            isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
          }
        },
        {
          $match: { isCategoryMatch: true } // Filter documents where the category matches
        },
        {
          $match: { adstatus: 'Active' }// Filter documents where the category matches
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
  
    }



    
    // Sort the array alphabetically by the _id field (address)
   //adsCountPerSubcategory.sort((a, b) => a._id.localeCompare(b._id));
   
    return JSON.parse(JSON.stringify(AdsCountPerVerified));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPerVerifiedFalse = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();
    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);


    let  AdsCountPerVerified:any=[];
    if (subcategory) {
       AdsCountPerVerified = await Ad.aggregate([
        {
          $addFields: {
            isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
          }
        },
        {
          $match: { isCategoryMatch: true } // Filter documents where the category matches
        },
        {
          $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
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
  
      // Sort the array alphab
    }else{
       AdsCountPerVerified = await Ad.aggregate([
        {
          $addFields: {
            isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
          }
        },
        {
          $match: { isCategoryMatch: true } // Filter documents where the category matches
        },
        {
          $match: { adstatus: 'Active' }// Filter documents where the category matches
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
  
      // Sort the array alphab
    }

   
   //adsCountPerSubcategory.sort((a, b) => a._id.localeCompare(b._id));
 //console.log(JSON.parse(JSON.stringify(AdsCountPerVerified)));
    return JSON.parse(JSON.stringify(AdsCountPerVerified));
  } catch (error) {
    handleError(error);
  }
};



export const getAdsCountPerCategoryAndAddress = async (category:string) => {
  try {
    await connectToDatabase();

    const adsCountPerCategoryAndAddress = await Ad.aggregate([
      {
        $match: { category: category, adstatus: 'Active' } // Filter documents based on the specified category
      },
      {
        $group: {
          _id: { category: "$category", address: "$address" }, // Group by both category and address fields
          adCount: { $sum: 1 } // Calculate the count of ads for each category-address pair
        }
      }
    ]);

    // Sort the array alphabetically by category and address
    adsCountPerCategoryAndAddress.sort((a, b) => {
      const categoryComparison = a._id.category.localeCompare(b._id.category);
      if (categoryComparison !== 0) {
        return categoryComparison;
      }
      return a._id.address.localeCompare(b._id.address);
    });

    return JSON.parse(JSON.stringify(adsCountPerCategoryAndAddress));
  } catch (error) {
    handleError(error);
  }
};




export const getAdsCountPerYear = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    let adsCountPerSubcategory:any=[];

    if(subcategory){
       adsCountPerSubcategory = await Ad.aggregate([
        {
          $addFields: {
            isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
          }
        },
        {
          $match: { isCategoryMatch: true } // Filter documents where the category matches
        },
        {
          $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
        },
        {
          $group: {
            _id: "$vehicleyear", // Group by the subcategory field
            adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
          }
        }
      ]);
      adsCountPerSubcategory.sort((a:any, b:any) => a._id.localeCompare(b._id));
    }else{
       adsCountPerSubcategory = await Ad.aggregate([
        {
          $addFields: {
            isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
          }
        },
        {
          $match: { isCategoryMatch: true } // Filter documents where the category matches
        },
        {
          $match: { adstatus: 'Active' }// Filter documents where the category matches
        },
        {
          $group: {
            _id: "$vehicleyear", // Group by the subcategory field
            adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
          }
        }
      ]);
      adsCountPerSubcategory.sort((a:any, b:any) => a._id.localeCompare(b._id));
    }
   
    return JSON.parse(JSON.stringify(adsCountPerSubcategory));

  } catch (error) {
    handleError(error);
  }
};



export const getAdsCountPerTypes = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      },
      {
        $match: { subcategory: subcategory, adstatus: 'Active'}// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$Types", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};

export const getAdsCountPerhouseclass = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      },
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$houseclass", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};

export const getAdsCountPerfloors = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      },
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$floors", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};

export const getAdsCountPerpropertysecurity = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      },
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$propertysecurity", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
export const getAdsCountPerlanduse = async (category: string, subcategory:string) => {
  try {
    await connectToDatabase();

    const categoryCondition = category ? await getCategoryByName(category) : null
    const categoryId = new ObjectId(categoryCondition._id);
    const adsCountPerSubcategory = await Ad.aggregate([
      {
        $addFields: {
          isCategoryMatch: { $eq: ["$category", categoryId] } // Check if the category matches the specified category ObjectId
        }
      },
      {
        $match: { isCategoryMatch: true } // Filter documents where the category matches
      },
      {
        $match: { subcategory: subcategory, adstatus: 'Active' }// Filter documents where the category matches
      },
      {
        $group: {
          _id: "$landuse", // Group by the subcategory field
          adCount: { $sum: 1 } // Calculate the count of ads for each subcategory
        }
      }
    ]);

    return JSON.parse(JSON.stringify(adsCountPerSubcategory));
  } catch (error) {
    handleError(error);
  }
};
