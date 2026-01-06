import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import { rs, ss } from "$lib/state.svelte";
import { VercelStorageController } from "$lib/controller/VercelStorage";
import { MailController } from "$lib/controller/Mail";

import * as db from "$lib/server/database";
import { fail } from "@sveltejs/kit";
import { createCard } from "$lib/server/database";
import { Prisma } from "$lib/db";

export const load: PageServerLoad = async ({ url }) => {
    const limit: number = Number(url.searchParams.get("limit")) || 10;
    const skip: number = Number(url.searchParams.get("skip")) || 0;
    const currentPage: number = Math.floor(skip / limit) + 1;

    const type = url.searchParams.get("type") || "";
    let result = await db.getAllTemplates(limit, skip);

    if (type) {
        result = await db.getAllTemplatesByType(limit, skip, type);
    }

    const categories = await db.getAllCategories();

    return {
        templates: result.templates,
        categories,
        total: result.total,
        currentPage,
        pageSize: limit,
    };
};

export const actions: Actions = {
    create: async ({ request, fetch }) => {
        const formData = await request.formData();
        const cardMeta = JSON.parse(formData.get("card") as string);
        let card: Prisma.CardCreateInput;
        ss.isSubmitting = true;

        try {
            // Page 1 validations
            if (
                !cardMeta.title?.trim() ||
                !cardMeta.receiver?.trim() ||
                !cardMeta.sender?.trim()
            ) {
                ss.isSubmitting = false;
                return fail(400, {
                    cardMeta,
                    error: "Моля, попълнете всички полета.",
                    errorStep: 1,
                    missing: true,
                });
            }

            // Page 2 validations
            if (!cardMeta.templateId) {
                ss.isSubmitting = false;
                ss.currentStep = 2;
                return fail(400, {
                    cardMeta,
                    error: "Моля, изберете шаблон за картичката.",
                    errorStep: 2,
                });
            }

            card = {
                title: cardMeta.title,
                description: cardMeta.description,
                sender: cardMeta.sender,
                receiver: cardMeta.receiver,
                slug: cardMeta.slug,
                audioUrl: cardMeta.audioUrl,
                cardUuid: cardMeta.cardUuid,
                template: {
                    connect: { id: cardMeta.templateId },
                },
            };

            const file = formData.get("record") as File | null;
            if (file) {
                const storeResponse = await VercelStorageController.store({
                    file: file,
                    mimeType: "webm",
                    uuid: card.cardUuid as string,
                });
                card.audioUrl = storeResponse.url;
            }

            await createCard(card);

            MailController.send({
                to: process.env.ADMIN_EMAIL || "",
                from: process.env.APP_EMAIL || "",
                name: cardMeta.receiver,
                title: cardMeta.title,
                senderName: cardMeta.sender,
                description: cardMeta.description || "",
            });

            ss.isSubmitting = false;

            return { success: true, card };
        } catch (e) {
            ss.isSubmitting = false;
            console.error("Card creation error:", e);

            if (
                e instanceof Error &&
                e.message.includes("Card_templateId_fkey")
            ) {
                return fail(400, {
                    cardMeta,
                    error: "Избраният шаблон не съществува. Моля, изберете валиден шаблон.",
                });
            }

            return fail(500, {
                cardMeta,
                error: `Възникна грешка при създаването на картичката.`,
            });
        }
    },
} satisfies Actions;
