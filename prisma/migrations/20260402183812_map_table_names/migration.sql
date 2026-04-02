/*
  Warnings:

  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Template` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_templateId_fkey";

-- DropTable
DROP TABLE "Card";

-- DropTable
DROP TABLE "Template";

-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "qrCode" TEXT,
    "sender" TEXT,
    "receiver" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audioUrl" TEXT,
    "cardUuid" TEXT NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "titlePos" "TitlePosition" NOT NULL DEFAULT 'top',
    "description" TEXT,
    "type" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "backgroundBack" TEXT NOT NULL DEFAULT '',
    "font" TEXT NOT NULL DEFAULT 'Arial',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cards_slug_key" ON "cards"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cards_cardUuid_key" ON "cards"("cardUuid");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
