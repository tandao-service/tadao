import { IAd } from "@/lib/database/models/ad.model";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { formatKsh } from "@/lib/help";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { createBookmark, deleteBookmark } from "@/lib/actions/bookmark.actions";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LocalSeeOutlinedIcon from "@mui/icons-material/LocalSeeOutlined";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { updatebookmarked } from "@/lib/actions/ad.actions";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
type CardProps = {
  userId: string;
  ad: IAd;
  isAdCreator?: boolean;
};

const VerticalCard = ({ userId, ad, isAdCreator }: CardProps) => {
  const pathname = usePathname();
  const isbookmark = pathname === "/bookmark";
  //alert(pathname);
  const { toast } = useToast();
  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };
  const truncateaddress = (address: string, maxLength: number) => {
    if (address.length > maxLength) {
      return address.substring(0, maxLength) + "...";
    }
    return address;
  };
  const handle = async (id: string) => {
    if (userId) {
      const newBookmark = await createBookmark({
        bookmark: {
          userBId: userId,
          adId: id,
        },
        path: pathname,
      });
      if (newBookmark === "Ad Saved to Bookmark") {
        const bookmarked = (Number(ad.bookmarked ?? "0") + 1).toString();
        const _id = ad._id;
        await updatebookmarked({
          _id,
          bookmarked,
          path: `/ads/${ad._id}`,
        });
        toast({
          title: "Alert",
          description: newBookmark,
          duration: 5000,
          className: "bg-[#30AF5B] text-white",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed!",
          description: newBookmark,
          duration: 5000,
        });
      }
    } else {
      window.location.reload();
    }
  };
  const handledeletebk = async (id: string) => {
    const delBookmark = await deleteBookmark({
      bookmark: {
        userBId: userId,
        adId: id,
      },
      path: pathname,
    });
    if (delBookmark === "Bookmark deleted successfully") {
      const bookmarked = (Number(ad.bookmarked ?? "1") - 1).toString();
      const _id = ad._id;
      await updatebookmarked({
        _id,
        bookmarked,
        path: `/ads/${ad._id}`,
      });
      toast({
        variant: "destructive",
        title: "Deleted!",
        description: delBookmark,
        duration: 5000,
      });
    }
  };
  const router = useRouter();
  // console.log(ad.imageUrls);
  return (
    <div className="group relative flex min-h-[300px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[300px]">
      <div
        // href={`/ads/${ad._id}`}
        onClick={() => router.push(`/ads/${ad._id}`)}
        style={{ backgroundImage: `url(${ad.imageUrls[0]})` }}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500 cursor-pointer"
      />
      {/* IS Ad CREATOR ... */}

      {ad.plan.name !== "Free" && (
        <div
          style={{
            backgroundColor: ad.plan.color,
          }}
          className="absolute top-0 shadow-lg left-0 text-white text-[10px] py-1 px-1 lg:text-xs lg:py-1 lg:px-3 rounded-br-lg rounded-tl-lg"
        >
          <Link href={`/plan`}>
            <div className="flex gap-1 cursor-pointer">{ad.plan.name}</div>
          </Link>
        </div>
      )}
      {ad.organizer.verified &&
        ad.organizer?.verified[0]?.accountverified === true && (
          <div className="absolute bg-emerald-100 top-0 right-0 text-[10px] py-1 px-1 lg:text-xs lg:py-1 lg:px-3 rounded-bl-lg rounded-tr-lg">
            <div className="flex gap-1 cursor-pointer">
              <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
              Verified
            </div>
          </div>
        )}
      {isAdCreator && (
        <div className="absolute right-2 top-10 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <Link href={`/ads/${ad._id}/update`}>
            <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
          <DeleteConfirmation adId={ad._id} imageUrls={ad.imageUrls} />
        </div>
      )}
      <div className="flex min-h-[80px] lg:items-center flex-col p-1">
        <div className="w-full mt-[-10px] flex justify-between absolute top-1/2 left-1/2 transform -translate-x-1/2 p-1 rounded-full">
          <div className="gap-1 cursor-pointer bg-[#000000] bg-opacity-70 text-[10px] lg:text-xs text-white flex rounded-lg p-1 shadow-sm transition-all">
            <LocalSeeOutlinedIcon sx={{ fontSize: 16, cursor: "pointer" }} />
            {ad.imageUrls.length}
          </div>
          {ad.youtube && (
            <div className="gap-1 cursor-pointer bg-[#000000] bg-opacity-70 text-[10px] lg:text-xs text-white flex rounded-lg p-1 shadow-sm transition-all">
              <YouTubeIcon
                sx={{ fontSize: 16, cursor: "pointer" }}
                style={{ color: "red" }}
              />{" "}
              Video
            </div>
          )}
        </div>

        {!isAdCreator && !isbookmark && (
          <div className="w-full flex justify-end  absolute top-2/3 left-1/2 transform -translate-x-1/2 p-1 rounded-full">
            <SignedIn>
              <div
                className="w-8 h-8 p-1 mt-[-20px] shadow-lg flex items-center justify-center rounded-full bg-white text-emerald-500 tooltip tooltip-bottom hover:text-[#2BBF4E] hover:cursor-pointer"
                data-tip="Bookmark"
                onClick={() => handle(ad._id)}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <BookmarkIcon sx={{ fontSize: 16 }} />
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="text-sm"> Save Ad</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in">
                <div
                  className="w-8 h-8 p-1 mt-[-20px] shadow-lg flex items-center justify-center rounded-full bg-white text-emerald-500 tooltip tooltip-bottom hover:text-[#2BBF4E] hover:cursor-pointer"
                  data-tip="Bookmark"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <BookmarkIcon sx={{ fontSize: 16 }} />
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="text-sm"> Save Ad</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </Link>
            </SignedOut>
          </div>
        )}
        {isbookmark && (
          <div className="w-full flex justify-end  absolute top-2/3 left-1/2 transform -translate-x-1/2 p-1 rounded-full">
            <div
              className="w-8 h-8 p-1 mt-[-20px] shadow-lg flex items-center justify-center rounded-full bg-red-100 text-emerald-500 tooltip tooltip-bottom hover:text-[#2BBF4E] hover:cursor-pointer"
              data-tip="Bookmark"
              onClick={() => handledeletebk(ad._id)}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Image
                      src="/assets/icons/delete.svg"
                      alt="edit"
                      width={20}
                      height={20}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="text-sm"> Delete Ad</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
        {isAdCreator ? (
          <div className="flex justify-between items-center w-full p-1">
            <Link href={`/ads/${ad._id}`} className="no-underline">
              <span className="text-emerald-950 text-[12px] lg:text-lg font-bold w-min rounded-full text-green-60">
                {formatKsh(ad.price)}
              </span>
            </Link>
            {ad.adstatus && (
              <div
                className={`flex flex-col text-[8px] lg:text-[10px] p-1 text-white justify-center items-center rounded-full ${
                  ad.adstatus === "Pending"
                    ? "bg-yellow-600"
                    : ad.adstatus === "Failed"
                    ? "bg-red-600 "
                    : "bg-green-600"
                }`}
              >
                {ad.adstatus}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center p-1">
            <Link href={`/ads/${ad._id}`} className="no-underline">
              <span className="text-emerald-950 font-bold text-[12px] lg:text-lg w-min rounded-full text-green-60">
                {formatKsh(ad.price)}
              </span>
            </Link>
          </div>
        )}
        <Link
          href={`/ads/${ad._id}`}
          className="no-underline text-[12px] lg:text-sm"
        >
          <div className="text-gray-500 text-sm hidden lg:inline">
            {truncateTitle(ad.title, 35)}
          </div>
          <div className="text-gray-500 text-[12px] lg:hidden">
            {truncateTitle(ad.title, 20)}
          </div>
          {/* Change 20 to your desired character limit */}
        </Link>
        {ad.calcDistance && (
          <div className="text-[10px] lg:text-xs text-emerald-500">
            {Math.round(ad.calcDistance / 100) / 10} KM Away
          </div>
        )}
        <div className="text-gray-500 text-[12px] hidden lg:inline">
          <LocationOnIcon sx={{ fontSize: 14 }} />
          {truncateaddress(ad.address, 35)}
        </div>
        <div className="text-gray-500 text-[10px] lg:hidden">
          <LocationOnIcon sx={{ fontSize: 14 }} />
          {truncateaddress(ad.address, 25)}
        </div>
        <div className="flex justify-between w-full gap-1 p-1">
          {ad.vehiclecondition && (
            <div className="flex gap-2 text-[10px] lg:text-xs bg-[#ebf2f7] rounded-sm p-1 justify-center border">
              {ad.vehiclecondition}
            </div>
          )}
          {ad.vehicleTransmissions && (
            <div className="flex gap-2 text-[10px] lg:text-xs bg-[#ebf2f7] rounded-sm p-1 justify-center border">
              {ad.vehicleTransmissions}
            </div>
          )}
          {ad.vehicleEngineSizesCC && (
            <div className="flex gap-2 text-[10px] lg:text-xs bg-[#ebf2f7] rounded-sm p-1 justify-center border">
              {ad.vehicleEngineSizesCC}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalCard;
