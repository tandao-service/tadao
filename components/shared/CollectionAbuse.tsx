"use client";

import React, { useState } from "react";
import Pagination from "./Pagination";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import ReportActionWindow from "./ReportActionWindow";

type CollectionProps = {
  data: any[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  page: number | string;
  totalPages: number;
  urlParamName?: string;
  userId: string;
  handleOpenChatId: (value: string) => void;
};

const CollectionAbuse = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages,
  urlParamName,
  handleOpenChatId,
}: CollectionProps) => {
  const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null);
  const [isOpenMethods, setIsOpenMethods] = useState(false);

  const handleOpenMethods = (delivery: any) => {
    setSelectedDelivery(delivery);
    setIsOpenMethods(true);
  };

  const handleCloseMethods = () => {
    setSelectedDelivery(null);
    setIsOpenMethods(false);
  };

  return (
    <div className="dark:bg-[#2D3236]">
      {data.length > 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-600 dark:bg-[#2D3236]">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1000px] w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead className="bg-gray-200 text-xs dark:bg-gray-800">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                    Ad Id
                  </th>
                  <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                    Creater Phone
                  </th>
                  <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                    Reason
                  </th>
                  <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                    Reporter Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                    Reporter Phone
                  </th>
                  <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((report: any, index: number) => (
                  <tr
                    key={report?._id || index}
                    className="text-xs hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                      {report?.adId?._id}
                    </td>

                    <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                      {report?.adId?.data?.phone || "N/A"}
                    </td>

                    <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                      {report?.reason || "N/A"}
                    </td>

                    <td className="min-w-[260px] border border-gray-300 px-4 py-2 dark:border-gray-600">
                      {report?.description || "N/A"}
                    </td>

                    <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                      {report?.userId?.firstName} {report?.userId?.lastName}
                    </td>

                    <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                      {report?.userId?.phone || "N/A"}
                    </td>

                    <td className="whitespace-nowrap border border-gray-300 px-4 py-2 dark:border-gray-600">
                      <button
                        type="button"
                        onClick={() => handleOpenMethods(report.adId)}
                        className="cursor-pointer hover:text-green-600"
                      >
                        <ModeEditOutlinedIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
        <ReportActionWindow
          isOpen={isOpenMethods}
          onClose={handleCloseMethods}
          ad={selectedDelivery}
          handleOpenChatId={handleOpenChatId}
        />
      )}
    </div>
  );
};

export default CollectionAbuse;