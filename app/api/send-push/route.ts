import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
    const { token, notification, data } = await req.json();

    const message = {
        token,
        notification: {
            title: notification.title,
            body: notification.body,
        },
        webpush: {
            notification: {
                icon: notification.icon || "https://tadaoservices.com/logo.png",
                click_action: notification.click_action || "https://tadaoservices.com/?action=chat",
            },
        },
        data: data || {},
    };

    try {
        const response = await admin.messaging().send(message);
        return NextResponse.json({ success: true, response });
    } catch (error: any) {
        console.error("Error sending message:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
