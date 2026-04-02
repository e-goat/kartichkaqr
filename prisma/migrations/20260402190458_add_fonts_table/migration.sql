/*
  Warnings:

  - You are about to drop the column `font` on the `templates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "templates" DROP COLUMN "font",
ADD COLUMN     "fontId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "fonts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "fonts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fonts_name_key" ON "fonts"("name");

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_fontId_fkey" FOREIGN KEY ("fontId") REFERENCES "fonts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
