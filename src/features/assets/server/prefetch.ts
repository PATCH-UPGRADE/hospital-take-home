import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.assets.getMany>;

/**
 * Prefetch all assets
 */
export const prefetchAssets = (params: Input) => {
  return prefetch(trpc.assets.getMany.queryOptions(params));
};
