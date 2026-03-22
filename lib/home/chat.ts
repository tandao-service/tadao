import {
    addDoc,
    collection,
    doc,
    getDoc,
    increment,
    serverTimestamp,
    setDoc,
    updateDoc,
    writeBatch,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ChatUserLite = {
    _id: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    photo?: string;
};

export type ChatAdContext = {
    adId?: string;
    title?: string;
    price?: number;
    imageUrl?: string;
} | null;

export function getConversationId(userA: string, userB: string) {
    return [userA, userB].sort().join("_");
}

export function getUserDisplayName(user?: Partial<ChatUserLite>) {
    const full =
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

    return full || "User";
}

export function getUserAvatar(user?: Partial<ChatUserLite>) {
    return user?.imageUrl || user?.photo || "";
}

type EnsureConversationArgs = {
    currentUser: ChatUserLite;
    otherUser: ChatUserLite;
    adContext?: ChatAdContext;
};

export async function ensureConversation({
    currentUser,
    otherUser,
    adContext = null,
}: EnsureConversationArgs) {
    const conversationId = getConversationId(currentUser._id, otherUser._id);
    const conversationRef = doc(db, "conversations", conversationId);
    const snap = await getDoc(conversationRef);

    if (!snap.exists()) {
        await setDoc(conversationRef, {
            members: [currentUser._id, otherUser._id],
            memberDetails: {
                [currentUser._id]: {
                    name: getUserDisplayName(currentUser),
                    avatar: getUserAvatar(currentUser),
                },
                [otherUser._id]: {
                    name: getUserDisplayName(otherUser),
                    avatar: getUserAvatar(otherUser),
                },
            },
            adContext: adContext || null,
            lastMessage: "",
            lastMessageType: "text",
            lastSenderId: "",
            lastMessageAt: serverTimestamp(),
            unreadCount: {
                [currentUser._id]: 0,
                [otherUser._id]: 0,
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    } else if (adContext) {
        await updateDoc(conversationRef, {
            adContext,
            updatedAt: serverTimestamp(),
        });
    }

    return conversationId;
}

type SendMessageArgs = {
    conversationId: string;
    senderId: string;
    recipientId: string;
    text: string;
};

export async function sendMessage({
    conversationId,
    senderId,
    recipientId,
    text,
}: SendMessageArgs) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const messagesRef = collection(db, "conversations", conversationId, "messages");

    await addDoc(messagesRef, {
        senderId,
        recipientId,
        text: trimmed,
        messageType: "text",
        createdAt: serverTimestamp(),
        readBy: [senderId],
    });

    const conversationRef = doc(db, "conversations", conversationId);

    await updateDoc(conversationRef, {
        lastMessage: trimmed,
        lastMessageType: "text",
        lastSenderId: senderId,
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        [`unreadCount.${recipientId}`]: increment(1),
    });
}

export async function markConversationAsRead(
    conversationId: string,
    currentUserId: string
) {
    const conversationRef = doc(db, "conversations", conversationId);

    await updateDoc(conversationRef, {
        [`unreadCount.${currentUserId}`]: 0,
        updatedAt: serverTimestamp(),
    });

    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const q = query(
        messagesRef,
        where("recipientId", "==", currentUserId)
    );
    const snap = await getDocs(q);

    if (snap.empty) return;

    const batch = writeBatch(db);

    snap.docs.forEach((messageDoc) => {
        const data = messageDoc.data();
        const readBy = Array.isArray(data.readBy) ? data.readBy : [];

        if (!readBy.includes(currentUserId)) {
            batch.update(messageDoc.ref, {
                readBy: [...readBy, currentUserId],
            });
        }
    });

    await batch.commit();
}