import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { toast } from "sonner";

export default function DeleteCardDialog({ open, onOpenChange, cardId }: { open: boolean, onOpenChange: (open: boolean) => void, cardId: number }) {

    const trpc = useTRPC();
    const queryClient = useQueryClient();
    
    const deleteCardMutation = useMutation(
		trpc.job.delete.mutationOptions({
			onSuccess: () => {
                toast.success("Card deleted successfully");
                onOpenChange(false);
                queryClient.invalidateQueries({ queryKey: trpc.job.getAll.queryKey() });
            },
            onError: (error) => {
                toast.error(error.message);
            }
		}),
	);
    const handleDeleteCard = () => {
        deleteCardMutation.mutate({ id: cardId });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Card</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to delete this card?
                </DialogDescription>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={() => handleDeleteCard()}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}