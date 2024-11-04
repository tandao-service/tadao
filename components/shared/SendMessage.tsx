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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#ebf2f7] h-auto z-10 p-0 shadow-md flex flex-col md:flex-row justify-end items-center">
      <form
        onSubmit={handleSendMessage}
        className="flex w-full p-1 justify-end items-center"
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
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input lg:ml-[460px] w-full text-sm lg:text-base text-black p-3 focus:outline-none bg-white rounded-r-none rounded-l-lg"
              type="text"
              placeholder="Enter your message..."
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
            <input
              value={value}
              disabled
              className="input lg:ml-[450px] w-full text-sm lg:text-base text-black p-3 focus:outline-none bg-white rounded-r-none rounded-l-lg"
              type="text"
              placeholder="Enter your message..."
            />

            <button
              type="submit"
              className="text-sm p-3 lg:text-base bg-gradient-to-b from-emerald-800 to-emerald-900 text-white rounded-r-lg"
            >
              Send
            </button>
          </>
        )}

        <div className="cursor-pointer relative p-2 lg:mr-5">
          <label htmlFor="file">
            <div className="text-gray-700 p-1 cursor-pointer ">
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
    </div>
  );
};

export default SendMessage;
