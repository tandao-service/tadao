"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
//import Termspopup from "./termspopup";

const Footersub = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <div className="border-t border-gray-300 p-2 mt-3"></div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-xs font-bold">
          {currentYear} AutoYard. All Rights reserved.
        </p>
        <div className="flex text-xs">
          <div className="flex gap-1 w-full text-gray-600">
            <div className="transition-colors text-[10px] hover:text-emerald-600 hover:cursor-pointer">
              <Link
                href="/about"
                className="no-underline hover:text-emerald-500 "
              >
                About
              </Link>
            </div>
            <div>|</div>
            <div className="transition-colors text-[10px] hover:text-emerald-600 hover:cursor-pointer">
              <Link
                href="/terms"
                className="no-underline hover:text-emerald-500 "
              >
                <div>Terms & Conditions</div>
              </Link>
            </div>
            <div>|</div>
            <div className="transition-colors text-[10px] hover:text-emerald-600 hover:cursor-pointer">
              <Link
                href="/privacy"
                className="no-underline hover:text-emerald-500 "
              >
                Privacy Policy
              </Link>
            </div>
            <div>|</div>
            <div className="transition-colors text-[10px] hover:text-emerald-600 hover:cursor-pointer">
              <Link
                href="/safety"
                className="no-underline hover:text-emerald-500 "
              >
                Safety Tips
              </Link>
            </div>
          </div>
        </div>
        <p className="text-[8px] lg:text-xs">
          Developed by{" "}
          <Link
            href="https://craftinventors.co.ke"
            className="no-underline hover:text-emerald-500 "
          >
            Craft Inventors
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Footersub;
