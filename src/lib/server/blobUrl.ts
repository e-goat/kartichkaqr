/**
 * Helpers for converting raw Vercel Blob URLs (private store, not directly
 * accessible by the browser) into proxy URLs that route through our own
 * `/api/asset` endpoint, which fetches the blob with the bearer token and
 * streams it back. Per Vercel docs there is no "unlocked URL" for a private
 * blob — the only ways to read it are `get()` from a server function or a
 * direct curl with the token. This proxy is the SDK route, packaged as a URL.
 */

const VERCEL_BLOB_HOST_SUFFIX = ".blob.vercel-storage.com";
const ASSET_PROXY_PATH = "/api/asset";

/**
 * Convert a Vercel Blob URL into a proxy URL the browser can use. The full
 * blob URL is passed through as the `u` query param; the proxy validates it
 * and fetches the blob server-side. Non-Vercel values (hex colors, legacy
 * paths, empty strings) pass through unchanged.
 */
export function toAssetProxyUrl(blobUrl: string): string;
export function toAssetProxyUrl(
    blobUrl: string | null | undefined,
): string | null;
export function toAssetProxyUrl(
    blobUrl: string | null | undefined,
): string | null {
    if (!blobUrl?.trim()) return blobUrl ?? null;

    let url: URL;
    try {
        url = new URL(blobUrl);
    } catch {
        return blobUrl;
    }

    if (!url.hostname.endsWith(VERCEL_BLOB_HOST_SUFFIX)) {
        return blobUrl;
    }

    const params = new URLSearchParams({ u: blobUrl });
    return `${ASSET_PROXY_PATH}?${params.toString()}`;
}

/**
 * Apply `toAssetProxyUrl` to selected fields on an object without mutating
 * the original. Useful for rewriting DB rows before they leave the server.
 */
export function rewriteAssetFields<T extends Record<string, unknown>>(
    row: T,
    fields: readonly (keyof T)[],
): T {
    const out = { ...row };
    for (const field of fields) {
        const value = out[field];
        if (typeof value === "string") {
            out[field] = toAssetProxyUrl(value) as T[keyof T];
        }
    }
    return out;
}
