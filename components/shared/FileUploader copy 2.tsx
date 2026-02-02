// components/shared/FileUploader.tsx
"use client";

import { useCallback, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Button } from "@/components/ui/button";
import { convertFileToUrl } from "@/lib/utils";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useToast } from "@/components/ui/use-toast";
import { removeImageUrl } from "@/lib/actions/dynamicAd.actions";
import { Icon } from "@iconify/react";
import imageCompression from "browser-image-compression";
import threeDotsScale from "@iconify-icons/svg-spinners/3-dots-scale";
import CircularProgress from "@mui/material/CircularProgress";
import type { AdImage } from "@/lib/images/uploadOptimized";

type FileUploaderProps = {
  // ✅ new
  images: AdImage[];
  onImagesChange: (images: AdImage[]) => void;

  // ✅ optional legacy (for compatibility, not required)
  imageUrls?: string[];

  userName: string;
  category: string;
  anayze: string;
  adId: string;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

const getNetworkType = (): "4g" | "3g" | "2g" | "slow-2g" | "unknown" => {
  if (typeof navigator !== "undefined" && "connection" in navigator) {
    // @ts-ignore
    return navigator.connection.effectiveType || "unknown";
  }
  return "unknown";
};

const isMobile = (): boolean => {
  return typeof window !== "undefined" && window.innerWidth < 768;
};

const getSmartCompressionOptions = () => {
  const network = getNetworkType();
  const mobile = isMobile();

  if (network === "2g" || network === "slow-2g") {
    return { maxSizeMB: 0.3, maxWidthOrHeight: mobile ? 800 : 1024 };
  }
  if (network === "3g") {
    return { maxSizeMB: 0.5, maxWidthOrHeight: mobile ? 1024 : 1280 };
  }
  return { maxSizeMB: 0.8, maxWidthOrHeight: mobile ? 1280 : 1600 };
};

const compressImage = async (file: File): Promise<File> => {
  const smartOptions = getSmartCompressionOptions();
  const options = { ...smartOptions, useWebWorker: true };
  return await imageCompression(file, options);
};

const applyWatermark = (
  file: File,
  headerText: string,
  contentText: string
): Promise<File> => {
  if (typeof window === "undefined") return Promise.resolve(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") img.src = result;
      else reject(new Error("Failed to read file"));
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Failed to get canvas context"));

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const headerFontSize = Math.min(canvas.width, canvas.height) * 0.07;
      const contentFontSize = Math.min(canvas.width, canvas.height) * 0.05;

      ctx.font = `bold ${headerFontSize}px Arial`;
      ctx.textAlign = "center";

      const gap = headerFontSize * 0.5;
      const headerCenterX = canvas.width / 2;

      // keep your existing +280 offset
      const headerCenterY = canvas.height / 2 - gap / 2 + 280;

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.strokeText(headerText, headerCenterX, headerCenterY);

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillText(headerText, headerCenterX, headerCenterY);

      ctx.font = `bold ${contentFontSize}px Arial`;
      const contentCenterX = canvas.width / 2;
      const contentCenterY = headerCenterY + gap / 4 + contentFontSize;

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.strokeText(contentText, contentCenterX, contentCenterY);

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillText(contentText, contentCenterX, contentCenterY);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Failed to create blob"));
          const watermarkedFile = new File([blob], file.name, { type: file.type });
          resolve(watermarkedFile);
        },
        file.type,
        0.92
      );
    };

    img.onerror = (error) => reject(error);
    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
};

