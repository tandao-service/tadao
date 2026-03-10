"use client";

import { useCallback, Dispatch, SetStateAction, useState } from "react";
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

type FileUploaderProps = {
  onFieldChange: (urls: string[]) => void;
  imageUrls: string[];
  userName: string;
  category: string;
  anayze: string;
  adId: string;
  setFiles: Dispatch<SetStateAction<File[]>>;

  // store cover thumbnail file + preview url
  onCoverThumbChange: (file: File | null, previewUrl: string | null) => void;
};

const getNetworkType = (): "4g" | "3g" | "2g" | "slow-2g" | "unknown" => {
  if (typeof navigator !== "undefined" && "connection" in navigator) {
    // @ts-ignore
    return navigator.connection.effectiveType || "unknown";
  }
  return "unknown";
};

const isMobile = (): boolean =>
  typeof window !== "undefined" && window.innerWidth < 768;

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
  return await imageCompression(file, { ...smartOptions, useWebWorker: true });
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
          resolve(new File([blob], file.name, { type: file.type }));
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

const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const toWebp = async (
  file: File,
  opts: { maxWidthOrHeight: number; quality: number; fileNameSuffix?: string }
): Promise<File> => {
  const img = await loadImageFromFile(file);

  const maxDim = Math.max(img.width, img.height);
  const scale = maxDim > opts.maxWidthOrHeight ? opts.maxWidthOrHeight / maxDim : 1;

  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(img, 0, 0, w, h);

  const quality = clamp(opts.quality, 0.4, 0.92);

  const blob: Blob | null = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/webp", quality);
  });

  if (!blob) return file;

  const base = file.name.replace(/\.[^/.]+$/, "");
  const suffix = opts.fileNameSuffix ? `-${opts.fileNameSuffix}` : "";
  const webpName = `${base}${suffix}.webp`;

  return new File([blob], webpName, { type: "image/webp" });
};

// --- WebP quality presets (your chosen ranges) ---
const WEBP_FULL_QUALITY = 0.82;   // 0.78 – 0.85
const WEBP_THUMB_QUALITY = 0.72;  // 0.65 – 0.75

const WEBP_FULL_MAX = 1600;
const WEBP_THUMB_MAX = 500;

// Full image webp
const toWebpFull = (file: File) =>
  toWebp(file, {
    maxWidthOrHeight: WEBP_FULL_MAX,
    quality: WEBP_FULL_QUALITY,
    fileNameSuffix: "full",
  });

// Thumbnail for cover
const toWebpThumb = (file: File) =>
  toWebp(file, {
    maxWidthOrHeight: WEBP_THUMB_MAX,
    quality: WEBP_THUMB_QUALITY,
    fileNameSuffix: "thumb",
  });

