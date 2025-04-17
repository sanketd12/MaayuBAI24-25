"use client"

import type React from "react"

import { useState } from "react"
import {
  Upload,
  Filter,
  Search,
  MoreHorizontal,
  Trash,
  FolderPlus,
  Download,
  Mail,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Badge } from "~/components/ui/badge"
import { Checkbox } from "~/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible"
import { Progress } from "~/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { FileUpload } from "~/components/ui/file-upload"

// Mock data for candidates
const initialCandidates = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    title: "Senior Frontend Developer",
    experience: "7 years",
    education: "B.S. Computer Science, Stanford University",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
    buckets: ["Engineering"],
    status: "reviewed",
    matchScore: 92,
    dateAdded: "2023-10-15",
  },
  {
    id: 2,
    name: "Jamie Smith",
    email: "jamie.smith@example.com",
    phone: "(555) 987-6543",
    location: "New York, NY",
    title: "UX/UI Designer",
    experience: "5 years",
    education: "M.F.A. Design, Rhode Island School of Design",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
    buckets: ["Design"],
    status: "reviewed",
    matchScore: 88,
    dateAdded: "2023-10-12",
  },
  {
    id: 3,
    name: "Taylor Wilson",
    email: "taylor.wilson@example.com",
    phone: "(555) 456-7890",
    location: "Chicago, IL",
    title: "Full Stack Developer",
    experience: "4 years",
    education: "B.S. Computer Engineering, MIT",
    skills: ["JavaScript", "React", "Python", "Django", "Docker"],
    buckets: ["Engineering"],
    status: "pending",
    matchScore: 85,
    dateAdded: "2023-10-10",
  },
  {
    id: 4,
    name: "Morgan Lee",
    email: "morgan.lee@example.com",
    phone: "(555) 789-0123",
    location: "Austin, TX",
    title: "Product Designer",
    experience: "6 years",
    education: "B.F.A. Graphic Design, Parsons School of Design",
    skills: ["UI Design", "UX Research", "Sketch", "InVision", "Zeplin"],
    buckets: ["Design"],
    status: "pending",
    matchScore: 82,
    dateAdded: "2023-10-08",
  },
  {
    id: 5,
    name: "Jordan Rivera",
    email: "jordan.rivera@example.com",
    phone: "(555) 234-5678",
    location: "Seattle, WA",
    title: "Backend Developer",
    experience: "3 years",
    education: "M.S. Computer Science, University of Washington",
    skills: ["Java", "Spring Boot", "Microservices", "Kubernetes", "PostgreSQL"],
    buckets: ["Engineering"],
    status: "rejected",
    matchScore: 78,
    dateAdded: "2023-10-05",
  },
  {
    id: 6,
    name: "Casey Kim",
    email: "casey.kim@example.com",
    phone: "(555) 345-6789",
    location: "Boston, MA",
    title: "Data Scientist",
    experience: "4 years",
    education: "Ph.D. Statistics, Harvard University",
    skills: ["Python", "R", "Machine Learning", "TensorFlow", "SQL"],
    buckets: ["Data Science"],
    status: "reviewed",
    matchScore: 90,
    dateAdded: "2023-10-03",
  },
]

// Mock data for buckets
const buckets = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Design" },
  { id: 3, name: "Marketing" },
  { id: 4, name: "Sales" },
  { id: 5, name: "Data Science" },
]

