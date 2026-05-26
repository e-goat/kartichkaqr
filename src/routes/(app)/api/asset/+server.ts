import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { VercelStorageController } from "$lib/controller/VercelStorage";

const PASSTHROUGH_HEADERS = [
    "content-type",
    "content-length",
    "content-range",
    "etag",
    "last-modified",
    "accept-ranges",
] as const;

const VERCEL_BLOB_HOST_SUFFIX = ".blob.vercel-storage.com";

/**
 * Proxy a private Vercel Blob URL to the browser. The blob URL is passed
 * through the `u` query param and validated to belong to a Vercel Blob store
 * (so this endpoint cannot be coerced into fetching arbitrary URLs). The
 * blob is fetched server-side with the read/write token and streamed back.
 *
 * Per Vercel's private storage guidance, responses use
 * `Cache-Control: private, no-cache` so browsers cache locally but always
 * revalidate; we forward the browser's `If-None-Match` and pass through any
 * `304 Not Modified` so unchanged blobs aren't re-downloaded.
 */
export const GET: RequestHandler = async ({ url, request }) => {
    const blobUrl = url.searchParams.get("u");
    if (!blobUrl) throw error(400, "Missing url");

    let parsed: URL;
    try {
        parsed = new URL(blobUrl);
    } catch {
        throw error(400, "Invalid url");
    }
    if (!parsed.hostname.endsWith(VERCEL_BLOB_HOST_SUFFIX)) {
        throw error(400, "Url must point to a Vercel Blob store");
    }

    const ifNoneMatch = request.headers.get("if-none-match") ?? undefined;
    const range = request.headers.get("range") ?? undefined;

    let result;
    try {
        result = await VercelStorageController.getAsset(blobUrl, {
            ifNoneMatch,
            range,
        });
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
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "private, no-cache");
    headers.set("X-Content-Type-Options", "nosniff");

    if (result.status === 304) {
        return new Response(null, { status: 304, headers });
    }

    return new Response(result.stream, {
        status: result.status || 200,
        headers,
    });
};
