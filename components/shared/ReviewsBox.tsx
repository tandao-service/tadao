"use client";
import { db } from "@/lib/firebase";
import Message from "./Message";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { UpdateUserParams } from "@/types";
import Reviews from "./Reviews";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
type sidebarProps = {
  displayName: string;
  uid: string;
  recipientUid: string;
  photoURL: string;
  recipient: UpdateUserParams;
};
interface Review {
  // id: string;
  text: string;
  name: string;
  avatar: string;
  createdAt: Timestamp; // Assuming createdAt is a Firestore timestamp
  uid: string;
  recipientUid: string;
  starClicked: boolean[];
}
const ReviewsBox = ({
  uid,
  photoURL,
  displayName,
  recipientUid,
  recipient,
}: sidebarProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);
  //const [recipientUid, setrecipientUid] = React.useState<string | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = () => {
      const senderMessagesQuery = query(
        collection(db, "reviews"),
        where("recipientUid", "==", recipientUid),

        limit(100)
      );

      const reviewsall = onSnapshot(senderMessagesQuery, (snapshot) => {
        const senderMessages: Review[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Review), // Cast to the Review type
        }));
        // Sort messages by createdAt timestamp
        senderMessages.sort((a, b) => {
          // Handle cases where createdAt might be null or undefined
          const createdAtA = a.createdAt ? a.createdAt.toMillis() : 0;
          const createdAtB = b.createdAt ? b.createdAt.toMillis() : 0;
          return createdAtA - createdAtB;
        });

        setMessages(senderMessages);
      });

      return () => {
        reviewsall();
      };
    };

    fetchMessages();
  }, [uid, recipientUid]);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    scrollToBottom();
  }, [messages]);
  // console.log(messages);
  return (
    <div className="w-full">
      {messages.length > 0 ? (
        <>
          <ScrollArea className="h-[79vh] w-full dark:bg-[#2D3236] bg-white rounded-t-md border p-2">
            {messages
              .slice()
              .reverse()
              .map((message: any) => (
                <Reviews
                  key={message.id}
                  message={message}
                  displayName={displayName}
                  uid={uid}
                  recipientUid={recipientUid}
                  photoURL={photoURL}
                  recipient={recipient}
                />
              ))}
          </ScrollArea>
        </>
      ) : (
        <div className="p-2 flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
        <ReviewsOutlinedIcon/>
          <h3 className="font-bold text-[16px] lg:text-[25px]">No Review</h3>
          <p className="text-sm lg:p-regular-14">Seller has 0 reviews</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsBox;
