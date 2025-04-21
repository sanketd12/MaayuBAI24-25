import type React from "react"

import { formatDistanceToNow } from "date-fns"
import { Building, Edit, Home, MoreHorizontal, Trash2, Clock, Briefcase, MapPin } from "lucide-react"
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
import DeleteCardDialog from "./delete-card-dialog"
import { useTRPC } from "@/utils/trpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface JobCardProps {
  job: Job
}

const formatWorkMode = (workMode: "remote" | "hybrid" | "office") => {
  switch (workMode) {
    case "remote":
      return "Remote"
    case "hybrid":
      return "Hybrid"
    case "office":
      return "Office"
    default:
      return workMode
  }
}

const formatJobType = (jobType: "full-time" | "part-time" | "internship") => {
  switch (jobType) {
    case "full-time":
      return "Full-Time"
    case "part-time":
      return "Part-Time"
    case "internship":
      return "Internship"
    default:
      return jobType
  }
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

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const editJobMutation = useMutation(
    trpc.job.updateJobDetails.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.job.getAll.queryKey() })
        toast.success("Job updated successfully!")
      },
      onError: () => {
        toast.error("Failed to update job. Please try again.")
      },
    }),
  )

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("Edit job:", job.id)
    setIsEditing(true)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleting(true)
  }

  const handleSave = () => {
    console.log("Save edited job:", editedJob)
    editJobMutation.mutate({
      id: job.id,
      name: editedJob.name,
      description: editedJob.description,
      salary: editedJob.salary,
      type: editedJob.type,
      work_mode: editedJob.work_mode,
      location: editedJob.location,
    })
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
          <div className="flex items-center">
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

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return " text-orange-500 bg-gradient-to-tr dark:from-orange-950/40 dark:to-orange-900/40 border border-orange-300/70 dark:border-orange-700/50"
      case "part-time":
        return "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600"
      case "internship":
        return "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getWorkModeColor = (workMode: string) => {
    switch (workMode) {
      case "remote":
        return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700"
      case "hybrid":
        return "bg-gradient-to-r from-fuchsia-800/20 to-fuchsia-200 text-primary"
      case "office":
        return "bg-gradient-to-r from-violet-800/20 to-violet-900/20 text-purple-400 border border-purple-600/20"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const [isDeleting, setIsDeleting] = useState(false)

  return (
    <>
      <Card
        className={`w-full transition-all duration-300 ${
          isEditing ? "" : "cursor-pointer hover:translate-y-[-2px] hover:shadow-md hover:shadow-purple-100/50"
        }`}
        onClick={handleCardClick}
      >
        {isEditing ? (
          <>
            <CardHeader className="pb-2 border-b">
              <div className="space-y-2">
                <Label htmlFor="name">Job Title</Label>
                <Input id="name" name="name" value={editedJob.name} onChange={handleChange} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
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
            <CardFooter className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="flex flex-row items-start justify-between pb-2 border-b">
              <div>
                <h3 className="text-xl font-bold tracking-tight">{job.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    {job.location}
                  </div>
                  <div className="ml-4 text-base font-medium">
                    {formatSalary(job.salary)}
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-slate-100"
                    onClick={(e) => e.stopPropagation()}
                  >
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
            <CardContent className="py-3">
              <p className="line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getJobTypeColor(job.type)} shadow-sm`}
                >
                  <Briefcase className="mr-1 h-3 w-3" />
                  {formatJobType(job.type)}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getWorkModeColor(job.work_mode)} shadow-sm`}
                >
                  {getWorkModeIcon(job.work_mode)}
                  <span className="ml-1">{formatWorkMode(job.work_mode)}</span>
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-end pt-2 border-t text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </CardFooter>
          </>
        )}
      </Card>
      <DeleteCardDialog open={isDeleting} onOpenChange={setIsDeleting} cardId={job.id} />
    </>
  )
}