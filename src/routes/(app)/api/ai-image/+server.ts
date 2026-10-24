import { error, json } from "@sveltejs/kit";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import * as db from "$lib/server/database";
import {
    planImage,
    renderImage,
    CategoryMismatchError,
    TextInImageError,
} from "$lib/server/ai";
import { AI_PROMPT_MAX_LENGTH } from "$lib/config/card";
import type { RequestHandler } from "./$types";

const bodySchema = z.object({
    prompt: z.string().trim().min(3).max(AI_PROMPT_MAX_LENGTH),
    categoryId: z.number().int().positive().nullable(),
    enhance: z.boolean(),
});

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) error(401, "Влезте, за да генерирате изображение.");

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) error(400, "Невалидна заявка.");
    const { prompt, categoryId, enhance } = parsed.data;

    const categories = await db.getAllCategories();
    const fixedCategory = categoryId
        ? (categories.find((c) => c.id === categoryId) ?? null)
        : null;
    if (categoryId && !fixedCategory) error(400, "Непозната категория.");

    try {
        const plan = await planImage({
            prompt,
            categories,
            fixedCategory,
            enhance,
        });
        const { category } = plan;
        const imageUrl = await renderImage(plan.prompt);
        // The visual-only English prompt is internal; only show it to the
        // user as an "improved prompt" when they asked for enhancement.
        const imagePrompt = enhance ? plan.prompt : prompt;

        return json({
            imageUrl,
            imagePrompt,
            category: { id: category.id, name: category.name },
        });
    } catch (e) {
        if (e instanceof CategoryMismatchError) {
            error(422, "Не успяхме да определим категория. Изберете ръчно.");
        }
        if (e instanceof TextInImageError) {
            error(
                502,
                "Не успяхме да генерираме изображение без текст. Опитайте отново.",
            );
        }
        if (e instanceof Anthropic.RateLimitError) {
            error(429, "Твърде много заявки. Опитайте след малко.");
        }
        if (e instanceof Anthropic.APIError) {
            console.error("Claude API error", e.status, e.message);
            error(502, "AI услугата не е достъпна в момента.");
        }
        console.error("AI image error", e);
        error(502, "Генерирането на изображение не успя.");
    }
};
