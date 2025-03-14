import React, { useState, useEffect } from "react";
import axios from "axios";
import { Multiselect } from "./Multiselect";
import AutoComplete from "./AutoComplete";
import MakeModelAutocomplete from "./MakeModelFilter";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
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

import { Button } from "../ui/button";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import Filter from "./Filter";
import MakeModelFilter from "./MakeModelFilter";
interface Field {
  name: string;
  type: string;
  options: string[];
  required: boolean;
}

interface Subcategory {
  fields: Field[];
}
type CollectionProps = {
  category: string;
  subcategory: string;
  allsubcategory: any;
  adsCount: any;
};
const FilterComponent = ({
  category,
  subcategory,
  allsubcategory,
  adsCount,
}: CollectionProps) => {
  const [fields, setFields] = useState<Field[]>([]);
  /// const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const [formData, setFormData] = useState<Record<string, any>>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const selectedData: any = allsubcategory.find(
      (catg: any) =>
        catg.category.name === category && catg.subcategory === subcategory
    );
    // Update fields if a match is found
    setFields(selectedData ? selectedData.fields : []);
  }, [category, subcategory]);

  const applyFilters = () => {
    // Filter out empty values from formData
    const filteredData = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    // Get the current URL search parameters
    const urlParams = new URLSearchParams(searchParams);

    // Remove keys from existing parameters that are present in filteredData
    Object.keys(filteredData).forEach((key) => {
      if (urlParams.has(key)) {
        urlParams.delete(key);
      }
    });

    // Append the new filtered data to the search parameters
    Object.entries(filteredData).forEach(([key, value]) => {
      urlParams.append(key, value as string);
    });

    // Construct the new URL
    const newUrl = `?${urlParams.toString()}`;

    // Navigate to the new URL with query parameters
    router.push(newUrl, { scroll: false });
  };
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };
  const handleCheckboxChange = (field: string, value: any) => {
    const currentSelection = formData[field] || []; // Get current selections for the field
    const isSelected = currentSelection.includes(value);

    const updatedSelection = isSelected
      ? currentSelection.filter((selected: any) => selected !== value) // Remove if already selected
      : [...currentSelection, value]; // Add new selection

    setFormData({ ...formData, [field]: updatedSelection }); // Update formData for the specific field
  };
  const handleInputAutoCompleteChange = (field: string, value: any) => {
    if (field === "make") {
      setFormData({ ...formData, [field]: value, model: "" });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };
  const handleInputYearChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };
  const currentYear = new Date().getFullYear();
  let years = [];
  for (let year = currentYear; year >= 1960; year--) {
    years.push(year.toString());
  }

  const handleClear = () => {
    let newUrl = "";
    newUrl = formUrlQuerymultiple({
      params: "",
      updates: {
        category: category.toString(),
        subcategory: subcategory.toString(),
      },
    });
    setFormData([]);
    router.push(newUrl, { scroll: false });
  };

  return (
    <div>
      {fields.map((field: any) => (
        <div key={field.name} className="flex gap-3 items-center mt-1">
          {field.type === "related-autocompletes" && (
            <>
              <MakeModelFilter
                plainTextData={field.options}
                make={formData["make"] || ""}
                adsCount={adsCount}
                formErrorsmake={""}
                model={formData["model"] || ""}
                formErrorsmodel={""}
                onChange={handleInputAutoCompleteChange}
              />
            </>
          )}

          {field.type === "select" && (
            <Filter
              data={years}
              name={field.name}
              adsCount={adsCount}
              onChange={handleInputYearChange}
              selected={formData[field.name] || ""}
            />
          )}
          {field.type === "year" && (
            <Filter
              data={years}
              name={field.name}
              adsCount={adsCount}
              onChange={handleInputYearChange}
              selected={formData[field.name] || ""}
            />
          )}
          {field.type === "autocomplete" && (
            <>
              <Filter
                data={field.options}
                name={field.name}
                adsCount={adsCount}
                onChange={handleInputAutoCompleteChange}
                selected={formData[field.name] || ""}
              />
              {/* <AutoComplete
                data={field.options}
                name={field.name}
                onChange={handleInputAutoCompleteChange}
                selected={formData[field.name] || ""}
              /> */}
            </>
          )}
          {/*  {field.type === "multi-select" && (
            <div className="w-full flex py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 flex-wrap gap-2 dark:bg-[#2D3236] bg-white">
              <Multiselect
                features={field.options}
                name={field.name}
                selectedFeatures={formData[field.name] || []}
                onChange={handleCheckboxChange}
              />
            </div>
          )}*/}
          {field.type === "radio" && (
            <>
              <Filter
                data={field.options}
                name={field.name}
                adsCount={adsCount}
                onChange={handleInputYearChange}
                selected={formData[field.name] || ""}
              />
              {/*   <div className="w-full flex py-2 px-3 rounded-sm border border-gray-300 dark:border-gray-600 flex-wrap gap-2 dark:bg-[#2D3236] bg-white">
              <FormControl>
                <FormLabel className="text-gray-800 dark:text-gray-200">
                  {capitalizeFirstLetter(field.name.replace("-", " "))}
                </FormLabel>
                <RadioGroup
                  name={field.name}
                  value={formData[field.name]} // Default to the first option
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                  className="space-y-0"
                >
                  {field.options?.map((option: any, index: number) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={
                        <Radio
                          sx={{
                            color: "gray", // Unchecked color
                            "&.Mui-checked": {
                              color: "green", // Checked color
                            },
                          }}
                        />
                      }
                      label={option}
                      className="text-gray-800 dark:text-gray-200"
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
            */}
            </>
          )}
          {field.type === "checkbox" && (
            <>
              <Filter
                data={field.options}
                name={field.name}
                adsCount={adsCount}
                onChange={handleInputYearChange}
                selected={formData[field.name] || ""}
              />
            </>
          )}
        </div>
      ))}
      {/*   <div className="flex flex-col">
        <Button
          onClick={applyFilters}
          size="lg"
          className="button bg-emerald-500 hover:bg-emerald-800 col-span-2 mt-3 w-full"
        >
          <div className="flex gap-1 items-center">
            <SearchOutlinedIcon />
            Apply Filters
          </div>
        </Button>
        <Button
          onClick={handleClear}
          size="lg"
          className="button col-span-2 mt-3 w-full"
        >
          <div className="flex gap-1 items-center">
            <CloseOutlinedIcon />
            Reset
          </div>
        </Button>
      </div>
      */}
    </div>
  );
};

export default FilterComponent;
