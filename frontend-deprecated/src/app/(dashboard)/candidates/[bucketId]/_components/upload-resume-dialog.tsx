import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { UploadBox } from "~/components/platform/upload-box"

export default function UploadResumeDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Resume</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Upload one or more REMOVED_BUCKET_NAME to this bucket.
                </DialogDescription>
                <UploadBox />
                <DialogFooter>
                    <Button type="submit">Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}