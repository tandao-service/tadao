"use client";
import { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IAd } from "@/lib/database/models/ad.model";
import { IUser } from "@/lib/database/models/user.model";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { formatKsh } from "@/lib/help";
import { getData } from "@/lib/actions/transactionstatus";
import { sendEmail } from "@/lib/actions/sendEmail";
import { sendSMS } from "@/lib/actions/sendsmsnow";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import { updateinquiries } from "@/lib/actions/ad.actions";
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
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        subscription = await getData(ad.organizer._id);

        setsendsms(subscription.currentpack.features[5].checked);
        setsendemail(subscription.currentpack.features[6].checked);
        setplanpackage(subscription.currentpack.name);
        const createdAtDate = new Date(subscription.transaction.createdAt);
        const periodDays = parseInt(subscription.transaction.period);
        const expirationDate = new Date(
          createdAtDate.getTime() + periodDays * 24 * 60 * 60 * 1000
        );
        const currentDate = new Date();
        const daysRemaining_ = Math.ceil(
          (expirationDate.getTime() - currentDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        setdaysRemaining(daysRemaining_);
      } catch (error) {
        console.error("Error checking subscription: ", error);
      }
    };
    checkSubscription();
  }, [ad.organizer._id]);

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
        imageUrl: ad.imageUrls[0],
        adTitle: ad.title,
        adDescription: ad.description,
        adUrl: `https://autoyard.co.ke/ads/${ad._id}`,
        read: "1",
      });

      const adTitle = ad.title;
      const adUrl = `https://autoyard.co.ke/ads/${ad._id}`;
      const phoneNumber = ad.phone;
      const recipientEmail = ad?.organizer?.email;

      // Send notification SMS and email

      if (sendsms && daysRemaining > 0) {
        await sendSMS(phoneNumber, message, adTitle, adUrl);
      }

      // if (sendemail && daysRemaining > 0) {
      // alert(recipientEmail);
      await sendEmail(
        recipientEmail,
        message,
        adTitle,
        adUrl,
        userName,
        userImage
      );
      //  }

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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hover:bg-emerald-700 bg-[#30AF5B] text-white text-xs mt-2 p-2 rounded-lg shadow"
      >
        <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 24 }} />
        <div className="hidden lg:inline">Enquire</div>
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{ad.title}</h3>
            <p className="text-gray-700 mb-4">
              {ad.description.length > 80
                ? `${ad.description.substring(0, 80)}...`
                : ad.description}
            </p>
            <span className="text-lg lg:text-xl font-bold w-min rounded-full mt-1 text-emerald-950">
              {formatKsh(ad.price)}
            </span>

            <Image
              src={ad.imageUrls[0]}
              alt={ad.title}
              className="w-full h-48 object-cover mb-4 rounded"
              width={800} // Adjust width as needed
              height={300} // Adjust height as needed
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your inquiry here..."
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={isSending} // Disable textarea while sending
            />

            <div className="flex justify-end">
              <button
                onClick={handleSendMessage}
                className={`px-4 py-2 text-white rounded hover:bg-green-700 focus:outline-none mr-2  ${
                  isSending ? "bg-green-200" : "bg-green-600"
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
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none"
                disabled={isSending} // Disable close button while sending
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;
