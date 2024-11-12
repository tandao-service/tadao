"use server";
import { handleError } from '../utils';
import Transaction from '../database/models/transaction.model';

import { connectToDatabase } from '../database';
import { CreateTransactionParams, TransactionStatusParams } from '@/types';
import axios from 'axios';
import { NextResponse } from 'next/server';
import Packages from '../database/models/packages.model';
import User from '../database/models/user.model';
export async function transactionStatus(transaction: TransactionStatusParams) {
 
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
       //console.log(responseData);
       if (responseData && responseData.status==="200") {
       
        //console.log("amount: "+responseData.amount);
      
        const trans = {
          orderTrackingId: transaction.orderTrackingId,
          amount: transaction.amount,
          plan: transaction.plan,
          planId: transaction.planId,
          period: transaction.period,
          buyerId: transaction.buyerId,
          status: "Active",
          //phone: transaction.phone,
        //  firstName: transaction.firstName,
          //middleName: transaction.middleName,
         // lastName: transaction.lastName,
        //  email: transaction.email,
          merchantId: responseData.merchant_reference,
          createdAt: new Date(),
        };
      //  console.log(trans);
        const newTransaction = await createTransaction(trans);
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
    .populate({ path: 'planId', model: Packages, select: '_id name list features price' })
   
}
// GET ONE Ad BY ID
import mongoose from 'mongoose';
import Ad from '../database/models/ad.model';
import { ObjectId } from 'mongodb';

export async function getData(userId: string) {
  try {
    // Connect to the MongoDB server
    await connectToDatabase();

    // Find the most recent transaction for the user
    const status = "Active";
    const conditions = { $and: [{ buyer: userId }, { status: status }, { plan: { $ne: "Verification" }} ] };
    const recentTransaction = await Transaction.find(conditions)
      .sort({ createdAt: 'desc' })
      .limit(1)
      .exec();

    if (!recentTransaction || recentTransaction.length === 0) {
      // No recent transactions found; use the free plan
      const planIdFree = "65fa7d3fb20de072ea107223";
      const pack = await Packages.findById(planIdFree);
    //  const planId = new ObjectId(planIdFree);
      const adConditions = { $and: [{ organizer: userId }] };
      const AdCount = await Ad.countDocuments(adConditions);

      return {
        transaction: null, // Since there's no recent transaction
        ads: AdCount,
        currentpack: pack,
      };
    } else {
      // Recent transaction found; use the transaction's plan
      const transaction = recentTransaction[0]; // Since find() returns an array
      const pack = await Packages.findById(transaction.planId);
      const planId = new ObjectId(transaction.planId);
      const adConditions = {
        $and: [
          { plan: planId },
          { createdAt: { $gte: transaction.createdAt } },
        ],
      };
      const AdCount = await Ad.countDocuments(adConditions);
    // console.log(JSON.parse(JSON.stringify(transaction))+" AdCount:"+AdCount+" pack: "+pack)
      return {
        transaction: JSON.parse(JSON.stringify(transaction)),
        ads: AdCount,
        currentpack: pack,
      };
    }
  } catch (error) {
    // Handle any errors
    handleError(error);
  }
}



export async function getpayTransaction(orderTrackingId: string) {
  try {
    // Connect to the MongoDB server
    await connectToDatabase();

    // Find the document by buyerId
    const conditions = { orderTrackingId: orderTrackingId }
    const trans = await populateAd(Transaction.find(conditions));
 
    if (!trans) throw new Error('Transaction not found');
    
    // Return the document
    return JSON.parse(JSON.stringify(trans));
  } catch (error) {
    // Handle any errors
    handleError(error);
  }
}
export async function getallTransaction(userId: string) {
  try {
    // Connect to the MongoDB server
    await connectToDatabase();

    // Find the document by buyerId
    const conditions = { buyer: userId }
    const trans = await populateAd(Transaction.find(conditions));
 
    if (!trans) throw new Error('Transaction not found');
    
    // Return the document
    return JSON.parse(JSON.stringify(trans));
  } catch (error) {
    // Handle any errors
    handleError(error);
  }
}
export async function getallTrans() {
  try {
    // Connect to the MongoDB server
    await connectToDatabase();

    // Find the document by buyerId
    const conditions = {}
    const trans = await populateAd(Transaction.find(conditions));
 
    if (!trans) throw new Error('Transaction not found');
    
    // Return the document
    return JSON.parse(JSON.stringify(trans));
  } catch (error) {
    // Handle any errors
    handleError(error);
  }
}
export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    await connectToDatabase();
 // Check if orderTrackingId exists
 const existingTransaction = await Transaction.findOne({ orderTrackingId: transaction.orderTrackingId });

 if (existingTransaction) {
   throw new Error('Transaction with the same orderTrackingId already exists');
 }

    // Create a new transaction with a buyerId
    const newTransaction = await Transaction.create({
      ...transaction,buyer: transaction.buyerId
    })

 //console.log(JSON.parse(JSON.stringify(newTransaction)))
    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error)
  }
}

