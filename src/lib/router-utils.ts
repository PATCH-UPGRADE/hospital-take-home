import {
  buildPaginationMeta,
  createPaginatedResponse,
  type PaginationInput,
} from "./pagination";

// ============================================================================
// SORTING
// ============================================================================

/**
 * Build a parser that turns the DataTable's `?sort=` URL param into a Prisma
 * `orderBy` array. The DataTable serializes sorting state as
 * `field` or `-field` (descending), comma-separated for multi-column sort.
 *
 * Unknown fields are silently dropped so callers don't blindly forward user
 * input to Prisma. The default is used when the param is empty OR when every
 * requested field is rejected by the whitelist.
 */
export function createSortParser<Field extends string>(
  allowedFields: ReadonlySet<Field>,
  defaultOrder: Array<Partial<Record<Field, "asc" | "desc">>>,
) {
  return (raw: string): Array<Partial<Record<Field, "asc" | "desc">>> => {
    if (!raw) return defaultOrder;
    const parsed: Array<Partial<Record<Field, "asc" | "desc">>> = [];
    for (const part of raw.split(",")) {
      const desc = part.startsWith("-");
      const field = (desc ? part.slice(1) : part) as Field;
      if (allowedFields.has(field)) {
        parsed.push({ [field]: desc ? "desc" : "asc" } as Partial<
          Record<Field, "asc" | "desc">
        >);
      }
    }
    return parsed.length > 0 ? parsed : defaultOrder;
  };
}

// ============================================================================
// PRISMA TYPES
// ============================================================================

// so we can take in a `prisma` model delegate (e.g. `prisma.asset`) and work with it
type PrismaDelegate<TItem> = {
  // biome-ignore lint/suspicious/noExplicitAny: Prisma delegates have per-model arg types
  count: (args?: any) => Promise<number>;
  // biome-ignore lint/suspicious/noExplicitAny: Prisma delegates have per-model arg types
  findMany: (args?: any) => Promise<TItem[]>;
};

// ============================================================================
// List view helpers
// ============================================================================

export function buildUpdatedAtFilter(
  input: Pick<PaginationInput, "lastUpdatedStartTime" | "lastUpdatedEndTime">,
): { updatedAt?: { gte?: Date; lte?: Date } } {
  const updatedAt: { gte?: Date; lte?: Date } = {};
  if (input.lastUpdatedStartTime) {
    updatedAt.gte = new Date(input.lastUpdatedStartTime);
  }
  if (input.lastUpdatedEndTime) {
    updatedAt.lte = new Date(input.lastUpdatedEndTime);
  }
  return Object.keys(updatedAt).length > 0 ? { updatedAt } : {};
}

export async function fetchPaginated<TItem>(
  delegate: PrismaDelegate<TItem>,
  input: PaginationInput,
  args: { where?: object; orderBy?: object | object[] },
) {
  const where = { ...args.where, ...buildUpdatedAtFilter(input) };

  const totalCount = await delegate.count({ where });

  const meta = buildPaginationMeta(input, totalCount);

  const items = await delegate.findMany({
    orderBy: { createdAt: "desc" },
    ...args,
    where,
    skip: meta.skip,
    take: meta.take,
  });

  return createPaginatedResponse(items, meta);
}
