import { ai, cs, ss, ts } from "$lib/state.svelte";

const ENHANCE_STORAGE_KEY = "kartichka:enhance-prompt";

/** "Enhance my prompt" is a per-browser preference, off by default. */
export function loadEnhancePreference() {
    ai.enhance = localStorage.getItem(ENHANCE_STORAGE_KEY) === "true";
}

export function saveEnhancePreference(value: boolean) {
    ai.enhance = value;
    localStorage.setItem(ENHANCE_STORAGE_KEY, String(value));
}

function requestKey() {
    return JSON.stringify([ai.prompt.trim(), ai.categoryId, ai.enhance]);
}

/**
 * Requests an image for the current prompt. Identical requests (same prompt,
 * category and enhance flag) are skipped unless `force` is set, so moving
 * back and forth between steps doesn't spend tokens or image credits.
 */
export async function generateImage({ force = false } = {}) {
    const key = requestKey();
    if (ai.generating) return;
    if (!force && ai.result && key === ai.lastRequestKey) return;

    ai.generating = true;
    ai.error = null;
    try {
        const res = await fetch("/api/ai-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: ai.prompt.trim(),
                categoryId: ai.categoryId,
                enhance: ai.enhance,
            }),
        });
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            throw new Error(body?.message ?? "Генерирането не успя.");
        }
        ai.result = await res.json();
        ai.lastRequestKey = key;
        // Don't override a template the user picked while this was running
        if (!cs.templateId) useAiImage();
    } catch (e) {
        ai.error = e instanceof Error ? e.message : String(e);
    } finally {
        ai.generating = false;
    }
}

/** Makes the generated image the card front. */
export function useAiImage() {
    if (!ai.result) return;
    cs.backgroundUrl = ai.result.imageUrl;
    cs.categoryId = ai.result.category.id;
    cs.prompt = ai.result.imagePrompt;
    cs.templateId = 0;
    ts.background = ai.result.imageUrl;
    ts.backgroundBack = "";
    delete ss.validationErrors.templateId;
}
