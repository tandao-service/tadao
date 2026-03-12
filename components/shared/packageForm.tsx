"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "../ui/use-toast";

import { packageFormSchema } from "@/lib/validator";
import { PackagesDefaultValues } from "@/constants";
import { useUploadThing } from "@/lib/uploadthing";
//import { IPackages } from "@/lib/database/models/packages.model";
import { createPackage, updatePackage } from "@/lib/actions/packages.actions";
import { FileUploaderPackage } from "./FileuploaderPackage";

type packageFormProps = {
  type: "Create" | "Update";
  pack?: any;
  packageId?: string;
};

const PackageForm = ({ type, pack, packageId }: packageFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { startUpload } = useUploadThing("imageUploader");

  const [files, setFiles] = useState<File[]>([]);
  const [showmessage, setmessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // ✅ Normalize initial values (support old packages that don't have entitlements/price2 yet)
  const initialValues =
    pack && type === "Update"
      ? ({
        ...pack,
        features: (pack as any)?.features ?? [],
        price: (pack as any)?.price ?? [],
        price2: (pack as any)?.price2 ?? [],
        entitlements: {
          maxListings:
            (pack as any)?.entitlements?.maxListings ??
            (pack as any)?.list ??
            0,
          priority:
            (pack as any)?.entitlements?.priority ??
            (pack as any)?.priority ??
            0,
          topDays: (pack as any)?.entitlements?.topDays ?? 0,
          featuredDays: (pack as any)?.entitlements?.featuredDays ?? 0,
          autoRenewHours:
            (pack as any)?.entitlements?.autoRenewHours ?? null,
        },
      } as any)
      : ({
        ...PackagesDefaultValues,
        price2: (PackagesDefaultValues as any)?.price2 ?? [],
        entitlements: {
          maxListings: 0,
          priority: 0,
          topDays: 0,
          featuredDays: 0,
          autoRenewHours: null,
        },
      } as any);

  const form = useForm<z.infer<typeof packageFormSchema>>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: initialValues,
  });

  // ------------ Color picker ------------
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

  // ------------ Feature add row state ------------
  const [newListingTitle, setNewListingTitle] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setNewListingTitle(event.target.value);
  };

  // ------------ Price add row state (price) ------------
  const [newListingPeriod, setNewListingPeriod] = useState("");
  const [newListingAmount, setNewListingAmount] = useState("");

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

  // ------------ Price add row state (price2) ------------
  const [newListingPeriod2, setNewListingPeriod2] = useState("");
  const [newListingAmount2, setNewListingAmount2] = useState("");

  // ✅ Sync "X Allowed Listings" with entitlements.maxListings (new upgrade)
  const maxListingsValue = form.watch("entitlements.maxListings");
  useEffect(() => {
    const currentFeatures = form.getValues("features") || [];
    const numericList = Number(maxListingsValue) || 0;

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

    form.setValue("features", updatedFeatures, { shouldDirty: true });
  }, [maxListingsValue, form]);

  async function onSubmit(values: z.infer<typeof packageFormSchema>) {
    let uploadedImageUrl = values.imageUrl;

    try {
      if (files.length > 0) {
        const uploadedImages = await startUpload(files);
        if (!uploadedImages) return;
        uploadedImageUrl = uploadedImages[0].url;
      }

      // ✅ mirror legacy fields from entitlements (backward compatibility)
      const maxListings = Number(values.entitlements?.maxListings ?? 0);
      const entPriority = Number(values.entitlements?.priority ?? 0);

      const payload = {
        ...values,
        imageUrl: uploadedImageUrl,

        // ✅ legacy mirror fields used elsewhere in your app
        list: maxListings,
        priority: entPriority,

        // ✅ ensure entitlements is clean
        entitlements: {
          maxListings,
          priority: entPriority,
          topDays: Number(values.entitlements?.topDays ?? 0),
          featuredDays: Number(values.entitlements?.featuredDays ?? 0),
          autoRenewHours:
            values.entitlements?.autoRenewHours === null ||
              values.entitlements?.autoRenewHours === undefined
              ? null
              : Number(values.entitlements.autoRenewHours),
        },

        // ✅ ensure arrays exist
        features: values.features ?? [],
        price: values.price ?? [],
        price2: (values as any).price2 ?? [],
      };

      if (type === "Create") {
        const newPack = await createPackage({
          pack: payload as any,
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
            ...(payload as any),
            _id: packageId,
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
      setShowAlert(true);
      setmessage("Error submitting package. Check console for details.");
    }
  }

  return (
    <ScrollArea className="h-[400px] w-full p-3">
      {showAlert && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{showmessage}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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

          {/* ✅ Entitlements (new upgrade) */}
          <div className="flex rounded-xl border mt-3 flex-col p-2 w-full">
            <div className="flex items-center font-bold px-2">
              <h1>Entitlements (New Upgrade)</h1>
            </div>

            {/* Max Listings */}
            <div className="flex flex-col p-2 w-full">
              <div className="flex items-center font-bold">
                <h1>Max Listings</h1>
              </div>
              <FormField
                control={form.control}
                name="entitlements.maxListings"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Max Listings"
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
                name="entitlements.priority"
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

            {/* Top Days */}
            <div className="flex flex-col p-2 w-full">
              <div className="flex items-center font-bold">
                <h1>Top Days</h1>
              </div>
              <FormField
                control={form.control}
                name="entitlements.topDays"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Top Days"
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

            {/* Featured Days */}
            <div className="flex flex-col p-2 w-full">
              <div className="flex items-center font-bold">
                <h1>Featured Days</h1>
              </div>
              <FormField
                control={form.control}
                name="entitlements.featuredDays"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Featured Days"
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

            {/* Auto Renew Hours */}
            <div className="flex flex-col p-2 w-full">
              <div className="flex items-center font-bold">
                <h1>Auto Renew Hours (optional)</h1>
              </div>
              <FormField
                control={form.control}
                name="entitlements.autoRenewHours"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        value={field.value === null ? "" : String(field.value)}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? null : Number(e.target.value)
                          )
                        }
                        placeholder="24 / 12 (leave empty for none)"
                        className="input-field dark:bg-[#2D3236] bg-white"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

                              const numericList =
                                Number(maxListingsValue) || 0;
                              const displayTitle = isAllowedListingFeature
                                ? `${numericList} Allowed Listings`
                                : feature.title;

                              // Special row: allowed listings
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

                              return (
                                <li
                                  key={index}
                                  className="flex items-center gap-2"
                                >
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

                                  <Image
                                    src="/assets/icons/delete.svg"
                                    alt="delete"
                                    className="p-2 cursor-pointer"
                                    width={35}
                                    height={35}
                                    onClick={() => {
                                      const updatedFeatures =
                                        field.value.filter(
                                          (_: any, i: number) => i !== index
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
                            <label className="whitespace-nowrap pr-3 leading-none">
                              Enabled
                            </label>
                            <Checkbox
                              onCheckedChange={() => setIsChecked(!isChecked)}
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
                                setIsChecked(false);
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

          {/* ---------- Price Listings (price) ---------- */}
          <div className="flex mt-3 rounded-xl border flex-col p-2 w-full">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex flex-col gap-5 md:flex-row rounded-2xl bg-grey-50">
                      <div className="w-full">
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
                                <Input
                                  className="flex-1 ml-2 mr-2 dark:bg-[#2D3236] bg-white"
                                  value={price.period}
                                  onChange={(e) => {
                                    const updatedPrice = [
                                      ...(field.value || []),
                                    ];
                                    updatedPrice[index] = {
                                      ...updatedPrice[index],
                                      period: e.target.value,
                                    };
                                    field.onChange(updatedPrice);
                                  }}
                                  placeholder="Period"
                                />

                                <Input
                                  className="flex-1 ml-2 mr-2 dark:bg-[#2D3236] bg-white"
                                  value={price.amount}
                                  type="number"
                                  onChange={(e) => {
                                    const updatedPrice = [
                                      ...(field.value || []),
                                    ];
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

                                <Image
                                  src="/assets/icons/delete.svg"
                                  alt="delete"
                                  className="p-2 cursor-pointer"
                                  width={35}
                                  height={35}
                                  onClick={() => {
                                    const updatedPrice =
                                      field.value.filter(
                                        (_: any, i: number) => i !== index
                                      );
                                    field.onChange(updatedPrice);
                                  }}
                                />
                              </li>
                            ))}
                        </ul>

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
                            type="number"
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
                                    amount: parseFloat(
                                      (newListingAmount || "0").trim()
                                    ),
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

          {/* ---------- Price Listings (price2) NEW ---------- */}
          <div className="flex mt-3 rounded-xl border flex-col p-2 w-full">
            <FormField
              control={form.control}
              name="price2"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex flex-col gap-5 md:flex-row rounded-2xl bg-grey-50">
                      <div className="w-full">
                        <div className="flex items-center font-bold">
                          <h1>Price Listings 2</h1>
                        </div>

                        <ul>
                          {field.value &&
                            field.value.map((price: any, index: number) => (
                              <li
                                key={index}
                                className="flex items-center mt-2 gap-5 w-full"
                              >
                                <Input
                                  className="flex-1 ml-2 mr-2 dark:bg-[#2D3236] bg-white"
                                  value={price.period}
                                  onChange={(e) => {
                                    const updatedPrice = [
                                      ...(field.value || []),
                                    ];
                                    updatedPrice[index] = {
                                      ...updatedPrice[index],
                                      period: e.target.value,
                                    };
                                    field.onChange(updatedPrice);
                                  }}
                                  placeholder="Period"
                                />

                                <Input
                                  className="flex-1 ml-2 mr-2 dark:bg-[#2D3236] bg-white"
                                  value={price.amount}
                                  type="number"
                                  onChange={(e) => {
                                    const updatedPrice = [
                                      ...(field.value || []),
                                    ];
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

                                <Image
                                  src="/assets/icons/delete.svg"
                                  alt="delete"
                                  className="p-2 cursor-pointer"
                                  width={35}
                                  height={35}
                                  onClick={() => {
                                    const updatedPrice =
                                      field.value.filter(
                                        (_: any, i: number) => i !== index
                                      );
                                    field.onChange(updatedPrice);
                                  }}
                                />
                              </li>
                            ))}
                        </ul>

                        <div className="flex items-center justify-between h-[54px] w-full overflow-hidden">
                          <Input
                            className="ml-2 mr-2 dark:bg-[#2D3236] bg-white"
                            value={newListingPeriod2}
                            onChange={(e) => setNewListingPeriod2(e.target.value)}
                            placeholder="Period"
                          />
                          <Input
                            className="ml-2 mr-2 dark:bg-[#2D3236] bg-white"
                            value={newListingAmount2}
                            onChange={(e) => setNewListingAmount2(e.target.value)}
                            placeholder="Amount"
                            type="number"
                          />

                          <Image
                            src="/assets/icons/add.svg"
                            alt="add"
                            className="p-0 cursor-pointer"
                            width={45}
                            height={45}
                            onClick={() => {
                              if (newListingPeriod2.trim() !== "") {
                                const updatedPrice = [
                                  ...(field.value || []),
                                  {
                                    period: newListingPeriod2.trim(),
                                    amount: parseFloat(
                                      (newListingAmount2 || "0").trim()
                                    ),
                                  },
                                ];
                                field.onChange(updatedPrice);
                                setNewListingPeriod2("");
                                setNewListingAmount2("");
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

                      <label className="whitespace-nowrap p-3 leading-none">
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
                  : `${type} Package`}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default PackageForm;