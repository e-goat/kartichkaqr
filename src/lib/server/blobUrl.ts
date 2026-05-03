/**
 * Helpers for converting raw Vercel Blob URLs (private store, not directly
 * accessible by the browser) into proxy URLs that route through our own
 * `/api/asset/[...path]` endpoint.
 */

import { createHash } from "node:crypto";

const VERCEL_BLOB_HOST_SUFFIX = ".blob.vercel-storage.com";
const ASSET_PROXY_PREFIX = "/api/asset/";

/**
 * Per Vercel docs, append a `?v=<version>` query param to blob URLs so that
 * browser/CDN caches refresh when the underlying content changes. We derive
 * the version deterministically from the pathname: blobs in this app use
 * UUIDed paths and are never overwritten, so the hash is stable per blob and
 * naturally bumps when the DB row points at a new upload.
 */
function versionFromPath(pathname: string): string {
    return createHash("sha1").update(pathname).digest("base64url").slice(0, 10);
}

/**
 * Convert a Vercel Blob URL into a proxy URL that streams the asset through
 * our server. Non-Vercel URLs (e.g. legacy paths or hex colors) pass through
 * unchanged.
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

    const pathname = url.pathname.replace(/^\//, "");
    return `${ASSET_PROXY_PREFIX}${pathname}?v=${versionFromPath(pathname)}`;
}

/**
 * Apply `toAssetProxyUrl` to selected fields on an object without mutating the
 * original. Useful for rewriting DB rows before they leave the server.
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
