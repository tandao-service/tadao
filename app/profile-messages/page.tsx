"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { Search, MessageSquareMore } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/app/hooks/useAuth";
import TopBar from "@/components/home/TopBar.client";

function formatChatTime(value: any) {
    try {
        if (!value?.seconds) return "";
        const date = new Date(value.seconds * 1000);

        return new Intl.DateTimeFormat("en-KE", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "short",
        }).format(date);
    } catch {
        return "";
    }
}

type InboxTab = "all" | "unread" | "spam";

export default function ProfileMessagesPage() {
    const router = useRouter();
    const { user, loading: isLoading } = useAuth();

    const [conversations, setConversations] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<InboxTab>("all");

    const currentUserId = user?._id || user?.id || user?.userId || "";

    useEffect(() => {
        if (!currentUserId) return;

        const q = query(
            collection(db, "conversations"),
            where("members", "array-contains", currentUserId),
            orderBy("updatedAt", "desc")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setConversations(items);
        });

        return () => unsub();
    }, [currentUserId]);

    const filteredConversations = useMemo(() => {
        const term = search.trim().toLowerCase();

        return conversations.filter((conversation) => {
            const otherUserId = conversation.members?.find(
                (id: string) => id !== currentUserId
            );
            const otherUser = conversation.memberDetails?.[otherUserId];
            const name = String(otherUser?.name || "").toLowerCase();
            const lastMessage = String(conversation.lastMessage || "").toLowerCase();
            const unread = Number(conversation.unreadCount?.[currentUserId] || 0);
            const isSpam = Boolean(conversation.isSpam);

            const matchesSearch =
                !term || name.includes(term) || lastMessage.includes(term);

            const matchesTab =
                activeTab === "all"
                    ? !isSpam
                    : activeTab === "unread"
                        ? unread > 0 && !isSpam
                        : isSpam;

            return matchesSearch && matchesTab;
        });
    }, [conversations, search, activeTab, currentUserId]);

    const unreadCount = useMemo(() => {
        return conversations.reduce((sum, conversation) => {
            const unread = Number(conversation.unreadCount?.[currentUserId] || 0);
            const isSpam = Boolean(conversation.isSpam);
            if (isSpam) return sum;
            return sum + (unread > 0 ? 1 : 0);
        }, 0);
    }, [conversations, currentUserId]);

    const spamCount = useMemo(() => {
        return conversations.filter((conversation) => Boolean(conversation.isSpam))
            .length;
    }, [conversations]);

    if (isLoading) {
        return (
            <>

                <main className="min-h-screen bg-slate-50">
                    <TopBar />
                    <div className="mx-auto mt-12 max-w-7xl px-4 py-6 md:px-6">
                        <div className="rounded-[24px] border border-orange-100 bg-white p-8 text-sm text-slate-500 shadow-sm">
                            Loading messages...
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
                            <h1 className="text-2xl font-bold text-slate-900">My messages</h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Sign in to view your conversations.
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

    const hasConversations = filteredConversations.length > 0;

    return (
        <>
            <main className="min-h-screen bg-slate-50">
                <TopBar />
                <div className="mx-auto mt-12 max-w-[1600px] px-4 py-5 md:px-6 md:py-8">
                    <div className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm">
                        <div className="grid min-h-[78vh] grid-cols-1 lg:grid-cols-[520px_minmax(0,1fr)]">
                            <aside className="border-r border-slate-200 bg-white">
                                <div className="px-6 pb-6 pt-7">
                                    <h1 className="text-[30px] font-extrabold tracking-[-0.02em] text-slate-900">
                                        My messages
                                    </h1>

                                    <div className="relative mt-6">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search"
                                            className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-5 pr-14 text-[17px] text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white"
                                        />
                                        <Search className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                    </div>

                                    <div className="mt-7 flex items-center gap-10">
                                        <button
                                            onClick={() => setActiveTab("all")}
                                            className={`relative pb-4 text-[17px] font-semibold transition ${activeTab === "all"
                                                ? "text-orange-500"
                                                : "text-slate-500 hover:text-slate-800"
                                                }`}
                                        >
                                            All
                                            {activeTab === "all" && (
                                                <span className="absolute bottom-0 left-0 h-[3px] w-8 rounded-full bg-orange-500" />
                                            )}
                                        </button>

                                        <button
                                            onClick={() => setActiveTab("unread")}
                                            className={`relative pb-4 text-[17px] font-semibold transition ${activeTab === "unread"
                                                ? "text-orange-500"
                                                : "text-slate-500 hover:text-slate-800"
                                                }`}
                                        >
                                            Unread
                                            {unreadCount > 0 && (
                                                <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">
                                                    {unreadCount}
                                                </span>
                                            )}
                                            {activeTab === "unread" && (
                                                <span className="absolute bottom-0 left-0 h-[3px] w-8 rounded-full bg-orange-500" />
                                            )}
                                        </button>

                                        <button
                                            onClick={() => setActiveTab("spam")}
                                            className={`relative pb-4 text-[17px] font-semibold transition ${activeTab === "spam"
                                                ? "text-orange-500"
                                                : "text-slate-500 hover:text-slate-800"
                                                }`}
                                        >
                                            Spam
                                            {spamCount > 0 && (
                                                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                                                    {spamCount}
                                                </span>
                                            )}
                                            {activeTab === "spam" && (
                                                <span className="absolute bottom-0 left-0 h-[3px] w-8 rounded-full bg-orange-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="h-[calc(78vh-180px)] overflow-y-auto">
                                    {hasConversations ? (
                                        <ul className="px-2 pb-3">
                                            {filteredConversations.map((conversation) => {
                                                console.log(filteredConversations);
                                                const otherUserId = conversation.members?.find(
                                                    (id: string) => id !== currentUserId
                                                );
                                                const otherUser =
                                                    conversation.memberDetails?.[otherUserId] || {};
                                                const unread =
                                                    Number(
                                                        conversation.unreadCount?.[currentUserId] || 0
                                                    ) || 0;
                                                const isMine =
                                                    conversation.lastSenderId === currentUserId;

                                                return (
                                                    <li key={conversation.id}>
                                                        <button
                                                            onClick={() =>
                                                                router.push(`/profile-messages/${otherUserId}`)
                                                            }
                                                            className="flex w-full items-start gap-3 rounded-2xl px-4 py-4 text-left transition hover:bg-orange-50"
                                                        >
                                                            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-orange-50 ring-1 ring-orange-100">
                                                                {otherUser?.avatar ? (
                                                                    <Image
                                                                        src={otherUser.avatar}
                                                                        alt={otherUser?.name || "User"}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-orange-600">
                                                                        {String(otherUser?.name || "U")
                                                                            .charAt(0)
                                                                            .toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <p className="truncate text-[16px] font-bold text-slate-900">
                                                                        {otherUser?.name || "User"}
                                                                    </p>

                                                                    <div className="flex flex-col items-end gap-1">
                                                                        <span className="whitespace-nowrap text-[12px] text-slate-400">
                                                                            {formatChatTime(
                                                                                conversation.lastMessageAt
                                                                            )}
                                                                        </span>

                                                                        {unread > 0 && (
                                                                            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[11px] font-bold text-white">
                                                                                {unread}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <p className="mt-1 truncate text-sm text-slate-500">
                                                                    {isMine ? "You: " : ""}
                                                                    {conversation.lastMessage ||
                                                                        "Start a conversation"}
                                                                </p>

                                                                {conversation.adContext?.title && (
                                                                    <p className="mt-1 truncate text-xs text-orange-500">
                                                                        Re: {conversation.adContext.title}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center px-8 pb-10 pt-8 text-center">
                                            <div className="relative mb-6 flex h-72 w-72 items-center justify-center">
                                                <div className="absolute h-56 w-56 rounded-full bg-orange-50" />
                                                <div className="relative z-10 flex h-40 w-40 items-center justify-center rounded-[36px] bg-gradient-to-br from-orange-400 to-orange-500 shadow-[0_20px_50px_rgba(249,115,22,0.28)]">
                                                    <MessageSquareMore
                                                        className="h-20 w-20 text-white"
                                                        strokeWidth={1.5}
                                                    />
                                                </div>
                                            </div>

                                            <p className="text-base text-slate-500">
                                                {activeTab === "unread"
                                                    ? "You have no unread messages yet."
                                                    : activeTab === "spam"
                                                        ? "You have no spam messages."
                                                        : "You have no messages yet."}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </aside>

                            <section className="flex min-h-[78vh] items-center justify-center bg-slate-50 px-6 py-10">
                                <div className="max-w-xl text-center">
                                    <h2 className="text-[30px] leading-tight font-bold text-slate-900">
                                        {hasConversations
                                            ? "Select a conversation"
                                            : "You have no messages yet."}
                                    </h2>

                                    <p className="mt-3 text-[17px] text-slate-600">
                                        <span className="font-semibold text-orange-500">
                                            {hasConversations ? "Open a chat" : "Find things"}
                                        </span>{" "}
                                        {hasConversations
                                            ? "to view your discussion here."
                                            : "to discuss or sell something"}
                                    </p>

                                    <Link
                                        href="/create-ad"
                                        className="mt-10 inline-flex h-14 min-w-[220px] items-center justify-center rounded-2xl bg-orange-500 px-8 text-[17px] font-bold text-white transition hover:bg-orange-600"
                                    >
                                        Post ad
                                    </Link>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}