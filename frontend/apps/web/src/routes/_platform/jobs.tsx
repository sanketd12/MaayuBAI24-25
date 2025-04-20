import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_platform/jobs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_platform/jobs"!</div>
}
