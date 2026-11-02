import { PrismaClient } from "@/generated/prisma";

// see https://www.prisma.io/docs/guides/nextjs#26-set-up-prisma-client
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
