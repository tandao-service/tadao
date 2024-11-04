"use client";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  useState,
  useEffect,
} from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid"; // Import UUID function
import { IUser } from "@/lib/database/models/user.model";
import { createTransaction } from "@/lib/actions/transactionstatus";
import { useRouter } from "next/navigation";
type Package = {
  imageUrl: string;
  name: string;
  _id: string;
  description: string;
  price: string[];
  features: string[];
  color: string;
};
type PackProps = {
  packagesList: Package[];
  userId: string;
  daysRemaining: number;
  packname: string;
  user: IUser;
};
export default function Listpackages({
  packagesList,
  userId,
  packname,
  daysRemaining,
  user,
}: PackProps) {
  const [activeButton, setActiveButton] = useState(1);
  const [activeButtonTitle, setActiveButtonTitle] = useState("1 month");
  const router = useRouter();
  const handlepay = async (
    packIdInput: string,
    packNameInput: string,
    periodInput: string,
    priceInput: string
  ) => {
    const customerId = uuidv4();

    const trans = {
      orderTrackingId: customerId,
      amount: Number(priceInput),
      plan: packNameInput,
      planId: packIdInput,
      period: periodInput,
      buyerId: userId,
      merchantId: userId,
      status: "Pending",
      createdAt: new Date(),
    };
    const response = await createTransaction(trans);
    if (response.status === "Pending") {
      router.push(`/pay/${response.orderTrackingId}`);
    }
  };
  const handleButtonClick = (index: number, title: string) => {
    setActiveButton(index);
    setActiveButtonTitle(title);

    activePackage?.price.forEach((price: any, indexx: number) => {
      if (indexx === index) {
        setPriceInput(price.amount);
        setPeriodInput(price.period);
      }
    });
  };
  //  const [activePackage, setActivePackage] = useState(1);
  const [activePackage, setActivePackage] = useState<Package | null>(
    packagesList.length > 1 ? packagesList[1] : null
  );

  const [priceInput, setPriceInput] = useState("");
  const [periodInput, setPeriodInput] = useState("");
  const [packIdInput, setPackIdInput] = useState(packagesList[1]._id);
  const [packNameInput, setPackNameInput] = useState(packagesList[1].name);
  const handleClick = (pack: Package) => {
    if (pack.name !== "Free") {
      setActivePackage(pack);
      setPackIdInput(pack._id);
      setPackNameInput(pack.name);

      pack.price.forEach((price: any, index: number) => {
        if (index === activeButton) {
          setPriceInput(price.amount);
          setPeriodInput(price.period);
        }
      });
    }
  };

  useEffect(() => {
    // Run this code once when the component mounts

    activePackage?.price.forEach((price: any, indexx: number) => {
      if (indexx === 1) {
        setPriceInput(price.amount);
        setPeriodInput(price.period);
      }
    });
  }, []); // Empty dependency array ensures this runs only once on mount

  // console.log("USER: " + user);
  return (
    <div className="p-1 rounded-sm">
      <div className="mb-20 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 m-1 gap-1">
        {packagesList.length > 0 &&
          packagesList.map((pack, index: any) => (
            <div
              key={index}
              className={`shadow-md rounded-md p-0 cursor-pointer ${
                activePackage === pack
                  ? "bg-[#F2FFF2] border-[#4DCE7A] border-2"
                  : ""
              }`}
              onClick={() => handleClick(pack)}
            >
              <div
                className="text-lg font-bold rounded-t-md text-white py-2 px-4 mb-4 flex flex-col items-center justify-center"
                style={{
                  backgroundColor:
                    activePackage === pack ? "#4DCE7A" : pack.color,
                }}
              >
                {pack.name}
              </div>

              <div className="p-3">
                <div className="text-gray-600 mb-1">
                  <div className="flex gap-2 text-sm">
                    {pack.description}

                    {daysRemaining > 0 && pack.name === packname ? (
                      <>
                        <div className="p-1 flex-block rounded-full bg-emerald-500">
                          <p className="text-white text-xs">Active</p>
                        </div>
                      </>
                    ) : (
                      <>
                        {pack.name === "Free" && daysRemaining <= 0 && (
                          <div className="p-1 flex-block rounded-full bg-emerald-500">
                            <p className="text-white text-xs">Active</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  {pack.name === "Free" ? (
                    <></>
                  ) : (
                    <>
                      <div className="text-gray-800 font-bold mb-0">
                        <ul className="flex flex-col gap-0 py-0">
                          {pack.price.map((price: any, index: number) => (
                            <li
                              key={index}
                              className={`flex items-center gap-0 ${
                                index !== activeButton ? "hidden" : ""
                              }`}
                            >
                              <p className="p-16-regular">
                                Ksh {price.amount}/ {activeButtonTitle}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>

                <ul className="flex flex-col gap-5 py-9">
                  {pack.features.map((feature: any, index: number) => (
                    <li key={index} className="flex items-center gap-4">
                      <img
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
            </div>
          ))}
      </div>
      {/* Static div at the bottom */}

      <div className="fixed bottom-0 left-0 right-0 bg-[#F2FFF2] h-auto md:h-24 z-10 p-3 shadow-md flex flex-col md:flex-row justify-between items-center">
        {/* Left-aligned buttons */}

        <div className="grid grid-cols-3 lg:grid-cols-5 w-full gap-1 justify-between items-center mb-2 md:mb-0">
          <button
            className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm  ${
              activeButton === 0
                ? "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white p-2 rounded-full"
                : "border border-[#30AF5B] text-[#30AF5B] rounded-full p-2"
            }`}
            onClick={() => handleButtonClick(0, "1 week")}
          >
            1 week
          </button>
          <button
            className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${
              activeButton === 1
                ? "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white p-2 rounded-full"
                : "border border-[#30AF5B] text-[#30AF5B] rounded-full p-2"
            }`}
            onClick={() => handleButtonClick(1, "1 month")}
          >
            1 month
          </button>
          <button
            className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${
              activeButton === 2
                ? "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white p-2 rounded-full"
                : "border border-[#30AF5B] text-[#30AF5B] rounded-full p-2"
            }`}
            onClick={() => handleButtonClick(2, "3 months")}
          >
            3 months
          </button>
          <button
            className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${
              activeButton === 3
                ? "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white p-2 rounded-full"
                : "border border-[#30AF5B] text-[#30AF5B] rounded-full p-2"
            }`}
            onClick={() => handleButtonClick(3, " 6 months")}
          >
            6 months
          </button>
          <button
            className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${
              activeButton === 4
                ? "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white p-2 rounded-full"
                : "border border-[#30AF5B] text-[#30AF5B] rounded-full p-2"
            }`}
            onClick={() => handleButtonClick(4, " 1 year")}
          >
            1 year
          </button>
        </div>

        {/* Right-aligned input field and button */}
        <div className="flex gap-1 justify-center items-center">
          <label
            htmlFor="color"
            className="whitespace-nowrap p-3 font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ksh
          </label>
          <input
            type="text"
            value={priceInput}
            disabled
            className="border p-1 w-[150px] lg:w-[200px] border-gray-300 font-bold rounded-md "
          />
          <SignedIn>
            <Button
              type="submit"
              onClick={() =>
                handlepay(packIdInput, packNameInput, periodInput, priceInput)
              }
              role="link"
              className="w-[100px] rounded-full bg-[#000000] bg-cover"
            >
              Buy Now
            </Button>
          </SignedIn>
          <SignedOut>
            <Button asChild className="rounded-full w-[100px]" size="lg">
              <Link href="/sign-in">Pay Now</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
