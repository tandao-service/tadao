import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import AutoComplete from "./AutoComplete";
import AutoCompleteFilter from "./AutoCompleteFilter";
type dataProps = {
  plainTextData: any;
  make: string;
  formErrorsmake: string;
  model: string;
  formErrorsmodel: string;
  adsCount: any;
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
const MakeModelAutocompleteFilter = ({
  plainTextData,
  make,
  formErrorsmake,
  model,
  formErrorsmodel,
  adsCount,
  onChange,
}: dataProps) => {
  const data = parsePlainTextToData(plainTextData.toString());

  // Extract makes and models
  const makes = data.map((item) => item.make);
  const models = make
    ? data.find((item) => item.make === make)?.models || []
    : [];

  const handleInputAutoCompleteChange = (field: string, value: any) => {
    onChange(field, value);
  };
  return (
    <div className="w-full grid grid-cols-1 flex gap-3">
      {/* Autocomplete for Make */}
      <div className="w-full">
        <AutoCompleteFilter
          data={makes}
          name={"make"}
          onChange={handleInputAutoCompleteChange}
          selected={make}
          adsCount={adsCount}
        />
      </div>
      <div className="w-full">
        <AutoCompleteFilter
          data={models ?? []}
          name={"model"}
          onChange={handleInputAutoCompleteChange}
          selected={model}
          adsCount={adsCount}
        />
      </div>
    </div>
  );
};

export default MakeModelAutocompleteFilter;
