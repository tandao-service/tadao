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
}: {
  placeholder?: string;
}) => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";
      // alert(query);
      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: query,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);
  const handleClear = () => {
    setQuery("");
    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["query"],
    });
    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="flex justify-between items-center bg-white p-1 shadow-xl rounded-full mx-auto w-full max-w-md">
      <div>
        <button
          onClick={() =>
            router.push(
              formUrlQuery({
                params: searchParams.toString(),
                key: "query",
                value: query,
              }),
              { scroll: false }
            )
          }
          className="flex justify-center items-center h-12 w-12 text-white bg-emerald-700 rounded-full"
        >
          <SearchOutlinedIcon />
        </button>
      </div>
      <div className="w-full">
        <Input
          type="text"
          value={query}
          placeholder={placeholder}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          className="w-full flex-grow rounded-full p-regular-16 border-0 bg-red outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        {query && (
          <button onClick={handleClear} className="p-2">
            <CloseOutlinedIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
