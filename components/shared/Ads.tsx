"use client";
import { formatKsh } from "@/lib/help";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LocalSeeOutlinedIcon from "@mui/icons-material/LocalSeeOutlined";
import { useEffect, useState } from "react";
//import { Carousel } from "react-responsive-carousel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CallIcon from "@mui/icons-material/Call";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
//import "react-responsive-carousel/lib/styles/carousel.min.css";
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import AssistantPhotoOutlinedIcon from '@mui/icons-material/AssistantPhotoOutlined';
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { IAd } from "@/lib/database/models/ad.model";
import Image from "next/image";
import EmblaCarousel from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import FloatingChatIcon from "./FloatingChatIcon";
import ChatWindow from "./ChatWindow";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import YouTubePlayer from "./YouTubePlayer";
import Streetmap from "./Streetmap";
import { format, isToday, isYesterday } from "date-fns";
//import SellerProfile from "./SellerProfile";
import { IUser } from "@/lib/database/models/user.model";
import { CreateUserParams } from "@/types";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import SettingsOverscanOutlinedIcon from "@mui/icons-material/SettingsOverscanOutlined";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";
//import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

import SellOutlinedIcon from "@mui/icons-material/SellOutlined";

import Head from "next/head";
import ChatButton from "./ChatButton";
import ShareAd from "./ShareAd";
import { useToast } from "../ui/use-toast";

import { updateabused, updateview } from "@/lib/actions/dynamicAd.actions";
import DescriptionComponent from "./DescriptionComponent";
import StreetmapOfice from "./StreetmapOffice";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import ProgressPopup from "./ProgressPopup";
import { useRouter } from "next/navigation";
import { ReportAbuse } from "./ReportAbuseProps";
import { ReportUnavailable } from "./ReportUnavailable";
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import ThreeDRotationOutlinedIcon from '@mui/icons-material/ThreeDRotationOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import MapWithFeatures from "./MapWithFeatures";
import TikTokEmbed from "./TikTokEmbed";
import VirtualTour from "./VirtualTour";
import CopyShareAdLink from "./CopyShareAdLink";
import { Button } from "../ui/button";
import MappingAds from "./MappingAds";
import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import { Icon } from "@iconify/react";
import threeDotsMove from "@iconify-icons/svg-spinners/3-dots-move"; // Correct import
import { RequestFinancing } from "./RequestFinancing";
import Bidding from "./Bidding";
import SellerProfileCard from "./SellerProfileCard";
import { useAuth } from "@/app/hooks/useAuth";

