"use server";
import { handleError } from '../utils';
import Transaction from '../database/models/transaction.model';
import { updateVerification } from './user.actions';
import { connectToDatabase } from '../database';
import { CreateTransactionParams, TransactionStatusParams } from '@/types';
import axios from 'axios';
import Packages from '../database/models/packages.model';
import User from '../database/models/user.model';
export async function verificationStatus(transaction: TransactionStatusParams) {
 
  const apiUrl = "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken";
  const consumerKey = "qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW";
  const consumerSecret = "osGQ364R49cXKeOYSpaOnT++rHs=";
  
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  
  const data = {
    "consumer_key": consumerKey,
    "consumer_secret": consumerSecret
  };
  
  try {
    const response = await axios.post(apiUrl, data, { headers });
  
    const responseData = response.data;
    
    if (responseData && responseData.token) {
      const token = responseData.token;
    
      // Construct the request URL for the second API call
      const regueststatusurl = `https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus?orderTrackingId=${transaction.orderTrackingId}`;
      
      // Set headers for the second request
      const requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
    
      try {
        const response = await axios.get(regueststatusurl, { headers: requestHeaders });
  
       const responseData = response.data;
     //  console.log(responseData);
       if (responseData && responseData.status==="200") {
       
        //console.log("amount: "+responseData.amount);
      
        const trans = {
          orderTrackingId: transaction.orderTrackingId,
          amount: transaction.amount,
          plan: transaction.plan,
          planId: transaction.planId,
          period: transaction.period,
          buyerId: transaction.buyerId,
          merchantId: responseData.merchant_reference,
          status: "Active",
          createdAt: new Date(),
        };
      //  console.log(trans);
       // const newTransaction = await createTransaction(trans);
       // console.log(JSON.stringify(newTransaction))
       // console.log(newTransaction);
        return "success";
       }else{
       // console.log(responseData.status);
        return "failed";
       }
      
      } catch (error) {
        console.error('Error:', error);
        return "error";
        // Handle error appropriately
      }
    } else {
     // throw new Error('Unable to extract token from response');
     return "error";
    }
  } catch (error) {
    console.error('Error:', error);
    return "error";
    // Handle error appropriately
  }
  
  //redirect(session.url!)
}
const populateAd = (query: any) => {
  return query
    .populate({ path: 'planId', model: Packages, select: '_id plan features price' })
   
}
// GET ONE Ad BY ID
export async function geetData(userId: string) {
  try {
    await connectToDatabase()

    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
   handleError(error)
  }
}



export async function createTransaction(trans: { orderTrackingId: string; amount: number; plan: string; planId: string; period: string; buyerId: string; merchantId: any; createdAt: Date; }, transaction: CreateTransactionParams) {
  try {
    await connectToDatabase();
 // Check if orderTrackingId exists
 
 const existingTransaction = await Transaction.findOne({ orderTrackingId: transaction.orderTrackingId });

 if (existingTransaction) {
 // console.log('Transaction with the same orderTrackingId already exists')
   throw new Error('Transaction with the same orderTrackingId already exists');
 }

    // Create a new transaction with a buyerId
    const newTransaction = await Transaction.create({
      ...transaction,buyer: transaction.buyerId
    })

    await updateVerification(transaction.buyerId);

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error)
  }
}