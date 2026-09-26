import { fail, redirect } from "@sveltejs/kit";
import { deleteCardForUser, getCardsByUser } from "$lib/server/database";
import { toAssetProxyUrl } from "$lib/server/blobUrl";
import { VercelStorageController } from "$lib/controller/VercelStorage";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) redirect(303, "/login?redirectTo=/account");

    const cards = await getCardsByUser(locals.user.id);

    return {
        cards: cards.map((c) => ({
            id: c.id,
            slug: c.slug,
            title: c.title || c.template?.title || "Без заглавие",
            createdAt: c.createdAt,
            hasAudio: !!c.audioUrl,
            physical: c.physical,
            generated: !!c.backgroundUrl,
            category: c.category?.name ?? null,
            image: toAssetProxyUrl(c.backgroundUrl ?? c.template?.background),
        })),
    };
};

export const actions: Actions = {
    delete: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: "Влезте, за да изтриете картичка." });
        }

        const cardId = Number((await request.formData()).get("cardId"));
        if (!Number.isInteger(cardId) || cardId <= 0) {
            return fail(400, { error: "Невалидна картичка." });
        }

        try {
            // Ownership is enforced in the query itself (id + userId), and the
            // blobs are removed before the delete commits.
            const deleted = await deleteCardForUser(
                cardId,
                locals.user.id,
                (card) =>
                    VercelStorageController.deleteCardAssets([
                        card.backgroundUrl,
                        card.audioUrl,
                    ]),
            );
            if (!deleted) {
                return fail(404, { error: "Картичката не е намерена." });
            }
            return { deleted: true };
        } catch (e) {
            // The transaction rolled back, so the card still exists and the
            // user can retry. Blob deletion is idempotent.
            console.error(`Card ${cardId} deletion failed:`, e);
            return fail(500, {
                error: "Възникна грешка при изтриването. Опитайте отново.",
            });
        }
    },
};
