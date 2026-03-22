import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import SettingsPageClient from "./SettingsPageClient";

export const metadata: Metadata = {
    title: "Settings | Tadao Market",
    description:
        "Manage your Tadao Market account settings, profile, contacts, and notifications.",
};

export default async function SettingsPage() {

    return <SettingsPageClient />;
}