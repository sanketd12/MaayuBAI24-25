"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FolderPlus, MoreHorizontal, Trash, Edit, FileText, Users } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
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

// Mock data for resume buckets
const initialBuckets = [
  { id: 1, name: "Engineering", count: 24 },
  { id: 2, name: "Design", count: 18 },
  { id: 3, name: "Marketing", count: 12 },
  { id: 4, name: "Sales", count: 8 },
]

export default function ResumeManagement() {
  const [buckets, setBuckets] = useState(initialBuckets)
  const [newBucketName, setNewBucketName] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isBucketDialogOpen, setIsBucketDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedBucket, setSelectedBucket] = useState<number | null>(null)

  const handleCreateBucket = () => {
    if (newBucketName.trim()) {
      const newBucket = {
        id: buckets.length + 1,
        name: newBucketName,
        count: 0,
      }
      setBuckets([...buckets, newBucket])
      setNewBucketName("")
      setIsBucketDialogOpen(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (selectedFile && selectedBucket) {
      // In a real app, you would upload the file to your backend here
      // Update the count for the selected bucket
      setBuckets(
        buckets.map((bucket) => (bucket.id === selectedBucket ? { ...bucket, count: bucket.count + 1 } : bucket)),
      )
      setSelectedFile(null)
      setSelectedBucket(null)
      setIsUploadDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PlatformHeading title="Resume Management" description="Upload and organize candidate REMOVED_BUCKET_NAME into buckets" />
        <div className="flex gap-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Resume
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Resume</DialogTitle>
                <DialogDescription>Upload a candidate resume to a specific bucket</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="file">Resume File</Label>
                  <Input id="file" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bucket">Bucket</Label>
                  <select
                    id="bucket"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedBucket || ""}
                    onChange={(e) => setSelectedBucket(Number(e.target.value))}
                  >
                    <option value="">Select a bucket</option>
                    {buckets.map((bucket) => (
                      <option key={bucket.id} value={bucket.id}>
                        {bucket.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={!selectedFile || !selectedBucket}>
                  Upload
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isBucketDialogOpen} onOpenChange={setIsBucketDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="mr-2 h-4 w-4" />
                New Bucket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Bucket</DialogTitle>
                <DialogDescription>Create a new bucket to organize candidate REMOVED_BUCKET_NAME</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Bucket Name</Label>
                  <Input
                    id="name"
                    value={newBucketName}
                    onChange={(e) => setNewBucketName(e.target.value)}
                    placeholder="e.g., Frontend Developers"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBucketDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBucket} disabled={!newBucketName.trim()}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {buckets.map((bucket) => (
          <Card key={bucket.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{bucket.name}</CardTitle>
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
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{bucket.count} REMOVED_BUCKET_NAME</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Users className="mr-1 h-3 w-3" />
                  {Math.floor(bucket.count * 0.8)} reviewed
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {Math.floor(bucket.count * 0.3)} matched
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View Resumes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}