export function FileUploader({
  imageUrls,
  userName,
  category,
  anayze,
  adId,
  onFieldChange,
  setFiles,
  onCoverThumbChange,
}: FileUploaderProps) {
  const { toast } = useToast();

  const [processingStatus, setProcessingStatus] = useState(false);

  // per-image loading state (fixes global spinner issue)
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setProcessingStatus(true);

      try {
        const processedFullFiles: File[] = [];
        let coverThumbSet = false;

        for (const originalFile of acceptedFiles) {
          const isScreenshot =
            /screenshot/i.test(originalFile.name) ||
            /Screen\s?Shot/i.test(originalFile.name);

          if (isScreenshot) {
            toast({
              variant: "destructive",
              title: "Failed!",
              description: `${originalFile.name} appears to be a screenshot and will not be uploaded.`,
              duration: 5000,
            });
            continue;
          }

          // prevent duplicates by file name
          const alreadyAdded =
            processedFullFiles.some((f) => f.name === originalFile.name) ||
            imageUrls.some((u) => u.includes(encodeURIComponent(originalFile.name)));
          if (alreadyAdded) continue;

          let file = originalFile;

          // 1) compress (reduces huge photos early)
          if (file.size > 0.8 * 1024 * 1024) {
            try {
              file = await compressImage(file);
            } catch (err) {
              console.error("Compression failed", err);
              continue;
            }
          }

          // 2) watermark
          try {
            file = await applyWatermark(
              file,
              userName.toUpperCase(),
              "Posted on Tadao market"
            );
          } catch (error) {
            console.error("Watermarking failed, proceeding with original:", error);
          }

          // 3) convert to WEBP full (fast loading)
          const fullWebp = await toWebpFull(file);
          processedFullFiles.push(fullWebp);

          // 4) make WEBP thumb for cover (only when first image overall)
          const shouldMakeCoverThumb =
            !coverThumbSet && imageUrls.length === 0 && processedFullFiles.length === 1;

          if (shouldMakeCoverThumb) {
            const thumbWebp = await toWebpThumb(file);
            const thumbPreview = convertFileToUrl(thumbWebp);
            onCoverThumbChange(thumbWebp, thumbPreview);
            coverThumbSet = true;
          }
        }

        setFiles((prev) => [...prev, ...processedFullFiles]);

        const urls = processedFullFiles.map((f) => convertFileToUrl(f));
        onFieldChange([...imageUrls, ...urls]);

        // mark new images as "loading"
        const startIndex = imageUrls.length;
        setLoadingMap((m) => {
          const next = { ...m };
          for (let i = 0; i < urls.length; i++) next[startIndex + i] = true;
          return next;
        });
      } catch (err) {
        console.error("Processing failed", err);
      } finally {
        setProcessingStatus(false);
      }
    },
    [imageUrls, onFieldChange, setFiles, toast, userName, onCoverThumbChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
  });

  const handleRemoveImage = async (index: number) => {
    const imageUrl = imageUrls[index];

    if (imageUrl) {
      await removeImageUrl(adId, imageUrl);
    }

    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    onFieldChange(newImageUrls);

    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });

    // if cover removed, clear cover thumb
    if (index === 0) {
      onCoverThumbChange(null, null);
    }

    // fix loading map indexes after delete
    setLoadingMap((m) => {
      const next: Record<number, boolean> = {};
      newImageUrls.forEach((_, i) => {
        next[i] = m[i >= index ? i + 1 : i] ?? true;
      });
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
            <small className="dark:text-gray-500 text-[#464b4f]">
              Add Profile Image
            </small>
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
            <CircularProgress sx={{ color: "gray" }} size={30} /> processing
            images...
          </div>
        )}

        {anayze && <div className="text-red-400 text-sm">{anayze}</div>}

        {imageUrls.length > 0 ? (
          <div className="flex w-full m-1 ">
            <div {...getRootProps()}>
              <AddBoxIcon className="my-auto hover:cursor-pointer" />
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-5 w-full p-2 rounded-sm">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative justify-center items-center mb-1 rounded-sm bg-[#e4ebeb] shadow-sm p-1 mr-1 flex-shrink-0"
                >
                  {loadingMap[index] !== false && (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-100">
                      <Icon
                        icon={threeDotsScale}
                        className="w-6 h-6 text-gray-500"
                      />
                    </div>
                  )}

                  <Zoom>
                    <img
                      src={url}
                      alt={`image-${index}`}
                      className={`w-full h-[100px] object-cover object-center rounded-sm transition-opacity duration-300 ${loadingMap[index] === false ? "opacity-100" : "opacity-0"
                        }`}
                      onLoad={() =>
                        setLoadingMap((m) => ({ ...m, [index]: false }))
                      }
                      onError={(e) => {
                        e.currentTarget.src = "/assets/icons/error.svg";
                        setLoadingMap((m) => ({ ...m, [index]: false }));
                      }}
                    />
                  </Zoom>

                  <div
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 rounded-xl bg-white p-1 shadow-sm"
                  >
                    <img
                      src="/assets/icons/delete.svg"
                      alt="delete"
                      width={20}
                      height={20}
                    />
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