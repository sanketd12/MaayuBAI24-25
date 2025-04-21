import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "redaxios";

export default function UploadResumeDialog({ open, onOpenChange, bucketId }: { open: boolean, onOpenChange: (open: boolean) => void, bucketId: number }) {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const trpc = useTRPC();
    const queryClient = useQueryClient(); // Get query client for potential refetching

    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        console.log(files);
    };

    const createCandidateMutation = useMutation(trpc.candidate.create.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trpc.bucket.getById.queryKey({ id: bucketId }) });
            queryClient.invalidateQueries({ queryKey: trpc.bucket.getNamesAndCounts.queryKey() });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    }));

    const handleUpload = async () => {
        console.log("@ bucketId", bucketId);
        if (files.length === 0) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.set("resume", files[0]);
        // files.forEach((file) => {
        //     formData.append("resume", file); // Use "files" as the key, matching common FastAPI file upload patterns
        // });

        try {
            // Replace '/api/upload-resume' with your actual FastAPI endpoint
            const response = await axios.post(`http://127.0.0.1:8000/ingestion/add-resume`, formData, {
                // headers: {
                //     'Content-Type': 'multipart/form-data',
                // },
            });

            console.log("@ response", response);

            createCandidateMutation.mutate({
                bucketId: bucketId,
                name: response.data.name,
                email: response.data.email,
            });
            
            toast.success("Resumes uploaded successfully!");

            // take the parsed resume and create a candidate


            setFiles([]); // Clear files after successful upload
            onOpenChange(false); // Close the dialog
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Resume</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Upload one or more REMOVED_BUCKET_NAME to this bucket.
                </DialogDescription>
                <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-background border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <FileUpload onChange={handleFileUpload} />
                </div>
                <DialogFooter>
                    <Button disabled={files.length === 0 || isUploading} variant="default" onClick={handleUpload}>
                        {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}