export default function CandidatesPool() {
  const [candidates, setCandidates] = useState(initialCandidates)
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddToBucketDialogOpen, setIsAddToBucketDialogOpen] = useState(false)
  const [selectedBucket, setSelectedBucket] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  // Filter states
  const [filterBuckets, setFilterBuckets] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [filterMinScore, setFilterMinScore] = useState(0)

  const handleSelectCandidate = (candidateId: number) => {
    setSelectedCandidates(
      selectedCandidates.includes(candidateId)
        ? selectedCandidates.filter((id) => id !== candidateId)
        : [...selectedCandidates, candidateId],
    )
  }

  const handleSelectAllCandidates = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([])
    } else {
      setSelectedCandidates(filteredCandidates.map((candidate) => candidate.id))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.multiple) {
        setSelectedFiles(e.target.files)
        setSelectedFile(null)
      } else {
        setSelectedFile(e.target.files[0])
        setSelectedFiles(null)
      }
    }
  }

  const handleUpload = () => {
    // In a real app, you would upload the file(s) to your backend here
    // For now, we'll just close the dialog
    setIsUploadDialogOpen(false)
    setSelectedFile(null)
    setSelectedFiles(null)
  }

  const handleAddToBucket = () => {
    if (selectedBucket && selectedCandidates.length > 0) {
      setCandidates(
        candidates.map((candidate) =>
          selectedCandidates.includes(candidate.id)
            ? {
                ...candidate,
                buckets: candidate.buckets.includes(selectedBucket)
                  ? candidate.buckets
                  : [...candidate.buckets, selectedBucket],
              }
            : candidate,
        ),
      )
      setIsAddToBucketDialogOpen(false)
      setSelectedBucket("")
    }
  }

  const handleRemoveFromBucket = (candidateId: number, bucketName: string) => {
    setCandidates(
      candidates.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              buckets: candidate.buckets.filter((b) => b !== bucketName),
            }
          : candidate,
      ),
    )
  }

  const handleDeleteCandidates = () => {
    setCandidates(candidates.filter((candidate) => !selectedCandidates.includes(candidate.id)))
    setSelectedCandidates([])
  }

  const toggleFilterBucket = (bucketName: string) => {
    setFilterBuckets(
      filterBuckets.includes(bucketName)
        ? filterBuckets.filter((b) => b !== bucketName)
        : [...filterBuckets, bucketName],
    )
  }

  // Apply filters to candidates
  const filteredCandidates = candidates.filter((candidate) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchQuery.toLowerCase())

    // Bucket filter
    const matchesBucket =
      filterBuckets.length === 0 || candidate.buckets.some((bucket) => filterBuckets.includes(bucket))

    // Status filter
    const matchesStatus = filterStatus === "" || candidate.status === filterStatus

    // Match score filter
    const matchesScore = candidate.matchScore >= filterMinScore

    return matchesSearch && matchesBucket && matchesStatus && matchesScore
  })

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reviewed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Reviewed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Candidates Pool</h2>
          <p className="text-sm text-muted-foreground">
            Upload, view, and organize all candidate REMOVED_BUCKET_NAME in your system
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Resumes
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Upload Resumes</DialogTitle>
                <DialogDescription>Upload one or multiple candidate REMOVED_BUCKET_NAME to add to your pool</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="files">Resume Files</Label>
                  <FileUpload />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, DOC, DOCX. Maximum file size: 10MB.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="upload-bucket">Add to Bucket (Optional)</Label>
                  <Select value={selectedBucket} onValueChange={setSelectedBucket}>
                    <SelectTrigger id="upload-bucket">
                      <SelectValue placeholder="Select a bucket" />
                    </SelectTrigger>
                    <SelectContent>
                      {buckets.map((bucket) => (
                        <SelectItem key={bucket.id} value={bucket.name}>
                          {bucket.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile && (!selectedFiles || selectedFiles.length === 0)}
                >
                  Upload
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {selectedCandidates.length > 0 && (
            <>
              <Dialog open={isAddToBucketDialogOpen} onOpenChange={setIsAddToBucketDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Add to Bucket
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add to Bucket</DialogTitle>
                    <DialogDescription>
                      Add {selectedCandidates.length} selected candidate(s) to a bucket
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="bucket">Bucket</Label>
                      <Select value={selectedBucket} onValueChange={setSelectedBucket}>
                        <SelectTrigger id="bucket">
                          <SelectValue placeholder="Select a bucket" />
                        </SelectTrigger>
                        <SelectContent>
                          {buckets.map((bucket) => (
                            <SelectItem key={bucket.id} value={bucket.name}>
                              {bucket.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddToBucketDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddToBucket} disabled={!selectedBucket}>
                      Add
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={handleDeleteCandidates}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          )}

          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => setViewMode("table")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M3 15h18" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
              </svg>
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => setViewMode("grid")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search candidates..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                Filters
                {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            {(filterBuckets.length > 0 || filterStatus || filterMinScore > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterBuckets([])
                  setFilterStatus("")
                  setFilterMinScore(0)
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
          <CollapsibleContent className="space-y-4">
            <Card>
              <CardContent className="grid gap-6 pt-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Buckets</h4>
                  <div className="space-y-2">
                    {buckets.map((bucket) => (
                      <div key={bucket.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`filter-bucket-${bucket.id}`}
                          checked={filterBuckets.includes(bucket.name)}
                          onCheckedChange={() => toggleFilterBucket(bucket.name)}
                        />
                        <Label htmlFor={`filter-bucket-${bucket.id}`}>{bucket.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Status</h4>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any status</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Minimum Match Score</h4>
                  <div className="flex items-center gap-4">
                    <Input
                      type="range"
                      min="0"
                      max="100"
                      value={filterMinScore}
                      onChange={(e) => setFilterMinScore(Number(e.target.value))}
                      className="w-full"
                    />
                    <span className="w-12 text-center">{filterMinScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="rounded-md border">
        {viewMode === "table" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={filteredCandidates.length > 0 && selectedCandidates.length === filteredCandidates.length}
                    onCheckedChange={handleSelectAllCandidates}
                    aria-label="Select all candidates"
                  />
                </TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Buckets</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No candidates found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCandidates.includes(candidate.id)}
                        onCheckedChange={() => handleSelectCandidate(candidate.id)}
                        aria-label={`Select ${candidate.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={candidate.name} />
                          <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-sm text-muted-foreground">{candidate.title}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {candidate.buckets.map((bucket) => (
                          <Badge key={bucket} variant="secondary" className="text-xs">
                            {bucket}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={candidate.matchScore} className="h-2 w-16" />
                        <span className="text-sm font-medium">{candidate.matchScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(candidate.dateAdded)}</TableCell>
                    <TableCell>
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
                            <Eye className="mr-2 h-4 w-4" />
                            View Resume
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Resume
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Contact Candidate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <FolderPlus className="mr-2 h-4 w-4" />
                            Add to Bucket
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCandidates.length === 0 ? (
              <div className="col-span-full py-6 text-center">
                <p className="text-muted-foreground">No candidates found.</p>
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <Card key={candidate.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedCandidates.includes(candidate.id)}
                          onCheckedChange={() => handleSelectCandidate(candidate.id)}
                          aria-label={`Select ${candidate.name}`}
                        />
                        <CardTitle className="text-base">{candidate.name}</CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Resume
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Resume
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Contact Candidate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <FolderPlus className="mr-2 h-4 w-4" />
                            Add to Bucket
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="text-xs">{candidate.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        {getStatusBadge(candidate.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Match Score:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{candidate.matchScore}%</span>
                          <Progress value={candidate.matchScore} className="h-2 w-16" />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date Added:</span>
                        <span>{formatDate(candidate.dateAdded)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start pt-2">
                    <div className="text-xs text-muted-foreground">Buckets:</div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {candidate.buckets.map((bucket) => (
                        <Badge key={bucket} variant="secondary" className="text-xs">
                          {bucket}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
