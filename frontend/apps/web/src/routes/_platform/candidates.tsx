import { createFileRoute } from '@tanstack/react-router'
import { useTRPC } from "@/utils/trpc";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute('/_platform/candidates')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const buckets = await context.queryClient.ensureQueryData(context.trpc.bucket.getAll.queryOptions());
    return { buckets };
  },
})

function RouteComponent() {
  const trpc = useTRPC();

	const todos = useSuspenseQuery(trpc.bucket.getAll.queryOptions());

  return (
    <pre>
      {JSON.stringify(todos, null, 2)}
    </pre>
  )
}