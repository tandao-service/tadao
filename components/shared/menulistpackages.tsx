import Link from "next/link";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DeleteThisPackage } from "./DeletePackage";

type packProps = {
  packagesList: {
    imageUrl: string;
    name: string;
    _id: string;
    description: string;
    price: string[];
    features: string[];
    color: string;
  }[];
};

export default function Menulistpackages({ packagesList }: packProps) {
  return (
    <div className="container mx-auto mt-0 bg-grey-50 p-2 rounded-sm">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 m-1 gap-1">
        {packagesList.length > 0 &&
          packagesList.map((pack: any) => (
            <div
              key={pack._id}
              className="bg-white shadow-md rounded-md p-0 items-center"
            >
              <div
                className={`text-lg font-bold rounded-t-md text-white py-2 px-4 mb-4 flex flex-col items-center justify-center`}
                style={{
                  backgroundColor: pack.color,
                }}
              >
                <Image
                  className="w-8 h-8 object-cover rounded-full"
                  src={pack.imageUrl}
                  alt="Menu Image"
                  height={200}
                  width={200}
                />
                {pack.name}
              </div>

              <div className="p-3">
                <div className="text-gray-600 mb-1">
                  <div className="flex gap-2">
                    <CheckCircleIcon style={{ fontSize: 14 }} />
                    {pack.description}
                  </div>
                </div>

                <div className="text-gray-700 mb-1">
                  {/* Inclusions */}
                  <ul className="flex flex-col gap-5 py-9">
                    {pack.features.map((feature: any, index: number) => (
                      <li key={index} className="flex items-center gap-4">
                        <Image
                          src={`/assets/icons/${
                            feature.checked ? "check" : "cross"
                          }.svg`}
                          alt={feature.checked ? "check" : "cross"}
                          width={24}
                          height={24}
                        />
                        <p className="text-sm">{feature.title}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <p className="p-1 cursor-pointer bg-grey-50 rounded-lg w-full">
                        View Prices?
                      </p>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-gray-800 p-1">
                        <ul className="flex flex-col gap-2 py-0">
                          {pack.price.map((price: any, index: number) => (
                            <li key={index} className="flex items-center gap-4">
                              <p className="">{price.period}</p>
                              <p className="">Ksh: {price.amount}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex items-center">
                  <Link href={`/packages/${pack._id}/update`} className="mr-2">
                    <Image
                      src="/assets/icons/edit.svg"
                      alt="edit"
                      width={20}
                      height={20}
                    />
                  </Link>
                  <DeleteThisPackage
                    packageId={pack._id}
                    packageIcon={pack.imageUrl}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
