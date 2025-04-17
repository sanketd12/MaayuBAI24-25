"use client"; // This page requires client-side interaction (state, hooks)

import { useState } from "react";
import { api } from "~/trpc/react";
import BucketCard from "./_components/bucket-card";
import EmptyBucketState from "./_components/empty-state";
import BucketTopBar from "./_components/topbar";
import CreateBucketDialog from "./_components/create-bucket-dialog";
import { Skeleton } from "~/components/ui/skeleton";

export default function CandidatesPage() {
    // --- State Management ---
    const [createBucketDialogOpen, setCreateBucketDialogOpen] = useState(false);

    // --- Data Fetching ---
    // Fetches all buckets using the tRPC hook. TanStack Query handles caching.
    const { data: buckets, isLoading, isError, error } = api.bucket.getAll.useQuery(
        undefined, // No input needed for getAll
        {
            // Optional: configure query behavior if needed
            // staleTime: 5 * 60 * 1000, // Example: Data is fresh for 5 minutes
        }
    );

    // --- Event Handlers ---
    const handleCreateNewBucket = () => {
        setCreateBucketDialogOpen(true);
    };

    // --- Rendering Logic ---

    // Loading State
    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                {/* Skeleton for TopBar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                    <Skeleton className="h-8 w-48" /> {/* Placeholder for title */}
                    <Skeleton className="h-10 w-40" /> {/* Placeholder for button */}
                </div>
                {/* Skeleton loaders for bucket cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-[120px] w-full rounded-lg" /> // Simple card skeleton
                    ))}
                </div>
            </div>
        );
    }

    // Error State
    if (isError) {
        console.error("Failed to load buckets:", error);
        return <div className="text-center text-red-600">Failed to load buckets. Error: {error.message}. Please try again later.</div>;
    }

    // No Buckets Found State
    if (!buckets || buckets.length === 0) {
        // Render the empty state component, which includes the button to open the dialog
        return <EmptyBucketState />;
    }

    // Main Content: Buckets Found
    return (
        <div className="flex flex-col gap-4">
            {/* Top bar with Create New Bucket button */}
            <BucketTopBar onCreateNew={handleCreateNewBucket} />

            {/* Dialog for creating a new bucket */}
            <CreateBucketDialog open={createBucketDialogOpen} setOpen={setCreateBucketDialogOpen} />

            {/* Responsive grid for displaying bucket cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {buckets.map((bucket) => (
                    <BucketCard key={bucket.id} bucket={bucket} />
                ))}
            </div>
        </div>
    );
}