// Correct import
type CardProps = {
  ad: any;
  user: any;
  userId: string;
  userImage: string;
  userName: string;
  onClose: () => void;
  handleSubCategory: (category: string, subcategory: string) => void;
  handleOpenReview: (value: any) => void;
  handleOpenShop: (value: any) => void;
  handlePay: (id: string) => void;
  handleOpenPlan: () => void;
  handleOpenSell: (category?: string, subcategory?: string) => void;
  handleOpenSafety: () => void;

};
function checkPlatform(url: string) {
  const youtubeRegex = /(?:youtube\.com|youtu\.be)/;
  const tiktokRegex = /tiktok\.com/;

  if (youtubeRegex.test(url)) {
    return "YouTube";
  } else if (tiktokRegex.test(url)) {
    return "TikTok";
  } else {
    return "Unknown Platform";
  }
}
export default function Ads({ ad, user, userId, userImage, userName, onClose, handlePay, handleOpenSafety, handleOpenSell, handleSubCategory, handleOpenReview, handleOpenPlan, handleOpenShop, }: CardProps) {
  const [videoAdId, setvideoAdId] = React.useState<string | null>(null);
  const [tiktokvideoAdId, setTiktokvideoAdId] = React.useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const hideAddVideo = userId === ad.organizer._id;
  const [showGuide, setShowGuide] = useState(false);
  const [showphone, setshowphone] = useState(false);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const handleShowPhoneClick = (e: any) => {
    setshowphone(true);
    window.location.href = `tel:${ad.data.phone}`;
  };

  const handleImageClick = (index: number) => {
    if (!api) {
      return;
    }

    api?.scrollTo(index);

    if (autoplayEnabled) {
      plugin.current.stop();
    }
  };

  const [showPopup, setShowPopup] = useState(false);
  // Handler to toggle the popup
  const togglePopup = () => {
    setShowPopup(true);
  };
  const closePopup = () => {
    setShowPopup(false);
  };
  const [isChatOpen, setChatOpen] = useState(false);
  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };

  const [api, setApi] = React.useState<CarouselApi>();
  const [api2, setApi2] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [totalSlides, setTotalSlides] = useState(ad.data.imageUrls.length); // Set total number of slides
  const router = useRouter();
  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    plugin.current.stop();
    // Subscribe to the "select" event to update the current index when the user manually selects a slide
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
      api2?.scrollTo(api.selectedScrollSnap() - 1);
      setSelectedIndex(api.selectedScrollSnap());
    });

    sessionStorage.setItem("id", ad._id);
    if (ad.title) {
      sessionStorage.setItem("title", ad.data.title);
    }
    if (ad.description) {
      sessionStorage.setItem("description", ad.data.description);
    }


  }, [
    api,
    ad._id,
    ad.data.description,
    ad.data.title,
    ad.data.youtube,
    api2,
  ]);
  useEffect(() => {
    const updateviewed = async () => {
      const views = (Number(ad.views || 0) + 1).toString();
      const _id = ad._id;

      await updateview({
        _id,
        views,
        path: `/ads/${ad._id}`,
      });
    };
    updateviewed();
  }, []);

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const [autoplayEnabled, setAutoplayEnabled] = useState(false); // Initially, autoplay is enabled

  const handlePlay = () => {
    if (autoplayEnabled) {
      plugin.current.stop();
      setAutoplayEnabled(false);
    } else {
      plugin.current.play();
      setAutoplayEnabled(true);
    }
  };

  let formattedCreatedAt = "";
  try {
    const createdAtDate = new Date(ad.createdAt); // Convert seconds to milliseconds

    // Get today's date
    const today = new Date();

    // Check if the message was sent today
    if (isToday(createdAtDate)) {
      formattedCreatedAt = "Today " + format(createdAtDate, "HH:mm"); // Set as "Today"
    } else if (isYesterday(createdAtDate)) {
      // Check if the message was sent yesterday
      formattedCreatedAt = "Yesterday " + format(createdAtDate, "HH:mm"); // Set as "Yesterday"
    } else {
      // Format the createdAt date with day, month, and year
      formattedCreatedAt = format(createdAtDate, "dd-MM-yyyy"); // Format as 'day/month/year'
    }

    // Append hours and minutes if the message is not from today or yesterday
    if (!isToday(createdAtDate) && !isYesterday(createdAtDate)) {
      formattedCreatedAt += " " + format(createdAtDate, "HH:mm"); // Append hours and minutes
    }
  } catch {
    // Handle error when formatting date
  }
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenAAv, setIsPopupOpenAv] = useState(false);
  const [abuseDescription, setAbuseDescription] = useState("");
  const handleOpenPopupAv = () => {
    setIsPopupOpenAv(true);
  };

  const handleClosePopupAv = () => {
    setIsPopupOpenAv(false);
    // Clear the textarea on close
  };
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setAbuseDescription(""); // Clear the textarea on close
  };
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAbuseDescription(event.target.value);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingsmall, setIsLoadingsmall] = useState(true);
  const [isLoadingpopup, setIsLoadingpopup] = useState(true);
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const handleDirectionClick = (latitude: any, longitude: any) => {
    // Perform navigation or other actions when direction button is clicked
    // Example: Open a new tab with Google Maps directions
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      "_blank"
    );
  };

  const [inputMode, setInputMode] = useState<'Images' | 'Video' | 'Virtual'>('Images');
  const [isOpenP, setIsOpenP] = useState(false);
  const [isPopupOpenLoan, setIsPopupOpenLoan] = useState(false);
  const handleOpenPopupLoan = () => {
    setIsPopupOpenLoan(true);
  };

  const handleClosePopupLoan = () => {
    setIsPopupOpenLoan(false);
  };

  const handleCloseP = () => {
    setIsOpenP(false);
  };
  return (
    <>
      <div className="text-sm p-0 hidden lg:inline">
        <div className="flex">
          <div className="mt-4 shadow border hover:text-orange-600 dark:hover:bg-[#3E454A] dark:bg-[#2D3236] dark:hover:text-gray-300 dark:text-gray-400 bg-white py-1 px-2 rounded-full mr-2">
            <div
              onClick={() => {
                //setIsOpenP(true);
                //router.push("/");
                onClose();
              }}
            >
              <div className="flex items-center gap-2 cursor-pointer ">
                <p className="text-xs lg:text-sm"> All Ads</p><EastOutlinedIcon sx={{ fontSize: 14 }} />
              </div>
            </div>
          </div>
          <div className="mt-4 shadow border hover:text-orange-600 dark:hover:bg-[#3E454A] dark:bg-[#2D3236] dark:hover:text-gray-300 dark:text-gray-400 bg-white py-1 px-2 rounded-full mr-2">
            <div className="flex items-center">
              {ad && (
                <div
                  onClick={() => {
                    handleSubCategory(ad.data.category, '');

                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >

                  <p className="text-xs lg:text-sm">{ad.data.category}</p><EastOutlinedIcon sx={{ fontSize: 14 }} />
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 border hover:text-orange-600 dark:hover:bg-[#3E454A] dark:bg-[#2D3236] shadow dark:hover:text-gray-300 bg-white dark:text-gray-400 py-1 px-2 rounded-full mr-2">
            <div className="flex items-center">
              {ad && (
                <div
                  onClick={() => {
                    handleSubCategory(ad.data.category, ad.data.subcategory);

                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >

                  <p className="text-xs lg:text-sm">{ad.data.subcategory}</p><EastOutlinedIcon sx={{ fontSize: 14 }} />
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 shadow border text-gray-700 dark:bg-[#2D3236] dark:text-gray-300 bg-white py-1 px-2 rounded-full">
            <div className="flex items-center">

              {ad && <p className="text-xs lg:text-sm">{ad.data.title}</p>}
            </div>
          </div>
        </div>
      </div>
      <div className="lg:m-1 space-y-0 lg:flex lg:space-x-0 gap-2">
        <div
          className="mt-1 lg:mt-2 shadow bg-white border-t-50 border-orange-700 relative lg:flex-1 dark:bg-[#2D3236] dark:text-gray-300 rounded-xl lg:p-1">
          {ad.plan.name !== "Free" && (
            <div
              style={{
                backgroundColor: ad.plan.color,
              }}
              className="hidden lg:inline rounded-tr-xl absolute shadow-lg z-10 top-0 right-0 text-white text-[10px] py-1 px-3"
            >
              <div
                onClick={() => {
                  handleOpenPlan()
                }}
              >
                <div className="flex gap-1 cursor-pointer">
                  {ad.plan.name}
                </div>
              </div>
            </div>
          )}
          <div
            className={`rounded-0 lg:p-2 flex flex-col bg-[#131B1E] lg:rounded-xl`}
          >
            {/* Images Section */}
            <div className={`${inputMode === "Images" ? "block" : "hidden"}`}>
              <div className={`relative`}>
                <Carousel
                  setApi={setApi}
                  plugins={[plugin.current as any]}
                  className="w-full"
                >
                  <CarouselContent>
                    {ad.data.imageUrls.length > 0 ? (<>
                      {ad.data.imageUrls.map((image: string, index: number) => (
                        <CarouselItem key={index}>
                          <div className="relative w-full">
                            {isLoading && (

                              <div className="absolute inset-0 flex justify-center items-center bg-[#000000] bg-opacity-50">
                                <Icon icon={threeDotsMove} className="w-6 h-6 text-gray-500" />
                              </div>
                            )}
                            <Zoom>
                              <Image
                                src={image}
                                alt={`Image ${index + 1}`}
                                width={800} // Adjust the width as needed
                                height={500} // Adjust the height as needed
                                className={`bg-[#000000] h-[420px] lg:h-[380px] object-cover cursor-pointer ${isLoading ? "opacity-0" : "opacity-100"
                                  } transition-opacity duration-300`}
                                onLoadingComplete={() => setIsLoading(false)}
                                placeholder="empty" // Optional: you can use "empty" if you want a placeholder before loading
                              />
                            </Zoom>
                          </div>
                        </CarouselItem>
                      ))}
                    </>) : (<>
                      <CarouselItem>
                        <Image
                          src={"/fallback.jpg"}
                          alt={"Ad image"}
                          width={800} // Adjust the width as needed
                          height={500} // Adjust the height as needed
                          layout="fill"
                          className={`object-cover h-[420px] lg:h-[380px] cursor-pointer ${isLoading ? "opacity-0" : "opacity-100"
                            } transition-opacity duration-300`}
                          onLoadingComplete={() => setIsLoading(false)}
                          placeholder="empty"
                        /> </CarouselItem>
                    </>)}
                  </CarouselContent>
                  <CarouselPrevious className="h-[50px] w-[50px] ml-20 font-bold border-0 text-white bg-white bg-opacity-50 p-2" />
                  <CarouselNext className="h-[50px] w-[50px] mr-20 font-bold border-0 bg-white bg-opacity-50 text-white p-2" />
                </Carousel>
                <div className="flex gap-1 absolute bottom-0 right-0 items-center text-white text-[10px] lg:text-xs m-1 p-0 focus:outline-none">
                  <div className="flex pr-2 pl-2 h-10 rounded-sm items-center bg-black bg-opacity-50">
                    Slide {current} of {count}
                  </div>
                  <div
                    className="p-1 cursor-pointer rounded-sm shadow"
                    onClick={togglePopup}
                  >
                    <Image
                      src="/assets/icons/expand.png"
                      alt="logo"
                      className="w-8 ml-5 hover:cursor-pointer"
                      width={36}
                      height={36}
                    />
                  </div>
                </div>
                <div className="flex gap-1 absolute bottom-0 left-0 text-white text-xs m-1 p-0 focus:outline-none">
                  <div
                    className="p-1 cursor-pointer rounded-sm"
                    onClick={handlePlay}
                  >
                    {autoplayEnabled ? (
                      <Image
                        src="/assets/icons/pause.png"
                        alt="logo"
                        className="w-8 ml-5 hover:cursor-pointer"
                        width={36}
                        height={36}
                      />
                    ) : (
                      <Image
                        src="/assets/icons/play.png"
                        alt="logo"
                        className="w-8 ml-5 hover:cursor-pointer"
                        width={36}
                        height={36}
                      />
                    )}
                  </div>
                </div>

                {ad.organizer.verified &&
                  ad.organizer.verified[0].accountverified === true && (
                    <div className="hidden lg:inline absolute bg-green-100 top-0 right-0 text-green-700 dark:text-gray-900 top-0 right-0 text-xs py-1 px-3 rounded-bl-lg rounded-tr-lg">
                      <div className="flex gap-1 cursor-pointer">
                        <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
                        Verified
                      </div>
                    </div>
                  )}
              </div>
              <div className="flex space-x-1">
                <Carousel
                  setApi={setApi2}
                  opts={{
                    align: "start",
                  }}
                  className="w-full ml-2 mr-2 mt-1"
                >
                  <CarouselContent>
                    {ad.data.imageUrls.map((image: string, index: number) => (
                      <CarouselItem
                        key={index}
                        className="rounded-lg basis-1/3 lg:basis-1/4 pl-5 lg:pr-0"
                      >
                        <div
                          style={{
                            border:
                              selectedIndex === index
                                ? "3px solid black"
                                : "3px solid transparent",
                          }}
                          className="p-0 w-full rounded-lg"
                        >
                          <span key={index} onClick={() => handleImageClick(index)}>
                            <div className="relative">
                              {isLoadingsmall && (
                                <div className="absolute inset-0 flex justify-center items-center bg-[#000000] bg-opacity-50">
                                  <Icon icon={threeDotsMove} className="w-6 h-6 text-gray-500" />
                                </div>
                              )}

                              <Image
                                src={image}
                                alt={`Image ${index + 1}`}
                                width={244} // Adjust width to match the `w-36` Tailwind class
                                height={196} // Adjust height to match the `h-24` Tailwind class
                                className={`h-[70px] rounded-lg bg-opacity-40 object-cover cursor-pointer border-2 border-transparent hover:border-orange-500 ${isLoadingsmall ? "opacity-0" : "opacity-100"
                                  } transition-opacity duration-300`}
                                onLoadingComplete={() => setIsLoadingsmall(false)}
                                placeholder="empty" // Optional: you can use "empty" if you want a placeholder before loading
                              />
                            </div>
                          </span>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <CarouselPrevious className="md:h-10 md:w-10 lg:h-10 lg:w-10 ml-10 font-bold text-white border-2 bg-black bg-opacity-80 p-2" />
                  <CarouselNext className="md:h-10 md:w-10 lg:h-10 lg:w-10 mr-10 font-bold bg-black border-2 bg-opacity-80 text-white p-2" />
                </Carousel>
              </div>
            </div>
          </div>
          {/* Popup for displaying all images */}
          {showPopup && (
            <div className="bg-black fixed top-0 left-0 w-full min-h-screen flex justify-center items-center z-50">
              <div className="bg-black p-4 w-full flex flex-col items-center justify-center z-50">
                <button
                  onClick={closePopup}
                  className="z-10 fixed p-1 top-50 left-50 rounded-full hover:cursor-pointer m-1 p-2 absolute top-3 right-3 focus:outline-none"
                >
                  <CloseIcon className="text-white dark:hover:text-gray-300 m-0" />
                </button>
                <div className="relative w-full justify-center">
                  <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                      {ad.data.imageUrls.map((image: string, index: number) => (
                        <CarouselItem key={index}>
                          <div className="relative h-[500px] w-full">
                            {isLoadingpopup && (
                              <div className="absolute inset-0 flex justify-center items-center bg-[#000000] bg-opacity-50">
                                <Icon icon={threeDotsMove} className="w-6 h-6 text-gray-500" />
                              </div>
                            )}
                            <Zoom>
                              <Image
                                src={image}
                                alt={`Image ${index + 1}`}
                                layout="fill" // Ensures the image scales to the parent container
                                className={`object-contain ${isLoadingpopup ? "opacity-0" : "opacity-100"
                                  } transition-opacity duration-300`}
                                onLoadingComplete={() =>
                                  setIsLoadingpopup(false)
                                }
                                placeholder="empty" // Optional: you can use "empty" if you want a placeholder before loading
                              />
                            </Zoom>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="h-[50px] w-[50px] ml-20 font-bold border-0 text-white bg-white bg-opacity-50 p-2" />
                    <CarouselNext className="h-[50px] w-[50px] mr-20 font-bold border-0 bg-white bg-opacity-50 text-white p-2" />
                  </Carousel>
                  <div className="fixed bottom-5 left-5 p-1 text-center text-white text-sm text-muted-foreground z-10 mt">
                    Slide {current} of {totalSlides}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Ad details */}
          <div className="p-3 lg:rounded-b-xl dark:bg-[#2D3236] dark:text-gray-300 bg-white">
            <div className="lg:hidden flex justify-end mb-2 items-center w-full">
              <div className="flex flex-col justify-center">
                <div className="flex gap-1 items-center justify-center">
                  <div className="flex items-center">
                    {ad.data.negotiable === "yes" && (
                      <div className="flex gap-1 text-[10px] text-green-700 font-bold bg-white rounded-lg p-1 justify-center border">
                        Negotiable
                        <CheckCircleIcon sx={{ fontSize: 14 }} />
                      </div>
                    )}
                    {ad.data.negotiable === "no" && (
                      <div className="flex gap-1 text-[10px] text-black font-bold bg-white rounded-lg p-1 justify-center border">
                        Fixed Price
                      </div>
                    )}
                  </div>
                  {ad.data.contact && ad.data.contact === "contact" && (
                    <div>
                      {currentUser ? (<button
                        className="bg-orange-100 hover:bg-[#000000] text-orange-700 text-xs border border-orange-700 p-2 rounded-lg"
                        onClick={handleShowPhoneClick}
                      >
                        <CallIcon sx={{ marginRight: "5px" }} />
                        Ask the Price?
                      </button>) : (<div
                        onClick={() => {
                          setIsOpenP(true);
                          router.push("/auth");
                        }}
                      >
                        <button className="bg-orange-100 cursor-pointer hover:bg-[#000000] text-orange-700 text-xs border border-orange-700 p-2 rounded-lg">
                          <CallIcon sx={{ marginRight: "5px" }} />
                          Ask the Price?
                        </button>
                      </div>)}


                    </div>
                  )}
                  <div className="flex gap-1 items-center no-underline">
                    {ad.data.contact && ad.data.contact === "contact" ? (
                      <p className="text-lg lg:text-xl font-bold p-1 dark:text-orange-500 text-black">
                        Contact for price
                      </p>
                    ) : (
                      <>
                        {ad.data.price > 0 && (<span className="flex text-lg lg:text-xl font-bold rounded-full p-1 dark:text-black text-black">
                          Ksh {ad.data.price.toLocaleString()}
                        </span>)}

                      </>
                    )}{" "}
                    {ad.data.unit && ad.data.contact === "specify" && (
                      <div className="text-xs dark:text-white">
                        {ad.data.unit}
                      </div>
                    )}{" "}
                    {ad.data.per && (
                      <div className="text-xs dark:text-white">
                        {ad.data.per}
                      </div>
                    )}
                    {ad.data.period && (
                      <div className="text-xs dark:text-white">
                        {ad.data.period}
                      </div>
                    )}
                    {ad.data["Maximum Amount"] && ad.data["Minimum Amount"] && (<div className="flex flex-col dark:text-black text-black font-bold">
                      <p>Min: Ksh {Number(ad.data["Minimum Amount"]).toLocaleString()} </p>
                      <p>Max: Ksh {Number(ad.data["Maximum Amount"]).toLocaleString()}</p>
                    </div>)}
                  </div>
                </div>
                {ad.data.bulkprice?.length > 0 && (
                  <>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1" className="border-0">
                        <AccordionTrigger>
                          <div className="flex dark:text-black gap-1 items-center no-underline">
                            <SellOutlinedIcon sx={{ fontSize: 16 }} />
                            <p className="text-sm">Bulk Price Options</p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div>
                            <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2 space-y-0">
                              {ad.data.bulkprice.map(
                                (item: any, index: number) => (
                                  <li
                                    key={index}
                                    className="flex text-xs items-center justify-between p-4 border dark:border-gray-600 text-black dark:text-gray-300 rounded-md shadow-sm"
                                  >
                                    <div className="flex flex-col gap-2">
                                      <div className="flex gap-1">
                                        <div className="text-gray-500">
                                          Quantity:
                                        </div>
                                        <div className="font-bold">
                                          {item.quantity}
                                        </div>
                                      </div>
                                      <div className="flex gap-1">
                                        <div>Price:</div>
                                        <div className="font-bold">
                                          Ksh {item.pricePerPiece.toFixed(2)}{" "}
                                          {item.unit === "piece"
                                            ? "/piece"
                                            : item.unit === "sqm"
                                              ? "/sqm"
                                              : "/sqft"}
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </>
                )}
              </div>
            </div>
            <div className="flex mb-2 items-center w-full">
              <p className="text-lg lg:text-2xl font-bold dark:text-gray-300 text-black">
                {ad.data.title}
              </p>
            </div>
            <div className="flex mb-2 items-center justify-between space-x-2">
              <div className="flex gap-2">
                <p className="dark:text-gray-400 text-gray-700 text-[10px] lg:text-sm">
                  <AccessTimeIcon sx={{ fontSize: 20 }} />
                  Posted {formattedCreatedAt}
                </p>
                <p className="dark:text-gray-400 text-gray-700 text-[10px] lg:text-sm">
                  <LocationOnIcon sx={{ fontSize: 20 }} /> {ad.data.region}
                  {" - "}
                  {ad.data.area}
                </p>
              </div>
              <p className="dark:text-gray-400 text-gray-700 text-[10px] lg:text-sm">
                <VisibilityIcon sx={{ fontSize: 20 }} /> {ad.views} Views
              </p>
            </div>

            {ad.data["youtube-link"] && (
              <>
                {checkPlatform(ad.data["youtube-link"]) === "TikTok" ? (<>
                  {/*<TikTokEmbed videoUrl={ad.data["youtube-link"]} />*/}
                </>) : (
                  <>
                    <div className="border-t dark:border-gray-600 border-gray-300 mt-4 mb-4"></div>
                    <p className="mt-5 font-bold dark:text-gray-400 text-black">
                      Ad Video
                    </p>
                    <YouTubePlayer videoUrl={ad.data["youtube-link"]} />
                  </>
                )}
              </>
            )}


            <div className="border-t dark:border-gray-600 border-gray-300 mt-4 mb-4"></div>
            <div className="grid grid-cols-3 lg:grid-cols-5 w-full gap-1 mt-4">
              {Object.entries(ad.data as Record<string, any>).map(
                ([key, value]) => (
                  <>
                    {key !== "title" &&
                      key !== "description" &&
                      key !== "area" &&
                      key !== "category" &&
                      key !== "subcategory" &&
                      key !== "phone" &&
                      key !== "price" &&
                      key !== "negotiable" &&
                      key !== "imageUrls" &&
                      key !== "features" &&
                      key !== "facilities" &&
                      key !== "amenities" &&
                      key !== "period" &&
                      key !== "per" &&
                      key !== "duration" &&
                      key !== "bulkprice" &&
                      key !== "unit" &&
                      key !== "contact" &&
                      key !== "gps" &&
                      key !== "propertyarea" &&
                      key !== "virtualTourLink" &&
                      key !== "delivery" &&
                      key !== "biddingEnabled" &&
                      key !== "biddingEndsAt" &&
                      key !== "bidIncrement" &&
                      key !== "bids" &&
                      key !== "youtube-link" && (
                        <>
                          <div key={key} className="mb-2 md:flex-row">
                            <div className="dark:text-gray-300 text-black text-sm">
                              {key === 'Maximum Amount' || key === 'Minimum Amount' ? Number(value).toLocaleString() : value}
                            </div>
                            <div className="dark:text-gray-500 text-gray-600 text-xs">
                              {capitalizeFirstLetter(key.replace("-", " "))}
                            </div>
                          </div>
                        </>
                      )}
                  </>
                )
              )}
            </div>

            {ad.data.facilities && ad.data.facilities.length > 0 && (
              <>
                <div className="border-t dark:border-gray-600 border-gray-300 mt-4 mb-4"></div>
                <p className="mt-5 font-bold dark:text-gray-400 text-black">
                  Facilities
                </p>
                <div className="grid grid-cols-3 lg:grid-cols-5 w-full gap-1 mt-1">
                  {ad.data.facilities.map((facility: any) => (
                    <>
                      <div className="flex flex-col items-center h-10 gap-2 text-[10px] lg:text-xs dark:bg-[#131B1E] bg-[#ebf2f7] rounded-xl p-1 justify-center border">
                        {facility}
                      </div>
                    </>
                  ))}
                </div>
              </>
            )}
            {ad.data.amenities && ad.data.amenities.length > 0 && (
              <>
                <div className="border-t dark:border-gray-600 border-gray-300 mt-4 mb-4"></div>
                <p className="mt-5 font-bold dark:text-gray-400 text-black">
                  Amenities
                </p>
                <div className="grid grid-cols-3 lg:grid-cols-5 w-full gap-1 mt-1">
                  {ad.data.amenities.map((amenity: any) => (
                    <>
                      <div className="flex flex-col items-center h-10 gap-2 text-[10px] lg:text-xs dark:bg-[#131B1E] bg-[#ebf2f7] rounded-xl p-1 justify-center border">
                        {amenity}
                      </div>
                    </>
                  ))}
                </div>
              </>
            )}
            {ad.data.features && ad.data.features.length > 0 && (
              <>
                <div className="border-t dark:border-gray-600 border-gray-300 mt-4 mb-4"></div>
                <p className="mt-5 font-bold dark:text-gray-400 text-black">
                  Key Features
                </p>
                <div className="grid grid-cols-3 lg:grid-cols-5 w-full gap-1 mt-1">
                  {ad.data.features.map((feature: any) => (
                    <>
                      <div className="flex flex-col items-center h-10 gap-2 text-[10px] lg:text-xs dark:bg-[#131B1E] bg-[#ebf2f7] rounded-xl p-1 justify-center border">
                        {feature}
                      </div>
                    </>
                  ))}
                </div>
              </>
            )}
            <div className="border-t dark:border-gray-600 border-gray-300 mt-4 mb-4"></div>
            <p className="mt-5 font-bold dark:text-gray-400 text-black">
              Description
            </p>
            {/* <p className="my-1 text-text-orange-500">{ad.data.description}</p>*/}
            <DescriptionComponent description={ad.data.description} />





            {ad.data.delivery?.length > 0 && (
              <>
                <div className="border-t dark:border-gray-600 border-gray-300 mt-4 mb-4"></div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" className="border-0">
                    <AccordionTrigger>
                      <div className="mt-5 flex text-black dark:text-gray-400 gap-1 items-center font-bold no-underline">
                        <LocalShippingOutlinedIcon />
                        <div className="font-bold">Delivery Options</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div>
                        <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2 space-y-0">
                          {ad.data.delivery.map((item: any, index: number) => (
                            <li
                              key={index}
                              className="flex text-xs items-center justify-between p-4 border dark:border-gray-600 text-black dark:text-gray-300  rounded-md shadow-sm"
                            >
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-1">
                                  <div className="text-gray-500">
                                    Delivery Name:
                                  </div>
                                  <div className="font-bold">{item.name}</div>
                                </div>
                                <div className="flex gap-1">
                                  <div className="text-gray-500">Region:</div>
                                  <div className="font-bold">
                                    {item.region.join(", ")}
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex gap-1">
                                    <div className="text-gray-500">
                                      Days From:
                                    </div>
                                    <div className="font-bold">
                                      {item.daysFrom}
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <div className="text-gray-500">
                                      Days To:
                                    </div>
                                    <div className="font-bold">
                                      {item.daysTo}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-1">
                                  <div className="text-gray-500">
                                    Charge Fee:
                                  </div>
                                  <div className="font-bold">
                                    {item.chargeFee}
                                  </div>
                                </div>

                                {item.costFrom && (
                                  <>
                                    {" "}
                                    <div className="flex justify-between items-center">
                                      <div className="flex gap-1">
                                        <div className="text-gray-500">
                                          Cost From:
                                        </div>
                                        <div className="font-bold">
                                          Ksh{" "}
                                          {Number(
                                            item.costFrom
                                          ).toLocaleString()}
                                        </div>
                                      </div>
                                      <div className="flex gap-1">
                                        <div className="text-gray-500">
                                          Cost To:
                                        </div>
                                        <div className="font-bold">
                                          Ksh{" "}
                                          {Number(item.costTo).toLocaleString()}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            )}
            {/* 
            {ad.organizer.businessname?.length > 0 && (
              <>
                <div className="border-t dark:border-gray-600 border-gray-300 mt-4 mb-4"></div>

                <div className="flex border-0 w-full gap-5 p-1 bg-white dark:bg-[#2D3236] dark:text-gray-100 rounded-lg">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full border-0"
                  >
                    <AccordionItem value="item-2" className="border-0">
                      <AccordionTrigger className="border-0">
                        <div className="mt-0 flex text-orange-500 dark:text-gray-400 gap-1 items-center font-bold no-underline">
                          <HelpOutlineOutlinedIcon />
                          <div className="font-bold">About Seller</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="border-0">
                        <div className="p-0 flex grid grid-cols-1 rounded-[20px] m-0 dark:bg-[#2D3236] bg-gray-100">
                         
                          <div className="flex flex-col">
                            <SellerProfileCard
                              userId={userId}
                              ad={ad}
                              fee={user?.fee ?? 500}
                              userImage={userImage}
                              userName={userName}
                              handleOpenReview={handleOpenReview}
                              handleOpenShop={handleOpenShop}
                              handlePay={handlePay} />
                          </div>
                          <div className="m-3 p-1">
                            {ad.organizer?.businessname && (
                              <div className="mb-2 md:flex-row">
                                <div className="text-gray-500 dark:text-gray-500 text-xs">
                                  Business Name
                                </div>
                                <div>{ad.organizer?.businessname}</div>
                              </div>
                            )}
                            {ad.organizer?.aboutbusiness && (
                              <div className="mb-2 md:flex-row">
                                <div className="text-gray-500 dark:text-gray-500 text-xs">
                                  About Business
                                </div>
                                <div>{ad.organizer?.aboutbusiness}</div>
                              </div>
                            )}
                            {ad.organizer?.businessaddress && (
                              <div className="mb-2 md:flex-row">
                                <div className="text-gray-500 dark:text-gray-500 text-xs">
                                  Business Address
                                </div>
                                <div>{ad.organizer?.businessaddress}</div>
                              </div>
                            )}
                            {ad.organizer?.latitude &&
                              ad.organizer?.latitude && (
                                <>
                                  <div className="p-0 text-l rounded-lg overflow-hidden">
                                    <div className="">
                                      <p className="text-gray-500 dark:text-gray-500 text-xs">
                                        Location
                                      </p>
                                      <p className="mb-1 lg:text-xs text-[10px]">
                                        <LocationOnIcon sx={{ fontSize: 16 }} />{" "}
                                        Physical Location
                                      </p>
                                      <StreetmapOfice
                                        id={userId}
                                        name={ad.organizer?.businessname}
                                        address={ad.organizer?.businessaddress}
                                        imageUrl={
                                          ad.organizer?.imageUrl ??
                                          ad.organizer?.photo
                                        }
                                        lat={ad.organizer?.latitude}
                                        lng={ad.organizer?.longitude}
                                      />
                                      <div className="justify-between flex w-full mb-5">
                                        <button
                                          onClick={(e) =>
                                            handleDirectionClick(
                                              ad.organizer?.latitude,
                                              ad.organizer?.longitude
                                            )
                                          }
                                          className="hover:bg-orange-700 bg-[#000000] text-white text-xs mt-2 p-2 rounded-lg shadow"
                                        >
                                          <AssistantDirectionIcon
                                            sx={{ marginRight: "5px" }}
                                          />
                                          Get Direction
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}

                            {ad.organizer?.businesshours &&
                              ad.organizer?.businesshours?.length > 0 && (
                                <>
                                  <div className="flex flex-col gap-5 mb-0 md:flex-row">
                                    <div>
                                      <>
                                        <div className="flex flex-col gap-5 mb-0 md:flex-row">
                                          <div>
                                            <label>
                                              <p className="text-gray-500 dark:text-gray-500 text-xs">
                                                Open Time:
                                              </p>
                                            </label>
                                            <div className="flex flex-col gap-5 mb-5 md:flex-row text-[10px] lg:text-xs">
                                              <select
                                                className="dark:bg-[#131B1E] dark:text-gray-300 text-gray-800  bg-gray-100 p-1  rounded-sm"
                                                value={
                                                  ad.organizer
                                                    ?.businesshours?.[0]
                                                    .openHour ?? ""
                                                }
                                              >
                                                {Array.from(
                                                  { length: 24 },
                                                  (_, i) => i
                                                ).map((hour) => (
                                                  <option
                                                    key={hour}
                                                    value={hour
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  >
                                                    {hour
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  </option>
                                                ))}
                                              </select>
                                              <select
                                                className="dark:bg-[#131B1E] dark:text-gray-300 text-gray-800  bg-gray-100 p-1 rounded-sm"
                                                value={
                                                  ad.organizer
                                                    ?.businesshours?.[0]
                                                    .openMinute ?? ""
                                                }
                                              >
                                                {Array.from(
                                                  { length: 60 },
                                                  (_, i) => i
                                                ).map((minute) => (
                                                  <option
                                                    key={minute}
                                                    value={minute
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  >
                                                    {minute
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                          <div>
                                            <label>
                                              {" "}
                                              <p className="text-gray-500 dark:text-gray-500 text-xs">
                                                Close Time:
                                              </p>
                                            </label>
                                            <div className="flex flex-col gap-5 mb-0 md:flex-row text-[10px] lg:text-xs">
                                              <select
                                                className="dark:bg-[#131B1E] dark:text-gray-300 text-gray-800  bg-gray-100 p-1 rounded-sm"
                                                value={
                                                  ad.organizer
                                                    ?.businesshours?.[0]
                                                    .closeHour ?? ""
                                                }
                                              >
                                                {Array.from(
                                                  { length: 24 },
                                                  (_, i) => i
                                                ).map((hour) => (
                                                  <option
                                                    key={hour}
                                                    value={hour
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  >
                                                    {hour
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  </option>
                                                ))}
                                              </select>
                                              <select
                                                className="dark:bg-[#131B1E] dark:text-gray-300 text-gray-800  bg-gray-100 p-1 rounded-sm"
                                                value={
                                                  ad.organizer
                                                    ?.businesshours?.[0]
                                                    .closeMinute ?? ""
                                                }
                                              >
                                                {Array.from(
                                                  { length: 60 },
                                                  (_, i) => i
                                                ).map((minute) => (
                                                  <option
                                                    key={minute}
                                                    value={minute
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  >
                                                    {minute
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    </div>
                                  </div>
                                </>
                              )}

                            {ad.organizer?.businesshours &&
                              ad.organizer?.businessworkingdays?.length > 0 && (
                                <>
                                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                                    <div>
                                      <label>
                                        <p className="text-gray-500 dark:text-gray-500 text-xs">
                                          Working Days:
                                        </p>
                                      </label>

                                      <>
                                        <div className="flex text-[10px] gap-1 w-full items-center lg:text-xs">
                                          <input
                                            type="checkbox"
                                            checked={ad.organizer?.businessworkingdays?.includes(
                                              "Sunday"
                                            )}
                                          />

                                          <label>Sunday</label>
                                        </div>
                                        <div className="flex text-[10px] gap-1 w-full items-center lg:text-xs">
                                          <input
                                            type="checkbox"
                                            checked={ad.organizer?.businessworkingdays?.includes(
                                              "Monday"
                                            )}
                                          />
                                          <label>Monday</label>
                                        </div>
                                        <div className="flex text-[10px] gap-1 w-full items-center lg:text-xs">
                                          <input
                                            type="checkbox"
                                            checked={ad.organizer?.businessworkingdays?.includes(
                                              "Tuesday"
                                            )}
                                          />
                                          <label>Tuesday</label>
                                        </div>
                                        <div className="flex text-[10px] gap-1 w-full items-center lg:text-xs">
                                          <input
                                            type="checkbox"
                                            checked={ad.organizer?.businessworkingdays?.includes(
                                              "Wednesday"
                                            )}
                                          />
                                          <label>Wednesday</label>
                                        </div>
                                        <div className="flex text-[10px] gap-1 w-full items-center lg:text-xs">
                                          <input
                                            type="checkbox"
                                            checked={ad.organizer?.businessworkingdays?.includes(
                                              "Thursday"
                                            )}
                                          />
                                          <label>Thursday</label>
                                        </div>
                                        <div className="flex text-[10px] gap-1 w-full items-center lg:text-xs">
                                          <input
                                            type="checkbox"
                                            checked={ad.organizer?.businessworkingdays?.includes(
                                              "Friday"
                                            )}
                                          />
                                          <label>Friday</label>
                                        </div>
                                        <div className="flex text-[10px] gap-1 w-full items-center lg:text-xs">
                                          <input
                                            type="checkbox"
                                            checked={ad.organizer?.businessworkingdays?.includes(
                                              "Saturday"
                                            )}
                                          />
                                          <label>Saturday</label>
                                        </div>
                                      </>
                                    </div>
                                  </div>
                                </>
                              )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </>
            )}*/}
            {ad.data?.bidIncrement}
            {ad.data?.biddingEnabled && (<>
              <Bidding
                ad={ad}
                userId={userId}
                user={ad?.organizer}
              /></>)}

            {(ad.data && !ad.data.biddingEnabled && (ad.data.category === 'Property' || ad.data.category === 'Vehicle')) && (
              <>
                <div className="flex w-full items-center">
                  {currentUser ? (
                    <button
                      onClick={handleOpenPopupLoan}
                      className="flex rounded-sm w-full py-3 px-2 text-lg text-white bg-orange-500 hover:bg-orange-700 justify-center items-center gap-1"
                    >
                      <SellOutlinedIcon />
                      Request Financing for This Property
                    </button>
                  ) : (<button
                    onClick={() => {
                      setIsOpenP(true);
                      router.push("/auth");
                    }}
                    className="flex text-white justify-center rounded-sm w-full py-3 px-2 text-lg bg-orange-500 hover:bg-orange-700 items-center"
                  >
                    <SellOutlinedIcon />
                    Request Financing for This Property
                  </button>)}


                </div>
              </>
            )}

            <div className="flex justify-between w-full items-center">
              <ReportUnavailable userId={userId} ad={ad} isOpen={isPopupOpenAAv} onClose={handleClosePopupAv} userName={userName} userImage={userImage} />
              <ReportAbuse userId={userId} ad={ad} isOpen={isPopupOpen} onClose={handleClosePopup} userName={userName} userImage={userImage} />
              <RequestFinancing userId={userId} ad={ad} isOpen={isPopupOpenLoan} onClose={handleClosePopupLoan} userName={userName} userImage={userImage} />
              <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div
          className={`p-1 lg:w-[32%]`}>


          <div className="hidden lg:inline">


            <div className="dark:bg-[#2D3236] shadow border-t-8 border-black dark:text-gray-300 bg-white p-5 rounded-lg overflow-hidden flex flex-col items-center">

              <div className="flex gap-1 items-center no-underline">
                {ad.data.contact && ad.data.contact === "contact" ? (
                  <p className="flex text-2xl font-bold dark:text-black text-black">
                    Contact for price
                  </p>
                ) : (
                  <>
                    {ad.data.price > 0 && (<span className="flex gap-1 text-2xl font-bold rounded-full px-4 py-1 dark:text-black text-black">
                      Ksh {ad.data.price.toLocaleString()}
                    </span>)}

                  </>
                )}
                {ad.data.unit && ad.data.contact === "specify" && (
                  <div className="text-xs dark:text-white">{ad.data.unit}</div>
                )}
                {ad.data.per && (
                  <div className="text-xs dark:text-white">{ad.data.per}</div>
                )}
                {ad.data.period && (
                  <div className="text-xs dark:text-white">
                    {ad.data.period}
                  </div>
                )}
                {ad.data["Maximum Amount"] && ad.data["Minimum Amount"] && (<div className="flex flex-col dark:text-black text-black font-bold">
                  <p>Min: Ksh {Number(ad.data["Minimum Amount"]).toLocaleString()} </p>
                  <p>Max: Ksh {Number(ad.data["Maximum Amount"]).toLocaleString()}</p>
                </div>)}
              </div>
              {ad.data.contact && ad.data.contact === "contact" && (
                <div>
                  {currentUser ? (
                    <button
                      className="bg-orange-100 hover:bg-[#000000] text-orange-700 text-xs border border-orange-700 p-2 rounded-lg"
                      onClick={handleShowPhoneClick}
                    >
                      <CallIcon sx={{ marginRight: "5px" }} />
                      Ask the Price?
                    </button>
                  ) : (<div
                    onClick={() => {
                      setIsOpenP(true);
                      router.push("/auth");
                    }}
                  >
                    <button className="bg-orange-100 hover:bg-[#000000] text-orange-700 text-xs border border-orange-700 p-2 rounded-lg">
                      <CallIcon sx={{ marginRight: "5px" }} />
                      Ask the Price?
                    </button>
                  </div>)}


                </div>
              )}

              <div className="flex items-center">
                {ad.data.negotiable === "yes" && (
                  <div className="flex gap-2 text-xs text-green-700 bg-white rounded-lg p-1 justify-center border">
                    Negotiable
                    <CheckCircleIcon sx={{ fontSize: 16 }} />
                  </div>
                )}
                {ad.data.negotiable === "no" && (
                  <div className="flex gap-1 text-[10px] text-black font-bold bg-white rounded-lg p-1 justify-center border">
                    Fixed Price
                  </div>
                )}
              </div>

              {ad.data.bulkprice?.length > 0 && (
                <>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1" className="border-0">
                      <AccordionTrigger>
                        <div className="flex dark:text-black gap-1 items-center no-underline">
                          <SellOutlinedIcon sx={{ fontSize: 16 }} />
                          <p className="text-sm">Bulk Price Options</p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div>
                          <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2 space-y-0">
                            {ad.data.bulkprice.map(
                              (item: any, index: number) => (
                                <li
                                  key={index}
                                  className="flex text-xs items-center justify-between p-4 border dark:border-gray-600 text-black dark:text-gray-300 rounded-md shadow-sm"
                                >
                                  <div className="flex flex-col gap-2">
                                    <div className="flex gap-1">
                                      <div className="text-gray-500">
                                        Quantity:
                                      </div>
                                      <div className="font-bold">
                                        {item.quantity}
                                      </div>
                                    </div>
                                    <div className="flex gap-1">
                                      <div className="text-gray-500">
                                        Price / Piece:
                                      </div>
                                      <div className="font-bold">
                                        Ksh{" "}
                                        {item.pricePerPiece.toLocaleString()}
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </>
              )}
            </div>

            <span className="hidden m-0">
              <div className="justify-between flex w-full gap-1">
                {currentUser ? (<>
                  <button
                    className="hover:bg-orange-700 bg-[#000000] text-white text-xs mt-2 p-2 rounded-lg shadow"
                    onClick={handleShowPhoneClick}
                  >
                    <CallIcon sx={{ marginRight: "5px" }} />
                    {showphone ? <>{ad.data.phone}</> : <> Call</>}
                  </button>
                  <ChatButton
                    ad={ad}
                    userId={userId}
                    userImage={userImage}
                    userName={userName}
                  />
                </>) : (<><div
                  onClick={() => {
                    setIsOpenP(true);
                    router.push("/auth");
                  }}
                >
                  <button className="hover:bg-orange-700 bg-[#000000] cursor-pointer text-white text-xs mt-2 p-2 rounded-lg shadow">
                    <CallIcon sx={{ marginRight: "5px" }} />
                    Call
                  </button>
                </div>
                  <div
                    onClick={() => {
                      setIsOpenP(true);
                      router.push("/auth");
                    }}
                  >
                    <button className="hover:bg-orange-700 bg-[#000000] cursor-pointer text-white text-xs mt-2 p-2 rounded-lg shadow">
                      <ChatBubbleOutlineOutlinedIcon
                        sx={{ marginRight: "5px" }}
                      />
                      Message
                    </button>
                  </div>
                </>)}



                {ad.organizer.whatsapp && (
                  <>
                    {currentUser ? (
                      <a href={`https://wa.me/${ad.organizer.whatsapp}/`}>
                        <button className="hover:bg-orange-700 bg-[#000000] text-white text-xs mt-2 p-2 rounded-lg shadow">
                          <WhatsAppIcon sx={{ marginRight: "5px" }} />
                          WhatsApp
                        </button>
                      </a>
                    ) : (<div
                      onClick={() => {
                        setIsOpenP(true);
                        router.push("/auth");
                      }}
                    >
                      <button className="hover:bg-orange-700 bg-[#000000] cursor-pointer text-white text-xs mt-2 p-2 rounded-lg shadow">
                        <WhatsAppIcon sx={{ marginRight: "5px" }} />
                        WhatsApp
                      </button>
                    </div>)}

                  </>
                )}
              </div>
            </span>
          </div>


          <div className="hidden lg:inline">
            <div className="mt-3">
              <div className="flex flex-col">
                <SellerProfileCard
                  userId={userId}
                  ad={ad}
                  fee={user?.fee ?? 500}
                  userImage={userImage}
                  userName={userName}
                  handleOpenReview={handleOpenReview}
                  handleOpenShop={handleOpenShop}
                  handlePay={handlePay}
                  titleId={"Ad"} />
              </div>
            </div>

          </div>


          <div className="mt-3 shadow border dark:bg-[#2D3236] dark:text-gray-300  bg-white p-5 text-sm rounded-lg overflow-hidden">
            <div className="flex justify-between">
              {currentUser ? (<>
                <Button onClick={handleOpenPopupAv} variant="outline" className="flex text-blue-600 items-center gap-1">
                  <AssistantPhotoOutlinedIcon sx={{ fontSize: 14 }} />
                  Ad Unavailable?
                </Button>
                <Button onClick={handleOpenPopup} variant="outline" className="flex text-red-600 items-center gap-1">
                  <AssistantPhotoOutlinedIcon sx={{ fontSize: 14 }} />
                  Report Abuse
                </Button>
              </>) : (<>
                <Button onClick={() => {
                  setIsOpenP(true);
                  router.push("/auth");
                }}
                  variant="outline" className="flex text-blue-600 items-center gap-1">
                  <AssistantPhotoOutlinedIcon sx={{ fontSize: 14 }} />
                  Ad Unavailable?
                </Button>
                <Button onClick={() => {

                  router.push("/auth");
                }} variant="outline" className="flex text-red-600 items-center gap-1">
                  <AssistantPhotoOutlinedIcon sx={{ fontSize: 14 }} />
                  Report Abuse
                </Button>
              </>)}


            </div>
          </div>


          <div className="mt-3 border shadow dark:bg-[#2D3236] dark:text-gray-300  bg-white p-5 text-sm rounded-lg overflow-hidden">
            <div className="font-bold text-lg text-center">Safety tips</div>

            <ol>
              <li>
                <div className="text-sm">
                  <p className="font-bold flex gap-2 text-sm">
                    <CheckCircleIcon sx={{ fontSize: 14 }} />
                    Research the Seller
                  </p>
                  <p>
                    Before contacting a seller, research their profile and
                    reviews if available. Be cautious of sellers with little to
                    no history on the platform.
                  </p>
                </div>
              </li>

              <li>
                <div className="mt-2 gap-2 text-sm">
                  <p className="font-bold flex gap-2 text-sm">
                    <CheckCircleIcon sx={{ fontSize: 14 }} /> Inspect the
                    Vehicle
                  </p>
                  <p>
                    Always inspect the vehicle in person before making a
                    purchase. Ensure that the vehicle is in the condition
                    described in the listing.
                  </p>
                </div>
              </li>

              <li>
                <div className="gap-2 mt-2 text-sm">
                  <p className="font-bold flex gap-2 text-sm">
                    <CheckCircleIcon sx={{ fontSize: 14 }} /> Meet in Safe
                    Locations
                  </p>
                  <p>
                    Arrange to meet the seller in a public place. Avoid secluded
                    areas and always choose a location where you feel safe.
                  </p>
                </div>
              </li>

              <li>
                <div className="mt-2 transition-colors font-bold text-orange-600 hover:text-orange-500 hover:cursor-pointer">
                  <div
                    onClick={() => {
                      handleOpenSafety();
                      // router.push("/safety");
                    }}
                    className="cursor-pointer hover:text-orange-500 "
                  >
                    Read more....
                  </div>
                </div>
              </li>
            </ol>
          </div>


          <div className="mt-3 border shadow dark:bg-[#2D3236] dark:text-gray-300  bg-white p-5 text-sm rounded-lg overflow-hidden">
            <div className="flex justify-between">

              {currentUser ? (
                <Button onClick={() => {

                  handleOpenSell(ad.data.category, ad.data.subcategory);
                  // router.push("/ads/create");

                }} variant="default" className="flex w-full items-center gap-2">
                  <SellOutlinedIcon sx={{ fontSize: 16 }} />
                  Post Ad like this?
                </Button>
              ) : (
                <Button onClick={() => {

                  router.push("/auth");
                }} variant="default" className="flex w-full items-center gap-2">
                  <SellOutlinedIcon sx={{ fontSize: 16 }} />
                  Post Ad like this?
                </Button>
              )}


            </div>
          </div>

        </div>
      </div >

    </>
  );
}