export function FileUploader({
  images,
  onImagesChange,
  imageUrls, // optional legacy
  userName,
  category,
  anayze,
  adId,
  setFiles,
}: FileUploaderProps) {
  const { toast } = useToast();

  const [processingStatus, setProcessingStatus] = useState(false);

  // For showing previews of new files BEFORE upload:
  // each preview item corresponds to a File stored in `setFiles`.
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  // combine existing uploaded + new previews for display
  const displayUrls = useMemo(() => {
    const uploaded = (images || []).map((img) => img.smallUrl || img.fullUrl).filter(Boolean);
    return [...uploaded, ...newPreviews];
  }, [images, newPreviews]);

  // per-image loading
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const next: Record<number, boolean> = {};
    displayUrls.forEach((_, i) => (next[i] = true));
    setLoadingMap(next);
  }, [displayUrls.length]);

  // optional: initialize previews from legacy imageUrls if images is empty
  useEffect(() => {
    if ((!images || images.length === 0) && imageUrls && imageUrls.length > 0) {
      // convert legacy urls into AdImage objects
      const legacyImages: AdImage[] = imageUrls.map((u) => ({ fullUrl: u }));
      onImagesChange(legacyImages);
    }
    // only run once intentionally
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setProcessingStatus(true);

      try {
        const processedFiles: File[] = [];
        const previewUrls: string[] = [];

        for (const originalFile of acceptedFiles) {
          // reject screenshots by name
          const isScreenshot =
            /screenshot/i.test(originalFile.name) || /Screen\s?Shot/i.test(originalFile.name);

          if (isScreenshot) {
            toast({
              variant: "destructive",
              title: "Failed!",
              description: `${originalFile.name} appears to be a screenshot and will not be uploaded.`,
              duration: 5000,
            });
            continue;
          }

          let file = originalFile;

          // compress only if big
          if (file.size > 0.8 * 1024 * 1024) {
            try {
              const compressed = await compressImage(file);
              if (compressed.size > 0.8 * 1024 * 1024) {
                toast({
                  variant: "destructive",
                  title: "Too Large",
                  description: `${file.name} is still too large after compression. Skipped.`,
                  duration: 5000,
                });
                continue;
              }
              file = compressed;
            } catch (err) {
              console.error("Compression failed", err);
              continue;
            }
          }

          // watermark
          try {
            const watermarked = await applyWatermark(
              file,
              userName.toUpperCase(),
              "Posted on Tadao market"
            );
            processedFiles.push(watermarked);
          } catch (error) {
            console.error("Watermark failed, using original:", error);
            processedFiles.push(file);
          }
        }

        if (processedFiles.length === 0) return;

        // store actual Files for later upload (AdForm uses these)
        setFiles((prev) => [...prev, ...processedFiles]);

        // show previews immediately (these are not uploaded yet)
        for (const f of processedFiles) {
          previewUrls.push(convertFileToUrl(f));
        }

        // prevent duplicate preview urls
        setNewPreviews((prev) => {
          const set = new Set(prev);
          previewUrls.forEach((u) => set.add(u));
          return Array.from(set);
        });
      } catch (err) {
        console.error("Processing failed", err);
      } finally {
        setProcessingStatus(false);
      }
    },
    [setFiles, userName, toast]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
  });

  const handleRemoveImage = async (displayIndex: number) => {
    const uploadedCount = (images || []).length;

    // removing an uploaded image
    if (displayIndex < uploadedCount) {
      const img = images[displayIndex];
      const url = img?.fullUrl;

      if (url) {
        try {
          await removeImageUrl(adId, url);
        } catch (e) {
          console.error("removeImageUrl failed:", e);
        }
      }

      const nextImages = [...images];
      nextImages.splice(displayIndex, 1);
      onImagesChange(nextImages);
      return;
    }

    // removing a new preview (not uploaded yet)
    const previewIndex = displayIndex - uploadedCount;

    setNewPreviews((prev) => {
      const next = [...prev];
      next.splice(previewIndex, 1);
      return next;
    });

    // remove the corresponding File from setFiles (only the NEW ones)
    // We assume new previews were appended in same order as setFiles additions.
    setFiles((prev) => {
      // remove from the tail based on previewIndex
      // Example: if you have N files already and you added M new, previews match those M.
      const next = [...prev];

      // To remove accurately we need to remove the (prev.length - newPreviews.length + previewIndex)
      // BUT newPreviews state update is async, so compute using current uploadedCount + current newPreviews
      const currentNewCount = newPreviews.length;
      const startOfNew = Math.max(0, next.length - currentNewCount);
      const fileIndexToRemove = startOfNew + previewIndex;

      if (fileIndexToRemove >= 0 && fileIndexToRemove < next.length) {
        next.splice(fileIndexToRemove, 1);
      }
      return next;
    });
  };

  return (
    <div className="w-full flex-center dark:text-[#e4ebeb] flex cursor-pointer p-1 flex-col">
      <input {...getInputProps()} className="cursor-pointer" />

      <div className="text-left text-sm w-full">
        <div className="font-semibold">Add Photo</div>

        <div>
          {category === "Property Services" || category === "Wanted Ads" ? (
            <small className="dark:text-gray-500 text-[#464b4f]">Add Profile Image</small>
          ) : (
            <>
              <small className="dark:text-gray-500 text-[#464b4f]">
                Add at least 3 photos for this category
              </small>
              <br />
              <small className="dark:text-gray-500 text-[#464b4f]">
                First picture - is the title picture.
              </small>
            </>
          )}
        </div>

        {processingStatus && (
          <div className="flex p-2 gap-2 text-gray-500 justify-center items-center">
            <CircularProgress sx={{ color: "gray" }} size={30} /> processing images...
          </div>
        )}

        {anayze && <div className="text-red-400 text-sm">{anayze}</div>}

        {displayUrls.length > 0 ? (
          <div className="flex w-full m-1">
            <div {...getRootProps()}>
              <AddBoxIcon className="my-auto hover:cursor-pointer" />
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-5 w-full p-2 rounded-sm">
              {displayUrls.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="relative justify-center items-center mb-1 rounded-sm bg-[#e4ebeb] shadow-sm p-1 mr-1 flex-shrink-0"
                >
                  {loadingMap[index] && (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-100">
                      <Icon icon={threeDotsScale} className="w-6 h-6 text-gray-500" />
                    </div>
                  )}

                  <Zoom>
                    <img
                      src={url}
                      alt={`image-${index}`}
                      className={`w-full h-[100px] object-cover object-center rounded-sm transition-opacity duration-300 ${loadingMap[index] ? "opacity-0" : "opacity-100"
                        }`}
                      onLoad={() => setLoadingMap((m) => ({ ...m, [index]: false }))}
                      onError={(e) => {
                        e.currentTarget.src = "/assets/icons/error.svg";
                        setLoadingMap((m) => ({ ...m, [index]: false }));
                      }}
                    />
                  </Zoom>

                  <div
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 rounded-xl bg-white p-1 shadow-sm"
                    role="button"
                    aria-label="remove image"
                  >
                    <img src="/assets/icons/delete.svg" alt="delete" width={20} height={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-center flex-col py-5 text-grey-500" {...getRootProps()}>
            <img src="/assets/icons/upload.svg" width={77} height={77} alt="file upload" />
            <h3 className="mb-2 mt-2">Drag photos here</h3>
            <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
            <Button type="button" className="rounded-full">
              Tap to upload photos
            </Button>
          </div>
        )}

        <br />
        <small className="dark:text-gray-500 text-[#464b4f]">
          Supported formats are .jpg, .gif .svg and .png, 5MB max
        </small>
      </div>
    </div>
  );
}

export default FileUploader;