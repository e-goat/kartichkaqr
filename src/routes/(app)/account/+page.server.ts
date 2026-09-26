import { redirect } from "@sveltejs/kit";
import { getCardsByUser } from "$lib/server/database";
import { toAssetProxyUrl } from "$lib/server/blobUrl";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) redirect(303, "/login?redirectTo=/account");

    const cards = await getCardsByUser(locals.user.id);

    return {
        cards: cards.map((c) => ({
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
