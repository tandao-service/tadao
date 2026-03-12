// components/shared/SubscriptionRequiredModal.tsx
"use client";

import { X } from "lucide-react";
import Listpackages from "@/components/shared/listpackages";

type Props = {
    open: boolean;
    onClose: () => void;
    packagesList: any[];
    userId: string;
    user: any;
    daysRemaining: number;
    packname: string;
};

export default function SubscriptionRequiredModal({
    open,
    onClose,
    packagesList,
    userId,
    user,
    daysRemaining,
    packname,
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[1200]">
            <button
                className="absolute inset-0 bg-black/50"
                aria-label="Close"
                onClick={onClose}
            />

            <div className="absolute inset-x-0 top-8 mx-auto w-[95vw] max-w-6xl rounded-2xl bg-white shadow-2xl dark:bg-[#1f272b]">
                <div className="flex items-center justify-between border-b px-4 py-3 dark:border-slate-700">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                            Subscription Required
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-300">
                            Your free listings are finished or your subscription has expired.
                            Choose a package to continue posting.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full border p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="max-h-[85vh] overflow-auto p-3">
                    <Listpackages
                        packagesList={packagesList || []}
                        userId={userId}
                        daysRemaining={daysRemaining}
                        packname={packname}
                        user={user}

                    />
                </div>
            </div>
        </div>
    );
}