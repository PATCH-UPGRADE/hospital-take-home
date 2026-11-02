import { z } from "zod";
import prisma from "@/lib/db";
import { paginationInputSchema } from "@/lib/pagination";
import { createSortParser, fetchPaginated } from "@/lib/router-utils";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import {
  assetInputSchema,
  assetResponseSchema,
  paginatedAssetResponseSchema,
  resolveVersionStatus,
} from "../types";

const createSearchFilter = (search: string) => {
  const insensitive = { contains: search, mode: "insensitive" as const };
  return search
    ? {
        OR: [
          { ip: insensitive },
          { deviceType: insensitive },
          { manufacturer: insensitive },
          { product: insensitive },
          { version: insensitive },
        ],
      }
    : {};
};

/** The sort keys that assets.getMany accepts; it drops any other key. */
export const ASSET_SORT_KEYS = new Set([
  "ip",
  "deviceType",
  "manufacturer",
  "product",
  "version",
  "versionStatus",
  "createdAt",
  "updatedAt",
] as const);

const ASSET_SORT_DESCRIPTION = `Comma-separated sort fields, with "-" in front of a field for descending. Fields: ${[...ASSET_SORT_KEYS].join(", ")}. Unknown fields are ignored.`;

const parseAssetSort = createSortParser(ASSET_SORT_KEYS, [
  { updatedAt: "desc" },
]);

export const assetsRouter = createTRPCRouter({
  // GET /api/v1/assets - List all assets
  getMany: baseProcedure
    .input(
      paginationInputSchema.extend({
        sort: z.string().default("").describe(ASSET_SORT_DESCRIPTION),
      }),
    )
    .meta({
      openapi: {
        method: "GET",
        path: "/assets",
        // trpc-to-openapi documents every endpoint as authenticated unless told otherwise
        protect: false,
        tags: ["Assets"],
        summary: "List Assets",
        description:
          "Get a page of assets. `search` matches the IP address, device type, manufacturer, product, and version.",
      },
    })
    .output(paginatedAssetResponseSchema)
    .query(async ({ input }) => {
      return fetchPaginated(prisma.asset, input, {
        where: createSearchFilter(input.search),
        // id breaks ties, so a row cannot move between pages
        orderBy: [...parseAssetSort(input.sort), { id: "asc" }],
      });
    }),

  // POST /api/v1/assets - Create an asset
  create: baseProcedure
    .input(assetInputSchema)
    .meta({
      openapi: {
        method: "POST",
        path: "/assets",
        // trpc-to-openapi documents every endpoint as authenticated unless told otherwise
        protect: false,
        tags: ["Assets"],
        summary: "Create Asset",
        description:
          "Create a new asset. Give `version` when it is known; otherwise omit it and set `versionStatus` to UNKNOWN (the default) or NOT_APPLICABLE.",
      },
    })
    .output(assetResponseSchema)
    .mutation(async ({ input }) => {
      return prisma.asset.create({
        data: { ...input, versionStatus: resolveVersionStatus(input) },
      });
    }),
});
