import { createFileRoute } from '@tanstack/react-router'
import { WebsiteHeader } from '@/components/website-header'
import { Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_website')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <WebsiteHeader />
      <Outlet />
    </>
  )
}