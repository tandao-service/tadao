import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";
import { getallcategories } from "@/lib/actions/subcategory.actions";
import { useMediaQuery } from "react-responsive"; // Import useMediaQuery

const CategorySelectSub = ({
  selected,
  data,
  onChange,
}: {
  selected: string | null;
  data: any;
  onChange: (field: string, value: string, id: string) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 items-start w-full rounded-lg cursor-pointer border">
          <div className="flex flex-col">
            <label className="text-sm font-medium dark:text-gray-400 text-gray-500">
              Category*
            </label>
            <div className="dark:text-gray-100 text-black text-sm lg:text-base">
              {selected || "Search Category"}
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
         side="bottom"
               align="start"
               className={cn(
                 "dark:bg-[#222528] dark:text-gray-100 w-full",
                 isMobile ? "fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#222528] p-4" : ""
               )}
      >
        <Command>
          <div className="dark:bg-[#222528] border-b border-gray-800">
            <CommandInput placeholder="Search category..." />
          </div>
          <CommandList className="dark:bg-[#222528] dark:text-gray-100">
            <CommandEmpty>No categories found</CommandEmpty>
            <CommandGroup>
              {data.map((category: any) => (
                <CommandItem
                  key={category._id}
                  //  className="dark:hover:bg-[#131B1E]"
                  onSelect={() => {
                    onChange("category", category.name, category._id);
                    setOpen(false);
                  }}
                >
                  <div className="flex gap-1 items-center">
                    <Image
                      className="h-4 w-6 object-cover"
                      src={category.imageUrl[0] || ""}
                      alt={category.name || ""}
                      width={60}
                      height={60}
                    />
                    {category.name}
                  </div>

                  <Check
                    className={cn(
                      "ml-auto",
                      selected === category.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelectSub;
