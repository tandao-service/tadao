"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { ArrowLeft, SendHorizonal } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/app/hooks/useAuth";
import { getUserById } from "@/lib/actions/user.actions";
import {
    ensureConversation,
    getConversationId,
    getUserAvatar,
    getUserDisplayName,
    markConversationAsRead,
    sendMessage,
} from "@/lib/home/chat";
import TopBar from "@/components/home/TopBar.client";

function formatMessageTime(value: any) {
    try {
        if (!value?.seconds) return "";
        const date = new Date(value.seconds * 1000);

        return new Intl.DateTimeFormat("en-KE", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    } catch {
        return "";
    }
}

export default function ProfileMessageConversationPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: isLoading } = useAuth();

    const [otherUser, setOtherUser] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const chatUserId = Array.isArray(params?.id)
        ? params.id[0]
        : (params?.id as string);

    const currentUserId = user?._id || user?.id || user?.userId || "";

    const conversationId = useMemo(() => {
        if (!currentUserId || !chatUserId) return "";
        return getConversationId(currentUserId, chatUserId);
    }, [currentUserId, chatUserId]);

    useEffect(() => {
        const loadOtherUser = async () => {
            if (!chatUserId) return;

            try {
                setPageLoading(true);
                const data = await getUserById(chatUserId);
                setOtherUser(data || null);
            } catch (error) {
                console.error("Failed to load chat user:", error);
            } finally {
                setPageLoading(false);
            }
        };

        loadOtherUser();
    }, [chatUserId]);

    useEffect(() => {
        if (!conversationId || !currentUserId) return;

        const q = query(
            collection(db, "conversations", conversationId, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsub = onSnapshot(
            q,
            async (snapshot) => {
                const items = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setMessages(items);

                try {
                    await markConversationAsRead(conversationId, currentUserId);
                } catch (error) {
                    console.error("Failed to mark as read:", error);
                }

                setTimeout(() => {
                    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 80);
            },
            (error) => {
                console.error("Conversation snapshot error:", error);
            }
        );

        return () => unsub();
    }, [conversationId, currentUserId]);

    const handleSend = async () => {
        if (!currentUserId || !chatUserId || !otherUser) return;
        if (!text.trim()) return;
        alert("OK");
        try {
            setSending(true);

            await ensureConversation({
                currentUser: {
                    _id: currentUserId,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    imageUrl: user?.imageUrl,
                    photo: user?.photo,
                },
                otherUser: {
                    _id: otherUser?._id || chatUserId,
                    firstName: otherUser?.firstName,
                    lastName: otherUser?.lastName,
                    imageUrl: otherUser?.imageUrl,
                    photo: otherUser?.photo,
                },
            });

            await sendMessage({
                conversationId,
                senderId: currentUserId,
                recipientId: chatUserId,
                text,
            });

            setText("");
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setSending(false);
        }
    };

    if (isLoading || pageLoading) {
        return (
            <>

                <main className="min-h-screen bg-slate-50">
                    <TopBar />
                    <div className="mx-auto mt-12 max-w-7xl px-4 py-6 md:px-6">
                        <div className="rounded-[24px] border border-orange-100 bg-white p-8 text-sm text-slate-500 shadow-sm">
                            Loading conversation...
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (!currentUserId) {
        return (
            <>

                <main className="min-h-screen bg-slate-50">
                    <TopBar />
                    <div className="mx-auto mt-12 max-w-7xl px-4 py-10 md:px-6">
                        <div className="mx-auto max-w-md rounded-[24px] border border-orange-100 bg-white p-8 text-center shadow-sm">
                            <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Sign in to continue chatting.
                            </p>
                            <Link
                                href="/auth"
                                className="mt-5 inline-flex rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>


            <main className="min-h-screen bg-slate-50">
                <TopBar />
                <div className="mx-auto mt-12 max-w-[1600px] px-4 py-5 md:px-6 md:py-8">
                    <div className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm">
                        <div className="grid min-h-[78vh] grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)]">
                            <aside className="hidden border-r border-slate-200 bg-white lg:flex lg:flex-col">
                                <div className="border-b border-slate-200 px-6 py-6">
                                    <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-slate-900">
                                        My messages
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Open your inbox to view all chats
                                    </p>
                                </div>

                                <div className="flex flex-1 items-center justify-center p-8 text-center">
                                    <div>
                                        <p className="text-base font-semibold text-slate-900">
                                            Want to see all conversations?
                                        </p>
                                        <p className="mt-2 text-sm text-slate-500">
                                            Return to your messages page and choose any chat.
                                        </p>
                                        <Link
                                            href="/profile-messages"
                                            className="mt-5 inline-flex h-11 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 px-5 text-sm font-semibold text-orange-600 transition hover:bg-orange-100"
                                        >
                                            Go to inbox
                                        </Link>
                                    </div>
                                </div>
                            </aside>

                            <section className="flex min-w-0 flex-1 flex-col bg-slate-50">
                                <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-4 md:px-6">
                                    <button
                                        onClick={() => router.push("/profile-messages")}
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-orange-600 transition hover:bg-orange-100 lg:hidden"
                                        aria-label="Back"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </button>

                                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-orange-50 ring-1 ring-orange-100">
                                        {getUserAvatar(otherUser) ? (
                                            <Image
                                                src={getUserAvatar(otherUser)}
                                                alt={getUserDisplayName(otherUser)}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-orange-600">
                                                {String(getUserDisplayName(otherUser) || "U")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-[16px] font-bold text-slate-900">
                                            {getUserDisplayName(otherUser)}
                                        </p>
                                        <p className="text-xs text-slate-500">Conversation</p>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-5">
                                    <div className="mx-auto flex max-w-4xl flex-col gap-3">
                                        {messages.length === 0 && (
                                            <div className="flex min-h-[50vh] items-center justify-center text-center">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900">
                                                        Start the conversation
                                                    </h3>
                                                    <p className="mt-2 text-sm text-slate-500">
                                                        Send your first message to begin chatting.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {messages.map((message) => {
                                            const isMine = message.senderId === currentUserId;

                                            return (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${isMine ? "justify-end" : "justify-start"
                                                        }`}
                                                >
                                                    <div
                                                        className={`max-w-[88%] rounded-[22px] px-4 py-3 shadow-sm md:max-w-[72%] ${isMine
                                                            ? "rounded-br-md bg-orange-500 text-white"
                                                            : "rounded-bl-md border border-slate-200 bg-white text-slate-900"
                                                            }`}
                                                    >
                                                        <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                                            {message.text}
                                                        </p>

                                                        <p
                                                            className={`mt-2 text-right text-[11px] ${isMine ? "text-orange-100" : "text-slate-400"
                                                                }`}
                                                        >
                                                            {formatMessageTime(message.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <div ref={bottomRef} />
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 bg-white px-3 py-3 md:px-6">
                                    <div className="mx-auto flex max-w-4xl items-end gap-3">
                                        <textarea
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    if (!sending && text.trim()) handleSend();
                                                }
                                            }}
                                            rows={1}
                                            placeholder="Write message"
                                            className="max-h-40 min-h-[54px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white"
                                        />

                                        <button
                                            onClick={handleSend}
                                            disabled={sending || !text.trim()}
                                            className="inline-flex h-[54px] min-w-[54px] items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <SendHorizonal className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}