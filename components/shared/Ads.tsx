"use client";
import { formatKsh } from "@/lib/help";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useEffect, useState } from "react";
//import { Carousel } from "react-responsive-carousel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CallIcon from "@mui/icons-material/Call";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
//import "react-responsive-carousel/lib/styles/carousel.min.css";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import Link from "next/link";
import { IAd } from "@/lib/database/models/ad.model";
import Image from "next/image";
import EmblaCarousel from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import FloatingChatIcon from "./FloatingChatIcon";
import ChatWindow from "./ChatWindow";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import YouTubePlayer from "./YouTubePlayer ";
import Streetmap from "./Streetmap";
import { format, isToday, isYesterday } from "date-fns";
import Ratings from "./ratings";
//import SellerProfile from "./SellerProfile";
import { IUser } from "@/lib/database/models/user.model";
import { CreateUserParams } from "@/types";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import SettingsOverscanOutlinedIcon from "@mui/icons-material/SettingsOverscanOutlined";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import { updateabused, updateview } from "@/lib/actions/ad.actions";
import CircularProgress from "@mui/material/CircularProgress";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import SellerProfile from "./SellerProfile";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Head from "next/head";
import ChatButton from "./ChatButton ";
import ShareAd from "./ShareAd";
import { useToast } from "../ui/use-toast";
import SellerProfileCard from "./SellerProfileCard";
type CardProps = {
  ad: IAd;
  userId: string;
  userImage: string;
  userName: string;
};
export default function Ads({ ad, userId, userImage, userName }: CardProps) {
  const [videoAdId, setvideoAdId] = React.useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const hideAddVideo = userId === ad.organizer._id;
  const [showphone, setshowphone] = useState(false);
  const { toast } = useToast();
  const handleShowPhoneClick = (e: any) => {
    setshowphone(true);
    window.location.href = `tel:${ad.phone}`;
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
    setShowPopup(!showPopup);
  };

  const [isChatOpen, setChatOpen] = useState(false);
  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };

  const [api, setApi] = React.useState<CarouselApi>();
  const [api2, setApi2] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [totalSlides, setTotalSlides] = useState(ad.imageUrls.length); // Set total number of slides

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
      sessionStorage.setItem("title", ad.title);
    }
    if (ad.description) {
      sessionStorage.setItem("description", ad.description);
    }
    const youtubeRegex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    // Function to check if it's a YouTube URL and extract the video ID
    function extractYouTubeVideoId(url: string) {
      const match = url.match(youtubeRegex);
      if (match && match[1]) {
        return match[1]; // Return the video ID
      } else {
        return null; // Not a YouTube URL or invalid URL
      }
    }
    if (ad.youtube) {
      const videoId = extractYouTubeVideoId(ad.youtube);
      if (videoId) {
        setvideoAdId(videoId);
        // console.log("YouTube Video ID:", videoId);
      } else {
        setvideoAdId(ad.youtube);
        //  console.log("Not a valid YouTube URL.");
      }
    }
  }, [api, ad._id, ad.description, ad.title, ad.youtube, api2, setvideoAdId]);
  useEffect(() => {
    const updateviewed = async () => {
      const views = (Number(ad.views) + 1).toString();
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

  const handleDirectionClick = () => {
    // Perform navigation or other actions when direction button is clicked
    // Example: Open a new tab with Google Maps directions
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${ad.latitude},${ad.longitude}`,
      "_blank"
    );
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
  const [abuseDescription, setAbuseDescription] = useState("");

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
  const handleSubmitReport = async () => {
    // Logic to handle report submission
    // For example, send data to the admin via an API call
    if (abuseDescription.trim()) {
      // Logic to handle report submission, e.g., send the description to the admin
      const read = "1";
      const imageUrl = "";

      // Define the query to check if a similar message already exists
      const q = query(
        collection(db, "messages"),
        where("text", "==", abuseDescription + " AD REPORTED:" + ad._id),
        where("uid", "==", userId),
        where("recipientUid", "==", "65d4a2ffec4c43cdc488ce0d")
      );

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Check if any matching document exists
      if (querySnapshot.empty) {
        // No matching document, proceed with adding the new message
        await addDoc(collection(db, "messages"), {
          text: abuseDescription + " AD REPORTED:" + ad._id,
          name: userName,
          avatar: userImage,
          createdAt: serverTimestamp(),
          uid: userId,
          recipientUid: "65d4a2ffec4c43cdc488ce0d",
          imageUrl,
          read,
        });
        const abused = (Number(ad.abused ?? "0") + 1).toString();
        const _id = ad._id;
        await updateabused({
          _id,
          abused,
          path: `/ads/${ad._id}`,
        });
        console.log("Message submitted successfully.");
        toast({
          title: "Alert",
          description: "Message submitted successfully.",
          duration: 5000,
          className: "bg-[#30AF5B] text-white",
        });
      } else {
        console.log("Message already exists. Skipping submission.");
        toast({
          variant: "destructive",
          title: "Failed!",
          description: "Message already exists. Skipping submission.",
          duration: 5000,
        });
        // Handle case where the message already exists
      }

      // Reset and close the popup after submission
      handleClosePopup();
    } else {
      //   alert("Please enter a description of the abuse.");
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "Please enter a description of the abuse.",
        duration: 5000,
      });
    }
  };
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingsmall, setIsLoadingsmall] = useState(true);
  const [isLoadingpopup, setIsLoadingpopup] = useState(true);
  return (
    <>
      <div className="lg:m-1 space-y-0 lg:flex lg:space-x-5">
        <div className="lg:flex-1 border-t-8 border-emerald-700 lg:bg-white rounded-lg">
          {/* Carousel */}
          <div className="relative">
            <Carousel
              setApi={setApi}
              plugins={[plugin.current as any]}
              className="w-full"
            >
              <CarouselContent>
                {ad.imageUrls.map((image: string, index: number) => (
                  <CarouselItem key={index}>
                    <div className="relative">
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#000000] bg-opacity-50">
                          {/* Spinner or loading animation */}
                          <CircularProgress sx={{ color: "white" }} />
                        </div>
                      )}
                      <Zoom>
                        <Image
                          src={image}
                          alt={`Image ${index + 1}`}
                          width={800} // Adjust the width as needed
                          height={500} // Adjust the height as needed
                          className={`bg-[#000000] h-[400px] lg:h-[450px] object-cover cursor-pointer ${
                            isLoading ? "opacity-0" : "opacity-100"
                          } transition-opacity duration-300`}
                          onLoadingComplete={() => setIsLoading(false)}
                          placeholder="empty" // Optional: you can use "empty" if you want a placeholder before loading
                        />
                      </Zoom>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="md:h-10 md:w-10 lg:h-20 lg:w-20 ml-20 font-bold border-0 text-white bg-black bg-opacity-50 p-2 text-3xl" />
              <CarouselNext className="md:h-10 md:w-10 lg:h-20 lg:w-20 mr-20 font-bold border-0 bg-black bg-opacity-50 text-white p-2 text-3xl" />
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
            {ad.plan.name !== "Free" && (
              <div
                style={{
                  backgroundColor: ad.plan.color,
                }}
                className="hidden lg:inline absolute shadow-lg top-0 left-0 text-white text-xs py-1 px-3 rounded-br-lg"
              >
                <Link href={`/plan`}>
                  <div className="flex gap-1 cursor-pointer">
                    {ad.plan.name}
                  </div>
                </Link>
              </div>
            )}
            {ad.organizer.verified &&
              ad.organizer.verified[0].accountverified === true && (
                <div className="hidden lg:inline absolute bg-emerald-100 top-0 right-0 text-xs py-1 px-3 rounded-bl-lg">
                  <div className="flex gap-1 cursor-pointer">
                    {" "}
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
                {ad.imageUrls.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className="rounded-lg basis-1/3 lg:basis-1/6 pl-5 lg:pr-0"
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
                            <div className="absolute rounded-lg inset-0 flex items-center justify-center bg-[#000000] bg-opacity-50">
                              {/* Spinner or loading animation */}
                              <CircularProgress
                                sx={{ color: "white" }}
                                size={30}
                              />
                            </div>
                          )}

                          <Image
                            src={image}
                            alt={`Image ${index + 1}`}
                            width={244} // Adjust width to match the `w-36` Tailwind class
                            height={196} // Adjust height to match the `h-24` Tailwind class
                            className={`h-[100px] rounded-lg bg-opacity-40 object-cover cursor-pointer border-2 border-transparent hover:border-emerald-500 ${
                              isLoadingsmall ? "opacity-0" : "opacity-100"
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
          {/* Popup for displaying all images */}
          {showPopup && (
            <div className="bg-black fixed top-0 left-0 w-full h-screen flex justify-center items-center z-50">
              <div className="bg-black p-4 w-full flex flex-col items-center justify-center z-50">
                <button
                  onClick={togglePopup}
                  className="bg-opacity-70 rounded-full m-1 p-2 bg-black absolute top-3 right-3 focus:outline-none"
                >
                  <CloseIcon className="text-white m-0" />
                </button>
                <div className="relative flex flex-row flex-wrap justify-center">
                  <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                      {ad.imageUrls.map((image: string, index: number) => (
                        <CarouselItem
                          key={index}
                          className="relative flex flex-row flex-wrap items-center justify-center"
                        >
                          <div className="relative">
                            {isLoadingpopup && (
                              <div className="absolute inset-0 flex items-center justify-center bg-[#000000] bg-opacity-50">
                                {/* Spinner or loading animation */}
                                <CircularProgress sx={{ color: "white" }} />
                              </div>
                            )}
                            <Zoom>
                              <Image
                                src={image}
                                alt={`Image ${index + 1}`}
                                width={900} // Max width of the image
                                height={200} // Height of the image
                                style={{ maxWidth: "100%", marginLeft: "0%" }}
                                className={`object-cover ${
                                  isLoadingpopup ? "opacity-0" : "opacity-100"
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
                    <CarouselPrevious className="md:h-10 md:w-10 lg:h-20 lg:w-20 ml-20 font-bold border-0 text-white bg-white bg-opacity-40 p-2" />
                    <CarouselNext className="md:h-10 md:w-10 lg:h-20 lg:w-20 mr-20 font-bold border-0 bg-white bg-opacity-40 text-white p-2" />
                  </Carousel>
                  <div className="p-1 text-center text-white text-sm text-muted-foreground z-10 mt">
                    Slide {current} of {totalSlides}
                  </div>
                </div>
                {/* Close button with CloseIcon */}
              </div>
            </div>
          )}

          {/* Ad details */}
          <div className="m-5">
            <div className="lg:hidden flex justify-end mb-2 items-center w-full">
              <div className="flex gap-1 items-center justify-center">
                <div className="flex items-center">
                  {ad.negotiable && (
                    <div className="flex gap-1 text-[10px] text-emerald-700 font-bold bg-white rounded-lg p-1 justify-center border">
                      Negotiable
                      <CheckCircleIcon sx={{ fontSize: 14 }} />
                    </div>
                  )}
                </div>
                <span className="text-lg lg:text-xl font-bold w-min rounded-full p-1 text-emerald-700">
                  {formatKsh(ad.price)}
                </span>
              </div>
            </div>
            <div className="flex mb-2 items-center w-full">
              <p className="text-lg lg:text-2xl font-bold text-emerald-950">
                {ad.title}
              </p>
            </div>
            <div className="flex mb-2 items-center justify-between space-x-2">
              <div className="flex gap-2">
                <p className="text-gray-700 text-[10px] lg:text-sm">
                  <AccessTimeIcon sx={{ fontSize: 20 }} />
                  Posted {formattedCreatedAt}
                </p>
                <p className="text-gray-700 text-[10px] lg:text-sm">
                  <LocationOnIcon sx={{ fontSize: 20 }} /> {ad.address}
                </p>
              </div>
              <p className="text-gray-700 text-[10px] lg:text-sm">
                <VisibilityIcon sx={{ fontSize: 20 }} /> {ad.views} Views
              </p>
            </div>

            {videoAdId && (
              <>
                <div className="divider"></div>
                <p className="mt-5 font-bold">Video</p>
                <div className="mt-1">
                  <div>
                    <YouTubePlayer videoId={videoAdId} />
                  </div>
                </div>
              </>
            )}
            <div className="divider"></div>
            <div className="grid grid-cols-3 lg:grid-cols-5 w-full gap-1 mt-4">
              {ad.make && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">{ad.make}</div>
                  <div className="text-gray-600 text-xs">MAKE</div>
                </div>
              )}
              {ad.vehiclemodel && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehiclemodel}
                  </div>
                  <div className="text-gray-600 text-xs">MODEL</div>
                </div>
              )}
              {ad.vehicleyear && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehicleyear}
                  </div>
                  <div className="text-gray-600 text-xs">YEAR</div>
                </div>
              )}
              {ad.vehiclemileage && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehiclemileage}
                    {" KM"}
                  </div>
                  <div className="text-gray-600 text-xs">MILAGE</div>
                </div>
              )}
              {ad.vehicleTransmissions && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehicleTransmissions}
                  </div>
                  <div className="text-gray-600 text-xs">TRANSMISSION</div>
                </div>
              )}
              {ad.vehicleEngineSizesCC && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehicleEngineSizesCC}
                  </div>
                  <div className="text-gray-600 text-xs">ENGINE SIZE</div>
                </div>
              )}
              {ad.vehicleFuelTypes && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehicleFuelTypes}
                  </div>
                  <div className="text-gray-600 text-xs">FUEL TYPE</div>
                </div>
              )}
              {ad.vehicleBodyTypes && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehicleBodyTypes}
                  </div>
                  <div className="text-gray-600 text-xs">BODY TYPE</div>
                </div>
              )}
              {ad.vehiclecolor && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehiclecolor}
                  </div>
                  <div className="text-gray-600 text-xs">BODY COLOR</div>
                </div>
              )}
              {ad.vehicleinteriorColor && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehicleinteriorColor}
                  </div>
                  <div className="text-gray-600 text-xs">INTERIOR COLOR</div>
                </div>
              )}
              {ad.vehicleSeats && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehicleSeats}
                  </div>
                  <div className="text-gray-600 text-xs">SEATS</div>
                </div>
              )}
              {ad.vehiclecondition && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehiclecondition}
                  </div>
                  <div className="text-gray-600 text-xs">CONDITION</div>
                </div>
              )}
              {ad.vehiclesecordCondition && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehiclesecordCondition}
                  </div>
                  <div className="text-gray-600 text-xs">SECORD CONDITION</div>
                </div>
              )}
              {ad.vehicleregistered && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehicleregistered}
                  </div>
                  <div className="text-gray-600 text-xs">REGISTERED</div>
                </div>
              )}
              {ad.vehicleexchangeposible && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehicleexchangeposible}
                  </div>
                  <div className="text-gray-600 text-xs">EXCHANGE POSSIBLE</div>
                </div>
              )}
              {ad.vehiclechassis && (
                <div className="mb-2 md:flex-row">
                  <div className="text-emerald-950 text-sm">
                    {ad.vehiclechassis}
                  </div>
                  <div className="text-gray-600 text-xs">VIN CHASSIS NO.</div>
                </div>
              )}
            </div>

            {ad.vehiclekeyfeatures.length > 0 && (
              <>
                <div className="divider"></div>
                <p className="mt-5 font-bold text-emerald-950">Key Features</p>
                <div className="grid grid-cols-3 lg:grid-cols-5 w-full gap-1 mt-1">
                  {ad.vehiclekeyfeatures.map((feature) => (
                    <>
                      <div className="flex flex-col items-center h-10 gap-2 text-[10px] lg:text-xs bg-white lg:bg-[#ebf2f7] rounded-sm p-1 justify-center border">
                        {feature}
                      </div>
                    </>
                  ))}
                </div>
              </>
            )}
            <div className="divider"></div>
            <p className="mt-5 font-bold text-emerald-950">Description</p>
            <p className="my-1 text-text-emerald-950">{ad.description}</p>

            <div className="divider"></div>
            <h1 className="mt-5 p-0 font-bold text-emerald-950">
              Share this Ad on Social media
            </h1>
            <div className="flex justify-between w-full items-center">
              <div className="flex items-center space-x-2">
                <ShareAd ad={ad} />
              </div>

              <button
                onClick={handleOpenPopup}
                className="mt-2 mb-2 p-1 gap-1 text-sm text-emerald-900 rounded-sm bg-white ring-1 ring-emerald-900 hover:bg-emerald-100"
              >
                Report Abuse
              </button>
              {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-4 w-[300px] rounded-md shadow-lg">
                    <h2 className="text-lg font-semibold text-emerald-900">
                      Report Abuse
                    </h2>
                    <textarea
                      className="w-full mt-2 p-2 border border-emerald-900 rounded-sm"
                      placeholder="Describe the issue..."
                      value={abuseDescription}
                      onChange={handleDescriptionChange}
                    />
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        className="p-2 text-xs text-emerald-900 rounded-sm bg-emerald-100 hover:bg-emerald-200"
                        onClick={handleSubmitReport}
                      >
                        Submit
                      </button>
                      <button
                        className="p-2 text-xs text-emerald-900 rounded-sm bg-gray-100 hover:bg-gray-200"
                        onClick={handleClosePopup}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:w-[30%] p-1 lg:p-0">
          <div className="hidden lg:inline">
            <div className="bg-white border-t-8 border-emerald-700 p-5 text-l rounded-lg overflow-hidden shadow-md flex flex-col items-center">
              <span className="flex gap-1 text-2xl font-bold w-min rounded-full px-4 py-1 text-emerald-950">
                {formatKsh(ad.price)}
              </span>
              <div className="flex items-center">
                {ad.negotiable && (
                  <div className="flex gap-2 text-sm text-emerald-700 font-bold bg-white rounded-lg p-1 justify-center border">
                    Negotiable
                    <CheckCircleIcon sx={{ fontSize: 20 }} />
                  </div>
                )}
              </div>
            </div>
            <br />
            <span className="hidden m-0">
              <div className="justify-between flex w-full  gap-1">
                <SignedIn>
                  <button
                    className="hover:bg-emerald-700 bg-[#000000] text-white text-xs mt-2 p-2 rounded-lg shadow"
                    onClick={handleShowPhoneClick}
                  >
                    <CallIcon sx={{ marginRight: "5px" }} />
                    {showphone ? <>{ad.phone}</> : <> Call</>}
                  </button>
                </SignedIn>
                <SignedOut>
                  <a href={`/sign-in`}>
                    <button className="hover:bg-emerald-700 bg-[#000000] text-white text-xs mt-2 p-2 rounded-lg shadow">
                      <CallIcon sx={{ marginRight: "5px" }} />
                      Call
                    </button>
                  </a>
                </SignedOut>

                <SignedIn>
                  <ChatButton
                    ad={ad}
                    userId={userId}
                    userImage={userImage}
                    userName={userName}
                  />

                  {/*    <a href={`/chat/${ad.organizer._id}`}>
                    <button className="hover:bg-emerald-700 bg-[#000000] text-white text-xs mt-2 p-2 rounded-lg shadow">
                      <ChatBubbleOutlineOutlinedIcon
                        sx={{ marginRight: "5px" }}
                      />
                      Message
                    </button>
                  </a>
                  */}
                </SignedIn>
                <SignedOut>
                  <a href={`/sign-in`}>
                    <button className="hover:bg-emerald-700 bg-[#000000] text-white text-xs mt-2 p-2 rounded-lg shadow">
                      <ChatBubbleOutlineOutlinedIcon
                        sx={{ marginRight: "5px" }}
                      />
                      Message
                    </button>
                  </a>
                </SignedOut>

                {ad.organizer.whatsapp && (
                  <>
                    <SignedIn>
                      <a href={`https://wa.me/${ad.organizer.whatsapp}/`}>
                        <button className="hover:bg-emerald-700 bg-[#000000] text-white text-xs mt-2 p-2 rounded-lg shadow">
                          <WhatsAppIcon sx={{ marginRight: "5px" }} />
                          WhatsApp
                        </button>
                      </a>
                    </SignedIn>
                    <SignedOut>
                      <a href={`/sign-in`}>
                        <button className="hover:bg-emerald-700 bg-[#000000] text-white text-xs mt-2 p-2 rounded-lg shadow">
                          <WhatsAppIcon sx={{ marginRight: "5px" }} />
                          WhatsApp
                        </button>
                      </a>
                    </SignedOut>
                  </>
                )}
              </div>
            </span>
          </div>

          <br />
          <div className="bg-white p-5 text-l rounded-lg overflow-hidden lg:shadow-md">
            <div className="">
              <p className="lg:mt-5 font-bold">Approximate Location</p>
              <p className="text-gray-700 mb-1 text-sm">
                <LocationOnIcon sx={{ fontSize: 20 }} /> {ad.address}
              </p>

              <Streetmap
                id={ad._id}
                title={ad.title}
                price={ad.price}
                imageUrls={ad.imageUrls}
                lat={ad.latitude}
                lng={ad.longitude}
              />
              <div className="justify-between flex w-full">
                <button
                  onClick={handleDirectionClick}
                  className="hover:bg-emerald-700 bg-[#000000] text-white text-xs mt-2 p-2 rounded-lg shadow"
                >
                  <AssistantDirectionIcon sx={{ marginRight: "5px" }} />
                  Get Direction
                </button>
              </div>
            </div>
          </div>

          <br />
          <div className="hidden lg:inline">
            <div className="bg-white p-1 text-l rounded-lg overflow-hidden shadow-md">
              <div className="flex flex-col">
                <SellerProfileCard
                  userId={userId}
                  ad={ad}
                  userImage={userImage}
                  userName={userName}
                />
              </div>
            </div>
            <br />

            <div className="justify-between flex w-full"></div>
          </div>

          <div className="bg-white p-5 text-sm lg:mt-5 rounded-lg overflow-hidden lg:shadow-md">
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
                <div className="mt-2 transition-colors font-bold text-emerald-600 hover:text-emerald-950 hover:cursor-pointer">
                  <Link
                    href="/safety"
                    className="no-underline hover:text-emerald-500 "
                  >
                    Read more....
                  </Link>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
