import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { OpenApiMeta } from "trpc-to-openapi";
import { TRPC_TRANSFORMER } from "@/lib/trpc-config";

export const createTRPCContext = async (opts?: { req?: Request }) => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { req: opts?.req };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export const createOpenApiContext = async ({
  req,
}: FetchCreateContextFnOptions): Promise<Context> => {
  return { req };
};

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().meta<OpenApiMeta>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: TRPC_TRANSFORMER,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
