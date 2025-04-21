import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { buckets } from "../db/schema/platform";
import { protectedProcedure, router } from "../lib/trpc";

export const bucketRouter = router({
	create: protectedProcedure
        .input(z.object({ name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            await db.insert(buckets).values({
                name: input.name,
                userId: ctx.userId,
            });
        }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
        return await db.query.buckets.findMany({
            where: eq(buckets.userId, ctx.userId),
        });
    }),

    getNamesAndCounts: protectedProcedure.query(async ({ ctx }) => {
        // Fetch buckets with their related candidates
        const bucketsWithCandidates = await db.query.buckets.findMany({
            where: eq(buckets.userId, ctx.userId),
            // Select only the necessary columns from the bucket table
            columns: {
                id: true, // Needed for mapping if done separately, or just good practice
                name: true,
            },
            // Use 'with' to load related candidates
            with: {
                candidates: {
                    // Select only the 'id' column from candidates to minimize data transfer
                    columns: {
                        id: true,
                    }
                },
            },
        });

        // Map the results to include the count
        return bucketsWithCandidates.map(bucket => ({
            id: bucket.id,
            name: bucket.name,
            candidateCount: bucket.candidates.length,
        }));
    }),

    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await db.query.buckets.findFirst({
                where: and(eq(buckets.id, input.id), eq(buckets.userId, ctx.userId)),
                with: {
                    candidates: true,
                },
            });
        }),

    updateBucketDetails: protectedProcedure
        .input(z.object({ id: z.number(), name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            await db.update(buckets).set({
                name: input.name,
            }).where(and(eq(buckets.id, input.id), eq(buckets.userId, ctx.userId)));
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            await db.delete(buckets).where(and(eq(buckets.id, input.id), eq(buckets.userId, ctx.userId)));
        }),
});