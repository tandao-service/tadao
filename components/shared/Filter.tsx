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
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "../ui/scroll-area";

const Filter = ({
  selected,
  name,
  data,
  adsCount,
  onChange,
}: {
  selected: string | null;
  name: string;
  data: any;
  adsCount: any;
  onChange: (field: string, value: string) => void;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const [total, settotal] = useState(0);

  useEffect(() => {
    try {
      setQuery(searchParams.get(name) ?? "");
      const totalAdCount = adsCount
        .filter((item: any) => item.field === name) // Filter for entries where field is 'year'
        .reduce((sum: any, item: any) => sum + item.adCount, 0); // Sum up the adCount values
      settotal(totalAdCount);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setHasError(true);
    } finally {
      // setIsLoading(false);
    }
  }, []);
  const search = (name: string, value: string) => {
    let newUrl = "";
    if (name && value) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: name,
        value: value,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: [name],
      });
    }
    setQuery(value);
    router.push(newUrl, { scroll: false });
  };
  const searchClear = (name: string) => {
    let newUrl = "";
    newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: [name],
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <>
      <div className="text-sm mt-2 rounded-xl w-full border dark:border-gray-600">
        <div className="w-full">
          <Command className="rounded-xl">
            <div className="dark:bg-[#222528] border-b border-gray-800">
              <CommandInput
                placeholder={`Search ${capitalizeFirstLetter(
                  name.replace("-", " ")
                )}`}
              />
            </div>
            <CommandList className="dark:bg-[#2D3236] dark:text-gray-100">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup
                heading={`${capitalizeFirstLetter(name.replace("-", " "))}`}
              >
                <ScrollArea className="w-full p-3 h-[200px] dark:bg-[#2D3236] dark:text-gray-100">
                  <CommandItem
                    className={`mb-1 flex w-full p-1 cursor-pointer text-xs dark:bg-[#222528] dark:hover:bg-gray-700 justify-between `}
                  >
                    <div className="flex gap-1 items-center">
                      <input
                        className="cursor-pointer"
                        type="radio"
                        value="all"
                        checked={!query}
                        onChange={() => {
                          searchClear(name);
                        }}
                      />
                      <div> Show All</div>
                    </div>
                    <div className="dark:text-gray-300 text-emerald-600 flex gap-1 mr-2">
                      {total}
                      <div>ads</div>
                    </div>
                  </CommandItem>
                  {data &&
                    data.map((option: any, index: number) => (
                      <>
                        <CommandItem
                          key={index}
                          className={`mb-1 flex dark:bg-[#2D3236]  cursor-pointer dark:hover:bg-gray-700 dark:text-gray-100 w-full p-1 dark:bg-[#222528] text-xs justify-between `}
                        >
                          <div className="flex gap-1 items-center">
                            <input
                              className="cursor-pointer"
                              type="radio"
                              value={option}
                              checked={query === option}
                              onChange={() => {
                                search(name, option);
                              }}
                            />
                            <div> {option}</div>
                          </div>
                          {(() => {
                            const adItem = adsCount?.find(
                              (item: {
                                field: string;
                                value: string;
                                adCount: number;
                              }) => item.field === name && item.value === option
                            );

                            const adCount = adItem?.adCount ?? 0;
                            const textColorClass =
                              adCount === 0
                                ? "dark:text-gray-500 text-gray-400"
                                : "dark:text-gray-300 text-emerald-600";

                            return (
                              <div
                                className={`${textColorClass} flex gap-1 mr-2`}
                              >
                                {adCount}
                                <div>ads</div>
                              </div>
                            );
                          })()}
                        </CommandItem>
                      </>
                    ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
    </>
  );
};

export default Filter;
