import { createFileRoute, useParams } from '@tanstack/react-router'
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
import { CalendarDays, MapPin, DollarSign, Link, Mail } from "lucide-react";

export const Route = createFileRoute('/_platform/jobs/$jobId')({
  component: JobDetailPage,
})

// Mock job data
const jobData = {
  id: "1",
  title: "Senior Full Stack Developer",
  company: "TechCorp Inc.",
  location: "San Francisco, CA",
  status: "Open",
  postedDate: "2023-12-01",
  salary: "$120,000 - $150,000",
  applicationUrl: "https://example.com/apply",
  description:
    "We are seeking an experienced Full Stack Developer to join our growing team. The ideal candidate will have a strong background in both front-end and back-end development, with a passion for creating clean, efficient code.",
  requirements: [
    "5+ years of experience with JavaScript/TypeScript",
    "Strong experience with React and Node.js",
    "Experience with SQL and NoSQL databases",
    "Knowledge of cloud services (AWS/GCP/Azure)",
    "Understanding of CI/CD principles",
    "Excellent communication skills",
  ],
  responsibilities: [
    "Design and implement new features and functionality",
    "Build reusable code and libraries for future use",
    "Optimize applications for maximum speed and scalability",
    "Collaborate with other team members and stakeholders",
    "Ensure the technical feasibility of UI/UX designs",
    "Stay updated with emerging technologies",
  ],
};

// Mock candidate match data
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

function JobDetailPage() {
  const { jobId } = useParams({ from: Route.id });
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
        }, 500);
      }
    }, 1000);
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Job Header */}
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{jobData.title}</h1>
            <Badge
              variant={jobData.status === "Open" ? "default" : "secondary"}
              className="text-sm"
            >
              {jobData.status}
            </Badge>
          </div>
          <div className="text-xl mt-1">{jobData.company}</div>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{jobData.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span>Posted {formatDate(jobData.postedDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              <span>{jobData.salary}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Link className="h-4 w-4" />
              <a
                href={jobData.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Application Link
              </a>
            </div>
          </div>
        </div>

        <Separator />

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{jobData.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-1">
                  {jobData.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-1">
                  {jobData.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* AI Candidate Finder */}
          <div>
            <Card className="sticky top-6">
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
                  >
                    Find Best Candidate
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
                    <Button disabled className="w-full">
                      Searching...
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center mb-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Top Match
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
                            <a href={`/candidate-info/${candidateMatch.id}`}>
                              View Profile
                            </a>
                          </Button>
                          <Button 
                            className="flex-1 gap-1.5"
                            asChild
                          >
                            <a href={`mailto:alex.johnson@example.com?subject=Regarding your application for ${jobData.title}`}>
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
