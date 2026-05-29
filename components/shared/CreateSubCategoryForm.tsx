"use client";

import React, { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

import { createSubCategory } from "@/lib/actions/subcategory.actions";
import { getAllCategories } from "@/lib/actions/category.actions";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";

import CategorySelectSub from "./CategorySelectSub";
import { IconUploader } from "./IconUploader";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

interface Field {
  name: string;
  type: string;
  required: boolean;
  options: string[] | string;
}

type Props = {
  onSaved?: () => void;
};

const FIELD_TYPES = [
  ["text", "Text"],
  ["number", "Number"],
  ["money", "Money"],
  ["select", "Select"],
  ["radio", "Radio"],
  ["checkbox", "Checkbox"],
  ["textarea", "Textarea"],
  ["multi-select", "Multi-Select"],
  ["autocomplete", "AutoComplete"],
  ["year", "Year"],
  ["phone", "Phone"],
  ["price", "Sale Price"],
  ["rentprice", "Price Per Duration"],
  ["priceper", "Price Per Space"],
  ["serviceprice", "Price Per Service"],
  ["bulkprice", "Price & BulkPrice"],
  ["delivery", "Delivery Option"],
  ["youtube-link", "YouTube Link"],
  ["notify", "Notify"],
  ["related-autocompletes", "Related Autocompletes"],
];

const OPTION_FIELD_TYPES = [
  "select",
  "multi-select",
  "radio",
  "notify",
  "autocomplete",
  "checkbox",
];

const CreateSubCategoryForm = ({ onSaved }: Props) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryName, setSubCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [iconUrl, setIconUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [fields, setFields] = useState<Field[]>([
    {
      name: "",
      type: "text",
      required: false,
      options: [],
    },
  ]);

  const { toast } = useToast();
  const { startUpload } = useUploadThing("imageUploader");

  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await getAllCategories();
        setCategories(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    }

    loadCategories();
  }, []);

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

  const handleFieldChange = (index: number, key: keyof Field, value: any) => {
    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [key]: value,
    };
    setFields(updatedFields);
  };

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      {
        name: "",
        type: "text",
        required: false,
        options: [],
      },
    ]);
  };

  const handleRemoveField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputCategoryChange = (
    field: string,
    value: string,
    id: string
  ) => {
    setCategoryName(value);
    setCategoryId(id);
  };

  const normalizeFields = () => {
    return fields.map((field) => {
      const optionTypes = [...OPTION_FIELD_TYPES, "related-autocompletes"];

      if (!optionTypes.includes(field.type)) {
        return {
          ...field,
          options: [],
        };
      }

      if (field.type === "related-autocompletes") {
        return {
          ...field,
          options:
            typeof field.options === "string"
              ? field.options
              : field.options.join(","),
        };
      }

      return {
        ...field,
        options: Array.isArray(field.options)
          ? field.options.map((x) => String(x).trim()).filter(Boolean)
          : String(field.options || "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
      };
    });
  };

  const resetForm = () => {
    setCategoryName("");
    setCategoryId("");
    setSubCategoryName("");
    setIconUrl("");
    setFiles([]);
    setUploadProgress(0);
    setFields([
      {
        name: "",
        type: "text",
        required: false,
        options: [],
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      toast({
        variant: "destructive",
        title: "Missing category",
        description: "Please select a parent category.",
        duration: 4000,
      });
      return;
    }

    if (!subcategoryName.trim()) {
      toast({
        variant: "destructive",
        title: "Missing subcategory name",
        description: "Please enter subcategory name.",
        duration: 4000,
      });
      return;
    }

    const cleanFields = normalizeFields().filter((field) =>
      field.name.trim()
    );

    if (cleanFields.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Add at least one form field.",
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const imageUrl = await uploadFiles();

      const response = await createSubCategory(
        categoryId,
        subcategoryName.trim(),
        imageUrl,
        cleanFields
      );

      if (response) {
        toast({
          title: "Created",
          description: "Subcategory created successfully.",
          duration: 5000,
          className: "bg-[#30AF5B] text-white",
        });

        resetForm();
        onSaved?.();
      }
    } catch (error) {
      console.error("Error creating subcategory:", error);

      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not create subcategory. Please try again.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="space-y-5">
            <section className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-slate-950">
                  Subcategory Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Select parent category and define the subcategory name.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Parent Category
                  </label>
                  <CategorySelectSub
                    selected={categoryName}
                    data={categories}
                    onChange={handleInputCategoryChange}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Subcategory Name
                  </label>
                  <input
                    type="text"
                    value={subcategoryName}
                    onChange={(e) => setSubCategoryName(e.target.value)}
                    placeholder="e.g. Cars"
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Subcategory Icon
                </label>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <IconUploader
                    onFieldChange={(url) => setIconUrl(url || "")}
                    iconUrl={iconUrl || null}
                    setFile={setFiles}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Form Fields
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    These fields will appear when sellers post under this
                    subcategory.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddField}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
                >
                  <Plus className="h-4 w-4" />
                  Add Field
                </button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => {
                  const isOptionField = OPTION_FIELD_TYPES.includes(field.type);
                  const isRelatedAuto = field.type === "related-autocompletes";

                  return (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_auto_auto] lg:items-center">
                        <input
                          type="text"
                          placeholder="Field name"
                          value={field.name}
                          onChange={(e) =>
                            handleFieldChange(index, "name", e.target.value)
                          }
                          className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400"
                        />

                        <select
                          value={field.type}
                          onChange={(e) =>
                            handleFieldChange(index, "type", e.target.value)
                          }
                          className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400"
                        >
                          {FIELD_TYPES.map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>

                        <label className="flex items-center gap-2 text-sm text-slate-600">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) =>
                              handleFieldChange(
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
                          disabled={fields.length === 1}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>

                      {isOptionField && (
                        <div className="mt-3">
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            {field.type === "notify"
                              ? "Notification Message"
                              : "Options"}
                          </label>
                          <input
                            type="text"
                            placeholder={
                              field.type === "notify"
                                ? "Enter notification text"
                                : "Comma-separated options"
                            }
                            value={
                              Array.isArray(field.options)
                                ? field.options.join(",")
                                : field.options || ""
                            }
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "options",
                                e.target.value
                                  .split(",")
                                  .map((option) => option.trim())
                              )
                            }
                            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400"
                          />
                        </div>
                      )}

                      {isRelatedAuto && (
                        <div className="mt-3">
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Related Autocomplete Options
                          </label>
                          <textarea
                            placeholder="Comma-separated options"
                            value={
                              Array.isArray(field.options)
                                ? field.options.join(",")
                                : field.options || ""
                            }
                            onChange={(e) =>
                              handleFieldChange(index, "options", e.target.value)
                            }
                            className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-200 bg-white pt-4">
          <Button
            type="submit"
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
              {loading ? "Saving..." : "Create Subcategory"}
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubCategoryForm;