// app/api/safaricom/register/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const consumerKey = '64367tr67tttgdd';
  const consumerSecret = 'trr655geyey6';
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
        ShortCode: '12345',
        ResponseType: 'Completed',
        ConfirmationURL: 'https://pocketshop.co.ke/api/safaricom/confirmation',
        ValidationURL: 'https://pocketshop.co.ke/api/safaricom/validation',
      }),
    });

    const registerData = await registerRes.json();
    return NextResponse.json(registerData);
  } catch (error: any) {
    console.error('Safaricom Register Error:', error);
    return NextResponse.json({ error: 'Failed to register URLs' }, { status: 500 });
  }
}
