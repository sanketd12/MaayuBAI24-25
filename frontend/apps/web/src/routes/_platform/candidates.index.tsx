import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Folder, Plus, User } from "lucide-react";

export const Route = createFileRoute('/_platform/candidates/')({
  component: RouteComponent,
})

// Mock data for buckets
const mockBuckets = [
  {
    id: "1",
    name: "Software Engineers",
    count: 24,
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "Product Managers",
    count: 12,
    color: "bg-purple-500",
  },
  {
    id: "3",
    name: "UX Designers",
    count: 18,
    color: "bg-pink-500",
  },
  {
    id: "4",
    name: "Data Scientists",
    count: 9,
    color: "bg-green-500",
  },
  {
    id: "5",
    name: "Marketing Specialists",
    count: 7,
    color: "bg-orange-500",
  },
];

function RouteComponent() {
  const [buckets, setBuckets] = useState(mockBuckets);
  const [newBucketName, setNewBucketName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getRandomColor = () => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-orange-500", "bg-teal-500", "bg-red-500"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleCreateBucket = () => {
    if (!newBucketName.trim()) return;
    
    const newBucket = {
      id: `${Date.now()}`,
      name: newBucketName,
      count: 0,
      color: getRandomColor(),
    };
    
    setBuckets([...buckets, newBucket]);
    setNewBucketName("");
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Candidate Buckets</h1>
          <p className="text-muted-foreground mt-1">
            Organize candidates into logical groups
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} /> Create New Bucket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new bucket</DialogTitle>
              <DialogDescription>
                Add a name for your new candidate bucket.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="name">Bucket name</Label>
              <Input
                id="name"
                value={newBucketName}
                onChange={(e) => setNewBucketName(e.target.value)}
                placeholder="e.g., Frontend Developers"
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBucket}>Create Bucket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {buckets.map((bucket) => (
          <Link 
            to="/candidates/$candidateId" 
            params={{ candidateId: bucket.id }}
            key={bucket.id} 
            className="block group"
          >
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/20 group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`${bucket.color} w-10 h-10 rounded-lg flex items-center justify-center text-white`}>
                    <Folder className="h-5 w-5" />
                  </div>
                  <CardTitle>{bucket.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{bucket.count} candidates</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  Open Bucket
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {buckets.length === 0 && (
        <div className="text-center py-12">
          <Folder className="mx-auto h-12 w-12 text-muted-foreground/80" />
          <h3 className="mt-4 text-lg font-semibold">No buckets created yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first candidate bucket to get started.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus size={18} /> Create Bucket
          </Button>
        </div>
      )}
    </div>
  );
}