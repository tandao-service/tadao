"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { getsourceCookie, setsourceCookie } from "./cookies";

type CardProps = {
  onClose: () => void;
};

const AppPopup = ({ onClose }: CardProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const searchParams = useSearchParams();
  let backPressedOnce = false;

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isMobile = /android|iphone|ipad|ipod/i.test(userAgent);

    const source = searchParams.get("source");
    const sourceCookie = getsourceCookie();

    if (source) {
      setsourceCookie(source);
    }

    if (!sourceCookie && !source && isMobile) {
      setShowPopup(true);
    }

    // ✅ Handle back button navigation inside PWA
    const handlePopState = () => {
      console.log("Back button pressed");

      if (showPopup) {
        // Close popup instead of leaving app
        alert("close popups"); // replace with toast
        onClose();
      } else {
        if (backPressedOnce) {
          alert("Exit app"); // replace with toast
          window.close(); // Will attempt to close TWA
        } else {
          backPressedOnce = true;
          alert("Press back again to exit");
          setTimeout(() => (backPressedOnce = false), 2000);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [showPopup]);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Download the Tadao App
        </h2>
        <p className="text-gray-600 mb-4">
          Get a better experience by using the Tadao android app!
        </p>

        <a
          href="https://play.google.com/store/apps/details?id=com.tadaomarket.twa"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors duration-300 inline-block mb-4 flex items-center justify-center"
        >
          <Image
            src="/google-play-badge.png"
            alt="Google Play Store"
            width={24}
            height={24}
            className="mr-2"
          />
          Install from Google Play
        </a>

        <button
          onClick={() => setShowPopup(false)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400 transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AppPopup;
