import "dotenv/config";
import { defineConfig } from "prisma/config";

const IGNORED_TABLES: string[] = [
    "public.cache",
    "public.cache_locks",
    "public.failed_jobs",
    "public.job_batches",
    "public.jobs",
    "public.password_reset_tokens",
    "public.sessions",
    "public.users",
    "public._dashboard_migrations",
];

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: "npx tsx prisma/seed.ts",
    },
    datasource: {
        url: process.env.DATABASE_URL!,
    },
    experimental: {
        externalTables: true,
    },
    tables: {
        external: IGNORED_TABLES,
    },
});
