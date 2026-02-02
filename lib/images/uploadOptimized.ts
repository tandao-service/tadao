// lib/images/uploadFilesOptimized.ts
import { buildImageVariants } from "./buildImageVariants";

export type AdImage = {
    smallUrl: string;
    fullUrl: string;
    width: number;
    height: number;
    blurDataUrl?: string;
};

export type StartUpload = (files: File[]) => Promise<any[] | undefined>;

export type UploadFilesOptimizedOptions = {
    onProgress?: (p: number) => void;
};

function extFromMime(mime: string) {
    if (mime.includes("webp")) return "webp";
    if (mime.includes("png")) return "png";
    return "jpg";
}

function blobToFile(blob: Blob, filename: string) {
    return new File([blob], filename, { type: blob.type });
}

function stripExt(name: string) {
    return name.replace(/\.[^/.]+$/, "");
}

/**
 * Factory: binds startUpload once, then you can call:
 * uploadFilesOptimized(files, { onProgress })
 */
export function makeUploadFilesOptimized(startUpload: StartUpload) {
    return async function uploadFilesOptimized(
        files: File[],
        opts: UploadFilesOptimizedOptions = {}
    ): Promise<AdImage[]> {
        const { onProgress } = opts;

        const results: AdImage[] = [];
        let done = 0;

        for (let i = 0; i < files.length; i++) {
            const original = files[i];

            // 1) Build variants in browser (webp/jpg fallback)
            const v = await buildImageVariants(original);

            // 2) Create upload files (small + full)
            const ext = extFromMime(v.mime);
            const base = `${stripExt(original.name)}_${Date.now()}_${i}`;

            const smallFile = blobToFile(v.smallBlob, `${base}-small.${ext}`);
            const fullFile = blobToFile(v.fullBlob, `${base}-full.${ext}`);

            // 3) Upload both together
            const uploaded = await startUpload([smallFile, fullFile]);

            if (!uploaded || uploaded.length < 2) {
                throw new Error("UploadThing failed to upload small+full variants.");
            }

            // 4) Map by filename
            const small = uploaded.find((u: any) =>
                String(u?.name || "").includes("-small.")
            );
            const full = uploaded.find((u: any) =>
                String(u?.name || "").includes("-full.")
            );

            if (!small?.url || !full?.url) {
                throw new Error("Could not map small/full URLs from UploadThing response.");
            }

            results.push({
                smallUrl: small.url,
                fullUrl: full.url,
                width: v.width,
                height: v.height,
                blurDataUrl: v.tinyDataUrl,
            });

            done++;
            const pct = Math.round((done / files.length) * 100);
            onProgress?.(pct);
        }

        return results;
    };
}