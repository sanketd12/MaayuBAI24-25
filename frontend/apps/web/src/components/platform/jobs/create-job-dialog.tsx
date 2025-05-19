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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Define the Zod schema based on the tRPC input validation
// Match this exactly with the input schema in job.ts
const formSchema = z.object({
    name: z.string().min(1, { message: "Job title is required." }),
    description: z.string().min(1, { message: "Description is required." }),
    // Ensure salary is treated as a number, coerce will attempt conversion
    salary: z.coerce.number().int({ message: "Salary must be a whole number." }).positive({ message: "Salary must be positive." }),
    type: z.enum(["full-time", "part-time", "internship"], {
        required_error: "Job type is required.",
    }),
    work_mode: z.enum(["remote", "hybrid", "office"], {
        required_error: "Work mode is required.",
    }),
    location: z.string().min(1, { message: "Location is required." }),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function CreateJobDialog({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const navigate = useNavigate();

    // 1. Define the form using react-hook-form and Zod resolver
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            salary: 0, // Start with undefined or an empty string if preferred
            type: "full-time",
            work_mode: "office",
            location: "",
        },
    });
    
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const createJobMutation = useMutation(
        trpc.job.create.mutationOptions({
            onSuccess: () => {
                toast.success("Job created successfully");
                setOpen(false); // Close dialog on success
                form.reset(); // Reset form fields
                // invalidate the trpc query
                queryClient.invalidateQueries({ queryKey: trpc.job.getAll.queryKey() });
            },
            onError: () => {
                toast.error("Failed to create job. Please try again.");
            }
        }),
    );

    // 2. Define the submit handler
    function onSubmit(values: FormSchemaType) {
        // TODO: Replace console.log with tRPC mutation call
        console.log("Form Submitted:", values);
        createJobMutation.mutate(values);
    }

    // Handle closing the dialog and resetting form state if needed
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            form.reset(); // Reset form when closing dialog
        }
        setOpen(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] border-border">
                <DialogHeader>
                    <DialogTitle>Create Job Posting</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new job posting.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Software Engineer" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the job responsibilities, requirements, etc."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="salary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Annual Salary (USD)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 90000" {...field} />
                                    </FormControl>
                                     <FormDescription>
                                        Enter the annual salary figure.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select job type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="full-time">Full-time</SelectItem>
                                                <SelectItem value="part-time">Part-time</SelectItem>
                                                <SelectItem value="internship">Internship</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="work_mode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Work Mode</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select work mode" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="remote">Remote</SelectItem>
                                                <SelectItem value="hybrid">Hybrid</SelectItem>
                                                <SelectItem value="office">Office</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Remote, New York City" {...field} />
                                    </FormControl>
                                     <FormDescription>
                                        Specify the primary work location or 'Remote'.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                             <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Job</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}