import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import type { Card, Template } from "$lib/db";
import { ts, ss } from "$lib/state.svelte";
import { VercelStorageController } from "$lib/controller/VercelStorage";
import { MailController } from "$lib/controller/Mail";
import { APP_EMAIL, ADMIN_EMAIL, APP_NAME } from "$lib/server/secrets";
import * as db from "$lib/server/database";
import { rewriteAssetFields } from "$lib/server/blobUrl";
import { fail } from "@sveltejs/kit";
import { createCard } from "$lib/server/database";
import { Prisma } from "$lib/db";

const TEMPLATE_ASSET_FIELDS = ["background", "backgroundBack"] as const;

export const load: PageServerLoad = async ({ url }) => {
    const limit: number = Number(url.searchParams.get("limit")) || 9;
    const skip: number = Number(url.searchParams.get("skip")) || 0;
    const currentPage: number = Math.floor(skip / limit) + 1;

    const categoryId = url.searchParams.get("categoryId");
    const result = categoryId
        ? await db.getAllTemplatesByCategory(limit, skip, Number(categoryId))
        : await db.getAllTemplates(limit, skip);

    const categories = await db.getAllCategories();

    return {
        templates: result.templates.map((t) =>
            rewriteAssetFields(t, TEMPLATE_ASSET_FIELDS),
        ),
        categories,
        total: result.total,
        currentPage,
        pageSize: limit,
    };
};

export const actions: Actions = {
    create: async ({ request, url }) => {
        const formData = await request.formData();
        const cardMeta = JSON.parse(formData.get("card") as string);

        let card: Prisma.CardCreateInput;

        ss.isSubmitting = true;

        try {
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

            const origin = url.origin;
            const cardUrl = `${origin}/card/${cardMeta.slug}`;

            card = {
                sender: cardMeta.sender,
                description: cardMeta.description ?? ts.description,
                slug: cardMeta.slug,
                audioUrl: cardMeta.audioUrl,
                cardUuid: cardMeta.cardUuid,
                qrCode: cardUrl,
                template: {
                    connect: { id: cardMeta.templateId },
                },
            };
            const file = formData.get("record") as File | null;
            if (file) {
                const storeResponse = await VercelStorageController.storeAudio({
                    file: file,
                    mimeType: "webm",
                    uuid: card.cardUuid as string,
                });
                card.audioUrl = storeResponse.url;
            }
            const createdCard: Card = await createCard(card);

            /**
             * Send email to admin if a physical copy is requested
             */
            const isRequested =
                formData.get("physical-copy-requested-value") === "true";
            if (isRequested) {
                // Get sender information from form data
                const senderName =
                    (formData.get("physical-copy-name") as string) || "";
                const senderEmail =
                    (formData.get("physical-copy-email") as string) || "";
                const senderPhone =
                    (formData.get("physical-copy-phone") as string) || "";
                const senderAddress =
                    (formData.get("physical-copy-address") as string) || "";
                const senderComment =
                    (formData.get("physical-copy-comment") as string) || "";
                const origin = url.origin;
                const cardUrl = `${origin}/card/${cardMeta.slug}`;
                const template: Template = await db.getTemplateById(
                    createdCard.templateId,
                );

                MailController.send({
                    to: ADMIN_EMAIL || "duchevmartin@gmail.com",
                    from: APP_EMAIL,
                    name: cardMeta.sender || "",
                    title: APP_NAME + " Нова карта",
                    cardTitle: template.title,
                    senderName: senderName || cardMeta.sender,
                    cardDescription: cardMeta.description,
                    cardId: createdCard.id,
                    senderEmail,
                    senderPhone,
                    senderAddress,
                    cardUrl,
                    senderComment,
                });
            }

            ss.isSubmitting = false;

            return { success: true, card, cardUrl };
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
                error: "Възникна грешка при създаването на картичката.",
            });
        }
    },
};
