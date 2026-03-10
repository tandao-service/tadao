import React, { useState } from "react";
import { FaShareAlt, FaFacebook, FaWhatsapp, FaTwitter } from "react-icons/fa";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { FacebookIcon, WhatsappIcon } from "next-share";

interface shareProps {
  userId: string;
}

const Share: React.FC<shareProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const shareTitle = "AutoYard | Where Every Ride Finds a Buyer";
  const shareUrl = `https://autoyard.co.ke/shop/${userId}`;

  const shareDescription = `Discover all the amazing Rides I'm selling on my AutoYard shop! Check them out here: ${shareUrl}`;

  const handleShare = (platform: string) => {
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareTitle} - ${shareDescription}`;
        break;
      case "twitter":
        url = `https://twitter.com/share?url=${shareUrl}&text=${shareTitle} - ${shareDescription}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(
          shareTitle + "\n" + shareDescription
        )}`;
        break;
      default:
        break;
    }
    window.open(url, "_blank");
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="p-1 gap-1 text-xs text-emerald-900 rounded-lg bg-white ring-1 ring-emerald-900 hover:bg-emerald-100"
      >
        <ShareOutlinedIcon sx={{ fontSize: 14 }} />
        Share
      </button>
      {isOpen && (
        <div className="absolute text-emerald-900 right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="flex items-center justify-between text-white p-1">
            <h3 className="text-sm text-emerald-900">Share your shop link</h3>

            <div onClick={toggleDropdown} className="cursor-pointer text-white">
              <CloseOutlinedIcon />
            </div>
          </div>

          <div
            onClick={() => handleShare("whatsapp")}
            className="flex items-center px-4 py-2 hover:text-emerald-500 cursor-pointer"
          >
            <WhatsappIcon size={18} round className="mr-2" />
            WhatsApp
          </div>
          <div
            onClick={() => handleShare("facebook")}
            className="flex items-center px-4 py-2 hover:text-emerald-500 cursor-pointer"
          >
            <FacebookIcon size={18} round className="mr-2" /> Facebook
          </div>
          <div
            onClick={() => handleShare("twitter")}
            className="flex items-center px-4 py-2 hover:text-emerald-500 cursor-pointer"
          >
            <FaTwitter className="mr-2" /> Twitter
          </div>
        </div>
      )}
    </div>
  );
};

export default Share;
