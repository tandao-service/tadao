// components/ChatWindow.js
"use client";
import React, { useEffect, useState } from "react";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { ScrollArea } from "../ui/scroll-area";
//import { ProductForm } from "./ProductForm";
//import { IProduct } from "@/lib/database/models/product.model";
import SettingsEdit from "./SettingsEdit";
import { deleteAd, getAdByUser, updateBanAll, updateStatus } from "@/lib/actions/dynamicAd.actions";
import { usePathname, useRouter } from "next/navigation";
import ProgressPopup from "./ProgressPopup";
import { updateUserStatus } from "@/lib/actions/user.actions";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  ad: any;
}

const ReportActionWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  ad,
  onClose,
}) => {
  if (!isOpen) return null;
  const [status, setStatus] = useState(ad.adstatus);
  const [statusAds, setStatusAds] = useState("Active");
  const [Userstatus, setUserStatus] = useState("User");
  const pathname = usePathname();
  const router = useRouter();
const isAdCreator=true;
const page=1000;
const sortby="recommended";
const [userId, setuserId] = useState(ad.organizer);
const [organizerAds, setorganizerAds] = useState<any>([]);
 const fetchAds = async () => {
 
    try {
      const organizedAds = await getAdByUser({
        userId,
        page,
        sortby: sortby,
        myshop: isAdCreator,
      });
      alert(organizedAds);
      console.log(organizedAds)
      setorganizerAds(organizedAds);
      // Update ads state using the latest prevAds for filtering
   
     
    } catch (error) {
      //alert(error);
      console.error("Error fetching ads", error);
    } finally {
    
    }
  };

  useEffect(() => {
   
      fetchAds();
    
  }, []);



  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this ad?")) {
      try {
           await deleteAd({ adId:ad._id, deleteImages:ad.data.imageUrls , path: pathname });
      
      } catch (error) {
        console.error("Error deleting ad:", error);
      }
    }
  };

  const handleStatusChange = async () => {
    const newStatus = status === "Active" ? "Inactive" : "Active";
    try {
      

      await updateStatus({ _id:ad._id, adstatus:newStatus , path: pathname });
    
      setStatus(newStatus);
   
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleStatusChangeUser = async () => {
    const status = Userstatus === "User" ? "Banned" : "User";
    try {
      

      await updateUserStatus(userId, status);
    
      setUserStatus(Userstatus);
   
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleBanall = async () => {
    if (confirm("Are you sure you want to Deactivate All Creator ads?")) {
      try {
        const phone=ad.data.phone;
        const status = statusAds === "Active" ? "Inactive" : "Active";
           await updateBanAll(phone, status);
      
      } catch (error) {
        console.error("Error banning all ads:", error);
      }
    }
  };

const [isOpenP, setIsOpenP] = useState(false);
  const handleOpenP = () => {
    setIsOpenP(true);
  };

  const handleCloseP = () => {
    setIsOpenP(false);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="dark:bg-[#2D3236] dark:text-gray-300 bg-white rounded-lg p-1 lg:p-6 w-full max-w-5xl md:max-w-3xl lg:max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Reported Ad</h3>
          <button
            onClick={onClose}
            className="flex justify-center items-center h-12 w-12 dark:text-white text-black hover:bg-black hover:text-white rounded-full"
          >
            <CloseOutlinedIcon />
          </button>
        </div>

        {/* Scrollable Form */}
        <ScrollArea className="p-2">
      <div className="border rounded-lg shadow-md p-4 dark:bg-[#131B1E] bg-white">
          <h2 className="text-sm font-bold">{ad.data.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Price: <span className="font-semibold">Ksh {ad.data.price.toLocaleString()}</span></p>
          <div className="mt-1 flex space-x-2 overflow-x-auto">
            {ad.data.imageUrls.map((url:string, index:number) => (
              <Image key={index} src={url} alt={ad.data.title} width={100} height={75} className="rounded-lg" />
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">{ad.data.description}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Condition: {ad.data.condition}</p>
         
          <div className="mt-4 flex justify-between">
            <span className={`px-3 py-1 items-center text-sm rounded-sm ${status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
              {status}
            </span>
            <div className="space-x-2">
              <button onClick={handleStatusChange} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">
                {status === "Active" ? "Deactivate" : "Activate"}
              </button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
          {organizerAds && (<><div className="border mt-2 p-2 rounded-xl dark:bg-[#2D3236] bg-gray-100 dark:gray-700">  
<h3 className="font-semibold text-sm">Ad Creator</h3>
{/*<div
            onClick={() => {
              handleOpenP();
              router.push(`/shop/${organizerAds[0].organizer._id}`);
            }}
            className="ml-2 text-xl cursor-pointer font-bold hover:underline hover:text-emerald-600"
          >
            {organizerAds[0].organizer.firstName} {organizerAds[0].organizer.lastName}
          </div>
*/}
   <p className="text-xs text-gray-500 dark:text-gray-400">Phone: {ad.data.phone}</p>
   <p className="text-xs text-gray-500 dark:text-gray-400">Active Ads: </p>
   <div className="mt-1 space-x-2">
              <button onClick={handleStatusChangeUser} className=" text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">
                {Userstatus === "User" ? "Ban Creator" : "Activate Creator"}
              </button>
              <button onClick={handleBanall} className=" text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">
                Deactivate All Creator Ads
              </button>
            </div>
   </div></>)}
   
        </div>
    
        </ScrollArea>
      </div>
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  )
};

export default ReportActionWindow;
