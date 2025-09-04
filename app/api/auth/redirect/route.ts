import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const response = await clerkClient.redirectUrls.createRedirectUrl({
            url: "https://tadaomarket.com/oauth/callback", // must match Clerk allowlist
        });

        return NextResponse.json({ redirectUrl: response.url });
    } catch (error: any) {
        console.error("Error creating redirect URL:", error);

        // Return Clerk's actual error for debugging
        return NextResponse.json(
            {
                message: "Failed to create redirect URL",
                clerkError: error?.errors ?? error?.message ?? String(error),
            },
            { status: 500 }
        );
    }
}
