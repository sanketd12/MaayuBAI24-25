"use client"; // Make this a Client Component

import { useState, useEffect, useMemo } from "react";
import { api } from "~/trpc/react"; // Use react hooks for client-side fetching
import JobCard from "./_components/job-card";
import NoJobsFound from "./_components/no-jobs-found";
import JobTopBar from "./_components/topbar";
import { Skeleton } from "~/components/ui/skeleton"; // Import Skeleton for loading state

// Helper function for debouncing
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer); // Cleanup the timer
    }, [value, delay]);
    return debouncedValue;
}


export default function JobsPage() {
    // --- State Management ---
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 100); // 300ms debounce delay

    // --- Data Fetching ---
    const { data: jobs, isLoading, isError, error } = api.job.getAll.useQuery(
        undefined, // No input for getAll
        {
            // Optional: configure refetching, stale time, etc.
            // staleTime: 5 * 60 * 1000, // 5 minutes
        }
    );

    // --- Event Handlers ---
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // --- Filtering Logic ---
    const filteredJobs = useMemo(() => {
        if (!jobs) return [];
        if (!debouncedSearchTerm) return jobs; // Return all if no search term

        const lowerCaseSearch = debouncedSearchTerm.toLowerCase().trim();
        if (!lowerCaseSearch) return jobs; // Also return all if search term is just whitespace

        return jobs.filter(job =>
            job.name.toLowerCase().includes(lowerCaseSearch) ||
            job.description.toLowerCase().includes(lowerCaseSearch) ||
            job.location.toLowerCase().includes(lowerCaseSearch) ||
            job.type.toLowerCase().includes(lowerCaseSearch) ||
            job.work_mode.toLowerCase().includes(lowerCaseSearch) ||
            job.status.toLowerCase().includes(lowerCaseSearch) ||
            job.salary?.toString().includes(lowerCaseSearch) // Search salary too
        );
    }, [jobs, debouncedSearchTerm]); // Re-run only when jobs data or debounced search term changes


    // --- Rendering Logic ---

    // Loading State
    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                 {/* Placeholder for TopBar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                    <Skeleton className="h-10 w-full max-w-sm" />
                    <Skeleton className="h-10 w-28" />
                </div>
                 {/* Skeleton loaders for job cards */}
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-[250px] w-full max-w-md rounded-lg" />
                ))}
            </div>
        );
    }

    // Error State
    if (isError) {
        console.error("Failed to load jobs:", error);
        return <div className="text-center text-red-600">Failed to load jobs. Please try again later.</div>;
    }

    // No Jobs Initial State (before filtering)
    if (!jobs || jobs.length === 0) {
        // Pass search state even to NoJobsFound's container if needed (TopBar is separate here)
         return (
             <div className="flex flex-col gap-4">
                <JobTopBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                <NoJobsFound />
            </div>
        );
    }

    // Main Content (with filtering)
    return (
        <div className="flex flex-col gap-4">
            <JobTopBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

            {filteredJobs.length === 0 && debouncedSearchTerm ? (
                 <div className="mt-6 text-center text-muted-foreground">
                    No jobs found matching &quot;{debouncedSearchTerm}&quot;.
                </div>
            ) : filteredJobs.length === 0 && !debouncedSearchTerm ? (
                 // This case should technically be covered by the initial check, but good for clarity
                 <NoJobsFound />
            ) : (
                 // Render filtered job cards
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"> {/* Added grid layout */}
                    {filteredJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
}