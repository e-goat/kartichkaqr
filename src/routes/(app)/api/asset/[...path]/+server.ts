import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { VercelStorageController } from "$lib/controller/VercelStorage";

const PASSTHROUGH_HEADERS = [
    "content-type",
    "content-length",
    "etag",
    "last-modified",
    "accept-ranges",
] as const;

/**
 * Blob pathnames in this app are UUIDed per upload and never overwritten,
 * so an asset at a given URL is content-addressable. We instruct browsers
 * and intermediaries to cache aggressively; cache busting happens via the
 * `?v=` query param attached by `toAssetProxyUrl`, which changes whenever
 * the DB row points at a different blob.
 */
const IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";

export const GET: RequestHandler = async ({ params, url }) => {
    const path = params.path?.trim();
    if (!path) throw error(400, "Missing asset path");

    let result;
    try {
        result = await VercelStorageController.getAsset(path);
    } catch (err) {
        console.error("Asset fetch failed", err);
        throw error(500, "Failed to fetch asset");
    }

    if (!result) throw error(404, "Asset not found");

    const headers = new Headers();
    for (const name of PASSTHROUGH_HEADERS) {
        const value = result.headers.get(name);
        if (value) headers.set(name, value);
    }

    // Only treat the response as immutable when the caller passes the version
    // param; otherwise fall back to a short cache so a bare `/api/asset/<path>`
    // hit can still pick up a re-uploaded blob without sticky browser caching.
    const hasVersion = url.searchParams.has("v");
    headers.set(
        "cache-control",
        hasVersion
            ? IMMUTABLE_CACHE_CONTROL
            : (result.headers.get("cache-control") ?? "public, max-age=300"),
    );

    return new Response(result.stream, {
        status: result.status || 200,
        headers,
    });
};
