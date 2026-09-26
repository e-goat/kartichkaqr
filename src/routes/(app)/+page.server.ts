import type { Actions, PageServerLoad } from "./$types";
import type { Card } from "$lib/db";
import { fail } from "@sveltejs/kit";
import { Prisma } from "$lib/db";
import { VercelStorageController } from "$lib/controller/VercelStorage";
import { MailController } from "$lib/controller/Mail";
import { APP_EMAIL, ADMIN_EMAIL, APP_NAME } from "$lib/server/secrets";
import * as db from "$lib/server/database";
import { cardStyleSchema, introStepSchema } from "$lib/schemas/card.schema";
import { STEP } from "$lib/config/steps";

export const load: PageServerLoad = async ({ locals }) => {
    const categories = await db.getAllCategories();
    return { categories, authenticated: !!locals.user };
};

export const actions: Actions = {
    create: async ({ request, url, locals }) => {
        if (!locals.user) {
            return fail(401, { error: "Влезте, за да създадете картичка." });
        }

        const formData = await request.formData();
        const cardMeta = JSON.parse(formData.get("card") as string);

        const info = introStepSchema.safeParse(cardMeta);
        if (!info.success) {
            return fail(400, {
                cardMeta,
                error: info.error.issues[0]?.message,
                errorStep: STEP.INFO,
            });
        }
        const style = cardStyleSchema.safeParse(cardMeta);
        if (!style.success) {
            return fail(400, {
                cardMeta,
                error: "Невалиден стил на картичката.",
                errorStep: STEP.INFO,
            });
        }

        const isGenerated = !!cardMeta.backgroundUrl;
        if (!isGenerated && !cardMeta.templateId) {
            return fail(400, {
                cardMeta,
                error: "Моля, генерирайте изображение или изберете шаблон.",
                errorStep: STEP.DESIGN,
            });
        }

        // Generated images must belong to an existing category
        let categoryId: number | null = null;
        if (isGenerated) {
            const categories = await db.getAllCategories();
            categoryId =
                categories.find((c) => c.id === cardMeta.categoryId)?.id ??
                null;
            if (!categoryId) {
                return fail(400, {
                    cardMeta,
                    error: "Невалидна категория на изображението.",
                    errorStep: STEP.DESIGN,
                });
            }
        }

        try {
            const origin = url.origin;
            const cardUrl = `${origin}/card/${cardMeta.slug}`;
            const isRequested =
                formData.get("physical-copy-requested-value") === "true";

            const card: Prisma.CardCreateInput = {
                title: info.data.title,
                sender: info.data.sender,
                description: info.data.description,
                slug: cardMeta.slug,
                audioUrl: cardMeta.audioUrl,
                cardUuid: cardMeta.cardUuid,
                qrCode: cardUrl,
                physical: isRequested,
                ...style.data,
                user: { connect: { id: locals.user.id } },
            };

            if (isGenerated) {
                const stored =
                    await VercelStorageController.storeGeneratedImage({
                        sourceUrl: cardMeta.backgroundUrl,
                        uuid: card.cardUuid as string,
                    });
                card.backgroundUrl = stored.url;
                card.prompt =
                    typeof cardMeta.prompt === "string"
                        ? cardMeta.prompt.slice(0, 1000)
                        : null;
                card.titlePos = "center";
                card.category = { connect: { id: categoryId! } };
            } else {
                card.template = { connect: { id: cardMeta.templateId } };
            }

            const file = formData.get("record") as File | null;
            if (file) {
                const ext =
                    (file.type.split("/")[1] ?? "webm").split(";")[0] || "webm";
                const storeResponse = await VercelStorageController.storeAudio({
                    file: file,
                    mimeType: ext,
                    uuid: card.cardUuid as string,
                });
                card.audioUrl = storeResponse.url;
            }
            const createdCard: Card = await db.createCard(card);

            /**
             * Send email to admin if a physical copy is requested
             */
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
                const template = createdCard.templateId
                    ? await db.getTemplateById(createdCard.templateId)
                    : null;

                MailController.send({
                    to: ADMIN_EMAIL || "duchevmartin@gmail.com",
                    from: APP_EMAIL,
                    name: cardMeta.sender || "",
                    title: APP_NAME + " Нова карта",
                    cardTitle: template?.title ?? "AI дизайн",
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

            return {
                success: true,
                cardUrl,
                physicalCopyRequested: isRequested,
            };
        } catch (e) {
            console.error("Card creation error:", e);

            if (
                e instanceof Error &&
                e.message.includes("cards_templateId_fkey")
            ) {
                return fail(400, {
                    cardMeta,
                    error: "Избраният шаблон не съществува. Моля, изберете валиден шаблон.",
                    errorStep: STEP.DESIGN,
                });
            }

            return fail(500, {
                cardMeta,
                error: "Възникна грешка при създаването на картичката.",
            });
        }
    },
};
