import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FindCandidateSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Candidate Finder</CardTitle>
                <CardDescription>
                    Find the best matching candidates for this job using our AI
                    technology.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button>
                    Find Best Candidate
                </Button>
            </CardContent>
        </Card>
    )
}