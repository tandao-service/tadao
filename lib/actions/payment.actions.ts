"use server"

import { CreatePaymentParams, CreateReportedParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import { revalidatePath } from "next/cache"
import Ad from "../database/models/ad.model"
import User from "../database/models/user.model"
import Reported from "../database/models/reported.model"
import DynamicAd from "../database/models/dynamicAd.model"
import Payment from "../database/models/payments.model"


const populateAd = (query: any) => {
  return query
    .populate({ path: 'userId', model: User, select: '_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified token' })
    .populate({
      path: 'adId',
      model: DynamicAd,
      select: '_id data views priority expirely adstatus inquiries whatsapp calls shared bookmarked abused subcategory organizer plan createdAt'
    });
};


export const createPayment = async ({ payment }: CreatePaymentParams) => {
  try {
    await connectToDatabase();
    //  const conditions = { adId: bookmark.adId };
    const conditions = { transactionId: payment.transactionId };
    const checkResponse = await Payment.findOne(conditions);  // Use findOne to find a single matching document

    let newReport = {}
    let response = "Transcation Exist!"
    if (!checkResponse) {
      newReport = await Payment.create({ ...payment });
      response = "Transcation Added"
    }

    return response;
  } catch (error) {
    handleError(error)
  }
}

export const checkPaymentStatus = async (orderTrackingId: string) => {
  try {
    // Ensure you are connected to the database
    await connectToDatabase();

    // Use findOne to find the payment by orderTrackingId
    const checkResponse = await Payment.findOne({ orderTrackingId });

    // If payment was not found, return a meaningful response
    if (!checkResponse) {
      return { success: false, message: "Payment not found for the given Order Tracking ID" };
    }

    // Return the payment status or full payment details
    return { success: true, payment: checkResponse };

  } catch (error) {
    // Proper error handling, logging and returning a response
    console.error('Error checking payment status:', error);
    return handleError(error); // Ensure this function sends a meaningful response
  }
};

// GET ONE Ad BY ID
export async function getPaymentById(_id: string) {
  try {
    await connectToDatabase()

    const response = await Payment.findById(_id);

    if (!response) throw new Error('Payment not found')

    return JSON.parse(JSON.stringify(response))
  } catch (error) {
    handleError(error)
  }
}
export async function getallPayments(transationId: string, start: string, end: string, limit: number, page: number) {
  try {
    await connectToDatabase();

    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;

    // Build conditions dynamically
    const conditions: any = {};
    if (transationId) {
      conditions.orderTrackingId = { $regex: transationId, $options: 'i' };
    }
    if (startDate || endDate) {
      conditions.createdAt = {};
      if (startDate) {
        conditions.createdAt.$gte = startDate; // Greater than or equal to startDate
      }
      if (endDate) {
        conditions.createdAt.$lte = endDate; // Less than or equal to endDate
      }
    }

    const skipAmount = (Number(page) - 1) * limit;

    // Fetch filtered orders with pagination
    const trans = await Payment.find(conditions)
        .skip(skipAmount)
        .limit(limit);

    // Get the count of documents that match the conditions
    const AdCount = await Payment.countDocuments(conditions);
    return { data: JSON.parse(JSON.stringify(trans)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}

export async function getallPayment(limit:16, page:1) {
  try {
    await connectToDatabase();
    const conditions = {}
    const skipAmount = (Number(page) - 1) * limit
    const response = await Payment.find(conditions)
      .skip(skipAmount)
      .limit(limit);

    const AdCount = await Payment.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(response)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
// UPDATE



// Function to delete a bookmark
export const deletePayment = async (_id: string) => {
  try {
    await connectToDatabase();
    const deletedPayment = await Payment.findByIdAndDelete(_id);
    return deletedPayment;
  } catch (error) {
    handleError(error); // Handle any errors
  }
};