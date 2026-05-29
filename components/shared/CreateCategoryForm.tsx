"use client";

import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";

import { Button } from "../ui/button";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import { useUploadThing } from "@/lib/uploadthing";
import { createCategory, updateCategory } from "@/lib/actions/category.actions";
import { IconUploader } from "./IconUploader";
import { ICategory } from "@/lib/database/models/category.model";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";

interface CategoryProps {
  category?: ICategory | null;
  type: "Create" | "Update";
  onSaved?: () => void;
}

const CreateCategoryForm = ({ category, type, onSaved }: CategoryProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [oldurl, setOldurl] = useState("");
  const [formData, setFormData] = useState<Record<string, any>>({
    name: "",
    imageUrl: "",
  });

  const pathname = usePathname();
  const { toast } = useToast();
  const { startUpload } = useUploadThing("imageUploader");

  useEffect(() => {
    if (type === "Update" && category) {
      const currentImage = Array.isArray(category.imageUrl)
        ? category.imageUrl[0]
        : category.imageUrl || "";

      setOldurl(currentImage);

      setFormData({
        name: category.name || "",
        imageUrl: currentImage,
      });
    }
  }, [category, type]);

  const uploadFiles = async () => {
    if (files.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const uploadedImages = await startUpload([files[i]]);

      if (uploadedImages && uploadedImages.length > 0) {
        uploadedUrls.push(uploadedImages[0].url);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }
    }

    return uploadedUrls.filter((url) => !url.includes("blob:"));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name?.trim()) {
      toast({
        variant: "destructive",
        title: "Missing category name",
        description: "Please enter category name.",
        duration: 4000,
      });
      return;
    }

    setLoading(true);

    try {
      const uploadedUrls = await uploadFiles();

      const finalImageUrl =
        uploadedUrls.length > 0
          ? uploadedUrls
          : formData.imageUrl
            ? [formData.imageUrl]
            : [];

      const finalData = {
        name: formData.name.trim(),
        imageUrl: finalImageUrl,
      };

      if (type === "Create") {
        const created = await createCategory({
          formData: finalData,
          path: pathname,
        });

        if (created) {
          toast({
            title: "Created",
            description: "Category created successfully.",
            duration: 5000,
            className: "bg-[#30AF5B] text-white",
          });

          setFormData({ name: "", imageUrl: "" });
          setFiles([]);
          setUploadProgress(0);
          onSaved?.();
        }
      }

      if (type === "Update" && category) {
        const hasNewImage = uploadedUrls.length > 0;

        const updated = await updateCategory({
          _id: category._id.toString(),
          formData: finalData,
          deleteUrl: !hasNewImage,
          oldurl,
          path: pathname,
        });

        if (updated) {
          toast({
            title: "Updated",
            description: "Category updated successfully.",
            duration: 5000,
            className: "bg-[#30AF5B] text-white",
          });

          onSaved?.();
        }
      }
    } catch (error) {
      console.error("Category submission failed", error);

      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not save category. Please try again.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <section className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-950">
              Category Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add or update the category name and icon.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g. Vehicles"
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category Icon
              </label>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <IconUploader
                  onFieldChange={(url) => handleInputChange("imageUrl", url)}
                  iconUrl={formData.imageUrl || null}
                  setFile={setFiles}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-4 border-t border-slate-200 bg-white pt-4">
        <Button
          type="button"
          onClick={handleSubmit}
          size="lg"
          disabled={loading}
          className="w-full rounded-2xl bg-slate-950 hover:bg-orange-500"
        >
          <div className="flex items-center justify-center gap-2">
            {loading ? (
              <CircularProgressWithLabel value={uploadProgress} />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {loading
              ? "Saving..."
              : type === "Create"
                ? "Create Category"
                : "Save Category Changes"}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default CreateCategoryForm;