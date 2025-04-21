import {
    generateReactHelpers,
    generateUploadButton,
    generateUploadDropzone,
} from "@uploadthing/react";

import type { UploadRouter } from "@/lib/uploadthing/uploader";

export const UploadButton = generateUploadButton<UploadRouter>();
export const UploadDropzone = generateUploadDropzone<UploadRouter>();

export const { useUploadThing } = generateReactHelpers<UploadRouter>();