"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
const Search = ({
  placeholder = "Search title...",
  onLoading,
}: {
  placeholder?: string;
  onLoading: () => void;
}) => {
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     let newUrl = "";
  // alert(query);
  //   if (query) {
  //      newUrl = formUrlQuery({
  //        params: searchParams.toString(),
  //        key: "query",
  //        value: query,
  //      });
  //   } else {
  //      newUrl = removeKeysFromQuery({
  //       params: searchParams.toString(),
  //       keysToRemove: ["query"],
  //     });
  //   }

  // onLoading();
  //  router.push(newUrl, { scroll: false });
  //}, 300);

  //return () => clearTimeout(delayDebounceFn);
  //}, [query]);
  const handleClear = () => {
    setQuery("");
    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["query"],
    });
    onLoading();
    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="flex justify-between items-center border border-gray- dark:border-gray-600 dark:bg-[#2D3236] bg-white p-1 rounded-full mx-auto w-full max-w-md">
      <div className="flex items-center w-full">
        {focus && (
          <div className="text-gray-400">
            <SearchOutlinedIcon />
          </div>
        )}
        <Input
          type="text"
          value={query}
          placeholder={placeholder}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="w-full dark:bg-[#2D3236] dark:text-gray-300 flex-grow rounded-full p-regular-16 border-0 bg-red outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        {query && (
          <button onClick={handleClear} className="p-2">
            <CloseOutlinedIcon />
          </button>
        )}
      </div>
      <div>
        <button
          onClick={() => {
            if (query) {
              onLoading();
              router.push(
                formUrlQuery({
                  params: searchParams.toString(),
                  key: "query",
                  value: query,
                }),
                { scroll: false }
              );
            }
          }}
          className="flex justify-center items-center h-12 w-12 text-white bg-emerald-700 hover:bg-emerald-800 rounded-full"
        >
          <SearchOutlinedIcon />
        </button>
      </div>
    </div>
  );
};

export default Search;
