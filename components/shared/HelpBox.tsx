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
import { useEffect, useRef, useState } from "react";
import React from "react";
import { UpdateUserParams } from "@/types";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type SidebarProps = {
  displayName: string;
  uid: string;
  recipientUid: string;
  photoURL: string;
  recipient: UpdateUserParams;
  client: boolean;
};

type PropMess = {
  messageId: string;
};

const HelpBox = ({
  uid,
  photoURL,
  displayName,
  recipientUid,
  recipient,
  client,
}: SidebarProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchMessages = () => {
      const senderMessagesQuery = query(
        collection(db, "messages"),
        where("uid", "==", uid),
        where("recipientUid", "==", recipientUid),
        limit(50)
      );

      const recipientMessagesQuery = query(
        collection(db, "messages"),
        where("uid", "==", recipientUid),
        where("recipientUid", "==", uid),
        limit(50)
      );

      const unsubscribeSender = onSnapshot(senderMessagesQuery, (snapshot) => {
        const senderMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages((prevMessages) =>
          [
            ...prevMessages.filter((msg) => msg.uid !== uid),
            ...senderMessages,
          ].sort((a, b) => a.createdAt - b.createdAt)
        );
      });

      const unsubscribeRecipient = onSnapshot(
        recipientMessagesQuery,
        (snapshot) => {
          const recipientMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages((prevMessages) =>
            [
              ...prevMessages.filter((msg) => msg.uid !== recipientUid),
              ...recipientMessages,
            ].sort((a, b) => a.createdAt - b.createdAt)
          );
        }
      );

      return () => {
        unsubscribeSender();
        unsubscribeRecipient();
      };
    };

    fetchMessages();
  }, [uid, recipientUid]);

  const updateMessageReadStatus = async ({ messageId }: PropMess) => {
    try {
      const messageRef = doc(db, "messages", messageId);
      await updateDoc(messageRef, {
        read: 1,
      });
      console.log("Message read status updated successfully.");
    } catch (error) {
      console.error("Error updating message read status: ", error);
    }
  };

  return (
    <ScrollArea.Root className="h-full overflow-hidden">
      <ScrollArea.Viewport className="h-[calc(100vh-100px)] text-sm lg:text-base w-full dark:bg-[#2D3236] bg-white border p-4">
        <div className="justify-start">
          <h2 className="font-bold">Frequently Asked Questions (Tadao)</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem key="faq-1" value="item-1">
              <AccordionTrigger>
                <div className="w-full">
                  <h3>1. How do I list a product on Tadao?</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Sign in to your account, navigate to the <strong>&apos;Sell&apos;</strong> section, choose the correct category, upload clear photos, provide a price, and fill in the details. Submit your ad for review.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem key="faq-2" value="item-2">
              <AccordionTrigger>
                <h3>2. Is it free to post a listing on Tadao?</h3>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Yes! Standard listings are free. You can opt for premium upgrades to boost visibility at a small fee.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem key="faq-3" value="item-3">
              <AccordionTrigger>
                <h3>3. How can I reach out to a seller?</h3>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  You can contact sellers through Tadao&apos;s built-in chat or use the contact info listed with the ad (if provided).
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem key="faq-4" value="item-4">
              <AccordionTrigger>
                <h3>4. What do I do if I see a suspicious ad?</h3>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Click the <strong>&apos;Report&apos;</strong> button on the listing page. Our moderation team will investigate it promptly.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem key="faq-5" value="item-5">
              <AccordionTrigger>
                <h3>5. How do I update or delete a product I posted?</h3>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Log into your Tadao account, go to <strong>&apos;My Listings&apos;</strong>, and select the post to edit or delete.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem key="faq-6" value="item-6">
              <AccordionTrigger>
                <h3>6. How long does listing approval take?</h3>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Listings are typically reviewed within 24 hours. Delays may occur during peak times.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem key="faq-7" value="item-7">
              <AccordionTrigger>
                <h3>7. Can I get a refund on premium upgrades?</h3>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Refunds are only issued if your premium listing is not approved or a technical error occurred. Please reach out to our support team.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical" />
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
};

export default HelpBox;
