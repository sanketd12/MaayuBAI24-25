import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Building,
  GraduationCap,
  BookOpen,
  Briefcase,
  Link2,
  Download,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute('/_platform/candidate-info/$candidateId')({
  component: RouteComponent,
})

// Mock candidate data
const mockCandidate = {
  id: "c1",
  name: "Alex Johnson",
  headline: "Senior Frontend Developer",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  addedDate: "2023-12-01",
  status: "New",
  buckets: ["Software Engineers", "React Specialists"],
  resumeUrl: "#",
  summary:
    "Experienced frontend developer with 7+ years of experience building scalable web applications using modern JavaScript frameworks. Passionate about creating user-friendly interfaces and optimizing web performance.",
  skills: [
    { name: "React", level: "Expert" },
    { name: "TypeScript", level: "Expert" },
    { name: "JavaScript", level: "Expert" },
    { name: "HTML/CSS", level: "Expert" },
    { name: "Redux", level: "Advanced" },
    { name: "Next.js", level: "Advanced" },
    { name: "Node.js", level: "Intermediate" },
    { name: "GraphQL", level: "Intermediate" },
    { name: "AWS", level: "Intermediate" },
    { name: "Docker", level: "Beginner" },
  ],
  experience: [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: "Present",
      description:
        "Lead frontend development for the company's main SaaS product, managing a team of 3 developers. Implemented new features using React and TypeScript, improving performance by 40% and reducing bundle size by 25%.",
    },
    {
      title: "Frontend Developer",
      company: "WebSolutions Co.",
      location: "Austin, TX",
      startDate: "2018-06",
      endDate: "2021-02",
      description:
        "Developed responsive web applications using React and Redux. Collaborated with UX designers to implement pixel-perfect interfaces. Improved page load time by 60% through code splitting and lazy loading.",
    },
    {
      title: "Junior Web Developer",
      company: "Digital Creations",
      location: "Chicago, IL",
      startDate: "2016-09",
      endDate: "2018-05",
      description:
        "Assisted in developing and maintaining client websites using HTML, CSS, and JavaScript. Created custom WordPress themes and plugins. Worked with senior developers to learn best practices.",
    },
  ],
  education: [
    {
      degree: "M.S. Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2014",
      endDate: "2016",
      description:
        "Focus on Human-Computer Interaction and Web Technologies. Thesis on optimizing React component performance.",
    },
    {
      degree: "B.S. Computer Science",
      institution: "University of Illinois",
      location: "Urbana-Champaign, IL",
      startDate: "2010",
      endDate: "2014",
      description:
        "Minor in User Interface Design. Dean's List all semesters. President of Web Development Club.",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "2022-05",
    },
    {
      name: "React Certification",
      issuer: "Meta",
      date: "2021-03",
    },
    {
      name: "Google UX Design Professional Certificate",
      issuer: "Google",
      date: "2020-11",
    },
  ],
};

function RouteComponent() {
//   const { candidateId } = useParams<{ candidateId: string }>();
  const [activeTab, setActiveTab] = useState("profile");
  const [notes, setNotes] = useState("");

  // Format date function
  const formatDate = (dateString: string) => {
    if (dateString === "Present") return "Present";
    
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  // Mock function to save notes
  const saveNotes = () => {
    // In a real app, this would save to the backend
    console.log("Saving notes:", notes);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link to="/candidates/$candidateId" params={{ candidateId: "1" }}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{mockCandidate.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href={`mailto:${mockCandidate.email}`}
                    className="text-primary hover:underline"
                  >
                    {mockCandidate.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <a
                    href={`tel:${mockCandidate.phone}`}
                    className="hover:underline"
                  >
                    {mockCandidate.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p>{mockCandidate.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Added On</p>
                  <p>{formatDate(mockCandidate.addedDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Resume</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center py-4">
                <div className="w-32 h-40 bg-muted rounded flex items-center justify-center">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" className="w-full gap-2" asChild>
                  <a href={mockCandidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4" /> View
                  </a>
                </Button>
                <Button variant="outline" className="w-full gap-2" asChild>
                  <a href={mockCandidate.resumeUrl} download>
                    <Download className="h-4 w-4" /> Download
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Buckets Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Candidate Buckets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockCandidate.buckets.map((bucket) => (
                  <Badge key={bucket} variant="secondary">
                    {bucket}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge>{mockCandidate.status}</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Latest Activity: Initial review on{" "}
                {formatDate(mockCandidate.addedDate)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs
            defaultValue="profile"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{mockCandidate.summary}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockCandidate.skills.map((skill) => (
                      <div key={skill.name} className="flex items-center">
                        <Badge variant="outline" className="mr-1">
                          {skill.level}
                        </Badge>
                        <span>{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Resume Tab */}
            <TabsContent value="resume" className="space-y-6">
              {/* Experience Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    <CardTitle>Work Experience</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {mockCandidate.experience.map((exp, index) => (
                    <div key={index} className="space-y-2">
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{exp.title}</h3>
                        <Badge variant="outline">
                          {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span>{exp.company}</span>
                        <span className="mx-1">•</span>
                        <MapPin className="h-4 w-4" />
                        <span>{exp.location}</span>
                      </div>
                      <p className="text-sm mt-2">{exp.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    <CardTitle>Education</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {mockCandidate.education.map((edu, index) => (
                    <div key={index} className="space-y-2">
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{edu.degree}</h3>
                        <Badge variant="outline">
                          {edu.startDate} - {edu.endDate}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{edu.institution}</span>
                        <span className="mx-1">•</span>
                        <MapPin className="h-4 w-4" />
                        <span>{edu.location}</span>
                      </div>
                      <p className="text-sm mt-2">{edu.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Certifications Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    <CardTitle>Certifications</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCandidate.certifications.map((cert, index) => (
                      <div key={index} className="flex justify-between">
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {cert.issuer}
                          </p>
                        </div>
                        <Badge variant="outline">{formatDate(cert.date)}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notes Tab */}
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Recruiter Notes</CardTitle>
                  <CardDescription>
                    Add private notes about this candidate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter your notes here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={8}
                  />
                  <div className="flex justify-end">
                    <Button onClick={saveNotes}>Save Notes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}