import { Prisma } from "$lib/db";
import { error } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export async function getCardBySlug(slug: string) {
    return prisma.card.findUnique({
        where: { slug },
        include: {
            template: {
                include: { font: true },
            },
        },
    });
}

export async function createCard(data: Prisma.CardCreateInput) {
    return prisma.card.create({
        data,
    });
}

export async function getCardsByUser(userId: string) {
    return prisma.card.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            template: {
                select: { background: true, title: true },
            },
            category: { select: { name: true } },
        },
    });
}

export async function getAllTemplates(limit: number, skip: number) {
    if (limit > 100) {
        throw error(400, "Bad Request");
    }
    const [templates, total] = await Promise.all([
        prisma.template.findMany({
            select: {
                id: true,
                title: true,
                titlePos: true,
                titleFontSize: true,
                description: true,
                background: true,
                backgroundBack: true,
                font: true,
                fontColor: true,
                categoryId: true,
            },
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
            select: {
                id: true,
                title: true,
                titlePos: true,
                titleFontSize: true,
                description: true,
                background: true,
                backgroundBack: true,
                font: true,
                fontColor: true,
                categoryId: true,
            },
            skip,
            where: { categoryId },
            orderBy: { createdAt: "desc" },
        }),
        prisma.template.count({ where: { categoryId } }),
    ]);
    return { templates, total };
}

export async function getTemplateById(templateId: number) {
    return prisma.template.findUniqueOrThrow({
        select: {
            id: true,
            title: true,
            titlePos: true,
            titleFontSize: true,
            description: true,
            background: true,
            backgroundBack: true,
            font: true,
            fontColor: true,
            categoryId: true,
        },
        where: { id: templateId },
    });
}

export async function getAllCategories() {
    return prisma.category.findMany({
        orderBy: { id: "asc" },
    });
}
