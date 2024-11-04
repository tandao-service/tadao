"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

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
    <div className="flex items-center bg-white p-2 border rounded-full mx-auto w-full max-w-md">
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
        className="p-2"
      >
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
        />
      </button>
      <Input
        type="text"
        value={query}
        placeholder={placeholder}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
        className="flex-grow p-regular-16 border-0 bg-white outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      {query && (
        <button onClick={handleClear} className="p-2">
          <Image
            src="/assets/icons/close.svg"
            alt="clear"
            width={24}
            height={24}
          />
        </button>
      )}
    </div>
  );
};

export default Search;
