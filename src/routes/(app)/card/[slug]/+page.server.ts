import type { PageServerLoad } from "./$types";
import { getCardBySlug } from "$lib/server/database";
import { rewriteAssetFields, toAssetProxyUrl } from "$lib/server/blobUrl";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, url }) => {
    const data = await getCardBySlug(params.slug);

    if (!data) {
        throw error(404, "Картичката не е намерена.");
    }

    return {
        ...data,
        audioUrl: toAssetProxyUrl(data.audioUrl),
        template: rewriteAssetFields(data.template, [
            "background",
            "backgroundBack",
        ]),
        cardPageUrl: `${url.origin}/card/${params.slug}`,
    };
};
