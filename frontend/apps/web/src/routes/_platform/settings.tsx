import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_platform/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_platform/settings"!</div>
}
