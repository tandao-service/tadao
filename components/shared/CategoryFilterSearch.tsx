"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
const CategoryFilterSearch = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();

      categoryList && setCategories(categoryList as ICategory[]);
    };

    getCategories();
  }, []);

  const onSelectCategory = (category: string) => {
    let newUrl = "";

    if (category && category !== "All") {
      newUrl = formUrlQuery({
        params: "",
        key: "category",
        value: category,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["category"],
      });
    }

    router.push(newUrl, { scroll: false });
  };
  const [categoryOption, setcategoryOption] = useState("");
  return (
    <>
      <Select onValueChange={(value: string) => onSelectCategory(value)}>
        <SelectTrigger className="select-field">
          <SelectValue placeholder="Search Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem
              value={category.name}
              key={category._id}
              className="flex select-item p-regular-14"
            >
              <div className="flex w-full gap-1 items-center">
                {category.name}{" "}
                <div className="text-xs text-emerald-600">
                  | {category.adCount} ads
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default CategoryFilterSearch;
