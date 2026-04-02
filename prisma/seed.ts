import "dotenv/config";
import { PrismaClient, Prisma } from '../src/lib/db'
import { \ } from '@prisma/adapter-ppg'

const adapter = new PrismaPostgresAdapter({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// Add tables to seed here
const SEED_TARGET: string[] = [
    // 'card',
    // 'template',
];

/**
 * @param data The data to seed into the table
 * @param table The name of the table to seed
 */
export async function main(data: any, table: string) {
    switch (table) {
        case 'card':
            // Seed card here
            break
        case 'template':
            // Seed template here
            break
        default:
            throw new Error(`Unknown table: ${table}`)
    }
}

for (const table of SEED_TARGET) {
    await main(null, table)
}
