import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import CreateJobDialog from '@/components/platform/jobs/create-job-dialog'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTRPC } from '@/utils/trpc'
import { JobSearch } from '@/components/platform/jobs/job-search'
import { JobCard } from '@/components/platform/jobs/job-card'
import { useCallback, useMemo } from 'react'

export const Route = createFileRoute('/_platform/jobs/')({
    component: RouteComponent,
    loader: async ({ context }) => {
        // Ensure data is fetched and cached before component mounts
        await context.queryClient.ensureQueryData(context.trpc.job.getAll.queryOptions());
        // Return value is optional if you primarily use useSuspenseQuery in the component
        return {};
    },
})

function RouteComponent() {
    const [dialogOpen, setDialogOpen] = useState(false);
    // const { jobs } = Route.useLoaderData(); // No longer needed for jobs data
    const trpc = useTRPC();

    // Use useSuspenseQuery to read directly from the cache, ensuring fresh data
    const { data: jobs } = useSuspenseQuery(trpc.job.getAll.queryOptions());

    const [searchQuery, setSearchQuery] = useState("")

    const setSearchQueryCallback = useCallback((query: string) => {
        setSearchQuery(query)
    }, [])

    const filteredJobs = useMemo(() => {
        const searchTerm = searchQuery.toLowerCase()
        return jobs
            .filter((job) => {
                return (
                    job.name.toLowerCase().includes(searchTerm) ||
                    job.location.toLowerCase().includes(searchTerm) ||
                    job.type.toLowerCase().includes(searchTerm) ||
                    job.work_mode.toLowerCase().includes(searchTerm) ||
                    job.description.toLowerCase().includes(searchTerm)
                )
            })
            .map((job) => ({
                ...job,
                createdAt: new Date(job.createdAt),
                updatedAt: new Date(job.updatedAt),
            }))
    }, [jobs, searchQuery])

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="flex-grow">
                     <JobSearch searchQuery={searchQuery} setSearchQuery={setSearchQueryCallback} />
                </div>
                <Button onClick={() => setDialogOpen(true)}>
                    <PlusIcon className="mr-2 h-4 w-4" /> Create Job
                </Button>
            </div>

            {filteredJobs.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-center text-muted-foreground">No jobs found matching your search criteria</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            )}

            <CreateJobDialog open={dialogOpen} setOpen={setDialogOpen} />
        </div>
    )
}
