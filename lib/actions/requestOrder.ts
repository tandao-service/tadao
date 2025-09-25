"use server";

import axios from "axios";

export async function requestOrder(orderDetails: {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  notification_id: string;
  billing_address: {
    email: string;
    phone_number: string;
    first_name: string;
    last_name: string;
  };
}) {
  const requestUrl = process.env.NEXT_PUBLIC_DOMAIN_URL + "api/pesapal/submit-order";

  try {
    const response = await axios.post(requestUrl, orderDetails, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
    return response.data;
  } catch (error: any) {
    console.error("Error submitting order:", error?.response?.data || error.message);
    return { error: true, message: "Failed to submit order" };
  }
}
