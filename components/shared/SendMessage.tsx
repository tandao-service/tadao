"use client";
import { db, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import LatLngPickerAndShare from "./LatLngPickerAndShare";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

type sidebarProps = {
  displayName: string;
  uid: string;
  photoURL: string;
  recipientUid: string;
  client: boolean;
};
const SendMessage = ({
  uid,
  photoURL,
  displayName,
  recipientUid,
  client,
}: sidebarProps) => {
  const [value, setValue] = useState<string>("");
  const [image, setImg] = useState<File | null>(null);
  // const [recipientUid, setrecipientUid] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (value.trim() === "") {
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "Enter your message!",
        duration: 5000,
      });
      return;
    }

    try {
      let imageUrl: string = "";
      if (image) {
        const date = new Date().getTime();
        const imageRef = ref(storage, `${uid + date}`);

        // Upload the image
        await uploadBytes(imageRef, image);

        // Get the download URL
        imageUrl = await getDownloadURL(imageRef);
      }
      const read = "1";
      await addDoc(collection(db, "messages"), {
        text: value,
        name: displayName,
        avatar: photoURL,
        createdAt: serverTimestamp(),
        uid,
        recipientUid,
        imageUrl,
        read,
      });
      setValue("");
      setImg(null);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
 const [showPopupGps, setShowPopupGps] = useState(false);

  const handleOpenPopupGps = () => {
    setShowPopupGps(true);
  };

  const handleClosePopupGps = () => {
    setShowPopupGps(false);
  };
  const handleSaveGps = () => {
    setShowPopupGps(false); // Close the popup after saving
  };
  const handleInputOnChange = async (field: string, value: any) => {
    //setValue("PropertyLocation&lat="+value.lat+"&lng="+value.lng)
    try {
      let imageUrl: string = "";
      const read = "1";
      await addDoc(collection(db, "messages"), {
        text: "PropertyLocation&lat="+value.lat+"&lng="+value.lng,
        name: displayName,
        avatar: photoURL,
        createdAt: serverTimestamp(),
        uid,
        recipientUid,
        imageUrl,
        read,
      });
      setValue("");
      setImg(null);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    //setValue(process.env.NEXT_PUBLIC_DOMAIN_URL+"location?title="+value.title+"&price="+value.price+"&lat="+value.lat+"&lng="+value.lng)
  };
  return (
    <div className="border dark:bg-[#2D3236] dark:text-[#F1F3F3] text-black rounded-b-md right-0 bg-white dark:bg-[#131B1E] h-auto z-10 p-0 flex flex-col md:flex-row justify-end items-center">
      <form
        onSubmit={handleSendMessage}
        className="flex w-full p-0 justify-end items-center"
      >
        {recipientUid ? (
          <>
            {image && (
              <div className="h-32 w-24 fixed bottom-20 bg-white shadow rounded-lg p-1">
                <button
                  onClick={(e) => setImg(null)}
                  className="focus:outline-none"
                >
                  <CloseIcon className="m-1" sx={{ fontSize: 24 }} />
                </button>
                <Zoom>
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="image"
                    width={50}
                    height={50}
                    className="w-full object-center rounded-lg"
                  />
                </Zoom>
              </div>
            )}
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onInput={(e) => {
                e.currentTarget.style.height = "auto"; // Reset height to recalculate
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
              }}
              className="input dark:bg-[#2D3236] dark:text-[#F1F3F3] text-black w-full text-sm lg:text-base p-3 focus:outline-none bg-white rounded-r-none rounded-l-lg"
              placeholder="Enter your message..."
              rows={1} // Start with a single row
              style={{ height: "auto" }} // Ensure auto-height
            />

            <button
              type="submit"
              className="text-sm p-3 lg:text-base bg-gradient-to-b from-emerald-800 to-emerald-900 text-white rounded-r-lg"
            >
              Send
            </button>
          </>
        ) : (
          <>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onInput={(e) => {
                e.currentTarget.style.height = "auto"; // Reset height to recalculate
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
              }}
              className="input dark:bg-[#2D3236] dark:text-[#F1F3F3] text-black w-full text-sm lg:text-base p-3 focus:outline-none bg-white rounded-r-none rounded-l-lg"
              placeholder="Enter your message..."
              rows={1} // Start with a single row
              style={{ height: "auto" }} // Ensure auto-height
            />

            <button
              type="submit"
              className="text-sm p-3 lg:text-base bg-gradient-to-b from-emerald-800 to-emerald-900 text-white rounded-r-lg"
            >
              Send
            </button>
          </>
        )}
 
        <div className="cursor-pointer relative p-2">
          <label htmlFor="file">
            <div className="text-gray-700 dark:text-gray-400 p-1 cursor-pointer ">
              {" "}
              <AttachFileOutlinedIcon />
            </div>
          </label>
          <input
            type="file"
            id="file"
            className="absolute top-0 left-0 opacity-0 h-0 w-0"
            onChange={(e) => setImg(e.target.files?.[0] || null)}
          />
        </div>
        </form>
        <div className="cursor-pointer relative p-2">
        <div className="flex flex-col w-full gap-1">
                  <button
                    onClick={handleOpenPopupGps}
                    className="flex text-[10px] gap-1 items-center justify-center w-full p-1 border border-gray-300 dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <LocationOnIcon /> Share Location
                  </button>

                  {showPopupGps && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
                        <div className="dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-gray-200 p-2 w-full  lg:max-w-4xl items-center justify-center rounded-md shadow-md relative">
                        <div className="flex justify-between items-center mb-1">
                        <h1 className="font-bold">Property Google Location</h1>
                          <button
                            onClick={handleClosePopupGps}
                            className="flex justify-center items-center h-12 w-12 text-black dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-black hover:text-white rounded-full"
                          >
                            <CloseOutlinedIcon />
                          </button>
                        </div>
                        <LatLngPickerAndShare
                          name={"gps"}
                          onChange={handleInputOnChange}
                          onSave={handleSaveGps} // Pass the save handler to the child
                        />
                      </div>
                    </div>
                  )}  
                  </div>
        </div>
    
    </div>
  );
};

export default SendMessage;
