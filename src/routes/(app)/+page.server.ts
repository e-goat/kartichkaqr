import type { PageServerLoad } from "./$types";
import * as db from "$lib/server/database";
import { rewriteAssetFields } from "$lib/server/blobUrl";

const SHOWCASE_SIZE = 8;

export const load: PageServerLoad = async () => {
    const [showcase, categories] = await Promise.all([
        db.getShowcaseTemplates(SHOWCASE_SIZE),
        db.getCategoriesWithTemplateCount(),
    ]);
    return {
        showcase: showcase.map((t) =>
            rewriteAssetFields(t, ["background", "backgroundBack"]),
        ),
        categories: categories.map((c) => ({
            id: c.id,
            name: c.name,
            templates: c._count.templates,
        })),
    };
};
