"use client";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Image from "next/image";
import { SignedIn, SignedOut } from "@clerk/nextjs";
type MobileProps = {
  categoryList: { imageUrl: string; name: string; _id: string }[];
};
export default function Menumobile({ categoryList }: MobileProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleCategory = (category: string) => {
    let newUrl = "";
    if (category) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "category",
        value: category,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["category"],
      });
    }

    if (category === "Vehicle") {
      router.push("/category/" + newUrl + "&subcategory=Car", {
        scroll: false,
      });
    } else {
      router.push("/category/" + newUrl, { scroll: false });
    }
  };
  return (
    <div className="mx-auto mt-10">
      <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 m-1 gap-1">
        <SignedIn>
          <div
            onClick={() => router.push("/ads/create")}
            className="lg:hidden h-[100px] bg-emerald-500 text-white flex flex-col items-center justify-center cursor-pointer rounded-sm p-1 border-0 border-emerald-300 hover:bg-emerald-600 "
          >
            <div className="flex flex-col items-center text-center justify-center">
              <div className="h-12 w-12 rounded-full p-2">
                <AddCircleOutlineOutlinedIcon />
              </div>

              <h2 className="text-lg font-bold">SELL</h2>
            </div>
          </div>
        </SignedIn>

        <SignedOut>
          <div
            onClick={() => router.push("/sign-in")}
            className="lg:hidden h-[100px] bg-emerald-500 text-white flex flex-col items-center justify-center cursor-pointer rounded-sm p-1 border-0 border-emerald-300 hover:bg-emerald-600 "
          >
            <div className="flex flex-col items-center text-center justify-center">
              <div className="h-12 w-12 rounded-full p-2">
                <AddCircleOutlineOutlinedIcon />
              </div>

              <h2 className="text-lg font-bold">SELL</h2>
            </div>
          </div>
        </SignedOut>

        {/*  {categoryList.length > 0 &&
          categoryList.map(
            (category: { imageUrl: string; name: string; _id: string }) => (
              <div
                key={category._id} // Added unique key prop
                onClick={() => handleCategory(category.name)}
                className="h-[100px] bg-white flex flex-col items-center justify-center cursor-pointer rounded-sm p-1 border-0 border-emerald-300 hover:bg-emerald-100 "
              >
                <div className="flex flex-col items-center text-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-white p-2">
                    <Image
                      className="w-full h-full"
                      src={category.imageUrl}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </div>

                  <h2 className="text-xs">{category.name}</h2>
                </div>
              </div>
            )
          )}*/}
      </div>
    </div>
  );
}
