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

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Ensure you have a button component

const AutoComplete = ({
  selected,
  name,
  data,
  onChange,
}: {
  selected: string | null;
  name: string;
  data: string[];
  onChange: (field: string, value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleConfirm = () => {
    if (inputValue.trim() !== "") {
      onChange(name, inputValue.trim());
      setInputValue("");
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="py-2 px-2 rounded-sm border border-gray-300 dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 items-start w-full rounded-lg cursor-pointer">
          <div className="flex flex-col">
            <label className="text-sm font-medium dark:text-gray-400 text-gray-500">
              {capitalizeFirstLetter(name.replace("-", " "))}
            </label>
            <div className="dark:text-gray-100 text-black text-sm lg:text-base">
              {selected || `Select ${capitalizeFirstLetter(name.replace("-", " "))}`}
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="dark:bg-[#222528] dark:text-gray-100 w-full">
        <Command>
          <div className="dark:bg-[#222528] border-b border-gray-800 p-2">
            <CommandInput
              placeholder={`Search or enter ${capitalizeFirstLetter(name.replace("-", " "))}`}
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConfirm();
                }
              }}
             
            />
          </div>

          <CommandList className="dark:bg-[#222528] dark:text-gray-100">
            <CommandEmpty>No {name} found</CommandEmpty>
            <CommandGroup>
              {data.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => {
                    onChange(name, option);
                    setOpen(false);
                  }}
                >
                  {option}
                  <Check
                    className={cn("ml-auto", selected === option ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {/* Confirm button for mobile users */}
        <div className="p-2 flex justify-end">
          <Button size="sm" onClick={handleConfirm}>Confirm</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AutoComplete;
