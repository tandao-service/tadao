"use client";

import { useCallback, Dispatch, SetStateAction } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

export function FileUploaderPackage({
  imageUrl,
  onFieldChange,
  setFiles,
}: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    onFieldChange(convertFileToUrl(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center p-1 bg-dark-3 flex h-50 cursor-pointer flex-col overflow-hidden rounded-xl border"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {imageUrl ? (
        <div className="flex h-16 w-16 flex-1 justify-center ">
          <Image
            src={imageUrl}
            alt="image"
            width={150}
            height={150}
            className="w-full object-center"
          />
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-grey-500">
          <Image
            src="/assets/icons/upload.svg"
            width={77}
            height={77}
            alt="file upload"
          />
          <h3 className="mb-2 mt-2">Drag Package Icon here</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
}
