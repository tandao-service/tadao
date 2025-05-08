"use client";

import React, { useState } from "react";
//import {
// deleteOrder,
//  updateDispatchedOrders,
//  updatePendingOrdersToSuccessful,
//} from "@/lib/actions/order.actions";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Pagination from "./Pagination";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { deleteTransaction } from "@/lib/actions/transactions.actions";
import { deletePayment } from "@/lib/actions/payment.actions";
//import { DispatchConfirmation } from "./DispatchConfirmation";
type CollectionProps = {
  data: any[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const CollectionPayments = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages,
  urlParamName,
}: CollectionProps) => {
  // const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const pathname = usePathname();
  const { toast } = useToast();

  const handleDelete = async (_id: string) => {
    await deletePayment(_id);
    toast({
      title: "Alert",
      description: "Deleted",
      duration: 5000,
      className: "bg-[#000000] text-white",
    });
  };

  return (
    <div className="dark:bg-[#2D3236]">
      <div className="flex flex-row gap-2 items-end border-t p-2">
        {/* Total for all orders */}
        <div className="flex gap-2 items-center p-1 rounded-sm">
          <div>Total</div>
          <div className="font-bold">
            KES{" "}
            {data
              .reduce((total, txs) => total + txs.amount, 0)
              .toLocaleString()}
          </div>
        </div>


       
      </div>

      {data.length > 0 ? (
        <div>
          <table className="w-full border-collapse border border-gray-300 text-xs">
            <thead>
              <tr className="dark:bg-gray-800 bg-gray-100">
               <th className="border p-2">_id</th>
                <th className="border p-2">orderTrackingId</th>
                <th className="border p-2">name</th>
                <th className="border p-2">transactionId</th>
                <th className="border p-2">amount</th>
                <th className="border p-2">status</th>
                <th className="border p-2">balance</th>
                <th className="border p-2">date</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((trans: any) => (
                <tr key={trans._id} className="text-xs">
                 
                  <td className="border p-2">
                    {trans._id} 
                  </td>
                  <td className="border p-2">{trans.orderTrackingId}</td>
                  <td className="border p-2">{trans.name}</td>
                  <td className="border p-2"> {trans.transactionId}</td>
                  <td className="border p-2">
                    KES {trans.amount.toLocaleString()}
                  </td>
                  <td className="border p-2"> {trans.status}</td>
                  <td className="border p-2"> {trans.balance}</td>
                  <td className="border p-2">
                    {new Date(trans.createdAt).toLocaleDateString()}
                  </td>

                  <td className="border p-2">
                 
                      <>
                        <button
                          onClick={() => handleDelete(trans._id)}
                          className={`mt-1 bg-gray-100 p-1 rounded-lg cursor-pointer hover:bg-gray-200`}
                        >
                          <DeleteOutlineOutlinedIcon />
                        </button>
                      </>
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <Pagination
              urlParamName={urlParamName}
              page={page}
              totalPages={totalPages}
            />
          )}

          {/* Modal for displaying order details */}
        </div>
      ) : (
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
          <h3 className="font-bold text-[16px] lg:text-[25px]">{emptyTitle}</h3>
          <p className="text-xs lg:p-regular-14">{emptyStateSubtext}</p>
        </div>
      )}
    </div>
  );
};

export default CollectionPayments;
