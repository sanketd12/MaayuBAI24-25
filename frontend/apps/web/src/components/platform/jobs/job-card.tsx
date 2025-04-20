"use client"

import type React from "react"

import { formatDistanceToNow } from "date-fns"
import { Building, Edit, Home, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Job } from "../../../../../server/src/db/schema/platform"
import { useNavigate } from "@tanstack/react-router"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedJob, setEditedJob] = useState(job)
  const navigate = useNavigate()

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary)
  }

  const handleCardClick = () => {
    if (!isEditing) {
      navigate({ to: "/jobs/$jobId", params: { jobId: job.id.toString() } })
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Edit job:", job.id)
    setIsEditing(true)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Delete job:", job.id)
  }

  const handleSave = () => {
    console.log("Save edited job:", editedJob)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedJob(job)
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedJob((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditedJob((prev) => ({ ...prev, [name]: value }))
  }

  const getWorkModeIcon = (workMode: "remote" | "hybrid" | "office") => {
    switch (workMode) {
      case "remote":
        return <Home className="h-4 w-4" />
      case "hybrid":
        return (
          <div className="flex">
            <Building className="h-4 w-4" />
            <span className="mx-0.5">/</span>
            <Home className="h-4 w-4" />
          </div>
        )
      case "office":
        return <Building className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card className="w-full transition-all hover:shadow-md cursor-pointer" onClick={handleCardClick}>
      {isEditing ? (
        <>
          <CardHeader className="pb-2">
            <div className="space-y-2">
              <Label htmlFor="name">Job Title</Label>
              <Input id="name" name="name" value={editedJob.name} onChange={handleChange} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={editedJob.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input id="salary" name="salary" type="number" value={editedJob.salary} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={editedJob.location} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Employment Type</Label>
                <Select value={editedJob.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="work_mode">Work Mode</Label>
                <Select value={editedJob.work_mode} onValueChange={(value) => handleSelectChange("work_mode", value)}>
                  <SelectTrigger id="work_mode">
                    <SelectValue placeholder="Select work mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <h3 className="text-xl font-bold">{job.name}</h3>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                {job.location} <span className="ml-1">{getWorkModeIcon(job.work_mode)}</span>
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {job.type}
              </span>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                {job.work_mode}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between pt-2">
            <p className="text-lg font-bold text-white">{formatSalary(job.salary)}</p>
            <p className="text-xs text-muted-foreground">
              Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </p>
          </CardFooter>
        </>
      )}
    </Card>
  )
}