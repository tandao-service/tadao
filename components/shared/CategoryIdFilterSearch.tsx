"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllCategories,
  getselectedCategories,
} from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
type CatgProps = {
  catList: any;
};
const CategoryIdFilterSearch = ({ catList }: CatgProps) => {
  // const [categories, setCategories] = useState<any>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  //useEffect(() => {
  // const getCategories = async () => {
  //   const categoryList = await getselectedCategories();

  // categoryList && setCategories(categoryList);
  // };

  //getCategories();
  //}, []);

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

  return (
    <>
      <Select onValueChange={(value: string) => onSelectCategory(value)}>
        <SelectTrigger className="select-field dark:bg-[#131B1E] border border-gray-600 dark:text-gray-300">
          <SelectValue placeholder="Filter by Category" />
        </SelectTrigger>
        <SelectContent className="dark:bg-[#2D3236] dark:text-gray-300">
          {catList.map((category: any) => (
            <SelectItem
              value={category._id}
              key={category._id}
              className="flex w-full select-item p-regular-14 dark:hover:bg-[#131B1E]"
            >
              <div className="flex w-[300px] gap-1 justify-between items-center">
                <div className="flex gap-1 items-center">
                  <Image
                    className="h-4 w-6 object-cover"
                    src={category.imageUrl[0] || ""}
                    alt={category.name || ""}
                    width={60}
                    height={60}
                  />

                  <div className="flex text-sm flex-col">
                    {category.name}
                    <div className="flex text-xs dark:text-gray-500 gap-1">
                      {category.adCount}
                      <div>subcategories</div>
                    </div>
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default CategoryIdFilterSearch;
