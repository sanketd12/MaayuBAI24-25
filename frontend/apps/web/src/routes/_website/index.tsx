import { createFileRoute } from '@tanstack/react-router'
import Hero from '@/components/hero'

export const Route = createFileRoute('/_website/')({
  component: RouteComponent,
})

const title = "Hire faster and smarter with Maayu"
const description = "A next-gen suite of AI tools to help you find, evaluate, and hire the best candidates."

function RouteComponent() {
  return <Hero title={title} description={description} />
}