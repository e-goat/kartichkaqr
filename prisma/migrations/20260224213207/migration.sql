/*
  Warnings:

  - The `titlePos` column on the `Template` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TitlePosition" AS ENUM ('top', 'bottom', 'center');

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "titlePos",
ADD COLUMN     "titlePos" "TitlePosition" NOT NULL DEFAULT 'top';

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "secretHash" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastVerifiedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
