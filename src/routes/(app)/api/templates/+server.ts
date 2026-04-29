import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import * as db from "$lib/server/database";

export const GET: RequestHandler = async ({ url }) => {
    const limit = Math.min(Number(url.searchParams.get("limit")) || 9, 100);
    const skip = Number(url.searchParams.get("skip")) || 0;
    const categoryId = url.searchParams.get("categoryId");
    const currentPage = Math.floor(skip / limit) + 1;

    const result = categoryId
        ? await db.getAllTemplatesByCategory(limit, skip, Number(categoryId))
        : await db.getAllTemplates(limit, skip);

    return json({
        templates: result.templates,
        total: result.total,
        currentPage,
        pageSize: limit,
    });
};
