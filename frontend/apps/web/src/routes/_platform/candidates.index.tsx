import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Folder, Plus, User } from "lucide-react";
import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/utils/trpc';
import CreateBucketDialog from '@/components/platform/buckets/create-bucket-dialog';
import { motion } from "framer-motion";

export const Route = createFileRoute('/_platform/candidates/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(context.trpc.bucket.getNamesAndCounts.queryOptions());
    return {};
  },
})

function RouteComponent() {
  const trpc = useTRPC();
  const { data: buckets } = useSuspenseQuery(trpc.bucket.getNamesAndCounts.queryOptions());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <CreateBucketDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidate Buckets</h1>
          <p className="text-muted-foreground mt-1">
            Organize candidates into logical groups.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-1.5">
          <Plus size={16} /> Create Bucket
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {buckets.map((bucket, index) => (
          <motion.div
            key={bucket.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
            className="h-full"
          >
            <Link
              to="/candidates/$bucketId"
              params={{ bucketId: bucket.id.toString() }}
              className="block group h-full"
            >
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/30 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center bg-secondary text-secondary-foreground`}>
                      <Folder className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg font-medium leading-tight group-hover:text-purple-300 transition-colors duration-200">
                      {bucket.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pt-0 pb-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span>{bucket.candidateCount || 0} {bucket.candidateCount === 1 ? "candidate" : "candidates"}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {buckets.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <div className="inline-block p-4 bg-secondary rounded-full mb-5">
            <Folder className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-2 text-xl font-semibold">No buckets found</h3>
          <p className="text-muted-foreground mt-2 mb-6 max-w-xs mx-auto">
            Get started by creating your first candidate bucket to group and manage applicants.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-1.5">
            <Plus size={16} /> Create Your First Bucket
          </Button>
        </motion.div>
      )}
    </div>
  );
}