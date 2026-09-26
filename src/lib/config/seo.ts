/** Canonical production origin; canonical URLs always point here. */
export const SITE_URL = "https://kartichkaqr.com";
export const SITE_NAME = "KartichkaQR";

export const DEFAULT_DESCRIPTION =
    "Създайте персонализирана поздравителна картичка с AI дизайн и вашия глас. Изберете шаблон, запишете поздрав и споделете с QR код.";

/** Absolute canonical URL for a path (and optional query string). */
export function canonicalUrl(pathWithQuery: string): string {
    return new URL(pathWithQuery, SITE_URL).toString();
}

/**
 * Serializes JSON-LD for an inline <script>. `<` is escaped so values from
 * the database (template titles, category names) can't close the tag.
 */
export function jsonLd(data: unknown): string {
    return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Showcase template images are portrait 3:4; used for width/height hints. */
export const CARD_IMAGE = { width: 600, height: 800 };
