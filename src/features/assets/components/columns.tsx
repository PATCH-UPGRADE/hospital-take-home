"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { SortableHeader } from "@/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VersionStatus } from "@/generated/prisma";
import type { AssetResponse } from "../types";
import { VersionStatusBadge } from "./version-status-badge";

const Unknown = () => <span className="text-muted-foreground">Unknown</span>;

export const columns: ColumnDef<AssetResponse>[] = [
  {
    accessorKey: "deviceType",
    meta: { title: "Device Type" },
    header: ({ column }) => (
      <SortableHeader header="Device Type" column={column} />
    ),
    cell: ({ row }) => row.original.deviceType ?? <Unknown />,
  },
  {
    accessorKey: "manufacturer",
    meta: { title: "Manufacturer" },
    header: ({ column }) => (
      <SortableHeader header="Manufacturer" column={column} />
    ),
  },
  {
    accessorKey: "product",
    meta: { title: "Product" },
    header: ({ column }) => <SortableHeader header="Product" column={column} />,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.product}</span>
    ),
  },
  {
    accessorKey: "version",
    meta: { title: "Version" },
    header: ({ column }) => <SortableHeader header="Version" column={column} />,
    cell: ({ row }) => {
      const { version, versionStatus } = row.original;
      if (version) return version;
      return (
        <VersionStatusBadge
          // KNOWN without a version can't be stored, but fall back to Unknown
          status={
            versionStatus === VersionStatus.NOT_APPLICABLE
              ? VersionStatus.NOT_APPLICABLE
              : VersionStatus.UNKNOWN
          }
        />
      );
    },
  },
  {
    accessorKey: "ip",
    meta: { title: "IP Address" },
    header: ({ column }) => (
      <SortableHeader header="IP Address" column={column} />
    ),
    cell: ({ row }) => <span className="font-mono">{row.original.ip}</span>,
  },
  {
    accessorKey: "updatedAt",
    meta: { title: "Last Updated" },
    header: ({ column }) => (
      <SortableHeader header="Last Updated" column={column} />
    ),
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <time dateTime={updatedAt.toISOString()}>
                {formatDistanceToNow(updatedAt, { addSuffix: true })}
              </time>
            </TooltipTrigger>
            <TooltipContent>{updatedAt.toLocaleString()}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
