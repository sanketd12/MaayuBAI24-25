import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Candidate } from "server/src/db/schema/platform";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Info, Loader2, Send, Copy, ExternalLink } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FindCandidateSection({ jobDescription }: { jobDescription: string }) {

    const [isSearching, setIsSearching] = useState(false);
    const [bestCandidate, setBestCandidate] = useState<Candidate & { reasoning: string } | null>(null);

    const trpc = useTRPC();

    const bestCandidateMutation = useMutation(
        trpc.agent.findBestCandidate.mutationOptions({
            onSuccess: (data) => {
                setBestCandidate({
                    ...data,
                    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
                    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
                });
                setIsSearching(false);
                toast.success("Optimal candidate found successfully");
            },
            onError: (error) => {
                console.error("Failed to find optimal candidate:", error);
                toast.error("Failed to find optimal candidate. Please try again.");
                setIsSearching(false);
            }
        }),
    );

    const handleFindCandidate = () => {
        setIsSearching(true);
        setBestCandidate(null);
        bestCandidateMutation.mutate({ jobDescription });
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>AI Candidate Finder</CardTitle>
                <CardDescription>
                    Find the best matching candidates for this job using our AI
                    technology.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isSearching ? (
                    <SearchingState />
                ) : bestCandidate ? (
                    <BestCandidateFoundState bestCandidate={bestCandidate} jobDescription={jobDescription} />
                ) : (
                    <IdleState handleFindCandidate={handleFindCandidate} />
                )}
            </CardContent>
        </Card>
    )
}

function IdleState({ handleFindCandidate }: { handleFindCandidate: () => void }) {
    return (
        <Button onClick={handleFindCandidate}>
            Find Best Candidate
        </Button>
    )
}

function SearchingState() {
    return (
        <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p>Searching for the best candidate...</p>
        </div>
    )
}

function BestCandidateFoundState({ bestCandidate, jobDescription }: { bestCandidate: Candidate & { reasoning: string }, jobDescription: string }) {
    const [isReachingOut, setIsReachingOut] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState<{ subject: string, body: string } | null>(null);

    const initials = bestCandidate.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('');

    const trpc = useTRPC();
    
    const generateEmailMutation = useMutation(
        trpc.agent.generateOutreachEmail.mutationOptions({
            onSuccess: (data: { title: string, body: string }) => {
                setGeneratedEmail({ subject: data.title, body: data.body });
                setIsReachingOut(false);
                toast.success("Outreach email generated!");
            },
            onError: (error) => {
                console.error("Failed to generate outreach email:", error);
                toast.error("Failed to generate outreach email. Please try again.");
                setIsReachingOut(false);
            }
        }),
    );

    const handleReachOut = () => {
        setIsReachingOut(true);
        setGeneratedEmail(null);
        generateEmailMutation.mutate({ jobDescription, candidateName: bestCandidate.name, reasoning: bestCandidate.reasoning });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <Card className="bg-card shadow-md hover:shadow-[0_8px_20px_-6px_rgb(var(--primary)/20),_0_4px_12px_-4px_rgb(251_191_36/15)] dark:hover:shadow-[0_8px_20px_-6px_rgb(var(--primary)/25),_0_4px_12px_-4px_rgb(251_191_36/20)] transition-all duration-300 overflow-hidden border">
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/20 ring-2 ring-primary/10 ring-offset-2 ring-offset-background transition-transform duration-300 hover:scale-105">
                            <AvatarFallback className="text-xl font-semibold bg-primary/20 text-white">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <p className="text-xl font-bold tracking-tight text-card-foreground">
                                {bestCandidate.name}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                                <Mail className="h-4 w-4" />
                                <a
                                    href={`mailto:${bestCandidate.email}`}
                                    className="hover:underline hover:text-primary transition-colors"
                                >
                                    {bestCandidate.email}
                                </a>
                            </div>
                        </div>
                    </div>
                    <Alert variant="default" className="bg-gradient-to-br from-orange-50 to-orange-100/80 dark:from-orange-950/40 dark:to-orange-900/40 border border-orange-300/70 dark:border-orange-700/50 rounded-md">
                        <Info className="h-5 w-5 stroke-orange-600 dark:stroke-orange-400" />
                        <AlertTitle className="font-semibold text-orange-700 dark:text-orange-300">
                            AI Reasoning
                        </AlertTitle>
                        <AlertDescription className="mt-1 text-orange-800/90 dark:text-orange-200/90 leading-relaxed">
                            {bestCandidate.reasoning}
                        </AlertDescription>
                    </Alert>
                    <div className="pt-6 border-t border-border min-h-[50px]">
                        <AnimatePresence mode="wait">
                            {generatedEmail ? (
                                <EmailGeneratedState key="email-display" email={generatedEmail} candidateEmail={bestCandidate.email} />
                            ) : isReachingOut ? (
                                <ReachingOutAddition key="email-loading" />
                            ) : (
                                <ReachOutOption key="email-button" handleReachOut={handleReachOut} />
                            )}
                        </AnimatePresence>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

const animationProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: "easeInOut" },
};

function ReachOutOption({ handleReachOut }: { handleReachOut: () => void }) {
    return (
        <motion.div {...animationProps} className="flex justify-end">
            <Button
                onClick={handleReachOut}
                className="bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground transition-all duration-300 ease-in-out transform hover:scale-[1.03] shadow-md hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 dark:hover:shadow-[0_0_20px_4px_rgb(var(--primary)/25)]"
            >
                <Send className="mr-2 h-4 w-4" />
                Generate Outreach Email
            </Button>
        </motion.div>
    );
}

function ReachingOutAddition() {
    return (
        <motion.div
            {...animationProps}
            className="flex items-center justify-center space-x-2 text-muted-foreground h-10"
        >
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p>Generating email...</p>
        </motion.div>
    );
}

function EmailGeneratedState({ email, candidateEmail }: { email: { subject: string, body: string }, candidateEmail: string }) {

    const [editedSubject, setEditedSubject] = useState(email.subject);
    const [editedBody, setEditedBody] = useState(email.body);

    const handleAutosend = () => {
        toast.info("Autosend functionality not yet implemented.");
        console.log("Autosend clicked:", { subject: editedSubject, body: editedBody, recipient: candidateEmail });
    };

    return (
        <motion.div {...animationProps} className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Generated Outreach Email</h3>

            <div className="space-y-1.5">
                 <Label htmlFor="email-subject" className="text-xs text-muted-foreground">Subject</Label>
                 <Input
                    id="email-subject"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="bg-background"
                 />
            </div>

            <div className="space-y-1.5">
                 <Label htmlFor="email-body" className="text-xs text-muted-foreground">Body</Label>
                 <Textarea
                    id="email-body"
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    className="bg-background h-96 resize-none scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent"
                 />
            </div>

            <div className="flex justify-end pt-2">
                 <Button
                    size="sm"
                    onClick={handleAutosend}
                    className="bg-gradient-to-r from-orange-500/80 to-orange-600 text-white transition-all duration-300 ease-in-out transform hover:scale-[1.03] shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700/90 hover:shadow-orange-500/30 hover:brightness-110 dark:hover:shadow-[0_0_20px_4px_rgba(249,115,22,0.25)]"
                 >
                    <Send className="mr-2 h-4 w-4" />
                    Autosend Email
                 </Button>
            </div>
        </motion.div>
    );
}