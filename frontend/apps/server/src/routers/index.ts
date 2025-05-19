import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { todoRouter } from "./todo";
import { jobRouter } from "./job";
import { candidateRouter } from "./candidate";
import { bucketRouter } from "./bucket";
import { agentRouter } from "./agent";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
	todo: todoRouter,
	job: jobRouter,
	candidate: candidateRouter,
	bucket: bucketRouter,
	agent: agentRouter,
});
export type AppRouter = typeof appRouter;
