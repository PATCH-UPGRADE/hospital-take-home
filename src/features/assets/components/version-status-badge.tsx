import { CircleHelpIcon, CircleMinusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VersionStatus } from "@/generated/prisma";

type MissingVersionStatus = Exclude<VersionStatus, typeof VersionStatus.KNOWN>;

const badges = {
  [VersionStatus.UNKNOWN]: {
    label: "Unknown",
    description: "This device has a version, but nobody knows what it is.",
    icon: CircleHelpIcon,
    className:
      "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  },
  [VersionStatus.NOT_APPLICABLE]: {
    label: "Not applicable",
    description: "This product has no versions.",
    icon: CircleMinusIcon,
    className: "border-transparent bg-secondary text-muted-foreground",
  },
} satisfies Record<MissingVersionStatus, unknown>;

/** Shown in place of a version when an asset has none, saying why. */
export const VersionStatusBadge = ({
  status,
}: {
  status: MissingVersionStatus;
}) => {
  const badge = badges[status];
  return (
    <Badge
      variant="outline"
      className={badge.className}
      title={badge.description}
    >
      <badge.icon aria-hidden="true" />
      {badge.label}
    </Badge>
  );
};
