import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const response = await clerkClient.redirectUrls.createRedirectUrl({
            url: "https://tadaomarket.com/oauth/callback", // your callback
        });

        return NextResponse.json({ redirectUrl: response.url });
    } catch (error: any) {
        console.error("Error creating redirect URL:", error);
        return NextResponse.json({ error: "Failed to create redirect URL" }, { status: 500 });
    }
}
