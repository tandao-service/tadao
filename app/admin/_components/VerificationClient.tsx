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
    const [verifyId, setVerifyId] = useState("");
    const [updating, setUpdating] = useState(false);
    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const res: any = await getVerifyfee();
                if (!cancelled) {
                    setVerifyId(res?._id || "");
                    setFee(String(res?.fee ?? "500"));
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
            setUpdating(true);

            const res = await updateVerifiesFee(fee);

            if (!res?.success) {
                throw new Error(res?.message || "Could not update verification fee");
            }

            toast({
                title: "Updated!",
                description: "Verification fee updated",
                duration: 5000,
                className: "bg-[#30AF5B] text-white",
            });
        } catch (error: any) {
            toast({
                title: "Failed",
                description: error?.message || "Could not update verification fee",
                duration: 5000,
                variant: "destructive",
            });
        } finally {
            setUpdating(false);
        }
    };
    if (loading) {
        return <AdminSectionLoader label="Loading verification settings..." />;
    }

    return (
        <>


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
                        disabled={updating}
                        className="h-12 rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {updating ? "Updating..." : "Update"}
                    </button>
                </div>
            </AdminCard>
        </>
    );
}