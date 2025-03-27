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
import { ScrollArea } from "@/components/ui/scroll-area";
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
            ...prevMessages.filter((msg) => msg.uid !== uid), // Filter out previous messages from current user
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
              ...prevMessages.filter((msg) => msg.uid !== recipientUid), // Filter out previous messages from recipient user
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

  // Function to update the read status of a message
  const updateMessageReadStatus = async ({ messageId }: PropMess) => {
    try {
      const messageRef = doc(db, "messages", messageId);
      await updateDoc(messageRef, {
        read: 1, // Correct read status value to indicate the message is read
      });
      console.log("Message read status updated successfully.");
    } catch (error) {
      console.error("Error updating message read status: ", error);
    }
  };

  return (
    <div className="">
  <ScrollArea className="h-[80vh] lg:h-[380px] text-sm lg:text-base w-full dark:bg-[#2D3236] bg-white rounded-md border p-4">
  <div className="justify-start">
    <h2 className="font-bold">Frequently Asked Questions</h2>

    <Accordion type="single" collapsible className="w-full">
      <AccordionItem key="faq-1" value="item-1">
        <AccordionTrigger>
          <div className="w-full">
            <h3>1. How do I post a product on PocketShop.co.ke?</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <p>
            To list a product, create an account, go to the <strong>"Post Ad"</strong> section, 
            select the appropriate category, upload images, enter pricing details, and provide a 
            description. Once submitted, your listing will be reviewed for approval.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem key="faq-2" value="item-2">
        <AccordionTrigger>
          <h3>2. Is there a fee for listing a product?</h3>
        </AccordionTrigger>
        <AccordionContent>
          <p>
            Posting a standard product listing on PocketShop.co.ke is free. However, we offer 
            premium listing options to boost visibility at an affordable cost.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem key="faq-3" value="item-3">
        <AccordionTrigger>
          <h3>3. How can I contact a seller?</h3>
        </AccordionTrigger>
        <AccordionContent>
          <p>
            You can reach out to sellers via the chat feature on the product page or through the 
            contact details provided, such as phone number or email.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem key="faq-4" value="item-4">
        <AccordionTrigger>
          <h3>4. How do I report a fraudulent listing?</h3>
        </AccordionTrigger>
        <AccordionContent>
          <p>
            If you come across a suspicious or fraudulent listing, click the 
            <strong>&quot;Report Abuse&quot;</strong> button on the product page. Our team will investigate 
            and take the necessary action.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem key="faq-5" value="item-5">
        <AccordionTrigger>
          <h3>5. How can I edit or remove my product listing?</h3>
        </AccordionTrigger>
        <AccordionContent>
          <p>
            To edit or delete your listing, log into your account, navigate to 
            <strong>&quot;My Listings&quot;</strong>, and select the product you wish to modify or remove.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem key="faq-6" value="item-6">
        <AccordionTrigger>
          <h3>6. How long does it take for my listing to be approved?</h3>
        </AccordionTrigger>
        <AccordionContent>
          <p>
            Listings are usually reviewed and approved within 24 hours. Processing times may be 
            longer during peak periods.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem key="faq-7" value="item-7">
        <AccordionTrigger>
          <h3>7. Can I get a refund for a premium listing?</h3>
        </AccordionTrigger>
        <AccordionContent>
          <p>
            Refunds are available only if your premium listing was not approved or if there was 
            a technical issue. Please contact our support team for assistance.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</ScrollArea>

</div>

  );
};

export default HelpBox;
