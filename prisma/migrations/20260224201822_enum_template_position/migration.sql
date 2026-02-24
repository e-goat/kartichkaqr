/*
  Warnings:

  - The `titlePos` column on the `Template` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TitlePosition" AS ENUM ('top', 'bottom', 'center');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "titlePos",
ADD COLUMN     "titlePos" "TitlePosition" NOT NULL DEFAULT 'top';
