import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useAssetsParams } from "./use-asset-params";

/**
 * Hook to fetch all assets using suspense
 */
export const useSuspenseAssets = () => {
  const trpc = useTRPC();
  const [params] = useAssetsParams();

  return useSuspenseQuery(trpc.assets.getMany.queryOptions(params));
};

/**
 * Hook to create a new asset
 */
export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.assets.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Asset "${data.product}" (${data.ip}) created`);
        // Invalidate all getMany queries regardless of params (page, search, etc.)
        queryClient.invalidateQueries(trpc.assets.getMany.pathFilter());
      },
      onError: (error) => {
        toast.error(`Failed to create asset: ${error.message}`);
      },
    }),
  );
};
