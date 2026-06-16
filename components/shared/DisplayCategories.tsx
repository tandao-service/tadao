"use client";

import { useState } from "react";
import Image from "next/image";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { DeleteCategory } from "./DeleteCategory";
import AddCategoryWindow from "./AddCategoryWindow";
import { ICategory } from "@/lib/database/models/category.model";

type CatProps = {
  categories: any[];
  onSaved?: () => void;
};

const DisplayCategories = ({ categories, onSaved }: CatProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [isOpenCategory, setIsOpenCategory] = useState(false);

  const handleOpenCategory = (category: ICategory) => {
    setSelectedCategory(category);
    setIsOpenCategory(true);
  };

  const handleCloseCategory = () => {
    setIsOpenCategory(false);
    setSelectedCategory(null);
  };

  return (
    <div>
      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          No categories available.
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-[800px] w-full border-separate border-spacing-y-3">
            <thead>
              <tr>
                <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </th>
                <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Active Ads
                </th>
                <th className="px-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category: any) => {
                const imageUrl = Array.isArray(category.imageUrl)
                  ? category.imageUrl[0]
                  : category.imageUrl;

                return (
                  <tr key={category._id}>
                    <td className="rounded-l-2xl bg-slate-50 px-4 py-4">
                      <div className="flex min-w-max items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={category.name || "Category"}
                              width={30}
                              height={30}
                              className="h-7 w-7 object-contain"
                              unoptimized
                            />
                          ) : (
                            <span className="text-xs text-slate-400">
                              No icon
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="whitespace-nowrap text-sm font-semibold text-slate-950">
                            {category.name || "Unnamed Category"}
                          </p>
                          <p className="mt-1 whitespace-nowrap text-xs text-slate-500">
                            ID: {String(category._id)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap bg-slate-50 px-4 py-4 text-sm text-slate-700">
                      {Number(category.adCount || 0).toLocaleString()}
                    </td>

                    <td className="rounded-r-2xl bg-slate-50 px-4 py-4">
                      <div className="flex min-w-max justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenCategory(category)}
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white hover:bg-orange-500"
                        >
                          <EditOutlinedIcon fontSize="small" />
                          Edit
                        </button>

                        <DeleteCategory
                          categoryId={category._id}
                          categoryImage={imageUrl || ""}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AddCategoryWindow
        isOpen={isOpenCategory}
        onClose={handleCloseCategory}
        category={selectedCategory}
        type="Update"
        onSaved={() => {
          handleCloseCategory();
          onSaved?.();
        }}
      />
    </div>
  );
};

export default DisplayCategories;