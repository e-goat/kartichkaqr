import type { PageServerLoad } from "./$types";
import { getCardBySlug } from "$lib/server/database";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, url }) => {
    const data = await getCardBySlug(params.slug);

    if (!data) {
        throw error(404, "Картичката не е намерена.");
    }

    return {
        ...data,
        cardPageUrl: `${url.origin}/card/${params.slug}`,
    };
};
