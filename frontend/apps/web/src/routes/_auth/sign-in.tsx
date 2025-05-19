import { createFileRoute } from '@tanstack/react-router'
import SignInForm from '@/components/sign-in-form'

export const Route = createFileRoute('/_auth/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignInForm />
}
