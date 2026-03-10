"use server";


import axios from 'axios';
import { connectToDatabase } from '../database';
import Transaction from '../database/models/transaction.model';
import { handleError } from '../utils';
import Ad from '../database/models/ad.model';
import { updateVerification } from './user.actions';
import DynamicAd from '../database/models/dynamicAd.model';

export async function Requestcheckpayment(orderTrackingId: string) {

  const regueststatusurl = `https://ezeshamobile.co.ke/pit/checkpayment_offerup.php?Account=${orderTrackingId}`;

  // Set headers for the second request
  const requestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.get(regueststatusurl, { headers: requestHeaders });

    const responseData = response.data;
    if (responseData.status === "success") {
      await updateTransaction(orderTrackingId);
    }
    // console.log(responseData.status);
    return responseData.status;

  } catch (error) {
    console.error('Error:', error);
    return "error";
    // Handle error appropriately
  }

}
export async function updateTransaction(orderTrackingId: string) {
  try {
    await connectToDatabase();
    //console.log("update userId: "+userId+" Date:"+Date());
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { orderTrackingId: orderTrackingId },
      { status: "Active" },
      { new: true }
    )

    if (updatedTransaction.plan === "Verification") {
      await updateVerification(updatedTransaction.buyer)
    }
    await DynamicAd.findByIdAndUpdate(
      { _id: orderTrackingId },
      { adstatus: "Active" },
      { new: true }
    )
    // if(!updatedTransaction) throw new Error("User Verification update failed");

    return JSON.parse(JSON.stringify(updatedTransaction));
  } catch (error) {
    handleError(error);
  }
}