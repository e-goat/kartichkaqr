/*
  Warnings:

  - The `titlePos` column on the `Template` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Template" DROP COLUMN "titlePos",
ADD COLUMN     "titlePos" TEXT NOT NULL DEFAULT 'top';

-- DropTable
DROP TABLE "Session";

-- DropEnum
DROP TYPE "TitlePosition";
