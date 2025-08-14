"use client";

import { useEffect, useState } from "react";
import { commonVehicleMakesInKenya } from "@/constants";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import InitialAvatar from "./InitialAvatar";
type CardProps = {
  category: string;
  subcategory: string;
};

export default function Menumake({ category, subcategory }: CardProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [active, setactive] = useState(30);
  // const make = searchParams.get("make");
  const handleClick = (query: string, index: number) => {
    let newUrl = "";
    if (query) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "make",
        value: query,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["make"],
      });
    }

    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="mt-2">
      <div className="grid grid-cols-4 lg:grid-cols-8 m-0 gap-1">
        {commonVehicleMakesInKenya.length > 0 &&
          commonVehicleMakesInKenya.map((vehicle: any, index: number) => (
            <div
              key={index}
              className={`flex h-[80px] flex-col items-center justify-center cursor-pointer rounded-sm p-1 border hover:border-orange-700 ${vehicle.make === searchParams.get("make")
                  ? "bg-orange-500 text-white"
                  : "dark:bg-[#131B1E] bg-white hover:bg-orange-900"
                }`}
            >
              <div
                className="flex flex-col text-center items-center"
                onClick={(e) => handleClick(vehicle.make, index)}
              >
                {/*   <div className="h-10 w-10 rounded-full bg-white p-2">
                  <Image
                    className="w-full h-full"
                    src={vehicle.iconPath}
                    alt="Menu Image"
                    width={20}
                    height={20}
                  />
                </div>*/}
                <div>
                  <InitialAvatar name={vehicle.make} color={"#2D3236"} />
                </div>
                <h2 className="text-xs">{vehicle.make}</h2>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
