"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import { getAllPackages } from "@/lib/actions/packages.actions";
import Menulistpackages from "@/components/shared/menulistpackages";
import AddPackageWindow from "@/components/shared/AddPackageWindow";
import {
    AdminCard,
    AdminPageHeader,
    AdminSectionLoader,
} from "./AdminShared";

export default function PackagesClient() {
    const [loading, setLoading] = useState(true);
    const [packagesList, setPackagesList] = useState<any[]>([]);
    const [isOpenPackage, setIsOpenPackage] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const list = await getAllPackages();
                if (!cancelled) setPackagesList(list || []);
            } catch (error) {
                console.error("Failed to load packages:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <>
            <AdminPageHeader
                eyebrow="Packages"
                title="Packages"
                subtitle="Manage premium advert plans and boosts."
                action={
                    <button
                        onClick={() => setIsOpenPackage(true)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
                    >
                        <AddOutlinedIcon fontSize="small" />
                        Add Package
                    </button>
                }
            />

            <AdminCard>
                {loading ? (
                    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-sm text-slate-500">
                        <Image
                            src="/assets/icons/loading.gif"
                            alt="loading"
                            width={40}
                            height={40}
                        />
                        Loading packages...
                    </div>
                ) : (
                    <Menulistpackages packagesList={packagesList} />
                )}
            </AdminCard>

            <AddPackageWindow
                isOpen={isOpenPackage}
                onClose={() => setIsOpenPackage(false)}
                type="Create"
            />
        </>
    );
}