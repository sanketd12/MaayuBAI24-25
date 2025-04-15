import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, authedProcedure } from "~/server/api/trpc";
import { buckets, candidates } from "~/server/db/schema";
import axios from "redaxios";
import { TRPCError } from "@trpc/server";


export const candidateRouter = createTRPCRouter({
    create: authedProcedure
        .input(z.object({ name: z.string().min(1), email: z.string().email(), bucketId: z.number(), uploadedResume: z.instanceof(File) }))
        .mutation(async ({ ctx, input }) => {
            // Handle resume parsing on Python backend
            const formData = new FormData();
            // Append the file using the field name expected by FastAPI ('resume')
            formData.append("resume", input.uploadedResume, input.uploadedResume.name);

            try {
                // Call the correct FastAPI endpoint with FormData
                const response = await axios.post(`${ctx.pythonBackendUrl}/ingestion/add-resume`, formData);

                // Assuming the response contains the parsed data
                const parsedData = response.data;
                // You might want to use `parsedData` here instead of just `input`
                console.log("Resume parsed successfully:", parsedData);

                // Insert into the database (consider using data from parsedData if needed)
                await ctx.db.insert(candidates).values({
                    name: input.name, // Or potentially parsedData.name if available
                    email: input.email, // Or potentially parsedData.email
                    bucketId: input.bucketId,
                    resume_file_name: input.uploadedResume.name,
                    userId: ctx.userId,
                });

            } catch (error) {
                // Handle potential errors during the API call or parsing
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to process resume" });
            }
        }),

    getAll: authedProcedure
        .query(async ({ ctx }) => {
        return await ctx.db.query.candidates.findMany({
            where: eq(candidates.userId, ctx.userId),
        });
    }),

    getAllByBucketId: authedProcedure
        .input(z.object({ bucketId: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.query.candidates.findMany({
                where: and(eq(candidates.bucketId, input.bucketId), eq(candidates.userId, ctx.userId)),
            });
        }),

    getById: authedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.query.candidates.findFirst({
                where: and(eq(candidates.id, input.id), eq(candidates.userId, ctx.userId)),
            });
        }),
    
    updateCandidateDetails: authedProcedure
        .input(z.object({ id: z.number(), name: z.string().min(1), email: z.string().email() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.update(candidates).set({
                name: input.name,
                email: input.email,
            }).where(and(eq(candidates.id, input.id), eq(candidates.userId, ctx.userId)));
        }),

    delete: authedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(candidates).where(and(eq(candidates.id, input.id), eq(candidates.userId, ctx.userId)));
        }),
});