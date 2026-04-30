import "dotenv/config";
import { PrismaClient } from "../src/lib/db";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.font.deleteMany();
    await prisma.category.deleteMany();
    console.log("Cleared all seeded tables.");

    const categories = [
        { name: "Благодарност" },
        { name: "Любов" },
        { name: "Подкрепа" },
        { name: "Празници" },
        { name: "Специални дни" },
    ];

    await prisma.category.createMany({ data: categories });
    console.log("Seeded categories successfully.");

    // Font names must match CSS variable suffixes (--font-family-<name>)
    // Spaces are invalid in CSS custom property names, so CamelCase is required.
    const fonts = [
        { name: "Roboto" },
        { name: "ChironSungHK" },
        { name: "BebasNeue" },
        { name: "Montserrat" },
        { name: "Allura" },
        { name: "Caveat" },
        { name: "DancingScript" },
        { name: "GreatVibes" },
        { name: "Oswald" },
        { name: "Pacifico" },
        { name: "PlayfairDisplay" },
        { name: "Raleway" },
        { name: "Sacramento" },
        { name: "Poppins" },
        { name: "Nunito" },
        { name: "Cinzel" },
        { name: "CormorantGaramond" },
        { name: "Lora" },
        { name: "AlexBrush" },
        { name: "Tangerine" },
        { name: "PinyonScript" },
        { name: "Lobster" },
        { name: "AbrilFatface" },
        { name: "JosefinSans" },
        { name: "Quicksand" },
        { name: "Merriweather" },
        { name: "PermanentMarker" },
        { name: "Satisfy" },
    ];

    await prisma.font.createMany({ data: fonts });
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
