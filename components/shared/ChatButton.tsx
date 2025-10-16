"use client";
import { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IAd } from "@/lib/database/models/ad.model";
import { IUser } from "@/lib/database/models/user.model";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { formatKsh } from "@/lib/help";
import { getData } from "@/lib/actions/transactions.actions";
import { sendEmail } from "@/lib/actions/sendEmail";
import { sendSMS } from "@/lib/actions/sendsmsnow";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { io, Socket } from "socket.io-client";
import SendChat from "./SendChat";
import { updateinquiries } from "@/lib/actions/dynamicAd.actions";
import { Button } from "../ui/button";
import sanitizeHtml from "sanitize-html";
let socket: Socket;
type chatProps = {
  userId: string;
  userName: string;
  userImage: string;
  ad: any;
};

const ChatButton = ({ ad, userId, userName, userImage }: chatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false); // New state for sending status
  let subscription: any = [];

  const [daysRemaining, setdaysRemaining] = useState(0);
  const [planpackage, setplanpackage] = useState<string>("Free");
  const [sendsms, setsendsms] = useState(false);
  const [sendemail, setsendemail] = useState(false);

  const { NotifyUser } = SendChat(); // Get the sendMessage function

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    setIsSending(true); // Disable the button and show progress

    try {
      await addDoc(collection(db, "messages"), {
        text: message,
        name: userName,
        avatar: userImage || "/default-avatar.jpg",
        createdAt: serverTimestamp(),
        uid: userId, // sender's UID
        recipientUid: ad.organizer._id, // recipient's UID
        imageUrl: ad.data.imageUrls[0],
        adTitle: ad.data.title,
        adDescription: ad.data.description,
        adUrl: process.env.NEXT_PUBLIC_DOMAIN_URL + "?Ad=" + ad._id,
        read: "1",
      });


      const callbackUrl = process.env.NEXT_PUBLIC_DOMAIN_URL + "chat"
      //  sendMessage(message, userName, ad.organizer._id, callbackUrl, ad.data.imageUrls[0])
      if (ad.organizer.token && ad.organizer.notifications.fcm) {

        const inquiryMessage = message;
        NotifyUser(ad, userId, userName, inquiryMessage)
      }
      if (ad.organizer.notifications.email) {

        const adTitle = ad.data.title;
        const adUrl = `https://tadaomarkert.com/?Ad=${ad._id}`;
        const recipientEmail = ad?.organizer?.email;
        await sendEmail(
          recipientEmail,
          message,
          adTitle,
          adUrl,
          userName,
          userImage
        );
      }

      const inquiries = (Number(ad.inquiries ?? "0") + 1).toString();
      const _id = ad._id;
      await updateinquiries({
        _id,
        inquiries,
        path: `/ads/${ad._id}`,
      });

      setMessage(""); // Clear the message input
      setIsOpen(false); // Close the popup
    } catch (error) {
      console.error("Error sending message: ", error);
    } finally {
      setIsSending(false); // Re-enable the button and hide progress
    }
  };
  const quickMessages = [
    "Is this still available?",
    "What is the last price?",
    "Can we negotiate?",
    "Where can I view this?",
  ];
  const truncateDescription = (description: string, charLimit: number) => {
    const safeMessage = sanitizeHtml(description);
    const truncatedMessage =
      safeMessage.length > charLimit
        ? `${safeMessage.slice(0, charLimit)}...`
        : safeMessage;
    return truncatedMessage;
  };
  const handleQuickMessageClick = (text: string) => {
    setMessage(text);
  };
  return (
    <>
      <Button onClick={() => setIsOpen(true)}
        variant="outline" className="flex w-full items-center gap-2 border border-gray-400 text-gray-800 hover:bg-orange-50 ">
        <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 24 }} />
        <div className="hidden lg:inline"> Enquire</div>
      </Button>


      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="h-[95vh] dark:bg-[#2D3236] dark:text-[#F1F3F3] bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between"> <p className="font-semibold mb-2"> {ad.data.title.length > 50
              ? `${ad.data.title.substring(0, 50)}...`
              : ad.data.title}</p>

              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 dark:text-white rounded hover:text-orange-600 focus:outline-none"
                disabled={isSending} // Disable close button while sending
              >
                <CloseOutlinedIcon />
              </button>
            </div>


            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              <span dangerouslySetInnerHTML={{ __html: truncateDescription(ad.data.description ?? "", 65) }} />

            </p>
            <span className="font-bold w-min rounded-full mt-1 dark:text-orange-600 text-orange-600">
              {formatKsh(ad.data.price)}
            </span>

            <div className="relative h-26 w-full bg-black rounded overflow-hidden aspect-[16/9]">
              <Image
                src={ad.data.imageUrls[0]}
                alt={ad.data.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 800px"
                priority={false}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
              {quickMessages.map((msg: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleQuickMessageClick(msg)}
                  className="text-sm border px-2 py-1 text-white rounded-md  bg-gray-900 hover:bg-black transition"
                >
                  {msg}
                </button>
              ))}
            </div>
            <textarea
              value={message}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // prevent newline
                  handleSendMessage(); // trigger message send
                }
              }}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your inquiry here..."
              className="w-full h-[100px] text-sm dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={isSending} // Disable textarea while sending
            />

            <div className="flex justify-end">
              <button
                onClick={handleSendMessage}
                className={`px-4 py-2 text-white rounded hover:bg-orange-700 focus:outline-none mr-2  ${isSending ? "bg-orange-200" : "bg-orange-600"
                  }`}
                disabled={isSending} // Disable button while sending
              >
                <div className="flex gap-1 items-center">
                  {isSending && (
                    <CircularProgress sx={{ color: "white" }} size={30} />
                  )}
                  {isSending ? "Sending..." : "Send Inquiry"}
                </div>
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;
