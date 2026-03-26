"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/app/hooks/useAuth";
import { getallReported } from "@/lib/actions/report.actions";
import CollectionAbuse from "@/components/shared/CollectionAbuse";
import PopupChatId from "@/components/shared/PopupChatId";

import {
    AdminCard,
    AdminPageHeader,
    AdminSectionLoader,
} from "./AdminShared";

export default function AbuseClient() {
    const { appUserId, user } = useAuth();
    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 50;

    const [loading, setLoading] = useState(true);
    const [reported, setReported] = useState<any>(null);
    const [recipientUid, setRecipientUid] = useState("");
    const [isOpenChatId, setIsOpenChatId] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const res = await getallReported(limit, page);
                if (!cancelled) setReported(res);
            } catch (error) {
                console.error("Failed to load abuse reports:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [limit, page]);

    const handleOpenChatId = (value: string) => {
        setRecipientUid(value);
        setIsOpenChatId(true);
    };

    const handleCloseChatId = () => {
        setRecipientUid("");
        setIsOpenChatId(false);
    };

    const noop = () => { };

    if (loading) {
        return <AdminSectionLoader label="Loading abuse reports..." />;
    }

    return (
        <>
            <AdminPageHeader
                eyebrow="Moderation"
                title="Abuse Reports"
                subtitle="Review reported users and listings."
            />

            <AdminCard>
                <CollectionAbuse
                    data={reported?.data || []}
                    emptyTitle="No Abuse"
                    emptyStateSubtext="Come back later"
                    limit={limit}
                    page={page}
                    userId={appUserId || ""}
                    totalPages={reported?.totalPages || 1}
                    handleOpenChatId={handleOpenChatId}
                />
            </AdminCard>

            <PopupChatId
                isOpen={isOpenChatId}
                onClose={handleCloseChatId}
                recipientUid={recipientUid}
                userId={appUserId || ""}
                handleOpenSell={noop}
                handleOpenAbout={noop}
                handleOpenTerms={noop}
                handleOpenPrivacy={noop}
                handleOpenSafety={noop}
                handleOpenBook={noop}
                handleOpenPlan={noop}
                userImage={user?.photo || user?.imageUrl || ""}
                userName={
                    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
                    user?.businessname ||
                    "Admin"
                }
                handleOpenChat={noop}
                handleOpenShop={noop}
                handleOpenChatId={handleOpenChatId}
                handleOpenPerfomance={noop}
                handleOpenSettings={noop}
                handleCategory={noop}
                handleAdEdit={noop}
                handleAdView={noop}
                handleOpenSearchTab={noop}
                user={reported}
            />
        </>
    );
}