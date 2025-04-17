"use client";

import { Button } from "~/components/ui/button";
import { FolderPlus } from "lucide-react";

interface BucketTopBarProps {
    onCreateNew: () => void; // Function to trigger the create dialog
}

export default function BucketTopBar({ onCreateNew }: BucketTopBarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <h1 className="text-2xl font-semibold tracking-tight">Candidate Buckets</h1>
            <Button onClick={onCreateNew}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Create New Bucket
            </Button>
        </div>
    );
}