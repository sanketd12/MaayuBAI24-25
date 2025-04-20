import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, router } from "@/lib/trpc";
import { jobs } from "@/db/schema/platform";
import { db } from "@/db";

export const jobRouter = router({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), description: z.string().min(1), salary: z.number().int().positive(), type: z.enum(["full-time", "part-time", "internship"]), work_mode: z.enum(["remote", "hybrid", "office"]), location: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.insert(jobs).values({
        name: input.name,
        description: input.description,
        salary: input.salary,
        type: input.type,
        work_mode: input.work_mode,
        location: input.location,
        status: "open",
        userId: ctx.userId,
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await db.query.jobs.findMany({
      where: eq(jobs.userId, ctx.userId),
      with: {
        selectedCandidate: true,
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await db.query.jobs.findFirst({
        where: and(eq(jobs.id, input.id), eq(jobs.userId, ctx.userId)),
        with: {
          selectedCandidate: true,
        },
      });
    }),

  updateJobDetails: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string().min(1), description: z.string().min(1), salary: z.number().int().positive(), type: z.enum(["full-time", "part-time", "internship"]), work_mode: z.enum(["remote", "hybrid", "office"]), location: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.update(jobs).set({
        name: input.name,
        description: input.description,
        salary: input.salary,
        type: input.type,
        work_mode: input.work_mode,
        location: input.location,
      }).where(and(eq(jobs.id, input.id), eq(jobs.userId, ctx.userId)));
    }),

  updateJobStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.enum(["open", "closed"]) }))
    .mutation(async ({ ctx, input }) => {
      await db.update(jobs).set({
        status: input.status,
      }).where(and(eq(jobs.id, input.id), eq(jobs.userId, ctx.userId)));
    }),

  selectCandidate: protectedProcedure
    .input(z.object({ id: z.number(), candidateId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.update(jobs).set({
        selectedCandidateId: input.candidateId,
      }).where(and(eq(jobs.id, input.id), eq(jobs.userId, ctx.userId)));
    }),

  reopenJob: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.update(jobs).set({
        status: "open",
        selectedCandidateId: null,
      }).where(and(eq(jobs.id, input.id), eq(jobs.userId, ctx.userId)));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(jobs).where(and(eq(jobs.id, input.id), eq(jobs.userId, ctx.userId)));
    }),
});
