"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { packageFormSchema } from "@/lib/validator";
import { PackagesDefaultValues } from "@/constants";
import { Textarea } from "../ui/textarea";
import "react-datepicker/dist/react-datepicker.css";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IPackages } from "@/lib/database/models/packages.model";
import { createPackage, updatePackage } from "@/lib/actions/packages.actions";
import { FileUploaderPackage } from "./FileuploaderPackage";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";

type packageFormProps = {
  type: "Create" | "Update";
  pack?: IPackages;
  packageId?: string;
};

const PackageForm = ({ type, pack, packageId }: packageFormProps) => {
  const initialValues =
    pack && type === "Update"
      ? {
        ...pack,
      }
      : PackagesDefaultValues;

  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof packageFormSchema>>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: initialValues,
  });

  const { startUpload } = useUploadThing("imageUploader");
  const [showmessage, setmessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof packageFormSchema>) {
    let uploadedImageUrl = values.imageUrl;
    try {
      if (files.length > 0) {
        const uploadedImages = await startUpload(files);

        if (!uploadedImages) {
          return;
        }

        uploadedImageUrl = uploadedImages[0].url;
      }

      if (type === "Create") {
        const newPack = await createPackage({
          pack: {
            ...values,
            imageUrl: uploadedImageUrl,
            list: Number(form.getValues("list")),
            priority: Number(form.getValues("priority")),
          },
          path: "/profile",
        });
        if (newPack) {
          form.reset();
          toast({
            title: "Created",
            description: "Package created successfully.",
            duration: 5000,
            className: "bg-[#30AF5B] text-white",
          });
        }
      } else if (type === "Update") {
        if (!packageId) {
          router.back();
          return;
        }

        const updatedPack = await updatePackage({
          pack: {
            ...values,
            imageUrl: uploadedImageUrl,
            _id: packageId,
            list: Number(form.getValues("list")),
            priority: Number(form.getValues("priority")),
          },
          path: `/packages/${packageId}`,
        });

        if (updatedPack) {
          form.reset();
          toast({
            title: "Updated",
            description: "Package updated successfully.",
            duration: 5000,
            className: "bg-[#30AF5B] text-white",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  // Example of a color picker component
  interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
  }

  const ColorPicker: React.FC<ColorPickerProps> = ({ onChange, value }) => {
    return (
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };

  const [newListingTitle, setNewListingTitle] = useState("");
  const [newListingPeriod, setNewListingPeriod] = useState("");
  const [newListingAmount, setNewListingAmount] = useState("");

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setNewListingTitle(event.target.value);
  };

  const handleInputChangePeriod = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setNewListingPeriod(event.target.value);
  };

  const handleInputChangeAmount = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setNewListingAmount(event.target.value);
  };

  const [isChecked, setIsChecked] = useState(false); // for new feature row

  /* ---------- Sync "x Allowed Listings" with Allowable Listing ---------- */
  const listValue = form.watch("list");
  useEffect(() => {
    const currentFeatures = form.getValues("features") || [];

    const numericList = Number(listValue) || 0;

    const updatedFeatures = currentFeatures.map((f: any) => {
      const isAllowedListingFeature =
        typeof f.title === "string" &&
        f.title.toLowerCase().includes("allowed listings");

      if (isAllowedListingFeature) {
        return {
          ...f,
          title: `${numericList} Allowed Listings`,
        };
      }

      return f;
    });

    form.setValue("features", updatedFeatures);
  }, [listValue, form]);

  return (
    <>
      <ScrollArea className="h-[400px] w-full p-3">
        {showAlert && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{showmessage}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="">
              {/* Package name */}
              <div className="flex flex-col p-2 w-full">
                <div className="flex items-center font-bold">
                  <h1>Package name</h1>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Name"
                          {...field}
                          className="input-field dark:bg-[#2D3236] bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col p-2 w-full">
                <div className="flex items-center font-bold">
                  <h1>Package Description</h1>
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl className="h-30">
                        <Textarea
                          placeholder="Description"
                          {...field}
                          className="textarea rounded-xl dark:bg-[#2D3236] bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Allowable Listing */}
              <div className="flex flex-col p-2 w-full">
                <div className="flex items-center font-bold">
                  <h1>Allowable Listing</h1>
                </div>
                <FormField
                  control={form.control}
                  name="list"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Allowable Listing"
                          {...field}
                          className="input-field dark:bg-[#2D3236] bg-white"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Priority */}
              <div className="flex flex-col p-2 w-full">
                <div className="flex items-center font-bold">
                  <h1>Priority</h1>
                </div>
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Priority"
                          {...field}
                          className="input-field dark:bg-[#2D3236] bg-white"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ---------- Features Listings ---------- */}
              <div className="flex rounded-xl border mt-3 flex-col p-2 w-full">
                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="flex flex-col w-full rounded-2xl bg-grey-50">
                          <div>
                            <div className="flex items-center font-bold">
                              <h1>Features Listings</h1>
                            </div>
                            <ul className="space-y-2">
                              {field.value &&
                                field.value.map((feature: any, index: number) => {
                                  const isAllowedListingFeature =
                                    typeof feature.title === "string" &&
                                    feature.title
                                      .toLowerCase()
                                      .includes("allowed listings");

                                  const numericList = Number(listValue) || 0;
                                  const displayTitle = isAllowedListingFeature
                                    ? `${numericList} Allowed Listings`
                                    : feature.title;

                                  // Special row: "x Allowed Listings" → text only, no edit, no delete, no checkbox
                                  if (isAllowedListingFeature) {
                                    return (
                                      <li
                                        key={index}
                                        className="flex items-center gap-2"
                                      >
                                        <span className="flex-1 text-sm font-medium">
                                          {displayTitle}
                                        </span>
                                      </li>
                                    );
                                  }

                                  // Normal features: editable + deletable
                                  return (
                                    <li
                                      key={index}
                                      className="flex items-center gap-2"
                                    >
                                      {/* Editable title */}
                                      <Input
                                        className="flex-1 dark:bg-[#2D3236] bg-white"
                                        value={feature.title}
                                        onChange={(e) => {
                                          const updatedFeatures = [
                                            ...(field.value || []),
                                          ];
                                          updatedFeatures[index] = {
                                            ...updatedFeatures[index],
                                            title: e.target.value,
                                          };
                                          field.onChange(updatedFeatures);
                                        }}
                                        placeholder="Feature title"
                                      />

                                      {/* Enabled checkbox */}
                                      <input
                                        type="checkbox"
                                        checked={feature.checked}
                                        onChange={(e) => {
                                          const updatedFeatures = [
                                            ...(field.value || []),
                                          ];
                                          updatedFeatures[index] = {
                                            ...updatedFeatures[index],
                                            checked: e.target.checked,
                                          };
                                          field.onChange(updatedFeatures);
                                        }}
                                        className="ml-2 p-2 cursor-pointer"
                                      />

                                      {/* Delete icon */}
                                      <Image
                                        src="/assets/icons/delete.svg"
                                        alt="delete"
                                        className="p-2 cursor-pointer"
                                        width={35}
                                        height={35}
                                        onClick={() => {
                                          const updatedFeatures =
                                            field.value.filter(
                                              (_: any, i: number) =>
                                                i !== index
                                            );
                                          field.onChange(updatedFeatures);
                                        }}
                                      />
                                    </li>
                                  );
                                })}
                            </ul>

                            {/* Add new feature row */}
                            <div className="flex items-center justify-between h-[54px] w-full overflow-hidden mt-2">
                              <Input
                                className="ml-2 mr-2 dark:bg-[#2D3236] bg-white"
                                value={newListingTitle}
                                onChange={handleInputChange}
                                placeholder="Enter Feature title"
                              />
                              <div className="flex items-center">
                                <label
                                  htmlFor="negotiable"
                                  className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Enabled
                                </label>
                                <Checkbox
                                  onCheckedChange={() =>
                                    setIsChecked(!isChecked)
                                  }
                                  checked={isChecked}
                                  id="recommended"
                                  className="mr-2 h-5 w-5 border-2 border-primary-500"
                                />
                              </div>

                              <Image
                                src="/assets/icons/add.svg"
                                alt="add"
                                className="p-0 cursor-pointer"
                                width={45}
                                height={45}
                                onClick={() => {
                                  if (newListingTitle.trim() !== "") {
                                    const updatedFeatures = [
                                      ...(field.value || []),
                                      {
                                        title: newListingTitle.trim(),
                                        checked: isChecked,
                                      },
                                    ];
                                    field.onChange(updatedFeatures);
                                    setNewListingTitle("");
                                    setIsChecked(false); // Reset checkbox state
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ---------- Price Listings ---------- */}
              <div className="flex mt-3 rounded-xl border flex-col p-2 w-full">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="flex flex-col gap-5 md:flex-row rounded-2xl bg-grey-50">
                          <div>
                            <div className="flex items-center font-bold">
                              <h1>Price Listings</h1>
                            </div>
                            <ul>
                              {field.value &&
                                field.value.map((price: any, index: number) => (
                                  <li
                                    key={index}
                                    className="flex items-center mt-2 gap-5 w-full"
                                  >
                                    {/* Editable Period */}
                                    <Input
                                      className="flex-1 ml-2 mr-2 dark:bg-[#2D3236] bg-white"
                                      value={price.period}
                                      onChange={(e) => {
                                        const updatedPrice = [...(field.value || [])];
                                        updatedPrice[index] = {
                                          ...updatedPrice[index],
                                          period: e.target.value,
                                        };
                                        field.onChange(updatedPrice);
                                      }}
                                      placeholder="Period"
                                    />

                                    {/* Editable Amount */}
                                    <Input
                                      className="flex-1 ml-2 mr-2 dark:bg-[#2D3236] bg-white"
                                      value={price.amount}
                                      type="number"
                                      onChange={(e) => {
                                        const updatedPrice = [...(field.value || [])];
                                        updatedPrice[index] = {
                                          ...updatedPrice[index],
                                          amount:
                                            e.target.value === ""
                                              ? 0
                                              : Number(e.target.value),
                                        };
                                        field.onChange(updatedPrice);
                                      }}
                                      placeholder="Amount"
                                    />

                                    {/* Delete icon */}
                                    <Image
                                      src="/assets/icons/delete.svg"
                                      alt="delete"
                                      className="p-2 cursor-pointer"
                                      width={35}
                                      height={35}
                                      onClick={() => {
                                        const updatedPrice = field.value.filter(
                                          (_: any, i: number) => i !== index
                                        );
                                        field.onChange(updatedPrice);
                                      }}
                                    />
                                  </li>
                                ))}
                            </ul>

                            {/* Add new price row */}
                            <div className="flex items-center justify-between h-[54px] w-full overflow-hidden">
                              <Input
                                className="ml-2 mr-2 dark:bg-[#2D3236] bg-white"
                                value={newListingPeriod}
                                onChange={handleInputChangePeriod}
                                placeholder="Period"
                              />
                              <Input
                                className="ml-2 mr-2 dark:bg-[#2D3236] bg-white"
                                value={newListingAmount}
                                onChange={handleInputChangeAmount}
                                placeholder="Amount"
                              />

                              <Image
                                src="/assets/icons/add.svg"
                                alt="add"
                                className="p-0 cursor-pointer"
                                width={45}
                                height={45}
                                onClick={() => {
                                  if (newListingPeriod.trim() !== "") {
                                    const updatedPrice = [
                                      ...(field.value || []),
                                      {
                                        period: newListingPeriod.trim(),
                                        amount: parseFloat(newListingAmount.trim()),
                                      },
                                    ];
                                    field.onChange(updatedPrice);
                                    setNewListingPeriod("");
                                    setNewListingAmount("");
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </div>

            {/* ---------- Color ---------- */}
            <div className="flex rounded-xl border mt-3 flex-col p-2 w-full">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="flex h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                        <Image
                          src="/assets/icons/link.svg"
                          alt="link"
                          width={24}
                          height={24}
                        />

                        <label
                          htmlFor="color"
                          className="whitespace-nowrap p-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Choose Color
                        </label>
                        <div className="mr-2 p-2">
                          <ColorPicker
                            value={field.value}
                            onChange={(color: any) => field.onChange(color)}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ---------- Image & Submit ---------- */}
            <div className="flex flex-col mt-2 w-full">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl className="h-50">
                      <FileUploaderPackage
                        onFieldChange={field.onChange}
                        imageUrl={field.value}
                        setFiles={setFiles}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="p-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                  className="button col-span-2 mt-3 w-full"
                >
                  {form.formState.isSubmitting
                    ? "Submitting..."
                    : `${type} Package `}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </>
  );
};

export default PackageForm;
