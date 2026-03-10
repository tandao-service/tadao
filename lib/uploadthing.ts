import { generateReactHelpers } from "@uploadthing/react/hooks";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
//import { url } from "inspector";
//const API_BASE_URL = "https://localhost/api/uploadthing";
//export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>({url:API_BASE_URL});
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();
// Set your API endpoint URL
