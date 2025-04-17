// app/api/confirmation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Transaction from '@/lib/database/models/transaction.model';
import { updateVerification } from '@/lib/actions/user.actions';
import DynamicAd from '@/lib/database/models/dynamicAd.model';
import { handleError } from '@/lib/utils';
import { createPayment } from '@/lib/actions/payment.actions';

interface MpesaCallbackData {
  TransID: string;
  TransTime: string;
  MSISDN: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  TransAmount: number;
  BillRefNumber: string;
  OrgAccountBalance?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: MpesaCallbackData = await req.json();

    const db_arr = {
      internal_transaction_id: body.TransID,
      name: `${body.FirstName} ${body.MiddleName} ${body.LastName}`,
      receipt: body.TransID,
      time: body.TransTime,
      account: body.BillRefNumber,
      phonenumber: body.MSISDN,
      amount: body.TransAmount,
      org_balance: body.OrgAccountBalance?.split('.')[0],
    };

    //const account = normalizePhone(db_arr.account);
    // const dateAdded = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const paymentresponse = await createPayment({
      payment: {
        orderTrackingId: db_arr.account,
        name: db_arr.name,
        transactionId: db_arr.receipt,
        amount: db_arr.amount,
        status: 'successful',
        balance: db_arr.org_balance || '0',
        date: new Date(), // ✅ safer to pass a Date object
      }
    });

    // Update transaction and related models
    const response = await updateTransaction(db_arr.account);
    return NextResponse.json({ status: response });
  } catch (error: any) {
    console.error("Confirmation API error:", error);
    handleError(error);
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}

//function normalizePhone(phone: string): string {
//  if (phone.startsWith('+254') && phone.length === 13) return phone.slice(1);
//  if (phone.startsWith('254') && phone.length === 12) return phone;
//  if (phone.startsWith('0') && phone.length === 10) return '254' + phone.slice(1);
// throw new Error('Invalid phone number format');
//}

export async function updateTransaction(orderTrackingId: string) {
  try {
    await connectToDatabase();

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { orderTrackingId },
      { status: "Active" },
      { new: true }
    );

    if (!updatedTransaction) {
      throw new Error("Transaction not found or update failed");
    }

    if (updatedTransaction.plan === "Verification") {
      await updateVerification(updatedTransaction.buyer);
    }

    await DynamicAd.findByIdAndUpdate(
      { _id: orderTrackingId },
      { adstatus: "Active" },
      { new: true }
    );

    return JSON.parse(JSON.stringify(updatedTransaction));
  } catch (error) {
    handleError(error);
    throw error;
  }
}
