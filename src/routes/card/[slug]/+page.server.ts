import type { PageServerLoad } from "./$types";
import { getCardBySlug } from "$lib/server/database";

export const load: PageServerLoad = async ({ params, url }) => {
    const data = await getCardBySlug(params.slug);
    if (!data) return null;
    return {
        ...data,
        cardPageUrl: `${url.origin}/card/${params.slug}`,
    };
};
