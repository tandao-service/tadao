// app/api/pesapal/submit-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// You should refactor this to be imported from a shared utility
async function getAccessToken(): Promise<string> {
  const APP_ENVIRONMENT = process.env.PESAPAL_ENVIRONMENT || "sandbox";

  let apiUrl = "";
  let consumerKey = "";
  let consumerSecret = "";

  if (APP_ENVIRONMENT === "sandbox") {
    apiUrl = "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken";
    consumerKey = "qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW";
    consumerSecret = "osGQ364R49cXKeOYSpaOnT++rHs=";
  } else if (APP_ENVIRONMENT === "live") {
    apiUrl = "https://pay.pesapal.com/v3/api/Auth/RequestToken";
    consumerKey = process.env.PESAPAL_CONSUMER_KEY!;
    consumerSecret = process.env.PESAPAL_CONSUMER_SECRET!;
  } else {
    throw new Error("Invalid APP_ENVIRONMENT");
  }

  const response = await axios.post(
    apiUrl,
    {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.data?.token) {
    throw new Error("Unable to retrieve Pesapal token");
  }

  return response.data.token;
}

// Get or register IPN
async function registerIPN(token: string): Promise<string> {
  const APP_ENVIRONMENT = process.env.PESAPAL_ENVIRONMENT || "sandbox";
  const ipnUrl =
    APP_ENVIRONMENT === "sandbox"
      ? "https://cybqa.pesapal.com/pesapalv3/api/URLSetup/RegisterIPN"
      : "https://pay.pesapal.com/v3/api/URLSetup/RegisterIPN";

  const response = await axios.post(
    ipnUrl,
    {
      url: process.env.NEXT_PUBLIC_DOMAIN_URL + "api/pesapal/pin", // Update to your deployed IPN endpoint
      ipn_notification_type: "POST",
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data?.ipn_id;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "id",
      "currency",
      "amount",
      "description",
      "billing_address.email",
      "billing_address.phone_number",
      "billing_address.first_name",
      "billing_address.last_name",
    ];
    for (const field of requiredFields) {
      const value = field
        .split(".")
        .reduce((obj, key) => obj?.[key], body as any);
      if (!value) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    console.log("PESAPAL_ENVIRONMENT: " + process.env.PESAPAL_ENVIRONMENT)
    const token = await getAccessToken();
    console.log("token: " + token)
    const ipn_id = await registerIPN(token);
    console.log("ipn_id: " + ipn_id)
    const APP_ENVIRONMENT = process.env.PESAPAL_ENVIRONMENT || "sandbox";
    const submitOrderUrl =
      APP_ENVIRONMENT === "sandbox"
        ? "https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest"
        : "https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest";

    const {
      id,
      currency,
      amount,
      description,
      billing_address: {
        email,
        phone_number,
        first_name,
        last_name,
      },
    } = body;

    const payload = {
      id,
      currency,
      amount,
      description,
      callback_url: process.env.NEXT_PUBLIC_DOMAIN_URL, // update to real domain in production
      notification_id: ipn_id,
      branch: "Tadao", // Optional: set dynamically
      billing_address: {
        email_address: email,
        phone_number,
        country_code: "KE",
        first_name,
        middle_name: "",
        last_name,
        line_1: "Tadao Services",
        line_2: "",
        city: "",
        state: "",
        postal_code: "",
        zip_code: "",
      },
    };

    const response = await axios.post(submitOrderUrl, payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const { redirect_url, order_tracking_id } = response.data;

    if (!redirect_url) {
      return NextResponse.json(
        { error: "Missing redirect_url in Pesapal response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ redirect_url, order_tracking_id });
  } catch (error: any) {
    console.error("Submit order error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
