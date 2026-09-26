import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { VercelStorageController } from "$lib/controller/VercelStorage";
import { IMAGE_WIDTHS, type ImageFormat } from "$lib/utils/image";
import sharp from "sharp";

const PASSTHROUGH_HEADERS = [
    "content-type",
    "content-length",
    "content-range",
    "etag",
    "last-modified",
    "accept-ranges",
] as const;

const VERCEL_BLOB_HOST_SUFFIX = ".blob.vercel-storage.com";

const IMAGE_FORMATS: Record<ImageFormat, { mime: string; quality: number }> = {
    avif: { mime: "image/avif", quality: 55 },
    webp: { mime: "image/webp", quality: 72 },
};

// Template images are public and stored under unique names, so their
// resized variants can be cached by browsers and Vercel's CDN for a year.
const PUBLIC_IMMUTABLE =
    "public, max-age=31536000, s-maxage=31536000, immutable";

function isPublicAsset(blob: URL) {
    return blob.pathname.startsWith("/templates/");
}

/**
 * Resize (`w`, one of IMAGE_WIDTHS) and optionally re-encode (`f`: avif or
 * webp) an image blob. Without `f` the result is a JPEG (PNG only when the
 * image has transparency): universally supported, which is what social
 * crawlers expect for og:image, and far smaller than a re-encoded PNG.
 */
async function transformImage(
    blobUrl: string,
    blob: URL,
    w: string | null,
    f: string | null,
) {
    const width = w ? Number(w) : null;
    if (width !== null && !IMAGE_WIDTHS.includes(width as never)) {
        throw error(400, "Unsupported width");
    }
    if (f && !(f in IMAGE_FORMATS)) throw error(400, "Unsupported format");
    const format = f ? IMAGE_FORMATS[f as ImageFormat] : null;

    let result;
    try {
        result = await VercelStorageController.getAsset(blobUrl);
    } catch (err) {
        console.error("Asset fetch failed", err);
        throw error(500, "Failed to fetch asset");
    }
    if (!result?.stream) throw error(404, "Asset not found");

    const sourceType = result.headers.get("content-type") ?? "";
    if (!sourceType.startsWith("image/") || sourceType.includes("svg")) {
        throw error(400, "Not a raster image");
    }

    const source = Buffer.from(await new Response(result.stream).arrayBuffer());
    let pipeline = sharp(source).rotate();
    if (width) pipeline = pipeline.resize({ width, withoutEnlargement: true });
    let mime: string;
    if (format) {
        pipeline = pipeline.toFormat(f as ImageFormat, {
            quality: format.quality,
        });
        mime = format.mime;
    } else if ((await sharp(source).metadata()).hasAlpha) {
        pipeline = pipeline.png({ compressionLevel: 9, palette: true });
        mime = "image/png";
    } else {
        pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
        mime = "image/jpeg";
    }
    const data = await pipeline.toBuffer();

    return new Response(new Uint8Array(data), {
        headers: {
            "Content-Type": mime,
            "Content-Length": String(data.length),
            "Cache-Control": isPublicAsset(blob)
                ? PUBLIC_IMMUTABLE
                : "private, no-cache",
            "X-Content-Type-Options": "nosniff",
        },
    });
}

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
 *
 * With `w` and/or `f` the image is resized/re-encoded instead (see
 * `$lib/utils/image` for building those URLs).
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

    const w = url.searchParams.get("w");
    const f = url.searchParams.get("f");
    if (w || f) return transformImage(blobUrl, parsed, w, f);

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
