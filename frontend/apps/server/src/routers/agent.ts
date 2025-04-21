import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../lib/trpc";

// Define the expected response structure from the FastAPI endpoint
// NOTE: Adjust this based on the actual API response
const CandidateResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  company: z.string(),
  matchScore: z.number(),
  topSkills: z.array(z.string()),
  matchReasons: z.array(z.string()),
});

// Assume FastAPI backend URL - Replace with environment variable if available
const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

export const agentRouter = router({
  findCandidate: publicProcedure
    .input(
      z.object({
        jobDescription: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(`${FASTAPI_URL}/api/agent/find-candidate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ job_description: input.jobDescription }),
        });

        if (!response.ok) {
          let errorDetails = "Failed to fetch from backend";
          try {
            // Attempt to parse potential error message from backend
            const errorData = await response.json();
            errorDetails = errorData.detail || response.statusText;
          } catch (parseError) {
            // Ignore if response body isn't valid JSON
          }
          console.error(`FastAPI Error: ${response.status} - ${errorDetails}`);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Backend request failed: ${errorDetails}`,
          });
        }

        const data = await response.json();

        // Validate the response against the schema
        const validationResult = CandidateResultSchema.safeParse(data);
        if (!validationResult.success) {
            console.error("Backend response validation failed:", validationResult.error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Invalid response structure received from backend.",
            });
        }

        return validationResult.data; // Return validated data

      } catch (error) {
        console.error("Error calling find-candidate endpoint:", error);
        if (error instanceof TRPCError) {
            throw error; // Re-throw TRPCError
        }
        // Wrap other errors in TRPCError
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while finding candidates.",
          cause: error, // Optionally include the original error
        });
      }
    }),
});

// Export the type for client-side usage
export type AgentRouter = typeof agentRouter; 