import { PrismaClient, Prisma } from "$lib/db";
import { error } from "@sveltejs/kit";

const prisma = new PrismaClient();

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

export async function getAllTemplatesByType(
    limit: number,
    skip: number,
    type: string,
) {
    if (limit > 100) {
        throw error(400, "Bad Request");
    }
    const [templates, total] = await Promise.all([
        prisma.template.findMany({
            take: limit,
            skip,
            where: { type },
            orderBy: { createdAt: "desc" },
        }),
        prisma.template.count({ where: { type } }),
    ]);

    return { templates, total };
}

export async function getAllCategories() {
    return prisma.template.findMany({
        where: {},
        distinct: ["type"],
    });
}
