"use client";

import { Inbox, PlusCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import CreateJobDialog from "./create-job-dialog";
import { useState } from "react";

export default function NoJobsFound() {
    // Optional: Add a function to handle the button click, e.g., open a modal or navigate
    const [createJobDialogOpen, setCreateJobDialogOpen] = useState(false);

    return (
        // Option 1: Centered content without a card
        <>
            <CreateJobDialog open={createJobDialogOpen} setOpen={setCreateJobDialogOpen} />
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Inbox className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                    No Job Postings Found
                </h3>
                <p className="mb-6 text-sm text-muted-foreground">
                    It looks like you haven't created any job postings yet.
                </p>
                <Button onClick={() => setCreateJobDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create First Job
                </Button>
            </div>
        </>
    );
}