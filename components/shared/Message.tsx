//import { UserAuth } from "../context/AuthContext";

import { UpdateUserParams } from "@/types";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { format, isToday, isYesterday } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
interface MessageProps {
  message: {
    uid: string;
    recipientUid: string;
    imageUrl: string;
    avatar: string;
    createdAt: {
      seconds: number;
      nanoseconds: number;
    }; // Assuming createdAt is a Timestamp object
    name: string;
    text: string;
    adUrl: string;
    adTitle: string;
    adDescription: string;
  };
  displayName: string;
  uid: string;
  photoURL: string;
  recipientUid: string | null;
  recipient: UpdateUserParams;
}

const Message = ({
  message,
  displayName,
  uid,
  recipientUid,
  photoURL,
  recipient,
}: MessageProps) => {
  // Convert Timestamp to Date object

  //console.log(message);
  const truncateDescription = (title: string, maxLength: number) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };
  const [isLoading, setIsLoading] = useState(true);
  let formattedCreatedAt = "";
  try {
    const createdAtDate = new Date(message.createdAt.seconds * 1000);
    if (isToday(createdAtDate)) {
      formattedCreatedAt = "Today " + format(createdAtDate, "HH:mm");
    } else if (isYesterday(createdAtDate)) {
      formattedCreatedAt = "Yesterday " + format(createdAtDate, "HH:mm");
    } else {
      formattedCreatedAt = format(createdAtDate, "dd-MM-yyyy HH:mm");
    }
  } catch {}
  return (
    <div className="">
      <div className="chatbox p-4">
        <div
          className={`flex items-start mb-4 ${
            message.uid === uid ? "justify-end" : "justify-start"
          }`}
        >
          <Image
            src={message.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full mr-3"
            height={200}
            width={200}
          />
          <div
            className={`message-content max-w-xs rounded-lg p-3 ${
              message.uid === uid
                ? "bg-green-100 text-right"
                : "bg-blue-100 text-left"
            }`}
          >
            <h4 className="font-semibold">{message.name}</h4>
            <p className="text-sm">{message.text}</p>
            <small className="text-gray-500">{formattedCreatedAt}</small>
            {message.imageUrl && (
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#000000] bg-opacity-50">
                    {/* Spinner or loading animation */}
                    <CircularProgress sx={{ color: "white" }} />
                  </div>
                )}
                <Zoom>
                  <Image
                    src={message.imageUrl} // Image URL coming from the message object
                    alt="ad image" // Alt text for accessibility
                    width={500} // Replace with actual width of the image
                    height={300} // Replace with actual height of the image
                    className={`mt-2 rounded-lg cursor-pointer ${
                      isLoading ? "opacity-0" : "opacity-100"
                    } transition-opacity duration-300`}
                    onLoadingComplete={() => setIsLoading(false)}
                    placeholder="empty" // Optional: you can use "empty" if you want a placeholder before loading
                  />
                </Zoom>
              </div>
            )}

            <a
              href={message.adUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-blue-600 underline"
            >
              {message.adTitle}
            </a>
            <p className="text-sm text-gray-700">
              {truncateDescription(message.adDescription ?? "", 80)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
