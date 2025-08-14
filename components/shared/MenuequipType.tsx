"use client";

import { useEffect, useState } from "react";
import { equipmentTypes } from "@/constants";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
type CardProps = {
  category: string;
  subcategory: string;
};

export default function MenuequipType({ category, subcategory }: CardProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";

      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "equipment-Type",
          value: query,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["equipment-Type"],
        });
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="mt-2">
      <div className="grid grid-cols-5 lg:grid-cols-8 m-0 gap-1">
        {equipmentTypes.length > 0 &&
          equipmentTypes.slice(0, 8).map((vehicle: any) => (
            <div
              key={vehicle.type} // Always good to have a unique key prop
              className={`flex h-[80px] shadow flex-col items-center justify-center cursor-pointer rounded-sm p-1 border-1 border-orange-300 hover:bg-orange-200 ${vehicle.type === searchParams.get("Types")
                  ? "bg-orange-500 text-white"
                  : "dark:bg-[#131B1E] bg-white hover:bg-orange-200"
                }`}
            >
              <div
                className="flex flex-col text-center items-center"
                onClick={(e) => setQuery(vehicle.type)}
              >
                <div className="h-10 w-10 rounded-full bg-white p-2">
                  <Image
                    className="w-full h-full"
                    src={vehicle.iconPath}
                    alt="Menu Image"
                    width={20}
                    height={20}
                  />
                </div>

                <h2 className="text-xs">{vehicle.type}</h2>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
