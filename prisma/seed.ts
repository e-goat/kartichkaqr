import { PrismaClient, Prisma } from '../src/lib/db'

const prisma = new PrismaClient()

export async function main(data: any, table: string) {
    switch (table) {
        case 'card':
            break
        case 'template':
            break
        default:
            throw new Error(`Unknown table: ${table}`)
    }
}

main(null, 'template')
