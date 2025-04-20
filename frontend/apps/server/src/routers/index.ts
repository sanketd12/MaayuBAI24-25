import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { bucketRouter } from "./bucket";
import { candidateRouter } from "./candidate";
import { jobRouter } from "./job";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	bucket: bucketRouter,
	candidate: candidateRouter,
	job: jobRouter,
});
export type AppRouter = typeof appRouter;
