"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import HeroSection from "~/components/hero-section"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const title = "Hire faster and smarter with Maayu"
const description =
  "A next-gen suite of AI tools to help you find, evaluate, and hire the best candidates."

export default function Home() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleQuerySubmit = async () => {
    if (!query.trim()) return
    setIsLoading(true)
    setResult(null)

    try {
      const res = await fetch("http://localhost:8000/agent/find-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_description: query }),
      })
      const data = await res.json()
      setResult(JSON.stringify(data, null, 2))  // show entire JSON response
    } catch (err) {
      setResult("An error occurred while fetching results.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <HeroSection title={title} description={description}>
      <div className="w-full mt-6 max-w-2xl bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-white">Recruiter Query</h3>
        <p className="text-sm text-gray-400 mb-4">
          Describe the ideal candidate or job requirements you're looking for.
        </p>

        <Textarea
          placeholder="e.g. Backend engineer with AWS and TypeScript experience..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4 min-h-[160px] bg-gray-800 border-gray-700 text-white"
        />
        <Button
          onClick={handleQuerySubmit}
          disabled={isLoading || !query.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Submit Query"
          )}
        </Button>

        {result && (
          <div className="mt-6 bg-gray-800 p-4 rounded-md text-gray-300 whitespace-pre-wrap">
            {result}
          </div>
        )}
      </div>
    </HeroSection>
  )
}
