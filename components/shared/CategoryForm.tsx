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

import { CategoryFormSchema } from "@/lib/validator";
import { CategoryDefaultValues } from "@/constants";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
//import router from "next/router";
import { useRouter } from "next/navigation";
import { ICategory } from "@/lib/database/models/category.model";
import { FileUploaderCategory } from "./FileuploaderCategory";
import { createCategory, updateCategory } from "@/lib/actions/category.actions";
import { SetStateAction, useState } from "react";

type CategoryFormProps = {
  type: "Create" | "Update";
  category?: ICategory;
  categoryId?: string;
};

const CategoryForm = ({ type, category, categoryId }: CategoryFormProps) => {
  const initialValues =
    category && type === "Update"
      ? {
          ...category,
        }
      : CategoryDefaultValues;
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  // 1. Define your form.
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: initialValues,
  });
  const { startUpload } = useUploadThing("imageUploader");
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof CategoryFormSchema>) {
    let uploadedImageUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }
    if (type === "Create") {
      try {
        // alert(uploadedImageUrl);

        const newCategory = await createCategory({
          category: { ...values, imageUrl: uploadedImageUrl },
          path: "/home",
        });
        // alert(newCategory);
        if (newCategory) {
          form.reset();
          //  router.push(`/admin/${newCategory._id}`);
          router.push(`/home/`);
          // window.location.href = "/events/" + newEvent._id;
        }
      } catch (error) {
        console.log(error);
      }
    } else if (type === "Update") {
      try {
        if (!categoryId) {
          router.back();
          return;
        }

        const updatedCat = await updateCategory({
          category: {
            ...values,
            imageUrl: uploadedImageUrl,
            _id: categoryId,
          },
          path: `/home/`,
        });

        if (updatedCat) {
          form.reset();
          router.push(`/category/${updatedCat._id}/update`);
          // router.push(`/categories`);
        }
      } catch (error) {
        console.log(error);
      }
    }
    // console.log(values);
  }
  const [newListingTitle, setNewListingTitle] = useState("");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Category Name"
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
            name="subcategory"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex flex-col gap-5 md:flex-row rounded-2xl bg-grey-50 px-4 py-2">
                    <div>
                      <div className="flex items-center font-bold">
                        <h1>Subcategory List</h1>
                      </div>
                      <ul>
                        {field.value &&
                          field.value.map((subcategory, index) => (
                            <li key={index} className="flex items-center gap-5">
                              <span>{subcategory.title}</span>

                              <Image
                                src="/assets/icons/delete.svg"
                                alt="edit"
                                className="p-2 cursor-pointer"
                                width={35}
                                height={35}
                                onClick={() => {
                                  const updatedTitle = field.value.filter(
                                    (_, i) => i !== index
                                  );
                                  field.onChange(updatedTitle);
                                }}
                              />
                            </li>
                          ))}
                      </ul>
                      <div className="flex items-center justify-between h-[54px] w-full overflow-hidden">
                        <Input
                          className="ml-2 mr-2"
                          value={newListingTitle}
                          //    onChange={handleInputChangeTitle}
                          onChange={(e) => setNewListingTitle(e.target.value)}
                          placeholder="Name"
                        />

                        <Image
                          src="/assets/icons/add.svg"
                          alt="edit"
                          className="p-0 cursor-pointer"
                          width={45}
                          height={45}
                          onClick={() => {
                            if (newListingTitle.trim() !== "") {
                              const updatedTitle = [
                                ...(field.value || []),
                                {
                                  title: newListingTitle.trim(),
                                },
                              ];
                              field.onChange(updatedTitle);
                              setNewListingTitle("");
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

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <FileUploaderCategory
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : `${type} Category `}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
