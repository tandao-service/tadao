import type { Metadata } from "next";
import VerifyClientPage from "./VerifyClientPage";

export const metadata: Metadata = {
    title: "Verify Account | Tadao Market",
    description: "Verify your Tadao Market account to build trust and unlock protected features.",
};

export default function VerifyPage() {
    return <VerifyClientPage />;
}