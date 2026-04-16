import type { Metadata } from "next";
import AdminShell from "./_components/AdminShell";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
    title: "Admin | Tadao Market",
    description: "Tadao Market admin dashboard",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminShell>{children}</AdminShell>;
}