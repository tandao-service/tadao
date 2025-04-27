// app/api/safaricom/register/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const consumerKey = process.env.MPESA_CONSUMER_KEY || '';
const consumerSecret = process.env.MPESA_CONSUMER_SECRET || '';
const businessShortCode = process.env.MPESA_SHORTCODE || '';
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    // Step 1: Get access token
    const accessTokenRes = await fetch('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    const tokenData = await accessTokenRes.json();
    const accessToken = tokenData.access_token;

    // Step 2: Register URLs
    const registerRes = await fetch('https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ShortCode: businessShortCode,
        ResponseType: 'Completed',
        ConfirmationURL: 'https://pocketshop.co.ke/api/safaricom/confirmation',
        ValidationURL: 'https://pocketshop.co.ke/api/safaricom/validation',
      }),
    });

    const registerData = await registerRes.json();
    console.log(registerData)
    return NextResponse.json(registerData);
  } catch (error: any) {
    console.error('Safaricom Register Error:', error);
    return NextResponse.json({ error: 'Failed to register URLs' }, { status: 500 });
  }
}
