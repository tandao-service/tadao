"use client";

import React, { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { TextareaAutosize } from "@mui/material";
import Image from "next/image";

import {
  deleteCategory,
  updateSubCategory,
} from "@/lib/actions/subcategory.actions";

import { IconUploader } from "./IconUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "../ui/use-toast";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  subcategories: any[];
  onSaved?: () => void;
};

const optionTypes = [
  "select",
  "multi-select",
  "radio",
  "notify",
  "autocomplete",
  "checkbox",
];

const fieldTypes = [
  "text",
  "number",
  "money",
  "select",
  "radio",
  "checkbox",
  "textarea",
  "multi-select",
  "autocomplete",
  "year",
  "phone",
  "price",
  "rentprice",
  "priceper",
  "bulkprice",
  "serviceprice",
  "delivery",
  "youtube-link",
  "notify",
  "related-autocompletes",
];

const DisplaySubCategories = ({ subcategories, onSaved }: Props) => {
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editFields, setEditFields] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [iconUrl, setIconUrl] = useState("");
  const [oldurl, setOldurl] = useState("");
  const [saving, setSaving] = useState(false);

  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();

  const handleEdit = (subcategory: any) => {
    setEditingCategory(subcategory);
    setEditFields(Array.isArray(subcategory.fields) ? subcategory.fields : []);
    setIconUrl("");
    setOldurl(
      Array.isArray(subcategory.imageUrl)
        ? subcategory.imageUrl[0] || ""
        : subcategory.imageUrl || ""
    );
    setFiles([]);
  };

  const closeEditModal = () => {
    setEditingCategory(null);
    setEditFields([]);
    setIconUrl("");
    setOldurl("");
    setFiles([]);
  };

  const handleEditFieldChange = (index: number, key: string, value: any) => {
    const updatedFields = [...editFields];
    updatedFields[index] = {
      ...updatedFields[index],
      [key]: value,
    };
    setEditFields(updatedFields);
  };

  const handleRemoveField = (index: number) => {
    setEditFields((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const uploadedImages = await startUpload([file]);

      if (uploadedImages?.[0]?.url) {
        uploadedUrls.push(uploadedImages[0].url);
      }
    }

    return uploadedUrls.filter((url) => !url.includes("blob:"));
  };

  const handleDelete = async (subcategoryId: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;

    try {
      await deleteCategory(subcategoryId, imageUrl);

      toast({
        title: "Deleted",
        description: "Subcategory deleted successfully.",
        duration: 5000,
        className: "bg-[#30AF5B] text-white",
      });

      onSaved?.();
    } catch (error) {
      console.error("Error deleting subcategory:", error);

      toast({
        variant: "destructive",
        title: "Failed",
        description: "Failed to delete subcategory. Please try again.",
        duration: 5000,
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;

    try {
      setSaving(true);

      let imageUrl: any;

      if (files.length > 0 || iconUrl) {
        const uploadedUrls = await uploadFiles();
        imageUrl = uploadedUrls.length > 0 ? uploadedUrls : [iconUrl];
      } else {
        imageUrl = Array.isArray(editingCategory.imageUrl)
          ? editingCategory.imageUrl
          : [editingCategory.imageUrl];
      }

      const subcategoryId = editingCategory._id;

      const parentCategoryId =
        typeof editingCategory.category === "object"
          ? editingCategory.category._id
          : editingCategory.category;

      await updateSubCategory(
        subcategoryId,
        parentCategoryId,
        editingCategory.subcategory,
        imageUrl,
        files.length > 0 || iconUrl ? oldurl : "",
        editFields
      );

      toast({
        title: "Updated",
        description: "Subcategory updated successfully.",
        duration: 5000,
        className: "bg-[#30AF5B] text-white",
      });

      closeEditModal();
      onSaved?.();
    } catch (error) {
      console.error("Error saving edits:", error);

      toast({
        variant: "destructive",
        title: "Failed",
        description: "Failed to save edits. Please try again.",
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        {subcategories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
            No subcategories available.
          </div>
        ) : (
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr>
                <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subcategory
                </th>
                <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </th>
                <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Fields
                </th>
                <th className="px-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {subcategories.map((subcategory: any) => {
                const imageUrl = Array.isArray(subcategory.imageUrl)
                  ? subcategory.imageUrl[0]
                  : subcategory.imageUrl;

                return (
                  <tr key={subcategory._id}>
                    <td className="rounded-l-2xl bg-slate-50 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                          {imageUrl ? (
                            <Image
                              className="h-7 w-7 object-contain"
                              src={imageUrl}
                              alt={subcategory.subcategory}
                              width={60}
                              height={60}
                              unoptimized
                            />
                          ) : (
                            <span className="text-xs text-slate-400">Icon</span>
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-950">
                            {subcategory.subcategory}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            ID: {String(subcategory._id)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="bg-slate-50 px-4 py-4 text-sm text-slate-700">
                      {subcategory.category?.name || "-"}
                    </td>

                    <td className="bg-slate-50 px-4 py-4 text-sm text-slate-700">
                      {Array.isArray(subcategory.fields)
                        ? subcategory.fields.length
                        : 0}
                    </td>

                    <td className="rounded-r-2xl bg-slate-50 px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(subcategory)}
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white hover:bg-orange-500"
                        >
                          <EditOutlinedIcon fontSize="small" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(subcategory._id, imageUrl || "")
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                        >
                          <DeleteOutlineOutlinedIcon fontSize="small" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                  Edit Subcategory
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  {editingCategory.subcategory}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Parent category: {editingCategory.category?.name || "-"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-2xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
              >
                <CloseOutlinedIcon />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <section className="mb-5 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Subcategory Icon
                </label>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <IconUploader
                    onFieldChange={(url) => setIconUrl(url || "")}
                    iconUrl={
                      iconUrl ||
                      (Array.isArray(editingCategory.imageUrl)
                        ? editingCategory.imageUrl[0]
                        : editingCategory.imageUrl) ||
                      null
                    }
                    setFile={setFiles}
                  />
                </div>
              </section>

              <section className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">
                      Form Fields
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Edit fields shown when sellers post under this
                      subcategory.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setEditFields((prev) => [
                        ...prev,
                        {
                          name: "",
                          type: "text",
                          required: false,
                          options: [],
                          multiSelect: false,
                        },
                      ])
                    }
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
                  >
                    <AddOutlinedIcon fontSize="small" />
                    Add Field
                  </button>
                </div>

                <div className="space-y-3">
                  {editFields.map((field: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_auto_auto] lg:items-center">
                        <input
                          type="text"
                          value={field.name || ""}
                          onChange={(e) =>
                            handleEditFieldChange(index, "name", e.target.value)
                          }
                          placeholder="Field name"
                          className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400"
                        />

                        <select
                          value={field.type || "text"}
                          onChange={(e) =>
                            handleEditFieldChange(index, "type", e.target.value)
                          }
                          className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400"
                        >
                          {fieldTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>

                        <label className="flex items-center gap-2 text-sm text-slate-600">
                          <input
                            type="checkbox"
                            checked={Boolean(field.required)}
                            onChange={(e) =>
                              handleEditFieldChange(
                                index,
                                "required",
                                e.target.checked
                              )
                            }
                          />
                          Required
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveField(index)}
                          className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                        >
                          <DeleteOutlineOutlinedIcon fontSize="small" />
                        </button>
                      </div>

                      {optionTypes.includes(field.type) && (
                        <input
                          type="text"
                          placeholder={
                            field.type === "notify"
                              ? "Notification"
                              : "Comma-separated options"
                          }
                          value={
                            Array.isArray(field.options)
                              ? field.options.join(",")
                              : field.options || ""
                          }
                          onChange={(e) =>
                            handleEditFieldChange(
                              index,
                              "options",
                              e.target.value
                                .split(",")
                                .map((option) => option.trim())
                            )
                          }
                          className="mt-3 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400"
                        />
                      )}

                      {field.type === "related-autocompletes" && (
                        <TextareaAutosize
                          placeholder="Comma-separated options"
                          value={
                            Array.isArray(field.options)
                              ? field.options.join(",")
                              : field.options || ""
                          }
                          minRows={3}
                          maxRows={10}
                          onChange={(e) =>
                            handleEditFieldChange(
                              index,
                              "options",
                              e.target.value
                            )
                          }
                          className="mt-3 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-orange-400"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-2 text-sm font-medium text-white hover:bg-orange-500 disabled:opacity-60"
              >
                <DoneOutlinedIcon fontSize="small" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DisplaySubCategories;