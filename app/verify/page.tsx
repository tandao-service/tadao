import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyClientPage from "./VerifyClientPage";

export const metadata: Metadata = {
    title: "Verify Account | Tadao Market",
    description:
        "Verify your Tadao Market account to build trust and unlock protected features.",
};

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading...</div>}>
            <VerifyClientPage />
        </Suspense>
    );
}