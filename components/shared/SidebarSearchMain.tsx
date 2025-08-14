import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

type SidebarProps = {
  category: string;
  categoryList?: any[];
  subcategory?: string;
  handleFilter: (value: any) => void;
};

const SidebarSearchMain = ({
  category,
  categoryList = [],
  subcategory,
  handleFilter,
}: SidebarProps) => {
  const [query, setQuery] = useState(subcategory || "");
  const [isOpen, setIsOpen] = useState(false);

  const handleQuery = (index: number, queryValue: string) => {
    handleFilter({
      category: category.toString(),
      subcategory: queryValue.toString(),
    });
    setQuery(queryValue);
  };

  const selectedCategory = categoryList?.find(
    (cat) => cat?.category?.name === category
  );

  const totalAdCount = categoryList?.reduce((sum, item) => {
    if (item?.category?.name === category) {
      return sum + (item.adCount || 0);
    }
    return sum;
  }, 0) || 0;

  const categoryImageUrl =
    selectedCategory?.category?.imageUrl?.[0] || "/placeholder.jpg";

  const filteredList =
    categoryList?.filter((cat) => cat?.category?.name === category) || [];

  // Scroll control hook
  function useScrollButtons(deps: any[] = []) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showScrollUp, setShowScrollUp] = useState(false);
    const [showScrollDown, setShowScrollDown] = useState(true);

    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setShowScrollUp(scrollTop > 0);
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
      setShowScrollDown(!atBottom);
    };

    const scrollToTop = () => {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const scrollToBottom = () => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    };

    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => el.removeEventListener("scroll", handleScroll);
    }, deps);

    return {
      scrollRef,
      showScrollUp,
      showScrollDown,
      scrollToTop,
      scrollToBottom,
    };
  }

  const categoryScroll = useScrollButtons();

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full p-0 dark:bg-[#2D3236] bg-white rounded-lg">
        {/* Category Header */}
        <div className="flex flex-col p-1 text-sm font-bold rounded-t-lg w-full">
          <div className="flex w-full justify-between p-1 text-lg gap-1 items-center mt-1 mb-1 border-b border-gray-300 dark:border-gray-600">
            {selectedCategory && (
              <div className="flex gap-1 items-center">
                <div className="rounded-full dark:bg-[#131B1E] bg-white p-1">
                  <Image
                    className="h-7 w-8 object-cover"
                    src={categoryImageUrl}
                    alt={selectedCategory?.category?.name || "category"}
                    width={60}
                    height={60}
                  />
                </div>
                {selectedCategory?.category?.name || ""}
              </div>
            )}
            <div className="flex gap-1 items-center">
              <div className="text-sm dark:text-gray-500 text-gray-700">
                {totalAdCount} ads
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="w-full h-full relative">
          <style jsx>{`
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-none {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>

          {categoryScroll.showScrollUp && (
            <button
              onClick={categoryScroll.scrollToTop}
              className="absolute top-1 rounded-full left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-gradient-to-l from-orange-400 to-orange-500 text-white shadow-lg hover:from-orange-500 hover:to-orange-400"
            >
              ↑ Top
            </button>
          )}

          {categoryScroll.showScrollDown && (
            <button
              onClick={categoryScroll.scrollToBottom}
              className="absolute bottom-1 rounded-full left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-gradient-to-l from-orange-400 to-orange-500 text-white shadow-lg hover:from-orange-500 hover:to-orange-400"
            >
              ↓ Bottom
            </button>
          )}

          <div
            ref={categoryScroll.scrollRef}
            className="h-[350px] w-full overflow-y-auto scrollbar-none"
            style={{ scrollBehavior: "smooth" }}
          >
            {filteredList.map((sub: any, index: number) => (
              <div
                key={index}
                onClick={() => handleQuery(index, sub.subcategory)}
                className={`border-b rounded-sm dark:border-gray-600 flex items-center w-full justify-between p-0 mb-0 text-sm cursor-pointer dark:hover:bg-[#131B1E] dark:hover:text-white hover:bg-gray-100 hover:text-black ${query === sub.subcategory
                  ? "text-orange-500 hover:text-orange-500"
                  : "dark:bg-[#2D3236] bg-white"
                  }`}
              >
                <div className="flex w-full gap-1 items-center p-2">
                  <Image
                    className="h-6 w-7 object-cover"
                    src={sub.imageUrl?.[0] || "/placeholder.jpg"}
                    alt={sub.subcategory || "subcategory"}
                    width={60}
                    height={60}
                  />
                  <div className="flex text-sm flex-col">
                    {sub.subcategory}
                    <div
                      className={`flex text-xs gap-1 ${query === sub.subcategory
                        ? "dark:text-gray-300"
                        : "dark:text-gray-500 text-gray-500"
                        }`}
                    >
                      {sub.adCount} <div>ads</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarSearchMain;
