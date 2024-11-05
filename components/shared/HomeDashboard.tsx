"use client";
import React, { useEffect, useState } from "react";
import CategoryForm from "@/components/shared/CategoryForm";
import Menulistcategory from "@/components/shared/menulistcategory";
import { getAllCategories } from "@/lib/actions/category.actions";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AdminNavItemsMobile from "@/components/shared/AdminNavItemsMobile";
import PieChart from "@/components/shared/PieChart";
import { adminLinks } from "@/constants";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CoPresentOutlinedIcon from "@mui/icons-material/CoPresentOutlined";
import DiamondIcon from "@mui/icons-material/Diamond";
import Menulistpackages from "./menulistpackages";
import PackageForm from "./packageForm";
import { getAllPackages } from "@/lib/actions/packages.actions";
import { ScrollArea } from "../ui/scroll-area";
import { getallTrans } from "@/lib/actions/transactionstatus";
import TotalRevenue from "./TotalRevenue";
import PropertyReferrals from "./PropertyReferrals";
import Chat from "./Chat";
type homeProps = {
  userId: string;
  userName: string;
  userImage: string;
};
const HomeDashboard = ({ userId, userName, userImage }: homeProps) => {
  const [activeTab, setActiveTab] = useState("Home");
  const [categoryList, setcategoryList] = useState<any[]>([]);
  const [packList, setpackList] = useState<any[]>([]);
  const [alltrans, setalltrans] = useState<any[]>([]);

  const handle = async (title: string) => {
    setActiveTab(title);
    if (title === "Categories") {
      const Categories = async () => {
        const category = await getAllCategories();
        setcategoryList(category);
      };
      Categories();
    }
    if (title === "Packages") {
      const pack = async () => {
        const list = await getAllPackages();
        setpackList(list);
      };
      pack();
    }
  };
  useEffect(() => {
    const transactions = async () => {
      const allt = await getallTrans();
      setalltrans(allt);
      console.log(allt);
      //  alert(allt);
    };
    transactions();
  }, []);
  return (
    <div className="w-full flex mt-3 p-1">
      <div className="hidden lg:inline mr-5">
        <div className="bg-gray-100 w-full rounded-lg p-3">
          <ul className="">
            {adminLinks.map((link) => {
              //  const isActive = pathname === link.route;

              return (
                <li
                  key={link.route}
                  className={`${
                    activeTab === link.label &&
                    "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white rounded-full"
                  } p-medium-16 whitespace-nowrap`}
                >
                  <div
                    onClick={() => handle(link.label)}
                    className="flex hover:bg-emerald-100 hover:rounded-full hover:text-emerald-600 p-3 mb-1 hover:cursor-pointer"
                  >
                    <span className="text-right my-auto">
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
                      {link.label === "Transactions" && (
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
                    </span>

                    <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                      {link.label}
                    </span>

                    <span className="text-right my-auto">
                      <ArrowForwardIosIcon className="w-10 p-1 hover:text-white" />
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="flex-1 rounded-lg">
        <div className="bg-white rounded-lg lg:hidden">
          <div className="">
            <AdminNavItemsMobile />
          </div>
        </div>

        {activeTab === "Home" && (
          <>
            <div className="p-2 rounded-lg bg-white max-w-6xl mx-auto flex flex-col lg:flex-row mt-3">
              <Box>
                <Typography fontSize={25} fontWeight={700} color="#11142D">
                  Dashboard
                </Typography>

                <Box mt="20px" display="flex" flexWrap="wrap" gap={2}>
                  <PieChart
                    title="Properties for Sale"
                    value={684}
                    series={[75, 25]}
                    colors={["#275be8", "#c4e8ef"]}
                  />
                  <PieChart
                    title="Properties for Rent"
                    value={550}
                    series={[60, 40]}
                    colors={["#b84644", "#4576b5"]}
                  />
                  <PieChart
                    title="Total customers"
                    value={5684}
                    series={[75, 25]}
                    colors={["#275be8", "#c4e8ef"]}
                  />
                  <PieChart
                    title="Properties for Cities"
                    value={555}
                    series={[75, 25]}
                    colors={["#275be8", "#c4e8ef"]}
                  />
                </Box>

                <Stack
                  mt="25px"
                  width="100%"
                  direction={{ xs: "column", lg: "row" }}
                  gap={4}
                >
                  <TotalRevenue />
                  <PropertyReferrals />
                </Stack>

                <Box
                  flex={1}
                  borderRadius="15px"
                  padding="20px"
                  bgcolor="#fcfcfc"
                  display="flex"
                  flexDirection="column"
                  minWidth="100%"
                  mt="25px"
                >
                  <Typography fontSize="18px" fontWeight={600} color="#11142d">
                    Latest Properties
                  </Typography>

                  <Box
                    mt={2.5}
                    sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}
                  >
                    -----------------
                  </Box>
                </Box>
              </Box>
            </div>
          </>
        )}
        {activeTab === "Categories" && (
          <>
            <div className="p-2 rounded-lg bg-white max-w-6xl mx-auto flex flex-col lg:flex-row mt-3">
              <div className="lg:flex-1 bg-white p-5 ml-2 mr-5 mb-3 lg:mb-0">
                <div className="text-lg font-bold breadcrumbs text-gray-600">
                  Add Category
                </div>
                <CategoryForm type="Create" />
              </div>

              <div className="lg:flex-1 bg-white p-5 ml-2 mr-5">
                <div className="text-lg font-bold breadcrumbs text-gray-600">
                  Category List
                </div>
                <Menulistcategory categoryList={categoryList} />
              </div>
            </div>
          </>
        )}
        {activeTab === "Packages" && (
          <>
            <div className="p-2 rounded-lg bg-white max-w-6xl mx-auto flex flex-col lg:flex-row mt-3">
              <div className="bg-white p-5 ml-2 mr-5 mb-3">
                <section className="bg-dotted-pattern bg-cover bg-center py-0 md:py-0 rounded-sm">
                  <div className="wrapper flex items-center justify-center sm:justify-between">
                    <h3 className="font-bold text-[25px] sm:text-left">
                      Add Package
                    </h3>
                  </div>
                </section>

                <PackageForm type="Create" />
              </div>

              <div className="bg-white p-5 ml-2 mr-5">
                <section className="bg-grey-50 bg-dotted-pattern bg-cover bg-center py-0 md:py-0 rounded-sm">
                  <div className="wrapper flex items-center justify-center sm:justify-between">
                    <h3 className="font-bold text-[25px] sm:text-left">
                      Packages List
                    </h3>
                  </div>
                </section>

                <Menulistpackages packagesList={packList} />
              </div>
            </div>
          </>
        )}
        {activeTab === "Communication" && (
          <>
            <div className="p-2 rounded-lg bg-white max-w-6xl mx-auto flex flex-col lg:flex-row mt-3">
              <Chat
                senderId={userId}
                senderName={userName}
                senderImage={userImage}
              />
            </div>
          </>
        )}
        {activeTab === "Transactions" && (
          <>
            <div className="p-2 rounded-lg bg-white max-w-6xl mx-auto flex flex-col lg:flex-row mt-3">
              <div className="flex flex-col border shadow-lg rounded-lg bg-gray-100 p-2 mb-2 w-full">
                <p className="font-bold text-[25px]">History</p>
                <div className="grid grid-cols-6 text-grey-600 text-xs text-[#000000] rounded-t-lg p-1">
                  <div className="justify-center items-center flex flex-col">
                    Status
                  </div>

                  <div className="justify-center items-center flex flex-col">
                    Order Tracking Id
                  </div>
                  <div className="justify-center items-center flex flex-col">
                    Plan
                  </div>
                  <div className="justify-center items-center flex flex-col">
                    Period
                  </div>
                  <div className="justify-center items-center flex flex-col">
                    Amount KES
                  </div>
                  <div className="justify-center items-center flex flex-col">
                    Date
                  </div>
                </div>
                <ScrollArea className="h-[350px]">
                  <ul className="w-full">
                    {alltrans.map((trans: any, index: any) => {
                      return (
                        <li
                          className="w-full  bg-grey-100 p-1 text-gray-600"
                          key={index}
                        >
                          <div
                            className={`p-1 mt-1 rounded-sm grid grid-cols-6 gap-1 w-full text-xs`}
                          >
                            <div className="flex">
                              <div
                                className={`flex flex-col p-1 text-white justify-center items-center w-[70px] rounded-full ${
                                  trans.status === "Pending"
                                    ? "bg-yellow-600"
                                    : trans.status === "Failed"
                                    ? "bg-red-600 "
                                    : "bg-green-600"
                                }`}
                              >
                                {trans.status}
                              </div>
                            </div>

                            <div className="justify-center items-center flex flex-col">
                              {trans.orderTrackingId}
                            </div>
                            <div className="justify-center items-center flex flex-col">
                              {trans.plan}
                            </div>
                            <div className="justify-center items-center flex flex-col">
                              {trans.period}
                            </div>
                            <div className="justify-center items-center flex flex-col">
                              KES {trans.amount.toFixed(2)}
                            </div>
                            <div className="justify-center items-center flex flex-col">
                              {trans.createdAt}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeDashboard;
