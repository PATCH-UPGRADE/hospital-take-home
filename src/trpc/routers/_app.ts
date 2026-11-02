import { assetsRouter } from "@/features/assets/server/routers";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  assets: assetsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
