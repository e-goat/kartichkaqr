-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "secretHash" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
