/*
  Warnings:

  - The values [half_top,half_bottom] on the enum `TitlePosition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TitlePosition_new" AS ENUM ('top', 'right', 'bottom', 'left', 'center');
ALTER TABLE "public"."templates" ALTER COLUMN "titlePos" DROP DEFAULT;
ALTER TABLE "templates" ALTER COLUMN "titlePos" TYPE "TitlePosition_new" USING ("titlePos"::text::"TitlePosition_new");
ALTER TYPE "TitlePosition" RENAME TO "TitlePosition_old";
ALTER TYPE "TitlePosition_new" RENAME TO "TitlePosition";
DROP TYPE "public"."TitlePosition_old";
ALTER TABLE "templates" ALTER COLUMN "titlePos" SET DEFAULT 'top';
COMMIT;
