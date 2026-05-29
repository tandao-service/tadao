"use client";

import React from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PackageForm from "./packageForm";

interface AddPackageWindowProps {
  isOpen: boolean;
  onClose: () => void;
  type: "Create" | "Update";
  pack?: any;
  packageId?: string;
  onSaved?: () => void;
}

const AddPackageWindow: React.FC<AddPackageWindowProps> = ({
  isOpen,
  type,
  pack,
  packageId,
  onClose,
  onSaved,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-[28px] border border-slate-200 bg-white p-4 shadow-2xl dark:bg-[#131B1E] dark:text-gray-300">
        <div className="mb-3 flex items-start justify-between gap-4 border-b border-slate-200 pb-3 dark:border-gray-700">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
              {type === "Create" ? "New Package" : "Edit Package"}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-gray-100">
              {type === "Create" ? "Add Package" : "Update Package"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <CloseOutlinedIcon />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <PackageForm
            type={type}
            pack={pack}
            packageId={packageId}
            onSaved={onSaved}
          />
        </div>
      </div>
    </div>
  );
};

export default AddPackageWindow;