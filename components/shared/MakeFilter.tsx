"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vehicleColors, vehicleConditions, vehicleModels } from "@/constants";
import { getAllCategories } from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MakeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vehiclemake, setvehiclemake] = useState("");
  const [vehiclemodel, setvehiclemodel] = useState("");
  const [vehiclecolor, setvehiclecolor] = useState("");
  const [vehiclecondition, setvehiclecondition] = useState("");
  const [vehicleyearfrom, setvehicleyearfrom] = useState("");
  const [vehicleyearto, setvehicleyearto] = useState("");
  const onSelectMake = (make: string) => {
    let newUrl = "";

    if (make && make !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "make",
        value: make,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["make"],
      });
    }

    router.push(newUrl, { scroll: false });
  };
  const onSelectModel = (make: string) => {
    let newUrl = "";

    if (make && make !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehiclemodel",
        value: make,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehiclemodel"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const onSelectYearfrom = (value: string) => {
    let newUrl = "";

    if (value && value !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "yearfrom",
        value: value,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["yearfrom"],
      });
    }

    router.push(newUrl, { scroll: false });
  };
  const onSelectYearto = (value: string) => {
    let newUrl = "";

    if (value && value !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "yearto",
        value: value,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["yearto"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const onSelectColor = (value: string) => {
    let newUrl = "";

    if (value && value !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehiclecolor",
        value: value,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehiclecolor"],
      });
    }

    router.push(newUrl, { scroll: false });
  };
  const onSelectCondition = (value: string) => {
    let newUrl = "";

    if (value && value !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "vehiclecondition",
        value: value,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["vehiclecondition"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const [minPrice, setminPrice] = useState("");
  const [maxPrice, setmaxPrice] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";

      if (minPrice && maxPrice) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "Price",
          value: minPrice + "-" + maxPrice,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["Price"],
        });
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [minPrice, maxPrice, searchParams, router]);

  const currentYear = new Date().getFullYear();
  let years = [];
  for (let year = currentYear; year >= 1960; year--) {
    years.push(year.toString());
  }

  return (
    <>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="w-full overflow-hidden rounded-full px-4 py-2">
          <Autocomplete
            id="vehiclemake"
            options={vehicleModels}
            getOptionLabel={(option) => option.make}
            value={
              vehicleModels.find((vehicle) => vehicle.make === vehiclemake) ||
              null
            }
            onChange={(event, newValue) => {
              onSelectMake(newValue?.make ?? "");
              setvehiclemake(newValue?.make ?? "");
            }}
            renderInput={(field) => <TextField {...field} label="Make*" />}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="w-full overflow-hidden rounded-full px-4 py-2">
          <Autocomplete
            id="vehiclemodel"
            options={
              vehicleModels.find((vehicle) => vehicle.make === vehiclemake)
                ?.models || []
            }
            value={vehiclemodel}
            onChange={(event, newValue) => {
              onSelectModel(newValue ?? "");
              setvehiclemodel(newValue ?? "");
            }}
            renderInput={(field) => <TextField {...field} label="Model*" />}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="w-full overflow-hidden rounded-full px-4 py-2">
          <Autocomplete
            id="vehicleyearfrom"
            options={years}
            getOptionLabel={(option) => option}
            value={years.find((yr) => yr === vehicleyearfrom) || null}
            onChange={(event, newValue) => {
              onSelectYearfrom(newValue ?? "");
              setvehicleyearfrom(newValue ?? "");
            }}
            renderInput={(field) => <TextField {...field} label="From Year*" />}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="w-full overflow-hidden rounded-full px-4 py-2">
          <Autocomplete
            id="vehicleyearto"
            options={years}
            getOptionLabel={(option) => option}
            value={years.find((yr) => yr === vehicleyearto) || null}
            onChange={(event, newValue) => {
              onSelectYearto(newValue ?? "");
              setvehicleyearto(newValue ?? "");
            }}
            renderInput={(field) => <TextField {...field} label="To Year*" />}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="w-full overflow-hidden rounded-full px-4 py-2">
          <TextField
            value={minPrice}
            label="Min Price*"
            className="w-full"
            onChange={(e) => setminPrice(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="w-full overflow-hidden rounded-full px-4 py-2">
          <TextField
            value={maxPrice}
            label="Max Price*"
            className="w-full"
            onChange={(e) => setmaxPrice(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="w-full overflow-hidden rounded-full px-4 py-2">
          <Autocomplete
            id="vehiclecondition"
            options={vehicleConditions}
            getOptionLabel={(option) => option}
            value={
              vehicleConditions.find(
                (vehicle) => vehicle === vehiclecondition
              ) || null
            }
            onChange={(event, newValue) => {
              onSelectCondition(newValue ?? "");
              setvehiclecondition(newValue ?? "");
            }}
            renderInput={(field) => <TextField {...field} label="Condition*" />}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="w-full overflow-hidden rounded-full px-4 py-2">
          <Autocomplete
            id="vehiclecolor"
            options={vehicleColors}
            getOptionLabel={(option) => option}
            value={
              vehicleColors.find((vehicle) => vehicle === vehiclecolor) || null
            }
            onChange={(event, newValue) => {
              onSelectColor(newValue ?? "");
              setvehiclecolor(newValue ?? "");
            }}
            renderInput={(field) => (
              <TextField {...field} label="Body Color*" />
            )}
          />
        </div>
      </div>
    </>
  );
};

export default MakeFilter;
