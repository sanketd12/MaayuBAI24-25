"use client";

import { FolderPlus } from "lucide-react";
import { Button } from "~/components/ui/button";
import CreateBucketDialog from "./create-bucket-dialog";
import { useState } from "react";

export default function EmptyBucketState() {
    const [createBucketDialogOpen, setCreateBucketDialogOpen] = useState(false);

    return (
        <>
            <CreateBucketDialog open={createBucketDialogOpen} setOpen={setCreateBucketDialogOpen} />
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {/* Using FolderPlus icon to represent adding categories/buckets */}
                    <FolderPlus className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                    No Candidate Buckets Yet
                </h3>
                <p className="mb-6 text-sm text-muted-foreground">
                    Organize your candidates by creating custom buckets (e.g., Screened, Interviewing, Hired).
                </p>
                {/* Update the onClick handler to trigger your bucket creation logic */}
                <Button onClick={() => setCreateBucketDialogOpen(true)}>
                    <FolderPlus className="mr-2 h-4 w-4" /> Create First Bucket
                </Button>
            </div>
        </>
    );
}