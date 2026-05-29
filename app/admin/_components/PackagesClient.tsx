"use client";

import { useEffect, useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import { getAllPackages } from "@/lib/actions/packages.actions";
import AddPackageWindow from "@/components/shared/AddPackageWindow";


import {
    AdminCard,
    AdminPageHeader,
    AdminSectionLoader,
} from "./AdminShared";
import PackagesTable from "@/components/shared/PackagesTable";

export default function PackagesClient() {
    const [loading, setLoading] = useState(true);
    const [packagesList, setPackagesList] = useState<any[]>([]);
    const [isOpenPackage, setIsOpenPackage] = useState(false);

    async function loadPackages() {
        try {
            setLoading(true);
            const list = await getAllPackages();
            setPackagesList(Array.isArray(list) ? list : []);
        } catch (error) {
            console.error("Failed to load packages:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPackages();
    }, []);

    return (
        <>

            <AdminCard>
                {loading ? (
                    <AdminSectionLoader label="Loading packages..." />
                ) : (
                    <PackagesTable
                        packagesList={packagesList}
                        onSaved={loadPackages}
                    />
                )}
            </AdminCard>

            <AddPackageWindow
                isOpen={isOpenPackage}
                onClose={() => setIsOpenPackage(false)}
                type="Create"
                onSaved={() => {
                    setIsOpenPackage(false);
                    loadPackages();
                }}
            />
        </>
    );
}