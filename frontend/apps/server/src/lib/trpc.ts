import { TRPCError, initTRPC } from "@trpc/server";
import type { Context } from "./context";

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Authentication required",
			cause: "No session",
		});
	}
	if (!process.env.PYTHON_BACKEND_URL) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Python backend URL not set",
		});
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
			userId: ctx.session.session.userId,
			pythonBackendUrl: process.env.PYTHON_BACKEND_URL,
		},
	});
});
