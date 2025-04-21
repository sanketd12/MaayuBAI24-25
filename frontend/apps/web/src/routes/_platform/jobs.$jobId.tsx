import { createFileRoute, useParams, Link } from '@tanstack/react-router'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, MapPin, DollarSign, Link as LinkIcon, Mail, Briefcase, Info } from "lucide-react";
import { useTRPC } from '@/utils/trpc';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner";
import { useSuspenseQuery } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const Route = createFileRoute('/_platform/jobs/$jobId')({
  component: JobDetailPage,
  loader: async ({ context, params }) => {
    const jobIdInt = parseInt(params.jobId);
    if (isNaN(jobIdInt)) {
      console.error("Invalid Job ID provided in URL");
    } else {
      await context.queryClient.ensureQueryData(context.trpc.job.getById.queryOptions({ id: jobIdInt }));
    }
  },
})

// Mock candidate match data - Re-adding this
const candidateMatch = {
  id: "c123",
  name: "Alex Johnson",
  title: "Senior Software Engineer",
  company: "Tech Innovations Inc.",
  matchScore: 92,
  topSkills: ["React", "Node.js", "TypeScript", "AWS"],
  matchReasons: [
    "7+ years of full stack development experience",
    "Led teams of 3-5 developers on complex projects",
    "Strong background in cloud architecture",
    "Implemented CI/CD pipelines for multiple companies",
  ],
};

// Helper function to format salary
const formatSalary = (salary: number | null | undefined): string => {
  if (!salary) return 'Not specified';
  return `${salary.toLocaleString()}`;
};

// Helper function to format job type
const formatJobType = (type: string | undefined): string => {
  if (!type) return 'N/A';
  switch (type) {
    case 'full-time': return 'Full-Time';
    case 'part-time': return 'Part-Time';
    case 'internship': return 'Internship';
    default: return type;
  }
};

// Helper function to format date
const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return 'N/A';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function JobDetailPage() {
  const { jobId } = useParams({ from: Route.id });
  const jobIdInt = parseInt(jobId);

  const trpc = useTRPC();

  const jobQuery = useSuspenseQuery(trpc.job.getById.queryOptions({ id: jobIdInt }));

  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [showResult, setShowResult] = useState(false);

  // Function to simulate AI search process
  const startCandidateSearch = () => {
    setIsSearching(true);
    setProgress(0);
    setShowResult(false);

    const steps = [
      "Parsing job description...",
      "Identifying key requirements...",
      "Searching candidate database...",
      "Analyzing potential matches...",
      "Ranking candidates...",
      "Finalizing recommendation...",
    ];

    let currentStepIndex = 0;
    setCurrentStep(steps[currentStepIndex]);

    const interval = setInterval(() => {
      if (currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        setCurrentStep(steps[currentStepIndex]);
        setProgress((prevProgress) => prevProgress + 100 / steps.length);
      } else {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setIsSearching(false);
          setShowResult(true);
          toast.success("Candidate search complete!");
        }, 500);
      }
    }, 800);
  };

  if (jobQuery.isLoading) {
    return <JobDetailSkeleton />;
  }

  if (!jobQuery.data) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Job Not Found</AlertTitle>
          <AlertDescription>
            The requested job could not be found. It might have been removed or the ID is incorrect.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const jobData = jobQuery.data;

  const jobStatus = jobData.status || 'Unknown';
  const isJobOpen = jobStatus === 'open';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Job Header */}
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{jobData.name}</h1>
            <Badge
              variant={isJobOpen ? "default" : "secondary"}
              className="text-sm capitalize"
            >
              {jobStatus}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            {jobData.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{jobData.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>{formatJobType(jobData.type)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span>Posted {formatDate(jobData.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              <span>{formatSalary(jobData.salary)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Main content - Changed to vertical stack */}
        <div className="flex flex-col space-y-6">
          {/* Job Details Section */}
          <div className="space-y-6">
            {jobData.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{jobData.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* AI Candidate Finder Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>AI Candidate Finder</CardTitle>
                <CardDescription>
                  Find the best matching candidates for this job using our AI
                  technology.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isSearching && !showResult ? (
                  <Button
                    className="w-full"
                    onClick={startCandidateSearch}
                    disabled={!isJobOpen}
                  >
                    {isJobOpen ? 'Find Best Candidate' : 'Job Closed'}
                  </Button>
                ) : isSearching ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{currentStep}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <Button disabled className="w-full opacity-75 cursor-not-allowed">
                      Searching...
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center mb-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700">
                        Top Match Found
                      </Badge>
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{candidateMatch.name}</CardTitle>
                            <CardDescription>{candidateMatch.title} at {candidateMatch.company}</CardDescription>
                          </div>
                          <Badge>{candidateMatch.matchScore}% Match</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-2">
                        <div>
                          <p className="text-sm font-medium">Top Skills</p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {candidateMatch.topSkills.map((skill, i) => (
                              <Badge key={i} variant="secondary" className="font-normal">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Match Reasons</p>
                          <ul className="text-sm pl-5 list-disc mt-1.5 space-y-0.5">
                            {candidateMatch.matchReasons.map((reason, i) => (
                              <li key={i}>{reason}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            asChild
                          >
                            <Link to="/candidate-info/$candidateId" params={{ candidateId: candidateMatch.id }}>
                              View Profile
                            </Link>
                          </Button>
                          <Button
                            className="flex-1 gap-1.5"
                            asChild
                          >
                            <a href={`mailto:example@example.com?subject=Regarding your potential fit for ${jobData.name}`}>
                              <Mail className="h-4 w-4" /> Contact
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowResult(false);
                      }}
                      disabled={!isJobOpen}
                    >
                      Search Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton component for loading state
function JobDetailSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 animate-pulse">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-3/5 rounded" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-6 w-2/5 mt-2 rounded" />
          <div className="flex flex-wrap gap-4 mt-3">
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-5 w-28 rounded" />
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-5 w-20 rounded" />
          </div>
        </div>

        <Separator />

        <div className="flex flex-col space-y-6">
          {/* Main Content Skeleton */}
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/4 rounded" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-4/5 rounded" />
                  {i > 0 && <Skeleton className="h-4 w-3/5 rounded pt-4" />}
                  {i > 0 && <Skeleton className="h-4 w-full rounded" />}
                  {i > 0 && <Skeleton className="h-4 w-1/2 rounded" />}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2 rounded" />
                <Skeleton className="h-4 w-3/4 mt-1 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
