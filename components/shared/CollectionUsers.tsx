"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";
import Pagination from "./Pagination";
import UsersWindowUpdate from "./UsersWindowUpdate";
import ContactUser from "./ContactUser";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

type CollectionProps = {
  data: any[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  page: number | string;
  totalPages: number;
  urlParamName?: string;
  userId: string;
  handleOpenChatId: (value: any) => void;
  handleOpenUserAdverts?: (userId: string) => void;
};

const CollectionUsers = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages,
  urlParamName,
  handleOpenChatId,
  handleOpenUserAdverts,
}: CollectionProps) => {
  const pathname = usePathname();
  const { toast } = useToast();

  const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null);
  const [isOpenMethods, setIsOpenMethods] = useState(false);

  const [selectUser, setSelectAUser] = useState<any>([]);
  const [isOpenContact, setIsOpenContact] = useState(false);

  const handleOpenContact = (user: any) => {
    setSelectAUser(user);
    setIsOpenContact(true);
  };

  const handleCloseContact = () => setIsOpenContact(false);

  const handleOpenMethods = (delivery: any) => {
    setSelectedDelivery(delivery);
    setIsOpenMethods(true);
  };

  const handleCloseMethods = () => {
    setSelectedDelivery(null);
    setIsOpenMethods(false);
  };

  return (
    <div>
      {data.length > 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1100px] w-full">
              <thead className="dark:bg-gray-800 bg-gray-200 text-xs">
                <tr>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Business Name</th>
                  <th className="px-4 py-2">Verified</th>
                  <th className="px-4 py-2">Total Paid</th>
                  <th className="px-4 py-2">Ads</th>
                  <th className="px-4 py-2">Actions</th>
                  <th className="px-4 py-2">Contact</th>
                </tr>
              </thead>

              <tbody>
                {data.map((user: any, index: number) => (
                  <tr
                    key={user._id || index}
                    className="text-xs hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <td className="px-4 py-2 whitespace-nowrap">
                      {user.email}
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap">
                      {user.firstName} {user.lastName}
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap">
                      {user.status}
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap">
                      {user.businessname || "N/A"}
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap">
                      {user.verified &&
                        user?.verified[0]?.accountverified === true ? (
                        <p className="inline-flex items-center gap-1 rounded-sm bg-green-100 p-1 text-xs text-green-700">
                          <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
                          Verified Seller
                        </p>
                      ) : (
                        <p className="inline-flex items-center gap-1 rounded-sm bg-white p-1 text-xs text-gray-600 dark:bg-[#131B1E] dark:text-gray-400">
                          <ShieldOutlinedIcon sx={{ fontSize: 16 }} />
                          Unverified Seller
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap">
                      {user.totalPaid || "0"}
                    </td>

                    <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                      <div className="flex min-w-max gap-2">
                        <div className="flex flex-col items-center justify-center rounded-sm bg-blue-100 p-2 text-xs text-blue-600">
                          <div>Total</div>
                          <div>{user.adsCount || "0"}</div>
                        </div>

                        <div className="flex flex-col items-center justify-center rounded-sm bg-green-100 p-2 text-xs text-green-600">
                          <div>Active</div>
                          <div>{user.activeCount || 0}</div>
                        </div>

                        <div className="flex flex-col items-center justify-center rounded-sm bg-red-100 p-2 text-xs text-red-600">
                          <div>Inactive</div>
                          <div>{user.inactiveCount || 0}</div>
                        </div>

                        <div className="flex flex-col items-center justify-center rounded-sm bg-orange-100 p-2 text-xs text-orange-700">
                          <div>Pending</div>
                          <div>{user.pendingCount || 0}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenUserAdverts?.(user._id)}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500"
                        >
                          Adverts
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenMethods(user)}
                          className="cursor-pointer hover:text-green-600"
                        >
                          <ModeEditOutlinedIcon />
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenContact(user)}
                        className="rounded bg-gray-800 px-3 py-1 text-white hover:bg-gray-900"
                      >
                        <QuestionAnswerOutlinedIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ContactUser
            isOpen={isOpenContact}
            user={selectUser}
            handleOpenChatId={handleOpenChatId}
            onClose={handleCloseContact}
          />

          {totalPages > 1 && (
            <Pagination
              urlParamName={urlParamName}
              page={page}
              totalPages={totalPages}
            />
          )}
        </div>
      ) : (
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
          <h3 className="font-bold text-[16px] lg:text-[25px]">
            {emptyTitle}
          </h3>
          <p className="text-xs lg:p-regular-14">{emptyStateSubtext}</p>
        </div>
      )}

      {selectedDelivery && (
        <UsersWindowUpdate
          isOpen={isOpenMethods}
          onClose={handleCloseMethods}
          userId={selectedDelivery._id}
          type="Update"
          user={selectedDelivery}
        />
      )}
    </div>
  );
};

export default CollectionUsers;