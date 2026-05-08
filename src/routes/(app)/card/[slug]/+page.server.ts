import type { PageServerLoad } from "./$types";
import { getCardBySlug } from "$lib/server/database";
import { rewriteAssetFields, toAssetProxyUrl } from "$lib/server/blobUrl";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, url }) => {
    const data = await getCardBySlug(params.slug);

    if (!data) {
        throw error(404, "Картичката не е намерена.");
    }

    const template = rewriteAssetFields(data.template, [
        "background",
        "backgroundBack",
    ]);
    const bg = template.background ?? "";
    const ogImageUrl = bg.startsWith("http") ? bg : `${url.origin}${bg}`;

    return {
        ...data,
        audioUrl: toAssetProxyUrl(data.audioUrl),
        template,
        cardPageUrl: `${url.origin}/card/${params.slug}`,
        ogImageUrl,
    };
};
