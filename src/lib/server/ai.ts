import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { ANTHROPIC_API, FAL_KEY } from "$lib/server/secrets";

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API });

// Cheapest current Claude model; every call is a single stateless turn.
const MODEL = "claude-haiku-4-5";

type Category = { id: number; name: string };

/**
 * Things the artwork must never contain; the card's title and message are
 * rendered on top of it by the app. The fal.ai FLUX.1 [schnell] endpoint has
 * no negative_prompt input, so these are appended to the prompt as an
 * exclusion clause instead.
 */
export const NEGATIVE_PROMPT =
    "text, words, letters, signatures, watermarks, writing, typography, labels";

export class CategoryMismatchError extends Error {}

/**
 * One Claude call that does only the work that's needed:
 * - picks a category from `categories` when the user didn't choose one
 * - rewrites the prompt when `enhance` is on
 * Returns null when neither is needed (no API call is made).
 */
export async function planImage({
    prompt,
    categories,
    fixedCategory,
    enhance,
}: {
    prompt: string;
    categories: Category[];
    fixedCategory: Category | null;
    enhance: boolean;
}): Promise<{ category: Category; prompt: string } | null> {
    const needCategory = !fixedCategory;
    if (!needCategory && !enhance) return null;

    const names = categories.map((c) => c.name) as [string, ...string[]];
    const shape = {
        ...(needCategory ? { category: z.enum(names) } : {}),
        ...(enhance ? { prompt: z.string() } : {}),
    };
    const schema = z.object(shape);

    const tasks = [
        needCategory && `Pick the best category from: ${names.join(", ")}.`,
        enhance &&
            "Rewrite the idea as an English image prompt for greeting card background art. Describe only visual elements: subject, scene, background, art style, palette, lighting, composition with calm open space. Never mention or quote any text, words, names, letters, signs, banners or captions, even if the idea asks for them. Max 60 words.",
    ]
        .filter(Boolean)
        .join(" ");

    const ask = async (hint = "") => {
        const response = await anthropic.messages.parse({
            model: MODEL,
            max_tokens: enhance ? 256 : 32,
            system: tasks + hint,
            messages: [{ role: "user", content: prompt }],
            output_config: { format: zodOutputFormat(schema) },
        });
        if (response.stop_reason === "refusal") {
            throw new Error("The model declined this prompt");
        }
        return response.parsed_output as {
            category?: string;
            prompt?: string;
        } | null;
    };

    // Structured outputs already constrain `category` to the enum; this is
    // the server-side check before we trust it, with one corrective retry.
    let out = await ask();
    let category = needCategory
        ? categories.find((c) => c.name === out?.category)
        : fixedCategory!;
    if (!category) {
        out = await ask(` Answer with one exact name from the list.`);
        category = categories.find((c) => c.name === out?.category);
    }
    if (!category) {
        throw new CategoryMismatchError(
            `Model returned an unknown category: ${out?.category}`,
        );
    }

    return { category, prompt: out?.prompt?.trim() || prompt };
}

/** Renders background art with FLUX.1 [schnell] on fal.ai (~$0.003/image). */
export async function renderImage(prompt: string, category: Category) {
    const res = await fetch("https://fal.run/fal-ai/flux/schnell", {
        method: "POST",
        headers: {
            Authorization: `Key ${FAL_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt: `${prompt}. Text-free greeting card background artwork, occasion: ${category.name}, purely visual illustration. Exclude: ${NEGATIVE_PROMPT}.`,
            image_size: "portrait_4_3",
        }),
    });

    if (!res.ok) {
        throw new Error(`Image generation failed: ${await res.text()}`);
    }

    const data = await res.json();
    const url: string | undefined = data.images?.[0]?.url;
    if (!url) throw new Error("Image generation returned no image");
    return url;
}
