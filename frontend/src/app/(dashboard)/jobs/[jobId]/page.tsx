"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation"; // Use useParams for client components
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { AlertTriangle, ArrowLeft, BrainCircuit, XCircle } from "lucide-react"; // Icons
import { formatSalary } from "../_components/job-card"; // Reuse the helper

// Helper function to determine badge variant based on status
const getStatusVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
        case "open":
            return "default"; // Or maybe 'success' if you add a green variant
        case "closed":
            return "destructive";
        default:
            return "secondary";
    }
};

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string; // jobId from the URL

    // Safely parse the ID
    const parsedJobId = React.useMemo(() => {
        const id = parseInt(jobId, 10);
        return isNaN(id) ? null : id;
    }, [jobId]);

    const {
        data: job,
        isLoading,
        isError,
        error,
    } = api.job.getById.useQuery(
        { id: parsedJobId! }, // Query input
        {
            enabled: parsedJobId !== null, // Only run query if ID is a valid number
            staleTime: 5 * 60 * 1000, // Optional: Cache data for 5 minutes
            refetchOnWindowFocus: false, // Optional: Prevent refetch on window focus
        }
    );

    // Placeholder function for AI action
    const handleAiSelectCandidate = () => {
        if (!job) return;
        console.log(`Initiating AI candidate selection for job ID: ${job.id}, Name: ${job.name}`);
        // TODO: Implement actual AI candidate selection logic here
        // - This might involve another tRPC mutation call
        // - Displaying results, loading states, etc.
        alert("AI Candidate Selection (Placeholder) Triggered!");
    };

    // --- Loading State ---
    if (isLoading && parsedJobId !== null) {
        return (
            <div className="container mx-auto max-w-4xl space-y-6 p-4">
                 <Button variant="outline" size="sm" disabled>
                     <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
                 </Button>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="mt-2 h-5 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                         <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Skeleton className="h-5 w-full" />
                         <Skeleton className="h-10 w-48" />
                    </CardContent>
                 </Card>
            </div>
        );
    }

    // --- Error States ---
    if (parsedJobId === null) {
        return (
            <div className="container mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 p-4 text-center">
                 <XCircle className="h-12 w-12 text-destructive" />
                <h2 className="text-xl font-semibold">Invalid Job ID</h2>
                <p className="text-muted-foreground">The job ID in the URL is not valid.</p>
                 <Button variant="outline" onClick={() => router.push('/jobs')}>
                     <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
                 </Button>
            </div>
        );
    }

    if (isError) {
         console.error("tRPC Error:", error);
        return (
            <div className="container mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 p-4 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <h2 className="text-xl font-semibold">Error Loading Job</h2>
                <p className="text-muted-foreground">Could not load job details. Please try again later.</p>
                 <Button variant="outline" onClick={() => router.push('/jobs')}>
                     <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
                 </Button>
            </div>
        );
    }

    if (!job) {
        // Handled case where query ran successfully but found no job
        return (
             <div className="container mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 p-4 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Job Not Found</h2>
                <p className="text-muted-foreground">No job posting found with the specified ID.</p>
                 <Button variant="outline" onClick={() => router.push('/jobs')}>
                     <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
                 </Button>
            </div>
        );
    }

    // --- Success State ---
    return (
        <div className="container mx-auto max-w-4xl space-y-8 p-4 md:p-6">
            {/* Back Button */}
            <div>
                <Button variant="outline" size="sm" onClick={() => router.push('/jobs')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs List
                </Button>
            </div>

            {/* Job Details Card */}
            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="text-2xl md:text-3xl">{job.name}</CardTitle>
                        <Badge variant={getStatusVariant(job.status)} className="capitalize">
                            {job.status}
                        </Badge>
                    </div>
                    <CardDescription className="text-base">{job.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="mb-2 text-lg font-semibold">Description</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Salary</p>
                            <p className="font-semibold">{formatSalary(job.salary)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
                            <Badge variant="outline" className="capitalize">{job.type}</Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Work Mode</p>
                            <Badge variant="secondary" className="capitalize">{job.work_mode}</Badge>
                        </div>
                         {/* Optional: Add more fields like Created At if needed */}
                         {/* <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Posted</p>
                            <p>{new Date(job.createdAt).toLocaleDateString()}</p>
                        </div> */}
                    </div>
                     {job.selectedCandidate && (
                         <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
                             <p className="font-semibold text-primary">Candidate Selected: {job.selectedCandidate.name}</p>
                             {/* Optionally show more candidate details */}
                         </div>
                     )}
                </CardContent>
            </Card>

            {/* AI Candidate Selection Section */}
             {job.status === 'open' && !job.selectedCandidate && ( // Only show if job is open and no candidate selected
                <Card>
                    <CardHeader>
                        <CardTitle>AI Candidate Matching</CardTitle>
                        <CardDescription>
                            Use AI to analyze applicants and find the best potential matches for this role based on their REMOVED_BUCKET_NAME.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleAiSelectCandidate}>
                            <BrainCircuit className="mr-2 h-4 w-4" /> Find Top Candidates
                        </Button>
                         {/* Placeholder for potential results display later */}
                         {/* <div className="mt-4">
                             [AI results will appear here...]
                         </div> */}
                    </CardContent>
                </Card>
             )}
        </div>
    );
}