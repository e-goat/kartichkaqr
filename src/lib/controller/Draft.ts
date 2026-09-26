import { ai } from "$lib/state.svelte";

// sessionStorage: survives reloads and the sign-in redirect, not new tabs
const KEY = "kartichka:draft";

type Draft = { prompt: string; categoryId: number | null };

export function saveDraft(draft: Draft) {
    try {
        if (draft.prompt || draft.categoryId) {
            sessionStorage.setItem(KEY, JSON.stringify(draft));
        } else {
            sessionStorage.removeItem(KEY);
        }
    } catch {
        // Storage unavailable (private mode, quota); the draft just isn't kept
    }
}

/** Refills the Prompt step from the saved draft, without overwriting input. */
export function restoreDraft() {
    try {
        const draft = JSON.parse(
            sessionStorage.getItem(KEY) ?? "null",
        ) as Draft | null;
        if (!draft) return;
        if (!ai.prompt && typeof draft.prompt === "string") {
            ai.prompt = draft.prompt;
        }
        if (ai.categoryId === null && typeof draft.categoryId === "number") {
            ai.categoryId = draft.categoryId;
        }
    } catch {
        // Ignore unreadable drafts
    }
}

export function clearDraft() {
    try {
        sessionStorage.removeItem(KEY);
    } catch {
        // ignore
    }
}
