"use client";

import type { Job } from "~/server/db/schema";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import { MoreHorizontal, Edit, Trash, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

// Helper to format salary nicely
const formatSalary = (salary: number | null | undefined) => {
    if (salary === null || salary === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(salary);
};

export default function JobCard({ job }: { job: Job }) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    // State to hold edited values temporarily
    const [editedJob, setEditedJob] = useState<Job>(job);

    useEffect(() => {
        // Reset editedJob if the job prop changes (e.g., parent list updates)
        // and we are not currently editing this specific card
        if (!isEditing) {
            setEditedJob(job);
        }
    }, [job, isEditing]);

    const utils = api.useUtils();

    const updateJobMutation = api.job.updateJobDetails.useMutation({
        onSuccess: () => {
            toast.success("Job updated successfully");
            // invalidate the trpc query
            utils.job.getAll.invalidate();
        },
        onError: () => {
            toast.error("Failed to update job. Please try again.");
        }
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        // Prevent link navigation when interacting with inputs
        e.stopPropagation();
        const { name, value } = e.target;
        setEditedJob((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof Job) => (value: string) => {
        // Prevent link navigation when interacting with selects (might not be strictly necessary but good practice)
        // The actual interaction is handled by the Select's trigger/content logic
        setEditedJob((prev) => ({ ...prev, [name]: value }));
    };

    const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Prevent link navigation when interacting with inputs
        e.stopPropagation();
        const value = e.target.value;
        // Allow empty string for clearing, otherwise parse as number
        const salary = value === "" ? null : parseInt(value, 10);
        // Ensure it's a valid number or null
        if (value === "" || !isNaN(salary!)) {
             setEditedJob((prev) => ({ ...prev, salary: salary as number })); // Assert salary type
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        // Prevent link navigation when clicking edit
        e.stopPropagation();
        setEditedJob(job); // Reset edits to current job state before opening
        setIsEditing(true);
    };

    const handleCancelEdit = (e: React.MouseEvent) => {
        // Prevent link navigation when clicking cancel
        e.stopPropagation();
        setIsEditing(false);
        setEditedJob(job); // Discard changes
    };

    const handleSave = (e: React.MouseEvent) => {
        // Prevent link navigation when clicking save
        e.stopPropagation();
        setIsEditing(false);
        // --- TODO: Add mutation call here ---
        // Example: updateJobMutation.mutate(editedJob);
        console.log("Saving job:", editedJob);
        updateJobMutation.mutate(editedJob);
        // invalidate the trpc query
    };

    const deleteJobMutation = api.job.delete.useMutation({
        onSuccess: () => {
            toast.success("Job deleted successfully");
            // invalidate the trpc query
            utils.job.getAll.invalidate();
        },
        onError: () => {
            toast.error("Failed to delete job. Please try again.");
        }
    });

    const handleDeleteConfirm = (e: React.MouseEvent) => {
        // Prevent link navigation when clicking confirm delete in dialog
        e.stopPropagation();
        setIsDeleteDialogOpen(false);
        deleteJobMutation.mutate({ id: job.id });
    };

    const jobTypeOptions = ["full-time", "part-time", "internship"];
    const workModeOptions = ["remote", "hybrid", "office"];
    const statusOptions = ["open", "closed"];

    // Disable link behavior when editing
    const linkHref = isEditing ? undefined : `/jobs/${job.id}`;
    const LinkWrapper = linkHref ? Link : React.Fragment;
    const linkProps = linkHref ? { href: linkHref, className: "block" } : {}; // Use block to make Link take Card space

    return (
        <>
            <LinkWrapper {...linkProps}>
                <Card className={`w-full transition-shadow duration-200 ${!isEditing ? 'hover:shadow-lg cursor-pointer' : ''}`}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            {isEditing ? (
                                <Input
                                    id={`job-name-${job.id}`}
                                    name="name"
                                    value={editedJob.name}
                                    onChange={handleInputChange}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-lg font-semibold leading-none tracking-tight"
                                    placeholder="Job Title"
                                />
                            ) : (
                                <CardTitle className="text-lg">{editedJob.name}</CardTitle> // Display potentially saved name
                            )}
                            {isEditing ? (
                                 <Input
                                    id={`job-location-${job.id}`}
                                    name="location"
                                    value={editedJob.location}
                                    onChange={handleInputChange}
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="Location (e.g., Remote, New York City)"
                                    className="text-sm text-muted-foreground"
                                />
                            ) : (
                                <CardDescription>{editedJob.location}</CardDescription>
                            )}
                        </div>
                        {!isEditing && ( // Only show dropdown when not editing
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={handleEdit}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">More options</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenuItem onClick={handleEdit}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDeleteDialogOpen(true);
                                        }}
                                        className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                         {isEditing && ( // Show Save/Cancel buttons only when editing
                            <div className="flex items-center space-x-2">
                                 <Button variant="ghost" size="icon" onClick={handleSave} className="h-8 w-8 text-green-600 hover:text-green-700">
                                    <Check className="h-5 w-5" />
                                    <span className="sr-only">Save changes</span>
                                 </Button>
                                  <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="h-8 w-8 text-red-600 hover:text-red-700">
                                    <X className="h-5 w-5" />
                                    <span className="sr-only">Cancel edit</span>
                                 </Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4" onClick={(e) => e.stopPropagation()}>
                         {/* Description */}
                         <div className="space-y-1">
                             <Label htmlFor={`job-description-${job.id}`}>Description</Label>
                             {isEditing ? (
                                <Textarea
                                    id={`job-description-${job.id}`}
                                    name="description"
                                    value={editedJob.description}
                                    onChange={handleInputChange}
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="Job description..."
                                    className="min-h-[80px]"
                                 />
                             ) : (
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {editedJob.description}
                                 </p>
                             )}
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                            {/* Salary */}
                            <div className="space-y-1">
                                 <Label htmlFor={`job-salary-${job.id}`}>Salary (Annual)</Label>
                                 {isEditing ? (
                                     <Input
                                        id={`job-salary-${job.id}`}
                                        name="salary"
                                        type="number" // Use number input
                                        value={editedJob.salary ?? ""} // Handle null value for input
                                        onChange={handleSalaryChange}
                                        onClick={(e) => e.stopPropagation()}
                                        placeholder="e.g., 90000"
                                    />
                                 ) : (
                                     <p className="font-medium">{formatSalary(editedJob.salary)}</p>
                                 )}
                             </div>

                            {/* Type */}
                            <div className="space-y-1">
                                <Label htmlFor={`job-type-${job.id}`}>Type</Label>
                                {isEditing ? (
                                    <Select
                                        name="type"
                                        value={editedJob.type}
                                        onValueChange={handleSelectChange("type")}
                                    >
                                        <SelectTrigger id={`job-type-${job.id}`} onClick={(e) => e.stopPropagation()}>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jobTypeOptions.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Badge variant="outline" className="capitalize">
                                        {editedJob.type}
                                    </Badge>
                                )}
                            </div>

                            {/* Work Mode */}
                            <div className="space-y-1">
                                <Label htmlFor={`job-work_mode-${job.id}`}>Work Mode</Label>
                                {isEditing ? (
                                    <Select
                                        name="work_mode"
                                        value={editedJob.work_mode}
                                        onValueChange={handleSelectChange("work_mode")}
                                    >
                                        <SelectTrigger id={`job-work_mode-${job.id}`} onClick={(e) => e.stopPropagation()}>
                                            <SelectValue placeholder="Select work mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                             {workModeOptions.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Badge variant="secondary" className="capitalize">
                                        {editedJob.work_mode}
                                    </Badge>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-1">
                                 <Label htmlFor={`job-status-${job.id}`}>Status</Label>
                                 {isEditing ? (
                                    <Select
                                        name="status"
                                        value={editedJob.status}
                                        onValueChange={handleSelectChange("status")}
                                    >
                                        <SelectTrigger id={`job-status-${job.id}`} onClick={(e) => e.stopPropagation()}>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                 ) : (
                                    <Badge
                                        variant={editedJob.status === "open" ? "default" : "destructive"}
                                        className="capitalize"
                                    >
                                        {editedJob.status}
                                    </Badge>
                                 )}
                            </div>
                        </div>
                    </CardContent>
                    {/* Optional Footer - can display createdAt or other info */}
                    {/* <CardFooter className="text-xs text-muted-foreground pt-4">
                        Created: {new Date(editedJob.createdAt).toLocaleDateString()}
                    </CardFooter> */}
                </Card>
            </LinkWrapper>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            job posting &quot;{job.name}&quot;.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700" // Destructive action style
                        >
                            Confirm Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}