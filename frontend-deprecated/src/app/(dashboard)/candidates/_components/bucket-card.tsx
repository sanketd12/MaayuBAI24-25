"use client";

import * as React from "react";
import type { Bucket } from "~/server/db/schema";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import { MoreHorizontal, Edit, Trash, Check, X, FolderOpen } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export default function BucketCard({ bucket }: { bucket: Bucket }) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [editedName, setEditedName] = React.useState<string>(bucket.name);

    React.useEffect(() => {
        if (!isEditing) {
            setEditedName(bucket.name);
        }
    }, [bucket.name, isEditing]);

    const utils = api.useUtils();

    const updateBucketMutation = api.bucket.updateBucketDetails.useMutation({
        onSuccess: (_data, variables) => {
            toast.success(`Bucket "${variables.name}" updated successfully`);
            utils.bucket.getAll.invalidate();
        },
        onError: (error) => {
            toast.error(`Failed to update bucket: ${error.message}`);
            setEditedName(bucket.name);
        },
    });

    const deleteBucketMutation = api.bucket.delete.useMutation({
        onSuccess: (_data, variables) => {
            toast.success(`Bucket "${bucket.name}" deleted successfully`);
            utils.bucket.getAll.invalidate();
        },
        onError: (error) => {
            toast.error(`Failed to delete bucket: ${error.message}`);
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedName(e.target.value);
    };

    const handleEdit = () => {
        setEditedName(bucket.name);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedName(bucket.name);
    };

    const handleSave = () => {
        const trimmedName = editedName.trim();
        if (trimmedName === "") {
            toast.error("Bucket name cannot be empty.");
            return;
        }
        if (trimmedName === bucket.name) {
             setIsEditing(false);
             return;
        }

        setIsEditing(false);
        updateBucketMutation.mutate({ id: bucket.id, name: trimmedName });
    };

    const handleDeleteTrigger = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        setIsDeleteDialogOpen(false);
        deleteBucketMutation.mutate({ id: bucket.id });
    };

    return (
        <>
            <Card className="w-full max-w-sm transition-shadow duration-200 hover:shadow-md border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex-grow space-y-1 pr-2">
                        {isEditing ? (
                            <Input
                                id={`bucket-name-${bucket.id}`}
                                value={editedName}
                                onChange={handleInputChange}
                                className="text-lg font-semibold leading-none tracking-tight"
                                placeholder="Bucket Name"
                                autoFocus
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancelEdit(); }}
                                disabled={updateBucketMutation.isPending}
                            />
                        ) : (
                            <CardTitle className="truncate text-lg leading-tight">{editedName}</CardTitle>
                        )}
                    </div>
                    <div className="flex-shrink-0">
                        {!isEditing ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild disabled={deleteBucketMutation.isLoading}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Bucket options</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleEdit} disabled={updateBucketMutation.isLoading}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Edit Name</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleDeleteTrigger}
                                        className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                        disabled={deleteBucketMutation.isLoading}
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        <span>Delete Bucket</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleSave}
                                    className="h-8 w-8 text-green-600 hover:text-green-700"
                                    disabled={updateBucketMutation.isLoading}
                                >
                                    {updateBucketMutation.isLoading ? (
                                        <span className="animate-spin">⏳</span>
                                    ) : (
                                        <Check className="h-5 w-5" />
                                    )}
                                    <span className="sr-only">Save changes</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCancelEdit}
                                    className="h-8 w-8 text-red-600 hover:text-red-700"
                                    disabled={updateBucketMutation.isLoading}
                                >
                                    <X className="h-5 w-5" />
                                    <span className="sr-only">Cancel edit</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <Link href={`/candidates/${bucket.id}`} passHref>
                        <Button variant="outline" className="w-full" disabled={deleteBucketMutation.isLoading}>
                            <FolderOpen className="mr-2 h-4 w-4" />
                            View Resumes
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                             bucket &quot;{bucket.name}&quot; and all associated candidates.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteBucketMutation.isLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteBucketMutation.isLoading}
                        >
                            {deleteBucketMutation.isLoading ? "Deleting..." : "Confirm Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}