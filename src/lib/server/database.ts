import { Prisma } from "$lib/db";
import type { Card } from "$lib/db";
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

/**
 * Delete a card owned by `userId` and run `cleanup` (storage deletion) before
 * the delete commits. The DELETE runs first so the row stays locked while
 * `cleanup` runs; if `cleanup` throws, the transaction rolls back and the card
 * is left intact so the user can retry. Nothing else references `cards`, so
 * no dependent rows need to be removed.
 *
 * Returns `null` when the card doesn't exist or belongs to someone else.
 */
export async function deleteCardForUser(
    cardId: number,
    userId: string,
    cleanup: (card: Card) => Promise<void>,
): Promise<Card | null> {
    try {
        return await prisma.$transaction(
            async (tx) => {
                const card = await tx.card.delete({
                    where: { id: cardId, userId },
                });
                await cleanup(card);
                return card;
            },
            // Storage calls happen inside the transaction; allow for network latency
            { timeout: 15_000 },
        );
    } catch (e) {
        // P2025: no row matched (missing card or not the owner)
        if (
            e instanceof Prisma.PrismaClientKnownRequestError &&
            e.code === "P2025"
        ) {
            return null;
        }
        throw e;
    }
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
