import type { Metadata } from "next";
import SettingsPageClient from "./SettingsPageClient";

export const metadata: Metadata = {
    title: "Settings | Tadao Market",
    description:
        "Manage your Tadao Market account settings, profile, contacts, and notifications.",
};

export default async function SettingsPage() {

    return <SettingsPageClient />;
}