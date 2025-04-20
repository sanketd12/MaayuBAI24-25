import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { buckets } from "@/db/schema/platform";
import { protectedProcedure, router } from "@/lib/trpc";
import { db } from "../db";

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

    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await db.query.buckets.findFirst({
                where: and(eq(buckets.id, input.id), eq(buckets.userId, ctx.userId)),
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