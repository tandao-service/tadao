import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import ProgressPopup from "./ProgressPopup";
interface Subcategory {
  _id: string;
  subcategory: string;
  adCount: number;

}

interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}

type MobileProps = {
  categoryList: Category[];
  subcategoryList: any;
  footerRef: any;
  loans: any;
  hoveredCategory: any;
  handleCategory: (value: string) => void;
  handleHoverCategory: (value: string) => void;
  handleSubCategory: (category: string, subcategory: string) => void;
  handleDrawer: (category: string, subcategory: string) => void;

};
const CategoryMenu = ({
  categoryList,
  subcategoryList,
  footerRef,
  hoveredCategory,
  handleDrawer,
  handleCategory,
  handleSubCategory,
  handleHoverCategory,
  loans,
}: MobileProps) => {
  //const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isOpenP, setIsOpenP] = useState(false);
  const handleOpenP = (query: string) => {
    setIsOpenP(true);
  };

  const handleCloseP = () => {
    setIsOpenP(false);
  };
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const footer = footerRef.current;
      const windowHeight = window.innerHeight;
      const footerTop = footer.getBoundingClientRect().top + window.scrollY;
      if (scrollPosition > 200 && scrollPosition + windowHeight < footerTop) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);




  const searchParams = useSearchParams();
  const { toast } = useToast()

  const handleCategoryy = (query: string) => {
    let newUrl = "";
    if (query) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "category",
        value: query,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["category"],
      });
    }
    setIsOpenP(true);
    router.push("/category/" + newUrl, { scroll: false });
  };
  const handleSubCategoryy = (category: string, subcategory: string) => {
    let newUrl = "";
    if (category && subcategory) {
      newUrl = formUrlQuerymultiple({
        params: "",
        updates: {
          category: category.toString(),
          subcategory: subcategory.toString(),
        },
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["subcategory"],
      });
    }
    setIsOpenP(true);
    router.push("/category/" + newUrl, { scroll: false });
  };
  return (
    <div className="relative flex">
      <div className="w-64 p-0">
        <div
          className={`flex flex-col items-center transition-all duration-300 ${isSticky ? "fixed top-[70px] z-10" : "relative"
            }`}
        >
          <div className="w-64 dark:bg-[#2D3236] bg-white p-1 shadow-lg">
            {/*    <div className="p-1 border-b dark:border-gray-600">
              <h2 className="text-lg font-semibold">Categories</h2>
            </div>*/}
            <ScrollArea ref={listRef} className="h-[450px] w-full">

              {categoryList.map((category: any, index: number) => (
                <div
                  key={index}
                  onClick={() => {
                    if (category.toString().trim() === "Donations" || category.name.toString().trim() === "Buyer Requests" ? (category.adCount + loans.adCount) > 0 : category.adCount > 0) {
                      if (category.toString().trim() === "Donations" || category.name.toString().trim() !== "Buyer Requests") {
                        handleCategory(category.name);
                      }

                    } else {
                      toast({
                        title: "0 Ads",
                        description: (
                          <>
                            No ads in <strong>{category.name}</strong> category
                          </>
                        ),
                        //action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
                      });
                    }
                  }}
                  onMouseEnter={() => handleHoverCategory(category.name)}
                  className={`relative text-black dark:text-[#F1F3F3] flex flex-col items-center justify-center cursor-pointer p-1 border-b dark:border-gray-600 dark:hover:bg-[#131B1E] hover:bg-[#FAE6DA] ${hoveredCategory === category.name
                    ? "bg-[#FAE6DA] dark:bg-[#131B1E]"
                    : "dark:bg-[#2D3236] bg-white"
                    } `}
                >
                  <div className={`flex gap-1 items-center mb-1 h-full w-full`}>
                    <span>
                      <div className="rounded-full dark:bg-[#131B1E] bg-gray-100 p-1">
                        <Image
                          className="w-6 h-6 object-cover"
                          src={category.imageUrl[0]}
                          alt={category.name}
                          width={60}
                          height={60}
                        />
                      </div>
                    </span>
                    <span className="flex-1 text-sm hover:no-underline my-auto">
                      <div className="flex flex-col">
                        <h2
                          className={`text-xs font-bold ${category.name.toString().trim() === "Buyer Requests" ? (category.adCount + loans.adCount) > 0 : category.adCount > 0
                            ? ""
                            : "text-gray-500 dark:text-gray-500"
                            } `}
                        >
                          {category.name}
                        </h2>
                        <p
                          className={`text-xs text-gray-500 dark:text-gray-500`}
                        >
                          {category.name.toString().trim() === "Buyer Requests" ? (category.adCount + loans.adCount) : category.adCount} ads
                        </p>
                      </div>
                    </span>
                    <span
                      className={`text-right my-auto ${category.adCount > 0
                        ? ""
                        : "text-gray-500 dark:text-gray-500"
                        } `}
                    >
                      <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                    </span>
                  </div>

                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
      {hoveredCategory && (
        <div
          className={`w-64 z-10 dark:bg-[#2D3236] bg-white p-1 shadow-lg transition-all duration-300 ${isSticky
            ? "fixed top-[70px] left-[310px]"
            : "absolute top-0 left-64"
            }`}
          onMouseEnter={() => handleHoverCategory(hoveredCategory)}
          onMouseLeave={() => handleHoverCategory('')}
        >
          {/* <div className="p-1 border-b dark:border-gray-600">
            <h2 className="text-lg font-semibold">Subcategories</h2>
          </div> */}
          <ScrollArea className="h-[450px] w-full">
            {subcategoryList
              .filter((cat: any) => cat.category.name === hoveredCategory)
              .map((sub: any, index: number) => (
                <div
                  key={index}
                  className="relative dark:bg-[#2D3236] text-black dark:text-[#F1F3F3] bg-white flex flex-col items-center justify-center cursor-pointer p-1 border-b dark:hover:dark:bg-[#131B1E] hover:bg-[#FAE6DA] border-b dark:border-gray-600"

                  onClick={() => {
                    if (hoveredCategory.toString().trim() === "Donations" || hoveredCategory.toString().trim() === "Buyer Requests" ? (sub.adCount + loans.adCount + 1) > 0 : sub.adCount > 0) {


                      if (hoveredCategory.toString().trim() === "Donations" || hoveredCategory.toString().toString().trim() === "Buyer Requests") {
                        // setWantedcategory(hoveredCategory);
                        // setWantedsubcategory(sub.subcategory);
                        // setShowWantedPopup(true); // Show the popup instead
                        handleDrawer(hoveredCategory, sub.subcategory)
                      } else {
                        handleSubCategory(hoveredCategory, sub.subcategory);
                      }
                    } else {
                      toast({
                        title: "0 Ads",
                        description: (
                          <>
                            No ads in <strong>{sub.subcategory}</strong> subcategory
                          </>
                        ),
                        //action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
                      });
                    }
                  }}
                >
                  <div className="flex gap-1 items-center mb-1 w-full">
                    <span>
                      <div className="rounded-full dark:bg-[#131B1E] bg-gray-100 p-2">
                        <Image
                          className="h-6 w-6 object-cover"
                          src={sub.imageUrl[0] || ""}
                          alt={sub.subcategory}
                          width={60}
                          height={60}
                        />
                      </div>
                    </span>
                    <span className="flex-1 text-sm hover:no-underline my-auto">
                      <div className="flex flex-col">
                        <h2
                          className={`text-xs font-bold ${sub.subcategory?.trim().toLowerCase() === "Loan Request".toLowerCase() ? (sub.adCount + loans.adCount) > 0 : sub.adCount > 0
                            ? ""
                            : "text-gray-500 dark:text-gray-500"
                            } `}
                        >
                          {sub.subcategory}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {sub.subcategory?.trim().toLowerCase() === "Loan Request".toLowerCase() ? (sub.adCount + loans.adCount) : sub.adCount} ads
                        </p>
                      </div>
                    </span>
                  </div>
                  {/* <div
                    className={`absolute h-full w-full ${
                      sub.adCount > 0
                        ? ""
                        : "bg-white bg-opacity-50 dark:bg-[#2D3236] dark:bg-opacity-40"
                    } `}
                  ></div>*/}
                </div>
              ))}
          </ScrollArea>
        </div>
      )}
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
};

export default CategoryMenu;
