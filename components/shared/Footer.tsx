"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
//import Termspopup from "./termspopup";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <div className="">
        <div className="flex">
          <div className="flex-1">
            <p className="mb-3 text-slate-950 font-bold">About us</p>
            <div className="divider"></div>
            <ul className="space-y-4">
              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                <Link
                  href="/about"
                  className="no-underline hover:text-emerald-500 "
                >
                  About AutoYard
                </Link>
              </li>

              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                <Link
                  href="/terms"
                  className="no-underline hover:text-emerald-500 "
                >
                  <div>Terms & Conditions</div>
                </Link>
              </li>
              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                <Link
                  href="/privacy"
                  className="no-underline hover:text-emerald-500 "
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <p className="mb-3 text-slate-950 font-bold">Support</p>
            <ul className="space-y-4">
              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                <Link
                  href="mailto:support@autoyard.co.ke"
                  className="no-underline hover:text-emerald-500 "
                >
                  support@autoyard.co.ke
                </Link>
              </li>
              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                <Link
                  href="/safety"
                  className="no-underline hover:text-emerald-500 "
                >
                  Safety tips
                </Link>
              </li>

              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                <Link
                  href="/faq"
                  className="no-underline hover:text-emerald-500 "
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <p className="mb-3 text-slate-950 font-bold">Our Apps</p>
            <ul className="space-y-4">
              <li>
                <Link
                  href=" https://play.google.com/store/apps/details?id=ke.autoyard.app"
                  className="no-underline hover:text-emerald-500 "
                >
                  <Image
                    src="https://assets.jiji.ng/static/img/single-images/google-play.svg"
                    alt="Google Play"
                    className="w-20 md:w-40"
                    width={20}
                    height={40}
                  />
                </Link>
              </li>
              <li>
                <Image
                  src="https://assets.jiji.ng/static/img/single-images/app-store.svg"
                  alt="App Store"
                  className="w-20 md:w-40"
                  width={20}
                  height={40}
                />
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <p className="mb-3 text-slate-950 font-bold">Our resources</p>
            <ul className="space-y-4">
              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                Our FB
              </li>
              <li className="transition-colors text-sm  hover:text-emerald-600 hover:cursor-pointer">
                Our Instagram
              </li>
              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                Our Youtube
              </li>

              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                Our Twitter
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300 p-2 mt-3"></div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-xs font-bold">
          {currentYear} AutoYard. All Rights reserved.
        </p>
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

export default Footer;
