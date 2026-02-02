export type AdImage = {
    fullUrl: string;
    smallUrl?: string; // only for cover
    width?: number;
    height?: number;
};

type VariantOpts = {
    maxW: number;
    maxH: number;
    quality: number; // 0..1
    mime: "image/webp" | "image/jpeg" | "image/png";
};

const FULL_OPTS: VariantOpts = {
    maxW: 1600,
    maxH: 1600,
    quality: 0.82,
    mime: "image/webp",
};

const SMALL_OPTS: VariantOpts = {
    maxW: 480,
    maxH: 480,
    quality: 0.75,
    mime: "image/webp",
};

function isImageFile(file: File) {
    return file.type.startsWith("image/");
}

function extFromMime(mime: string) {
    if (mime === "image/webp") return "webp";
    if (mime === "image/jpeg") return "jpg";
    if (mime === "image/png") return "png";
    return "bin";
}

async function fileToImageBitmap(file: File): Promise<ImageBitmap> {
    // createImageBitmap is fast + avoids DOM Image decoding issues
    return await createImageBitmap(file);
}

function fitWithin(
    w: number,
    h: number,
    maxW: number,
    maxH: number
): { w: number; h: number } {
    if (w <= maxW && h <= maxH) return { w, h };
    const ratio = Math.min(maxW / w, maxH / h);
    return { w: Math.max(1, Math.round(w * ratio)), h: Math.max(1, Math.round(h * ratio)) };
}

async function canvasEncode(
    file: File,
    opts: VariantOpts,
    suffix: string
): Promise<File> {
    if (!isImageFile(file)) return file;

    const bmp = await fileToImageBitmap(file);
    const target = fitWithin(bmp.width, bmp.height, opts.maxW, opts.maxH);

    const canvas = document.createElement("canvas");
    canvas.width = target.w;
    canvas.height = target.h;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context not available");

    // Draw scaled
    ctx.drawImage(bmp, 0, 0, target.w, target.h);

    const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("Failed to encode image blob"))),
            opts.mime,
            opts.quality
        );
    });

    const ext = extFromMime(opts.mime);
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const outName = `${baseName}-${suffix}.${ext}`;

    return new File([blob], outName, { type: opts.mime, lastModified: Date.now() });
}

async function makeFullVariant(file: File) {
    // full for every image
    return canvasEncode(file, FULL_OPTS, "full");
}

async function makeSmallVariant(file: File) {
    // small only for cover
    return canvasEncode(file, SMALL_OPTS, "small");
}

export function makeUploadFilesOptimized(startUpload: any) {
    return async function uploadFilesOptimized(
        files: File[],
        opts?: { onProgress?: (p: number) => void }
    ): Promise<AdImage[]> {
        if (!files || files.length === 0) return [];

        // Build queue:
        // index 0 => full + small
        // index 1..n => full only
        const queue: { kind: "cover_small" | "full"; originalIndex: number; file: File }[] = [];

        for (let i = 0; i < files.length; i++) {
            const full = await makeFullVariant(files[i]);
            queue.push({ kind: "full", originalIndex: i, file: full });

            if (i === 0) {
                const small = await makeSmallVariant(files[i]);
                queue.push({ kind: "cover_small", originalIndex: i, file: small });
            }
        }

        // Upload
        const uploaded = await startUpload(queue.map((q) => q.file), {
            onUploadProgress: (p: number) => opts?.onProgress?.(p),
        });

        if (!uploaded) throw new Error("UploadThing returned no result");

        // Map results back
        const out: AdImage[] = Array.from({ length: files.length }, () => ({ fullUrl: "" }));

        uploaded.forEach((u: any, idx: number) => {
            const q = queue[idx];
            if (!q) return;

            if (q.kind === "full") out[q.originalIndex].fullUrl = u.url;
            if (q.kind === "cover_small") out[q.originalIndex].smallUrl = u.url;
        });

        // Ensure every image has fullUrl
        for (let i = 0; i < out.length; i++) {
            if (!out[i].fullUrl) throw new Error(`Missing fullUrl for image index ${i}`);
        }

        return out;
    };
}