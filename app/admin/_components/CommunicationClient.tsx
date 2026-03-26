"use client";

import { useEffect, useState } from "react";

import { getAllContacts, getToAdvertiser } from "@/lib/actions/user.actions";
import BroadcastMessage from "@/components/shared/BroadcastMessage";

import {
    AdminCard,
    AdminPageHeader,
    AdminSectionLoader,
} from "./AdminShared";

export default function CommunicationClient() {
    const [loading, setLoading] = useState(true);
    const [contacts, setContacts] = useState<any>([]);
    const [topadvertiser, setTopadvertiser] = useState<any>([]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);

                const [contactsRes, advertiserRes] = await Promise.all([
                    getAllContacts(),
                    getToAdvertiser(),
                ]);

                if (cancelled) return;

                setContacts(contactsRes || []);
                setTopadvertiser(advertiserRes || []);
            } catch (error) {
                console.error("Failed to load communication data:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return <AdminSectionLoader label="Loading communication tools..." />;
    }

    return (
        <>
            <AdminPageHeader
                eyebrow="Communication"
                title="Communication"
                subtitle="Send broadcast updates to users and advertisers."
            />

            <AdminCard>
                <BroadcastMessage
                    contacts={contacts}
                //topadvertiser={topadvertiser}
                />
            </AdminCard>
        </>
    );
}