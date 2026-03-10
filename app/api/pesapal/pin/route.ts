import { createTransaction, updateTransaction } from '@/lib/actions/transactions.actions';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const orderTrackingId = body?.OrderTrackingId;
    if (!orderTrackingId) {
      return NextResponse.json({ error: 'OrderTrackingId missing' }, { status: 400 });
    }
    const trans = {
      orderTrackingId: body?.orderTrackingId,
      amount: body?.amount,
      plan: body?.plan,
      planId: body?.planId,
      period: body?.period,
      buyerId: body?.buyerId,
      status: "Active",
      //phone: transaction.phone,
      //  firstName: transaction.firstName,
      //middleName: transaction.middleName,
      // lastName: transaction.lastName,
      //  email: transaction.email,
      merchantId: body?.merchant_reference,
      createdAt: new Date(),
    };
    //  console.log(trans);
   // await createTransaction(trans);
    await updateTransaction(orderTrackingId);

    return NextResponse.json({ message: 'Payment processed successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
