import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
// import { UploadBox } from "@/components/platform/upload-box"
import {
    UploadButton,
    UploadDropzone,
    useUploadThing,
} from "@/utils/uploadthing";


export default function UploadResumeDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const { startUpload } = useUploadThing("resumeUploader", {
        /**
         * @see https://docs.uploadthing.com/api-reference/react#useuploadthing
         */
        onBeforeUploadBegin: (files) => {
            console.log("Uploading", files.length, "files");
            return files;
        },
        onUploadBegin: (name) => {
            console.log("Beginning upload of", name);
        },
        onClientUploadComplete: (res) => {
            console.log("Upload Completed.", res.length, "files uploaded");
        },
        onUploadProgress(p) {
            console.log("onUploadProgress", p);
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Resume</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Upload one or more REMOVED_BUCKET_NAME to this bucket.
                </DialogDescription>
                <UploadButton
                    /**
                     * @see https://docs.uploadthing.com/api-reference/react#uploadbutton
                     */
                    endpoint="resumeUploader"
                    onClientUploadComplete={(res) => {
                        console.log(`onClientUploadComplete`, res);
                        alert("Upload Completed");
                    }}
                    onUploadBegin={() => {
                        console.log("upload begin");
                    }}
                    config={{ appendOnPaste: true, mode: "manual" }}
                />
                <UploadDropzone
                    /**
                     * @see https://docs.uploadthing.com/api-reference/react#uploaddropzone
                     */
                    endpoint={(routeRegistry) => routeRegistry.resumeUploader}
                    onUploadAborted={() => {
                        alert("Upload Aborted");
                    }}
                    onClientUploadComplete={(res) => {
                        console.log(`onClientUploadComplete`, res);
                        alert("Upload Completed");
                    }}
                    onUploadBegin={() => {
                        console.log("upload begin");
                    }}
                />
                <input
                    type="file"
                    multiple
                    onChange={async (e) => {
                        const files = Array.from(e.target.files ?? []);

                        // Do something with files

                        // Then start the upload
                        await startUpload(files);
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}