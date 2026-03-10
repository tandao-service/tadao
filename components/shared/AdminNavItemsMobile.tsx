"use client";

import { adminLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Separator } from "../ui/separator";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import AutoAwesomeMotionOutlinedIcon from "@mui/icons-material/AutoAwesomeMotionOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CoPresentOutlinedIcon from "@mui/icons-material/CoPresentOutlined";
import DiamondIcon from "@mui/icons-material/Diamond";
const AdminNavItemsMobile = ({ onDataFromChild }: any) => {
  const pathname = usePathname();

  return (
    <ul className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-8 m-1 gap-1 p-1">
      {adminLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <li
            key={link.route}
            className={`${
              isActive &&
              "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white rounded-full"
            } p-medium-16 whitespace-nowrap`}
          >
            <Link href={link.route}>
              <div className="flex hover:bg-emerald-100 hover:rounded-full hover:text-emerald-600 p-3 hover:cursor-pointer">
                {link.label === "Home" && (
                  <span>
                    <CottageOutlinedIcon className="w-10 p-1 hover:text-white" />
                  </span>
                )}
                {link.label === "Categories" && (
                  <span>
                    <ClassOutlinedIcon className="w-10 p-1 hover:text-white" />
                  </span>
                )}
                {link.label === "Packages" && (
                  <span>
                    <DiamondIcon className="w-10 p-1 hover:text-white" />
                  </span>
                )}
                {link.label === "Subsriptions" && (
                  <span>
                    <ChecklistOutlinedIcon className="w-10 p-1 hover:text-white" />
                  </span>
                )}
                {link.label === "User Management" && (
                  <span>
                    <GroupsOutlinedIcon className="w-10 p-1 hover:text-white" />
                  </span>
                )}
                {link.label === "Communication" && (
                  <span>
                    <ChatBubbleOutlineOutlinedIcon className="w-10 p-1 hover:text-white" />
                  </span>
                )}
                {link.label === "Dispute" && (
                  <span>
                    <CoPresentOutlinedIcon className="w-10 p-1 hover:text-white" />
                  </span>
                )}
                <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                  {link.label}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default AdminNavItemsMobile;
