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
      <ScrollArea className="h-[390px] text-sm lg:text-base w-full bg-white rounded-t-md border p-4">
        <div className="justify-start">
          <h2 className="font-bold">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem key="faq-1" value="item-1">
              <AccordionTrigger>
                <div className="w-full">
                  <h3>
                    1. How do I post a vehicle for sale on AutoYard.co.ke?
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  To post a vehicle, simply create an account, navigate to the
                  &quot;Sell&quot; section, and fill out the required details.
                  Upload photos, set your price, and submit your listing.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem key="faq-2" value="item-2">
              <AccordionTrigger>
                <h3>2. Is there a fee for posting a vehicle?</h3>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Posting a basic vehicle listing on AutoYard.co.ke is free.
                  However, we offer premium listing options for increased
                  visibility, which come with a small fee.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem key="faq-3" value="item-3">
              <AccordionTrigger>
                <h3>3. How can I contact a seller?</h3>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  You can contact a seller directly via the chat function on the
                  website, or by using the provided email or phone number listed
                  in the vehicle details.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem key="faq-4" value="item-4">
              <AccordionTrigger>
                <h3>4. What should I do if I suspect a fraudulent listing?</h3>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  If you suspect a fraudulent listing, please report it
                  immediately using the &quot;Report&quot; button on the listing
                  page. Our team will review and take appropriate action.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem key="faq-5" value="item-5">
              <AccordionTrigger>
                <h3>5. How do I edit or delete my vehicle listing?</h3>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  You can edit or delete your listing by logging into your
                  account, navigating to &quot;My Listings,&quot; and selecting
                  the option to edit or delete the desired vehicle listing.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem key="faq-6" value="item-6">
              <AccordionTrigger>
                <h3>6. Can I get a refund for a premium listing?</h3>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Refunds for premium listings are subject to our refund policy.
                  Please review the policy or contact our support team for
                  assistance.
                </p>
              </AccordionContent>
            </AccordionItem>
            {/* Add more FAQ sections with unique keys */}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
};

export default HelpBox;
