import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1, { message: "Bucket name is required." }).max(50, { message: "Bucket name must be less than 50 characters." }),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function CreateBucketDialog({ open, onOpenChange}: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const createBucketMutation = useMutation(
        trpc.bucket.create.mutationOptions({
            onSuccess: () => {
                toast.success("Bucket created successfully");
                onOpenChange(false);
                queryClient.invalidateQueries({ queryKey: trpc.bucket.getNamesAndCounts.queryKey() });
            },
            onError: (error) => {
                toast.error(error.message);
            }
        }),
    );

    function onSubmit(values: FormSchemaType) {
        // TODO: Replace console.log with tRPC mutation call
        console.log("Form Submitted:", values);
        createBucketMutation.mutate(values);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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

                        <DialogFooter>
                             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Job</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}