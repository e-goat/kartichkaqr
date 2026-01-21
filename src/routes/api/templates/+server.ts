import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import * as db from "$lib/server/database";

export const GET: RequestHandler = async ({ url }) => {
    const limit = Math.min(Number(url.searchParams.get("limit")) || 10, 100);
    const skip = Number(url.searchParams.get("skip")) || 0;
    const type = url.searchParams.get("type") || "";
    const currentPage = Math.floor(skip / limit) + 1;

    const result = type
        ? await db.getAllTemplatesByType(limit, skip, type)
        : await db.getAllTemplates(limit, skip);

    return json({
        templates: result.templates,
        total: result.total,
        currentPage,
        pageSize: limit,
    });
};
