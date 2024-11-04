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
type sidebarProps = {
  displayName: string;
  uid: string;
  photoURL: string;
  recipientUid: string;
  client: boolean;
};
const SendMessageSupport = ({
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
  const [check, setCheck] = useState(false);

  const sendWelcomeMessage = useCallback(async () => {
    const read = "1";
    const imageUrl = "";
    const welcomeText =
      "Hello! Thank you for reaching out to our support team. We're here to assist you. Please feel free to ask any questions or let us know how we can help you today.";

    try {
      const userQuery = query(
        collection(db, "messages"),
        where("uid", "==", "66dd62d837607af83cabf551"),
        where("recipientUid", "==", uid),
        where("text", "==", welcomeText)
      );

      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        await addDoc(collection(db, "messages"), {
          text: welcomeText,
          name: "Support Team",
          avatar: "/customer.jpg",
          createdAt: serverTimestamp(),
          uid: "66dd62d837607af83cabf551",
          recipientUid: uid,
          imageUrl,
          read,
        });
      }
    } catch (error) {
      console.error("Error sending welcome message: ", error);
    }
  }, [recipientUid, uid]);
  useEffect(() => {
    if (client && recipientUid && uid && !check) {
      const timer = setTimeout(() => {
        setCheck(true);
        sendWelcomeMessage();
      }, 1000); // 3 seconds delay

      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, []);

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
    <div className="w-full p-1 bg-[#ebf2f7]">
      <form onSubmit={handleSendMessage} className="px-0 containerWrap flex">
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
                <img
                  src={URL.createObjectURL(image)}
                  alt="image"
                  width={50}
                  height={50}
                  className="w-full object-center rounded-lg"
                />
              </div>
            )}
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input w-[210px] lg:w-full  text-sm text-black p-2 focus:outline-none bg-white rounded-r-none rounded-l-lg"
              type="text"
              placeholder="Enter your message..."
            />
            <button
              type="submit"
              className="w-auto bg-gradient-to-b from-emerald-800 to-emerald-900 text-white rounded-r-lg px-5 text-sm"
            >
              Send
            </button>
          </>
        ) : (
          <>
            <input
              value={value}
              disabled
              className="input w-full p-2 text-black focus:outline-none bg-white rounded-r-none rounded-l-lg"
              type="text"
              placeholder="Enter your message..."
            />
            <button
              type="submit"
              disabled
              className="w-auto bg-gradient-to-b from-emerald-800 to-emerald-900 text-white rounded-r-lg px-5 text-sm"
            >
              Send
            </button>
          </>
        )}

        <div className="cursor-pointer relative p-2 ml-5 mr-5">
          <label htmlFor="file">
            <img
              src="../assets/icons/attach.png"
              alt="Attach"
              className="cursor-pointer"
            />
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

export default SendMessageSupport;
