"use client";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useRef, useState, useCallback } from "react";
import React from "react";
import { UpdateUserParams } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import Message from "./Message";

type SidebarProps = {
  displayName: string;
  uid: string;
  recipientUid: string;
  photoURL: string;
  recipient: UpdateUserParams;
  client: boolean;
  handleAdEdit:(id:string)=> void;
  handleAdView:(id:string)=> void;
  handleCategory:(category:string)=> void;
  handleOpenSell:()=> void;
 handleOpenPlan:()=> void;
};

const ChatBoxSupport = ({
  uid,
  photoURL,
  displayName,
  recipientUid,
  recipient,
  handleAdEdit,
  handleAdView,
  handleCategory,
  handleOpenSell,
 handleOpenPlan,
}: SidebarProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);

  // Function to update the read status of a message
  const updateMessageReadStatus = useCallback(async (messageId: string) => {
    try {
      const messageRef = doc(db, "messages", messageId);
      await updateDoc(messageRef, { read: 0 });
    } catch (error) {
      console.error("Error updating message read status:", error);
    }
  }, []);

  useEffect(() => {
    const senderMessagesQuery = query(
      collection(db, "messages"),
      where("uid", "==", uid),
      where("recipientUid", "==", recipientUid),
      orderBy("createdAt", "asc"),
      limit(50)
    );

    const recipientMessagesQuery = query(
      collection(db, "messages"),
      where("uid", "==", recipientUid),
      where("recipientUid", "==", uid),
      orderBy("createdAt", "asc"),
      limit(50)
    );

    const unsubscribeSender = onSnapshot(senderMessagesQuery, (snapshot) => {
      const senderMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages((prevMessages) => {
        const mergedMessages = [...prevMessages, ...senderMessages];
        return mergedMessages.sort((a, b) => a.createdAt - b.createdAt);
      });
    });

    const unsubscribeRecipient = onSnapshot(
      recipientMessagesQuery,
      (snapshot) => {
        const recipientMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages((prevMessages) => {
          const mergedMessages = [...prevMessages, ...recipientMessages];
          return mergedMessages.sort((a, b) => a.createdAt - b.createdAt);
        });
      }
    );

    return () => {
      unsubscribeSender();
      unsubscribeRecipient();
    };
  }, [uid, recipientUid]);

  // Mark messages as read when they are received
  useEffect(() => {
    messages.forEach((message) => {
      if (message.uid !== uid && message.read === 1) {
        updateMessageReadStatus(message.id);
      }
    });
  }, [messages, uid, updateMessageReadStatus]);

  // Scroll to the bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 h-full">
      <ScrollArea className="h-[70vh] lg:h-[330px] w-full dark:bg-[#2D3236] bg-white border p-0">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            displayName={displayName}
            uid={uid}
            recipientUid={recipientUid}
            photoURL={photoURL}
            recipient={recipient}
            handleAdEdit={handleAdEdit}
            handleAdView={handleAdView} 
            handleCategory={handleCategory}
            handleOpenSell={handleOpenSell}
           handleOpenPlan={handleOpenPlan}
          />
        ))}
        <div ref={messagesEndRef}></div>
      </ScrollArea>
      </div>
  );
};

export default ChatBoxSupport;
