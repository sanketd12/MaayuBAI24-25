import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, authedProcedure } from "~/server/api/trpc";
import { jobs } from "~/server/db/schema";

export const jobRouter = createTRPCRouter({
  create: authedProcedure
    .input(z.object({ name: z.string().min(1), description: z.string().min(1), salary: z.number().int().positive(), type: z.enum(["full-time", "part-time", "internship"]), work_mode: z.enum(["remote", "hybrid", "office"]), location: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(jobs).values({
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

  getAll: authedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.jobs.findMany({
      where: eq(jobs.userId, ctx.userId),
      with: {
        selectedCandidate: true,
      },
    });
  }),

  getById: authedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.jobs.findFirst({
        where: and(eq(jobs.id, input.id), eq(jobs.userId, ctx.userId)),
        with: {
          selectedCandidate: true,
        },
      });
    }),

  updateJobDetails: authedProcedure
    .input(z.object({ id: z.number(), name: z.string().min(1), description: z.string().min(1), salary: z.number().int().positive(), type: z.enum(["full-time", "part-time", "internship"]), work_mode: z.enum(["remote", "hybrid", "office"]), location: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(jobs).set({
        name: input.name,
        description: input.description,
        salary: input.salary,
        type: input.type,
        work_mode: input.work_mode,
        location: input.location,
      }).where(and(eq(jobs.id, input.id), eq(jobs.userId, ctx.userId)));
    }),

  updateJobStatus: authedProcedure
    .input(z.object({ id: z.number(), status: z.enum(["open", "closed"]) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(jobs).set({
        status: input.status,
      }).where(and(eq(jobs.id, input.id), eq(jobs.userId, ctx.userId)));
    }),

  selectCandidate: authedProcedure
    .input(z.object({ id: z.number(), candidateId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(jobs).set({
        selectedCandidateId: input.candidateId,
      }).where(and(eq(jobs.id, input.id), eq(jobs.userId, ctx.userId)));
    }),

  reopenJob: authedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(jobs).set({
        status: "open",
        selectedCandidateId: null,
      }).where(and(eq(jobs.id, input.id), eq(jobs.userId, ctx.userId)));
    }),

  delete: authedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(jobs).where(and(eq(jobs.id, input.id), eq(jobs.userId, ctx.userId)));
    }),
});
