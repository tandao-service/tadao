"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { VerificationPackId } from "@/constants";
import {
    getVerifyfee,
    updateVerifiesFee,
} from "@/lib/actions/verifies.actions";

import {
    AdminCard,
    AdminPageHeader,
    AdminSectionLoader,
} from "./AdminShared";

export default function VerificationClient() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [fee, setFee] = useState("500");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const res: any = await getVerifyfee();
                if (!cancelled) {
                    setFee(String(res?.fee ?? res ?? "500"));
                }
            } catch (error) {
                console.error("Failed to load verification fee:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleFee = async () => {
        try {
            await updateVerifiesFee(fee, VerificationPackId);
            toast({
                title: "Updated!",
                description: "Verification fee updated",
                duration: 5000,
                className: "bg-[#30AF5B] text-white",
            });
        } catch (error) {
            console.error("Failed to update verification fee:", error);
            toast({
                title: "Failed",
                description: "Could not update verification fee",
                duration: 5000,
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return <AdminSectionLoader label="Loading verification settings..." />;
    }

    return (
        <>
            <AdminPageHeader
                eyebrow="Verification"
                title="Verification Fee"
                subtitle="Manage seller verification pricing."
            />

            <AdminCard className="max-w-xl">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Verification Fee (KES)
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        placeholder="Fee"
                        value={fee}
                        onChange={(e) => setFee(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm"
                    />
                    <button
                        type="button"
                        onClick={handleFee}
                        className="h-12 rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white hover:bg-orange-500"
                    >
                        Update
                    </button>
                </div>
            </AdminCard>
        </>
    );
}