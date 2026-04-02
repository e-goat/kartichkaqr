import { PrismaClient, Prisma } from "$lib/db";
import { error } from "@sveltejs/kit";
import { DATABASE_URL } from "$env/static/private";
import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";

const adapter = new PrismaPostgresAdapter({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function getCardBySlug(slug: string) {
    return prisma.card.findUnique({
        where: { slug },
        include: { template: true },
    });
}

export async function createCard(data: Prisma.CardCreateInput) {
    return prisma.card.create({
        data,
    });
}

export async function getAllTemplates(limit: number, skip: number) {
    if (limit > 100) {
        throw error(400, "Bad Request");
    }
    const [templates, total] = await Promise.all([
        prisma.template.findMany({
            take: limit,
            skip: skip,
            orderBy: { createdAt: "desc" },
        }),
        prisma.template.count(),
    ]);

    return { templates, total };
}

export async function getAllTemplatesByCategory(
    limit: number,
    skip: number,
    categoryId: number,
) {
    if (limit > 100) {
        throw error(400, "Bad Request");
    }
    const [templates, total] = await Promise.all([
        prisma.template.findMany({
            take: limit,
            skip,
            where: { categoryId },
            orderBy: { createdAt: "desc" },
        }),
        prisma.template.count({ where: { categoryId } }),
    ]);

    return { templates, total };
}

export async function getAllCategories() {
    return prisma.category.findMany({
        orderBy: { id: "asc" },
    });
}
