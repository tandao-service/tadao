import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ScrollArea } from "../ui/scroll-area";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import ProgressPopup from "./ProgressPopup";
import SellerProfile from "./SellerProfile";



type MobileProps = {
  user: any;
  userId:string;
  loggedId: string;
  footerRef: any;
};
const ProfileMenu = ({
  user,
  userId,
  loggedId,
  footerRef,
}: MobileProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
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

 
  
  return (
    <div className="relative flex">
      <div className="w-64 p-0">
        <div
          className={`flex flex-col items-center transition-all duration-300 ${
            isSticky ? "fixed top-[70px] z-10" : "relative"
          }`}
        >
          <div className="border  rounded-lg flex justify-center items-center w-full h-full">
                <SellerProfile
                  user={user}
                  loggedId={loggedId}
                  userId={userId}
                />
              </div>
        </div>
      </div>
    
      
    </div>
  );
};

export default ProfileMenu;
