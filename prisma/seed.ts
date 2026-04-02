import "dotenv/config";
import { PrismaClient } from "../src/lib/db";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const categories = [
        { name: "Благодарност" },
        { name: "Любов" },
        { name: "Подкрепа" },
        { name: "Празници" },
        { name: "Специални дни" },
    ];

    await prisma.category.createMany({
        data: categories,
        skipDuplicates: true,
    });
    console.log("Seeded categories successfully.");

    const fonts = [
        { name: "Arial" },
        { name: "Times New Roman" },
        { name: "Courier New" },
        { name: "Verdana" },
        { name: "Georgia" },
    ];

    await prisma.font.createMany({
        data: fonts,
        skipDuplicates: true,
    });
    console.log("Seeded fonts successfully.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });
