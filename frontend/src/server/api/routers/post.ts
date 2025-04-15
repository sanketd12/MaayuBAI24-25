import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { jobs } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1), description: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(jobs).values({
        name: input.name,
        description: input.description,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.jobs.findFirst({
      orderBy: (jobs, { desc }) => [desc(jobs.createdAt)],
    });

    return post ?? null;
  }),
});
