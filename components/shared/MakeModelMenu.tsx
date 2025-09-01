import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import AutoComplete from "./AutoComplete";
import InitialAvatar from "./InitialAvatar";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { Icons } from "@/constants";
type dataProps = {
  plainTextData: any;
  clearQuery: boolean;
  handleFilter: (value: any) => void;
};

// Parse plain text into structured data
const parsePlainTextToData = (text: string) => {
  const lines = text.trim().split("\n\n");
  return lines.map((block) => {
    const [makeLine, modelsLine] = block.split("\n");
    const make = makeLine.replace("Make: ", "").trim();
    const models = modelsLine
      .replace("Models: ", "")
      .split(",")
      .map((model) => model.trim());
    return { make, models, iconUrl: Icons[make] || "" };
  });
};

// Main component
const MakeModelMenu = ({ plainTextData, handleFilter, clearQuery }: dataProps) => {
  const data = parsePlainTextToData(plainTextData.toString());
  const [query, setQuery] = useState("");
  // Extract makes and models
  useEffect(() => {
    setQuery('');
  }, [clearQuery]);

  const makes = data.map((item) => item.make);
  const onSearch = (query: string) => {
    //let newUrl = "";

    if (query) {
      handleFilter({ make: query });
      setQuery(query);
    }

  };
  return (
    <>
      {makes.slice(0, 7).map((option: any) => {
        const item = data.find((d) => d.make === option); // get icon for this make
        return (
          <div
            key={option}
            onClick={() => onSearch(option)}
            className={`flex h-[80px] flex-col items-center justify-center cursor-pointer rounded-sm p-1 border ${option === query
              ? "text-orange-500 border bg-white border-orange-500"
              : "dark:bg-[#131B1E] bg-white hover:bg-orange-100"
              }`}
          >
            <div className="flex flex-col text-center items-center">
              <div>
                {item?.iconUrl ? (
                  <img
                    src={item.iconUrl}
                    alt={option}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <InitialAvatar
                    name={option}
                    color={option === query ? "#f97316" : "#2D3236"}
                  />
                )}
              </div>
              <h2 className="text-[10px]">{option}</h2>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default MakeModelMenu;
