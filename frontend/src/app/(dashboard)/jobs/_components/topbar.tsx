"use client";

import JobSearchBar from "./searchbar";
import { Button } from "~/components/ui/button";
import CreateJobDialog from "./create-job-dialog";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

export default function JobTopBar({
    searchTerm,
    onSearchChange,
}: {
    searchTerm: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    const [jobCreateDialogOpen, setJobCreateDialogOpen] = useState(false);

    return (
        <>
            <div className="flex flex-wrap items-center gap-4 border-b pb-4">
                <div className="flex-grow">
                    <JobSearchBar value={searchTerm} onChange={onSearchChange} />
                </div>
                <Button onClick={() => setJobCreateDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Job
                </Button>
            </div>
            <CreateJobDialog open={jobCreateDialogOpen} setOpen={setJobCreateDialogOpen} />
        </>
    );
}