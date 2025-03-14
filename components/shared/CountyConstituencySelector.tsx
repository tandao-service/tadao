import React, { useState } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";
import { REGIONS_WITH_CONSTITUENCIES } from "@/constants";
import AutoComplete from "./AutoComplete";

// Data: All counties and their constituencies

const CountyConstituencySelector: React.FC = () => {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<
    string | null
  >(null);

  // Get constituencies based on the selected county
  const constituencies =
    REGIONS_WITH_CONSTITUENCIES.find(
      (county) => county.county === selectedCounty
    )?.constituencies || [];

  const handleCounty = (field: string, value: any) => {
    setSelectedCounty(value);
    setSelectedConstituency(null);

    // setFormData({ ...formData, [field]: value });
  };
  const handleConstituency = (field: string, value: any) => {
    setSelectedConstituency(value);

    // setFormData({ ...formData, [field]: value });
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2 }}>
      {/* County Selector */}

      <AutoComplete
        data={REGIONS_WITH_CONSTITUENCIES.map((county) => county.county)}
        name={"county"}
        onChange={handleCounty}
        selected={selectedCounty}
      />

      {selectedCounty && (
        <>
          <AutoComplete
            data={constituencies}
            name={"constituency"}
            onChange={handleConstituency}
            selected={selectedConstituency}
          />
        </>
      )}
      <Autocomplete
        options={REGIONS_WITH_CONSTITUENCIES.map((county) => county.county)}
        value={selectedCounty}
        onChange={(event, newValue) => {
          setSelectedCounty(newValue);
          setSelectedConstituency(null); // Reset constituency when county changes
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select County"
            variant="outlined"
            className="flex mt-3 gap-3 border dark:bg-[#2D3236] bg-white py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 items-center mb-1"
          />
        )}
        sx={{ marginBottom: 2 }}
      />

      {/* Constituency Selector */}
      <Autocomplete
        options={constituencies}
        value={selectedConstituency}
        onChange={(event, newValue) => setSelectedConstituency(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Constituency"
            variant="outlined"
            disabled={!selectedCounty}
          />
        )}
      />
    </Box>
  );
};

export default CountyConstituencySelector;
