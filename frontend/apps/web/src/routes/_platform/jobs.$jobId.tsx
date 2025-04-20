import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_platform/jobs/$jobId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_platform/jobs/$jobId"!</div>
}
