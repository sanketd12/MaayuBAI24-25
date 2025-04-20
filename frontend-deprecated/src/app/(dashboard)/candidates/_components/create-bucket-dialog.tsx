"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogDescription,
    DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { toast } from "sonner";

// Define the Zod schema based on the tRPC input validation for bucket creation
// from `bucket.ts` -> create route
const formSchema = z.object({
    name: z.string().min(1, { message: "Bucket name is required." }),
});

type FormSchemaType = z.infer<typeof formSchema>;

// Define props interface for type safety
interface CreateBucketDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function CreateBucketDialog({ open, setOpen }: CreateBucketDialogProps) {
    // 1. Define the form using react-hook-form and Zod resolver
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const utils = api.useUtils();

    const createBucketMutation = api.bucket.create.useMutation({
        onSuccess: () => {
            toast.success("Bucket created successfully");
            setOpen(false); // Close dialog on success
            form.reset(); // Reset form fields
            // Invalidate the query for fetching all buckets to refresh the list
            utils.bucket.getAll.invalidate();
        },
        onError: (error) => {
            console.error("Failed to create bucket:", error);
            toast.error(`Failed to create bucket: ${error.message || "Please try again."}`);
            // Optionally, keep the dialog open on error if desired
            // setOpen(false);
        },
    });

    // 2. Define the submit handler
    function onSubmit(values: FormSchemaType) {
        console.log("Bucket Form Submitted:", values);
        createBucketMutation.mutate(values);
    }

    // Handle closing the dialog and resetting form state
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            form.reset(); // Reset form when closing dialog manually
        }
        setOpen(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px] border-border"> {/* Adjusted width */}
                <DialogHeader>
                    <DialogTitle>Create New Bucket</DialogTitle>
                    <DialogDescription>
                        Enter a name for your new candidate bucket (e.g., "Screening", "Interviewing").
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bucket Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Qualified Candidates" {...field} />
                                    </FormControl>
                                    <FormMessage /> {/* Displays validation errors */}
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                             <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={createBucketMutation.isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createBucketMutation.isPending}>
                                {createBucketMutation.isPending ? "Creating..." : "Create Bucket"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}