import { z } from "zod";
import { VersionStatus } from "@/generated/prisma";
import { createPaginatedResponseSchema } from "@/lib/pagination";

export const versionStatusSchema = z
  .enum(VersionStatus)
  .describe(
    "KNOWN when `version` is set. Without a version, UNKNOWN means the device has a version that nobody knows, and NOT_APPLICABLE means the product has no versions.",
  );

/** An optional text field: absent, null, or a non-blank string. */
const optionalText = z.string().trim().min(1).nullish();

// Set on both branches: a client may report either branch's message.
const INVALID_IP = "Must be a valid IPv4 or IPv6 address";

/** The asset fields without the version/versionStatus cross-check, for forms to extend. */
export const assetInputObjectSchema = z.object({
  ip: z
    .union([z.ipv4({ error: INVALID_IP }), z.ipv6({ error: INVALID_IP })], {
      error: INVALID_IP,
    })
    .describe(
      'The IPv4 or IPv6 address of the asset, for example "10.10.1.11".',
    ),
  deviceType: optionalText.describe(
    'What kind of device this is, for example "Infusion Pump".',
  ),
  manufacturer: z
    .string()
    .trim()
    .min(1)
    .describe('The device manufacturer, for example "BD".'),
  product: z
    .string()
    .trim()
    .min(1)
    .describe('The product name, for example "Alaris 8015 PC Unit".'),
  version: optionalText.describe(
    "The software or firmware version running on the device. Omit it if unknown or not applicable, and say which with versionStatus.",
  ),
  versionStatus: versionStatusSchema
    .optional()
    .describe(
      "Why the asset has no version: UNKNOWN (the default) or NOT_APPLICABLE. It is KNOWN whenever `version` is given, so it can be omitted then.",
    ),
});

export const assetInputSchema = assetInputObjectSchema.superRefine(
  ({ version, versionStatus }, ctx) => {
    if (version && versionStatus && versionStatus !== VersionStatus.KNOWN) {
      ctx.addIssue({
        code: "custom",
        path: ["versionStatus"],
        message: `versionStatus must be KNOWN or omitted when version is given, not ${versionStatus}`,
      });
    }
    if (!version && versionStatus === VersionStatus.KNOWN) {
      ctx.addIssue({
        code: "custom",
        path: ["version"],
        message: "version is required when versionStatus is KNOWN",
      });
    }
  },
);
export type AssetInput = z.infer<typeof assetInputSchema>;

/** The status stored for an asset: a version means KNOWN, otherwise UNKNOWN unless told otherwise. */
export function resolveVersionStatus({
  version,
  versionStatus,
}: Pick<AssetInput, "version" | "versionStatus">): VersionStatus {
  if (version) return VersionStatus.KNOWN;
  return versionStatus ?? VersionStatus.UNKNOWN;
}

export const assetResponseSchema = z.object({
  id: z.string(),
  ip: z.string(),
  deviceType: z.string().nullable(),
  manufacturer: z.string(),
  product: z.string(),
  version: z.string().nullable(),
  versionStatus: versionStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type AssetResponse = z.infer<typeof assetResponseSchema>;

export const paginatedAssetResponseSchema =
  createPaginatedResponseSchema(assetResponseSchema);
