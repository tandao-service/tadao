// app/api/safaricom/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const consumerKey = process.env.MPESA_CONSUMER_KEY || "";
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET || "";
  const businessShortCode = process.env.MPESA_SHORTCODE || "";

  // ✅ Put your NEW callback base URL here (recommended as env)
  // Example: https://tadaomarket.com  OR  https://your-new-domain.com
  const callbackBaseUrl = (process.env.MPESA_CALLBACK_BASE_URL || "https://tadaomarket.com").replace(/\/$/, "");

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  try {
    // Step 1: Get Access Token
    const tokenRes = await axios.get(
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;
    console.log('Access Token:', accessToken);
    if (!accessToken) {
      throw new Error("Access token not received");
    }

    // Step 2: Register NEW URLs (this replaces the old ones)
    const registerRes = await axios.post(
      "https://api.safaricom.co.ke/mpesa/c2b/v2/registerurl",
      {
        ShortCode: businessShortCode,
        ResponseType: "Completed",
        ConfirmationURL: `${callbackBaseUrl}/api/safaricom/confirmation`,
        ValidationURL: `${callbackBaseUrl}/api/safaricom/validation`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(registerRes.data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to register URLs",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
