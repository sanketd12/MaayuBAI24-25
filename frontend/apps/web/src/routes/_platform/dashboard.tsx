import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_platform/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_platform/dashboard"!</div>
}
