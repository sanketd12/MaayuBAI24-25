import { z } from "zod";
import { protectedProcedure, router } from "../lib/trpc";
import axios from "redaxios";
import { db } from "../db";
import { candidates } from "../db/schema/platform";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const CandidateSelectionSchema = z.object({
    name: z.string(),
    reasoning: z.string(),
})

export const agentRouter = router({
    findBestCandidate: protectedProcedure
        .input(z.object({ jobDescription: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const response = await axios.post(
                `${ctx.pythonBackendUrl}/agent/find-candidate`,
                { job_description: input.jobDescription },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const validationResult = CandidateSelectionSchema.safeParse(response.data);
            if (!validationResult.success) {
                console.error("FastAPI response validation error:", validationResult.error);
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Invalid data structure received from agent service." });
            }
            const bestCandidate = validationResult.data;

            const candidate = await db.query.candidates.findFirst({
                where: eq(candidates.name, bestCandidate.name),
            });
            if (!candidate) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Candidate not found in database" });
            }

            return {
                ...candidate,
                reasoning: bestCandidate.reasoning,
            };
        }),
    generateOutreachEmail: protectedProcedure
        .input(z.object({ jobDescription: z.string(), candidateName: z.string(), reasoning: z.string() }))
        .output(z.object({ title: z.string(), body: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const response = await axios.post(
                `${ctx.pythonBackendUrl}/agent/generate-outreach-email`,
                { job_description: input.jobDescription, candidate_name: input.candidateName, reasoning: input.reasoning },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        }),
});