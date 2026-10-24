import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { ANTHROPIC_API, FAL_KEY } from "$lib/server/secrets";

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API });

// Cheapest current Claude model; every call is a single stateless turn.
const MODEL = "claude-haiku-4-5";

type Category = { id: number; name: string };

export class CategoryMismatchError extends Error {}
export class TextInImageError extends Error {}

/**
 * Rules for the prompt FLUX sees. The card's title and message are rendered on
 * top of the artwork by the app, so the image must never contain lettering.
 * FLUX has no negative_prompt and its text encoder doesn't understand "no",
 * so naming text ("no words", "greeting card", "Happy Birthday") makes it draw
 * text. Instead the prompt only ever describes visual things.
 */
const VISUAL_RULES =
    "Write in English. Describe only visual elements: subject, scene, background, art style, palette, lighting. Never mention or quote any text, words, names, letters, numbers, signs, banners, captions, cards, posters or books, even if the idea asks for them; replace them with purely pictorial motifs. Do not use the words greeting, card, text or typography.";

const FAITHFUL =
    "Turn the idea into a short image prompt (max 40 words) that keeps the user's subject and mood without adding new elements.";

const ENHANCED =
    "Rewrite the idea as a rich image prompt (max 60 words) with a strong art style, palette, lighting and a composition with calm open space.";

/**
 * One Claude call that:
 * - turns the user's idea (often Bulgarian, often asking for a greeting) into
 *   a visual-only English prompt for FLUX — always, so no text leaks through
 * - picks a category from `categories` when the user didn't choose one
 * - embellishes the prompt when `enhance` is on
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
}): Promise<{ category: Category; prompt: string }> {
    const needCategory = !fixedCategory;

    const names = categories.map((c) => c.name) as [string, ...string[]];
    const schema = z.object({
        ...(needCategory ? { category: z.enum(names) } : {}),
        prompt: z.string(),
    });

    const system = [
        needCategory
            ? `Pick the best occasion category from: ${names.join(", ")}.`
            : `The occasion is: ${fixedCategory.name}.`,
        enhance ? ENHANCED : FAITHFUL,
        "Use motifs that suit the occasion.",
        VISUAL_RULES,
    ].join(" ");

    const ask = async (hint = "") => {
        const response = await anthropic.messages.parse({
            model: MODEL,
            max_tokens: 256,
            system: system + hint,
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
        : fixedCategory;
    if (!category) {
        out = await ask(` Answer with one exact category name from the list.`);
        category = categories.find((c) => c.name === out?.category);
    }
    if (!category) {
        throw new CategoryMismatchError(
            `Model returned an unknown category: ${out?.category}`,
        );
    }

    const visualPrompt = out?.prompt?.trim();
    if (!visualPrompt) throw new Error("The model returned no image prompt");
    return { category, prompt: visualPrompt };
}

/** Renders background art with FLUX.1 [schnell] on fal.ai (~$0.003/image). */
async function renderOnce(prompt: string) {
    const res = await fetch("https://fal.run/fal-ai/flux/schnell", {
        method: "POST",
        headers: {
            Authorization: `Key ${FAL_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // Positive phrasing only; see VISUAL_RULES.
            prompt: `${prompt}. Purely pictorial illustration, painterly artwork, clean unmarked surfaces.`,
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

/** Asks Claude whether the image shows any lettering. */
async function containsText(url: string) {
    const response = await anthropic.messages.parse({
        model: MODEL,
        max_tokens: 32,
        messages: [
            {
                role: "user",
                content: [
                    { type: "image", source: { type: "url", url } },
                    {
                        type: "text",
                        text: "Does this image contain any visible text, letters, numbers, words or letter-like glyphs, even small, partial or garbled?",
                    },
                ],
            },
        ],
        output_config: {
            format: zodOutputFormat(z.object({ hasText: z.boolean() })),
        },
    });
    // Treat an unparseable answer as "has text" so we never ship lettering.
    return response.parsed_output?.hasText ?? true;
}

const MAX_RENDER_ATTEMPTS = 3;

/**
 * Renders the image and rejects any result with lettering in it, retrying
 * with a new random seed. Throws TextInImageError if every attempt has text.
 */
export async function renderImage(prompt: string) {
    for (let attempt = 1; attempt <= MAX_RENDER_ATTEMPTS; attempt++) {
        const url = await renderOnce(prompt);
        if (!(await containsText(url))) return url;
        console.warn(`AI image attempt ${attempt} contained text, retrying`);
    }
    throw new TextInImageError("Every generated image contained text");
}
