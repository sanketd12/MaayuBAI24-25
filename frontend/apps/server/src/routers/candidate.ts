import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { candidates } from "../db/schema/platform";
import { protectedProcedure, router } from "../lib/trpc";
import axios from "redaxios";
import { TRPCError } from "@trpc/server";

export const candidateRouter = router({
	create: protectedProcedure
        .input(z.object({ name: z.string().min(1), email: z.string().email(), bucketId: z.number() }))
        .mutation(async ({ ctx, input }) => {

            try {
                // Call the correct FastAPI endpoint with FormData

                // Assuming the response contains the parsed data
                // You might want to use `parsedData` here instead of just `input`

                // Insert into the database (consider using data from parsedData if needed)
                await db.insert(candidates).values({
                    name: input.name, // Or potentially parsedData.name if available
                    email: input.email, // Or potentially parsedData.email
                    bucketId: input.bucketId,
                    resume_file_name: "RESUME_FILE_NAME", // TODO: get the actual file name
                    userId: ctx.userId,
                });

            } catch (error) {
                // Handle potential errors during the API call or parsing
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to process resume" });
            }
        }),

    getAll: protectedProcedure
        .query(async ({ ctx }) => {
        return await db.query.candidates.findMany({
            where: eq(candidates.userId, ctx.userId),
        });
    }),

    getAllByBucketId: protectedProcedure
        .input(z.object({ bucketId: z.number() }))
        .query(async ({ ctx, input }) => {
            return await db.query.candidates.findMany({
                where: and(eq(candidates.bucketId, input.bucketId), eq(candidates.userId, ctx.userId)),
            });
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await db.query.candidates.findFirst({
                where: and(eq(candidates.id, input.id), eq(candidates.userId, ctx.userId)),
            });
        }),
    
    updateCandidateDetails: protectedProcedure
        .input(z.object({ id: z.number(), name: z.string().min(1), email: z.string().email() }))
        .mutation(async ({ ctx, input }) => {
            await db.update(candidates).set({
                name: input.name,
                email: input.email,
            }).where(and(eq(candidates.id, input.id), eq(candidates.userId, ctx.userId)));
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            await db.delete(candidates).where(and(eq(candidates.id, input.id), eq(candidates.userId, ctx.userId)));
        }),
    
    uploadResume: protectedProcedure
    .input(
        z
          .instanceof(FormData)
          .transform((fd) => Object.fromEntries(fd.entries()))
          .pipe(
            z.object({
              text: z.string(),
              fileOne: z.instanceof(File).refine((f) => f.size > 0),
              fileTwo: z.instanceof(File).optional(),
            })
          )
      )
      .mutation(({ input }) => {
        console.log(input);
      }),
    emailCandidate: protectedProcedure
        .input(z.object({ candidateEmailAddress: z.string().email(), title: z.string(), body: z.string() }))
        .mutation(async ({ ctx, input }) => {
            
        }),
});