// components/ChatWindow.js
"use client";
import React, { useEffect, useState } from "react";
import ChatBoxSupport from "./ChatBoxSupport";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import SendMessageSupport from "./SendMessageSupport";
import HelpBox from "./HelpBox";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  recipientUid: string;
  senderId: string;
  senderName: string;
  senderImage: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  recipientUid,
  senderId,
  senderName,
  senderImage,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [title, settitle] = useState("Home");
  const tab = [
    { title: "Home", content: "Home" },
    { title: "Message", content: "Message" },
    { title: "Help", content: "Help" },
  ];
  const handle = async (index: number) => {
    setActiveTab(index);
    if (index == 0) {
      settitle("Home");
    } else if (index == 1) {
      settitle("Message");
    } else if (index == 2) {
      settitle("Help");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-5 bg-gradient-to-r from-[#000000] to-[#000000] rounded-lg shadow-xlg w-100 z-30">
      <div className="bg-gradient-to-r from-[#000000] to-[#000000] text-white p-2 rounded-t-lg">
        <div className="flex justify-between w-full">
          <h3 className="font-semibold text-white">{title}</h3>
          <div onClick={onClose} className="cursor-pointer text-white">
            <CloseOutlinedIcon />
          </div>
        </div>
      </div>
      <div className="p-1">
        {activeTab === 0 && (
          <>
            <div className="bg-gradient-to-b from-[#000000] to-[#000000] h-[400px] w-[300px] lg:w-[400px] flex flex-col p-1 mt-0">
              <div className="mt-5 w-full">
                <div className="flex items-center justify-center w-full gap-1 mt-5 mb-5">
                  <div className="w-12 h-12 border-white border-2 rounded-full">
                    <Image
                      className="w-full h-full rounded-full object-cover"
                      src={"/customer.jpg"}
                      alt="Profile Image"
                      width={120}
                      height={120}
                    />
                  </div>
                  <div className="w-12 h-12 border-white border-2 rounded-full">
                    <Image
                      className="w-full h-full rounded-full object-cover"
                      src={senderImage}
                      alt=""
                      width={120}
                      height={120}
                    />
                  </div>
                </div>
                <div className="gap-2 justify-center flex w-full items-center">
                  <h3 className="font-bold text-emerald-100 text-sm lg:text-lg">
                    Hi {senderName}
                  </h3>
                  <div className="h-14 w-14">
                    <Image src="/hello.png" alt="logo" width={50} height={50} />
                  </div>
                </div>
                <div className="gap-2 justify-center flex w-full items-center">
                  <h3 className="font-semibold text-2xl lg:text-3xl text-white">
                    How can we help?
                  </h3>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === 1 && (
          <>
            <div className="rounded-sm w-[300px] lg:w-[400px] bg-[#000000] flex flex-col p-1 mt-0">
              <div className="lg:flex-1 p-0 ml-0 mr-0">
                <ChatBoxSupport
                  displayName={senderName}
                  uid={senderId}
                  recipientUid={recipientUid}
                  client={true}
                  photoURL={senderImage}
                  recipient={{
                    status: "",
                    firstName: "",
                    lastName: "",
                    //username: "",
                    photo: "",
                  }}
                />

                <SendMessageSupport
                  displayName={senderName}
                  uid={senderId}
                  recipientUid={recipientUid}
                  client={true}
                  photoURL={senderImage}
                />
              </div>{" "}
            </div>
          </>
        )}
        {activeTab === 2 && (
          <>
            <div className="rounded-lg h-[400px] w-[300px] lg:w-[400px] bg-[#000000] flex flex-col p-1 mt-0">
              <div className="lg:flex-1 p-0 ml-0 mr-0">
                <HelpBox
                  displayName={senderName}
                  uid={senderId}
                  recipientUid={recipientUid}
                  client={true}
                  photoURL={senderImage}
                  recipient={{
                    status: "",
                    firstName: "",
                    lastName: "",
                    //username: "",
                    photo: "",
                  }}
                />
              </div>
            </div>
          </>
        )}
        <div className="flex flex-col items-center">
          <div className="flex bg-white w-full rounded-b-lg p-1">
            {tab.map((tab, index) => (
              <button
                key={index}
                className={`flex-1 text-xs lg:text-sm py-1 px-0 rounded-t-lg text-center ${
                  activeTab === index ? "text-emerald-600" : "text-black"
                }`}
                onClick={() => handle(index)}
              >
                {tab.title === "Home" && (
                  <div className="flex items-center">
                    <OtherHousesOutlinedIcon sx={{ fontSize: 16 }} />
                    {tab.title}
                  </div>
                )}

                {tab.title === "Message" && (
                  <div className="flex items-center">
                    <ChatOutlinedIcon sx={{ fontSize: 16 }} />
                    {tab.title}
                  </div>
                )}

                {tab.title === "Help" && (
                  <div className="flex items-center">
                    <ContactSupportOutlinedIcon sx={{ fontSize: 16 }} />
                    {tab.title}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
