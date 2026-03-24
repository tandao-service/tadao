"use server";

import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Deterministic conversation id to match your chat flow.
 * Keep this in sync with getConversationId() used by the chat system.
 */
function getConversationId(a: string, b: string) {
    return [String(a), String(b)].sort().join("_");
}

function getFirebaseAdminApp(): App {
    const existing = getApps();
    if (existing.length > 0) return existing[0];

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
            "Missing Firebase Admin env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
        );
    }

    return initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey,
        }),
    });
}

/**
 * Returns true only if buyer and seller have a real conversation.
 * If adId is passed, it also tries to match the conversation adContext.
 */
export async function hasCompletedBuyerInteraction({
    sellerId,
    buyerId,
    adId,
}: {
    sellerId: string;
    buyerId: string;
    adId?: string;
}) {
    if (!sellerId || !buyerId) return false;
    if (String(sellerId) === String(buyerId)) return false;

    const app = getFirebaseAdminApp();
    const db = getFirestore(app);

    const conversationId = getConversationId(sellerId, buyerId);
    const conversationRef = db.collection("conversations").doc(conversationId);
    const conversationSnap = await conversationRef.get();

    if (!conversationSnap.exists) {
        return false;
    }

    const conversationData = conversationSnap.data() || {};

    /**
     * Optional ad-level strictness:
     * If review is tied to an ad, only allow review if the conversation
     * is also tied to the same adContext.adId.
     */
    if (adId) {
        const convoAdId =
            String(conversationData?.adContext?.adId || "").trim();

        if (!convoAdId || convoAdId !== String(adId).trim()) {
            return false;
        }
    }

    /**
     * Require at least one message in the conversation.
     * This prevents empty conversation docs from counting.
     */
    const messagesSnap = await conversationRef
        .collection("messages")
        .limit(1)
        .get();

    if (messagesSnap.empty) {
        return false;
    }

    return true;
}