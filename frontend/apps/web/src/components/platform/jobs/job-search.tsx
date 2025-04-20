"use client"

import type React from "react"

import { Search } from "lucide-react"
import { memo, useCallback } from "react"

import { Input } from "@/components/ui/input"

interface JobSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const JobSearch = memo(function JobSearch({ searchQuery, setSearchQuery }: JobSearchProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
    },
    [setSearchQuery],
  )

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search jobs by title, location, or type..."
        className="pl-9"
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>
  )
})
