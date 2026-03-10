import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import AutoComplete from "./AutoComplete";
import Filter from "./Filter";
import { useSearchParams } from "next/navigation";
type dataProps = {
  plainTextData: any;
  make: string;
  adsCount: any;
  formErrorsmake: string;
  model: string;
  formErrorsmodel: string;
  onChange: (field: string, value: string) => void;
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
    return { make, models };
  });
};

// Main component
const MakeModelFilter = ({
  plainTextData,
  make,
  adsCount,
  formErrorsmake,
  model,
  formErrorsmodel,
  onChange,
}: dataProps) => {
  const data = parsePlainTextToData(plainTextData.toString());
  const searchParams = useSearchParams();
  // Extract makes and models
  const makes = data.map((item) => item.make);
  const models = make
    ? data.find((item) => item.make === searchParams.get("make"))?.models || []
    : [];

  const handleInputAutoCompleteChange = (field: string, value: any) => {
    onChange(field, value);
  };
  return (
    <div className="w-full grid grid-cols-1 flex gap-3">
      {/* Autocomplete for Make */}
      <div className="w-full">
        <Filter
          data={makes}
          name={"make"}
          adsCount={adsCount}
          onChange={handleInputAutoCompleteChange}
          selected={make}
        />
      </div>
      {models && (
        <>
          <div className="w-full">
            <Filter
              data={models ?? []}
              name={"model"}
              adsCount={adsCount}
              onChange={handleInputAutoCompleteChange}
              selected={model}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MakeModelFilter;
