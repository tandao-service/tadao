import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MenuIcon from "@mui/icons-material/Menu";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useState } from "react";
import NavItems from "./NavItems";
import StyledBrandNameblack from "./StyledBrandNameblack";

type MobileProps = {
  userstatus: string;
  userId: string;
  popup: string;
  user: any;
  handleOpenSell: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenShop: (shopId: any) => void;
  onClose: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
};

const MobileNav = ({
  userstatus,
  userId,
  popup,
  user,
  onClose,
  handleOpenSettings,
  handleOpenPerfomance,
  handleOpenShop,
  handleOpenChat,
  handleOpenPlan,
  handleOpenBook,
  handleOpenAbout,
  handleOpenTerms,
  handleOpenPrivacy,
  handleOpenSafety,
  handleOpenSell,
}: MobileProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleclicklink = () => {
    setIsSheetOpen(false);
  };

  return (
    <nav>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger
          className="align-middle"
          onClick={() => setIsSheetOpen(true)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-slate-700 dark:bg-[#1B2327] dark:text-slate-200 dark:hover:border-orange-500/30 dark:hover:bg-[#222C31] dark:hover:text-orange-300">
            <MenuIcon />
          </div>
        </SheetTrigger>

        <SheetContent className="[&>button]:hidden flex flex-col gap-6 bg-white dark:bg-[#131B1E] dark:text-gray-300">
          <SheetTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <StyledBrandNameblack />
              </div>

              <button
                onClick={handleclicklink}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#2D3236]"
              >
                <CloseOutlinedIcon />
              </button>
            </div>
          </SheetTitle>

          <NavItems
            userstatus={userstatus}
            user={user}
            //userId={userId}
            onClose={onClose}
            handleclicklink={handleclicklink}
            handleOpenSell={handleOpenSell}
            handleOpenBook={handleOpenBook}
            handleOpenPlan={handleOpenPlan}
            handleOpenChat={handleOpenChat}
            handleOpenShop={handleOpenShop}
            handleOpenPerfomance={handleOpenPerfomance}
            handleOpenSettings={handleOpenSettings}
            popup={popup}
          />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;