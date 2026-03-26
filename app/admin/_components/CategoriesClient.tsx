"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import {
    getAllCategories,
    getselectedCategories,
} from "@/lib/actions/category.actions";
import { getselectedsubcategories } from "@/lib/actions/subcategory.actions";

import DisplayCategories from "@/components/shared/DisplayCategories";
import DisplaySubCategories from "@/components/shared/DisplaySubCategories";
import AddCategoryWindow from "@/components/shared/AddCategoryWindow";
import AddSubCategoryWindow from "@/components/shared/AddSubCategoryWindow";
import CategoryIdFilterSearch from "@/components/shared/CategoryIdFilterSearch";

import {
    AdminCard,
    AdminPageHeader,
    AdminSectionLoader,
} from "./AdminShared";

export default function CategoriesClient() {
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || "";

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [catList, setCatList] = useState<any[]>([]);

    const [isOpenCategory, setIsOpenCategory] = useState(false);
    const [isOpenSubCategory, setIsOpenSubCategory] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);

                const [categoriesRes, subcategoriesRes, catListRes] = await Promise.all([
                    getAllCategories(),
                    getselectedsubcategories(category),
                    getselectedCategories(),
                ]);

                if (cancelled) return;

                setCategories(categoriesRes || []);
                setSubcategories(subcategoriesRes || []);
                setCatList(catListRes || []);
            } catch (error) {
                console.error("Failed to load categories:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [category]);

    if (loading) {
        return <AdminSectionLoader label="Loading categories..." />;
    }

    return (
        <>
            <AdminPageHeader
                eyebrow="Categories"
                title="Categories & Subcategories"
                subtitle="Manage listing groups with a cleaner route-based admin."
            />

            <div className="grid gap-6 xl:grid-cols-1">
                <AdminCard>
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold text-slate-950">Categories</h2>
                        <button
                            onClick={() => setIsOpenCategory(true)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
                        >
                            <AddOutlinedIcon fontSize="small" />
                            Add Category
                        </button>
                    </div>

                    <DisplayCategories categories={categories} />
                </AdminCard>

                <AdminCard>
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-semibold text-slate-950">Subcategories</h2>
                        <div className="flex items-center gap-3">
                            <CategoryIdFilterSearch catList={catList} />
                            <button
                                onClick={() => setIsOpenSubCategory(true)}
                                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
                            >
                                <AddOutlinedIcon fontSize="small" />
                                Add Subcategory
                            </button>
                        </div>
                    </div>

                    <DisplaySubCategories subcategories={subcategories} />
                </AdminCard>
            </div>

            <AddCategoryWindow
                isOpen={isOpenCategory}
                onClose={() => setIsOpenCategory(false)}
                type="Create"
            />

            <AddSubCategoryWindow
                isOpen={isOpenSubCategory}
                onClose={() => setIsOpenSubCategory(false)}
            />
        </>
    );
}