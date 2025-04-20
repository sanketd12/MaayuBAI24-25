"use client"

import { useState } from "react"
import { Briefcase, Plus, MoreHorizontal, Trash, Edit, Calendar, MapPin, DollarSign, Users } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Badge } from "~/components/ui/badge"
import PlatformHeading from "~/components/platform/heading"

// Mock data for jobs
const initialJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    location: "Remote",
    salary: "$120,000 - $150,000",
    department: "Engineering",
    postedDate: "2023-10-15",
    description: "We're looking for a Senior Frontend Developer with 5+ years of experience in React and TypeScript.",
    candidates: 12,
  },
  {
    id: 2,
    title: "UX Designer",
    location: "New York, NY",
    salary: "$90,000 - $110,000",
    department: "Design",
    postedDate: "2023-10-10",
    description: "Seeking a talented UX Designer to join our product team and create exceptional user experiences.",
    candidates: 8,
  },
  {
    id: 3,
    title: "Marketing Manager",
    location: "San Francisco, CA",
    salary: "$100,000 - $130,000",
    department: "Marketing",
    postedDate: "2023-10-05",
    description: "Looking for an experienced Marketing Manager to lead our marketing initiatives and campaigns.",
    candidates: 6,
  },
]

export default function JobManagement() {
  const [jobs, setJobs] = useState(initialJobs)
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false)
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    salary: "",
    department: "",
    description: "",
  })

  const handleCreateJob = () => {
    if (newJob.title.trim() && newJob.description.trim()) {
      const job = {
        id: jobs.length + 1,
        title: newJob.title,
        location: newJob.location,
        salary: newJob.salary,
        department: newJob.department,
        postedDate: new Date().toISOString().split("T")[0],
        description: newJob.description,
        candidates: 0,
      }
      setJobs([...jobs, job])
      setNewJob({
        title: "",
        location: "",
        salary: "",
        department: "",
        description: "",
      })
      setIsJobDialogOpen(false)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PlatformHeading title="Job Management" description="Create and manage job openings for candidate matching" />
        <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
              <DialogDescription>Add a new job opening to find matching candidates</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    placeholder="e.g., Remote, New York, NY"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    placeholder="e.g., $100,000 - $130,000"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newJob.department}
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                  placeholder="e.g., Engineering, Design, Marketing"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Describe the job requirements, responsibilities, and qualifications..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsJobDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateJob} disabled={!newJob.title.trim() || !newJob.description.trim()}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 px-6">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                    <span className="flex items-center">
                      <MapPin className="mr-1 h-3.5 w-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="mr-1 h-3.5 w-3.5" />
                      {job.salary}
                    </span>
                    <span className="flex items-center">
                      <Briefcase className="mr-1 h-3.5 w-3.5" />
                      {job.department}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-3.5 w-3.5" />
                      Posted {formatDate(job.postedDate)}
                    </span>
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{job.description}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Badge variant="secondary" className="flex items-center">
                <Users className="mr-1 h-3.5 w-3.5" />
                {job.candidates} potential candidates
              </Badge>
              <Button size="sm">Find Candidates</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}