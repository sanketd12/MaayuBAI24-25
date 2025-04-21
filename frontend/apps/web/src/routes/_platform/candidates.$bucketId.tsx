import { useTRPC } from '@/utils/trpc';
import { createFileRoute } from '@tanstack/react-router'
import { useParams } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { CandidateTable } from '@/components/platform/candidates/table';
import { columns } from '@/components/platform/candidates/table/columns';

export const Route = createFileRoute('/_platform/candidates/$bucketId')({
  component: RouteComponent,
  loader: async ({ context, params }) => {  
    await context.queryClient.ensureQueryData(context.trpc.bucket.getById.queryOptions({ id: parseInt(params.bucketId) }));
  },
})

function RouteComponent() {
  const trpc = useTRPC();
  const { bucketId } = useParams({ from: '/_platform/candidates/$bucketId' });
  const { data: bucketWithCandidates } = useSuspenseQuery(trpc.bucket.getById.queryOptions({ id: parseInt(bucketId) }));
  return (
    <>
        <CandidateTable columns={columns} data={bucketWithCandidates?.candidates || []} />
    </>
  )
}
