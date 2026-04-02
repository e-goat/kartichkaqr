// Import needed packages
import { PrismaClient } from "@prisma/client";
import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";

// Setup
const connectionString = `${process.env.DATABASE_URL}`;

// Init Prisma Client with adapter
const adapter = new PrismaPostgresAdapter({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;
