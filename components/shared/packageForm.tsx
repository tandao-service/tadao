"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { packageFormSchema } from "@/lib/validator";
import { PackagesDefaultValues } from "@/constants";
import { Textarea } from "../ui/textarea";
import "react-datepicker/dist/react-datepicker.css";
import { SetStateAction, useState } from "react";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IPackages } from "@/lib/database/models/packages.model";
import { createPackage, updatePackage } from "@/lib/actions/packages.actions";
import { FileUploaderPackage } from "./FileuploaderPackage";

type packageFormProps = {
  type: "Create" | "Update";
  pack?: IPackages;
  packageId?: string;
};

const PackageForm = ({ type, pack, packageId }: packageFormProps) => {
  //const initialValues = AdDefaultValues;

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
          // router.push(`/packages/${newPack._id}`);
          router.push(`/packages`);
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
          //router.push(`/packages/${updatedPack._id}`);
          router.push(`/packages`);
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

  const [isChecked, setIsChecked] = useState(false); // Initializing isChecked as false

  return (
    <>
      {showAlert && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{showmessage}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 m-1 gap-1"
        >
          <div className="">
            <div className="flex flex-col p-2 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Package name"
                        {...field}
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col p-2 w-full">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl className="h-30">
                      <Textarea
                        placeholder="Package Description"
                        {...field}
                        className="textarea rounded-2xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col p-2 w-full">
              <FormField
                control={form.control}
                name="list"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Allowable Listing"
                        {...field}
                        className="input-field"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col p-2 w-full">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Priority"
                        {...field}
                        className="input-field"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col p-2 w-full">
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="flex flex-col p-2 w-full rounded-2xl bg-grey-50 px-4 py-2">
                        <div>
                          <div className="flex items-center font-bold">
                            <h1>Features Listings</h1>
                          </div>
                          <ul>
                            {field.value &&
                              field.value.map((feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <span>{feature.title}</span>

                                  <input
                                    type="checkbox"
                                    checked={feature.checked}
                                    onChange={(e) => {
                                      const updatedFeatures = [...field.value];
                                      updatedFeatures[index].checked =
                                        e.target.checked;
                                      field.onChange(updatedFeatures);
                                    }}
                                    className="ml-2 p-2 cursor-pointer"
                                  />
                                  <Image
                                    src="/assets/icons/delete.svg"
                                    alt="edit"
                                    className="p-2 cursor-pointer"
                                    width={35}
                                    height={35}
                                    onClick={() => {
                                      const updatedFeatures =
                                        field.value.filter(
                                          (_, i) => i !== index
                                        );
                                      field.onChange(updatedFeatures);
                                    }}
                                  />
                                </li>
                              ))}
                          </ul>
                          <div className="flex items-center justify-between h-[54px] w-full overflow-hidden">
                            <Input
                              className="ml-2 mr-2"
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
                                onCheckedChange={() => setIsChecked(!isChecked)}
                                checked={isChecked}
                                id="recommended"
                                className="mr-2 h-5 w-5 border-2 border-primary-500"
                              />
                            </div>

                            <Image
                              src="/assets/icons/add.svg"
                              alt="edit"
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

            <div className="flex flex-col p-2 w-full">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="flex flex-col gap-5 md:flex-row rounded-2xl bg-grey-50 px-4 py-2">
                        <div>
                          <div className="flex items-center font-bold">
                            <h1>Price Listings</h1>
                          </div>
                          <ul>
                            {field.value &&
                              field.value.map((price, index) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-5"
                                >
                                  <span>{price.period}</span>
                                  <span>Ksh: {price.amount}</span>

                                  <Image
                                    src="/assets/icons/delete.svg"
                                    alt="edit"
                                    className="p-2 cursor-pointer"
                                    width={35}
                                    height={35}
                                    onClick={() => {
                                      const updatedPrice = field.value.filter(
                                        (_, i) => i !== index
                                      );
                                      field.onChange(updatedPrice);
                                    }}
                                  />
                                </li>
                              ))}
                          </ul>
                          <div className="flex items-center justify-between h-[54px] w-full overflow-hidden">
                            <Input
                              className="ml-2 mr-2"
                              value={newListingPeriod}
                              onChange={handleInputChangePeriod}
                              placeholder="Period"
                            />
                            <Input
                              className="ml-2 mr-2"
                              value={newListingAmount}
                              onChange={handleInputChangeAmount}
                              placeholder="Amount"
                            />

                            <Image
                              src="/assets/icons/add.svg"
                              alt="edit"
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
                                        newListingAmount.trim()
                                      ),
                                    },
                                  ];
                                  field.onChange(updatedPrice);
                                  setNewListingPeriod("");
                                  setNewListingAmount(""); // Reset checkbox state
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
          <div className="">
            <div className="flex flex-col p-2 w-full">
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
                            value={field.value} // Assuming field.value holds the color value
                            onChange={(color: any) => field.onChange(color)} // Assuming field.onChange handles value change
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col p-2 w-full">
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
                  className="button bg-[#000000] hover:bg-[#333333] col-span-2 w-full"
                >
                  {form.formState.isSubmitting
                    ? "Submitting..."
                    : `${type} Package `}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PackageForm;
