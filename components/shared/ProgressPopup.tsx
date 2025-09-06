// components/ChatWindow.js
"use client";
import React, { useEffect, useState } from "react";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import Image from "next/image";
import CreateCategoryForm from "./CreateCategoryForm";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import CreateSubCategoryForm from "./CreateSubCategoryForm";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProgressPopup: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="justify-center items-center dark:text-gray-300 rounded-lg p-1 lg:p-6 w-full md:max-w-3xl lg:max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex gap-1 items-center">
          <Image
            src="/assets/icons/loading.gif"
            alt="edit"
            width={60}
            height={60}
          />
          {/*Loading...*/}
        </div>
      </div>
    </div>
  );
};

export default ProgressPopup;
