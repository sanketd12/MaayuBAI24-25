import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, authedProcedure } from "~/server/api/trpc";
import { buckets } from "~/server/db/schema";

export const bucketRouter = createTRPCRouter({
    create: authedProcedure
        .input(z.object({ name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(buckets).values({
                name: input.name,
                userId: ctx.userId,
            });
        }),

    getAll: authedProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.buckets.findMany({
            where: eq(buckets.userId, ctx.userId),
        });
    }),

    getById: authedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.query.buckets.findFirst({
                where: and(eq(buckets.id, input.id), eq(buckets.userId, ctx.userId)),
            });
        }),

    updateBucketDetails: authedProcedure
        .input(z.object({ id: z.number(), name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.update(buckets).set({
                name: input.name,
            }).where(and(eq(buckets.id, input.id), eq(buckets.userId, ctx.userId)));
        }),

    delete: authedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(buckets).where(and(eq(buckets.id, input.id), eq(buckets.userId, ctx.userId)));
        }),
});