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

    async function loadData() {
        try {
            setLoading(true);

            const [categoriesRes, subcategoriesRes, catListRes] = await Promise.all([
                getAllCategories(),
                getselectedsubcategories(category),
                getselectedCategories(),
            ]);

            setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
            setSubcategories(Array.isArray(subcategoriesRes) ? subcategoriesRes : []);
            setCatList(Array.isArray(catListRes) ? catListRes : []);
        } catch (error) {
            console.error("Failed to load categories:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [category]);

    if (loading) {
        return <AdminSectionLoader label="Loading categories..." />;
    }

    return (
        <>
            <AdminPageHeader
                eyebrow="Categories"
                title="Categories & Subcategories"
                subtitle="Manage listing groups, form fields, and category visibility."
            />

            <div className="grid min-w-0 gap-6">
                <AdminCard>
                    <div className="min-w-0">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-950">
                                    Categories
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Main listing groups shown to sellers.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsOpenCategory(true)}
                                className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
                            >
                                <AddOutlinedIcon fontSize="small" />
                                Add Category
                            </button>
                        </div>

                        <div className="w-full min-w-0 overflow-x-auto">
                            <DisplayCategories categories={categories} onSaved={loadData} />
                        </div>
                    </div>
                </AdminCard>

                <AdminCard>
                    <div className="min-w-0">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-950">
                                    Subcategories
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Manage subcategory forms and fields.
                                </p>
                            </div>

                            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
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

                        <div className="w-full min-w-0 overflow-x-auto">
                            <DisplaySubCategories
                                subcategories={subcategories}
                                onSaved={loadData}
                            />
                        </div>
                    </div>
                </AdminCard>
            </div>

            <AddCategoryWindow
                isOpen={isOpenCategory}
                onClose={() => setIsOpenCategory(false)}
                type="Create"
                onSaved={() => {
                    setIsOpenCategory(false);
                    loadData();
                }}
            />

            <AddSubCategoryWindow
                isOpen={isOpenSubCategory}
                onClose={() => setIsOpenSubCategory(false)}
                onSaved={() => {
                    setIsOpenSubCategory(false);
                    loadData();
                }}
            />
        </>
    );
}