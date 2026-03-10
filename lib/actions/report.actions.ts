"use server"

import { CreateReportedParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import { revalidatePath } from "next/cache"
import Ad from "../database/models/ad.model"
import User from "../database/models/user.model"
import Reported from "../database/models/reported.model"
import DynamicAd from "../database/models/dynamicAd.model"


const populateAd = (query: any) => {
  return query
    .populate({ path: 'userId', model: User, select: '_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified token' })
    .populate({
      path: 'adId',
      model: DynamicAd,
      select: '_id data views priority expirely adstatus inquiries whatsapp calls shared bookmarked abused subcategory organizer plan createdAt'
    });
};


export const createReport = async ({ report, path }: CreateReportedParams) => {
  try {
    await connectToDatabase();
    //  const conditions = { adId: bookmark.adId };
    const conditions = { $and: [{ adId: report.adId }, { userId: report.userId }] };
    const reportResponse = await Reported.findOne(conditions);  // Use findOne to find a single matching document

    let newReport = {}
    let response = "You have aleardy reported Ad!"
    if (!reportResponse) {
      newReport = await Reported.create({ ...report });
      response = "Ad Reported"
    }

    revalidatePath(path)
    return response;
  } catch (error) {
    handleError(error)
  }
}

// GET ONE Ad BY ID
export async function getReportedById(_id: string) {
  try {
    await connectToDatabase()

    const response = await populateAd(Reported.findById(_id));

    if (!response) throw new Error('Reported not found')

    return JSON.parse(JSON.stringify(response))
  } catch (error) {
    handleError(error)
  }
}
export async function getallReported(limit = 16, page = 1) {
  try {
    await connectToDatabase();
    const conditions = {}
    const skipAmount = (Number(page) - 1) * limit
    const response = await populateAd(Reported.find(conditions)
      .skip(skipAmount)
      .limit(limit));
    console.log(response);
    const AdCount = await Reported.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(response)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
// UPDATE



// Function to delete a bookmark
export const deleteReported = async ({ report, path }: CreateReportedParams) => {
  try {
    await connectToDatabase();
    const conditions = { $and: [{ adId: report.adId }, { userId: report.userId }] };
    const reportResponse = await Reported.findOne(conditions); // Find the matching bookmark

    let response = "Report not found";
    if (reportResponse) {
      await Reported.deleteOne(conditions); // Delete the bookmark if it exists
      response = "Report deleted successfully";
    }

    revalidatePath(path); // Revalidate the path to update cache
    return response;
  } catch (error) {
    handleError(error); // Handle any errors
  }
};