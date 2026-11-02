-- CreateEnum
CREATE TYPE "VersionStatus" AS ENUM ('KNOWN', 'UNKNOWN', 'NOT_APPLICABLE');

-- CreateTable
CREATE TABLE "asset" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "deviceType" TEXT,
    "manufacturer" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "version" TEXT,
    "versionStatus" "VersionStatus" NOT NULL DEFAULT 'UNKNOWN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_pkey" PRIMARY KEY ("id"),
    -- An asset has a version exactly when its versionStatus is KNOWN.
    CONSTRAINT "asset_version_matches_status" CHECK (("version" IS NOT NULL) = ("versionStatus" = 'KNOWN'))
);

-- CreateIndex
CREATE INDEX "asset_createdAt_idx" ON "asset"("createdAt");

-- CreateIndex
CREATE INDEX "asset_updatedAt_idx" ON "asset"("updatedAt");
