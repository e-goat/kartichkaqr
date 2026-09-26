import { put, del, get } from "@vercel/blob";
import type { PutBlobResult } from "@vercel/blob";
import appConfig, { blobTokenForUrl } from "$lib/config/app";

const BLOB_SECRET = appConfig.blob;

class VercelStorage {
    #extensionFromMimeType(mimeType: string): string {
        const slash = mimeType.indexOf("/");
        return slash >= 0 ? mimeType.slice(slash + 1).trim() : mimeType.trim();
    }

    async storeAudio({
        file,
        mimeType,
        uuid,
    }: {
        file: File;
        mimeType: string;
        uuid: string;
    }): Promise<PutBlobResult> {
        try {
            if (!file) {
                throw new Error("Missing file");
            }

            if (!mimeType) {
                throw new Error("Missing mime type");
            }

            if (!uuid) {
                throw new Error("Missing filename");
            }

            if (!BLOB_SECRET) {
                throw new Error("Missing vercel storage token");
            }

            const result = await put(`records/${uuid}.${mimeType}`, file, {
                access: "private",
                token: BLOB_SECRET,
            });

            console.log("Recording stored successfully", result);

            return result;
        } catch (error) {
            console.error("Recording storage failed", error);
            throw error;
        }
    }

    async storeTemplate({
        file,
        mimeType,
        category,
    }: {
        file: File;
        mimeType: string;
        category: string;
    }): Promise<PutBlobResult> {
        try {
            if (!file) {
                throw new Error("Missing file");
            }

            if (!mimeType) {
                throw new Error("Missing mime type");
            }

            if (!category) {
                throw new Error("Missing filename");
            }

            if (!BLOB_SECRET) {
                throw new Error("Missing vercel storage token");
            }
            console.log("SECRET", BLOB_SECRET);
            const result = await put(
                `${category}/${file.name}.${mimeType}`,
                file,
                {
                    access: "private",
                    token: BLOB_SECRET,
                },
            );

            console.log("Image stored successfully", result);

            return result;
        } catch (error) {
            console.error("Image storage failed", error);
            throw error;
        }
    }

    /**
     * Store a file under a category with a unique filename.
     * Path: `${category}/${uuid}.${ext}` where ext is derived from mimeType.
     */
    async storeWithCategory({
        file,
        mimeType,
        category,
    }: {
        file: File;
        mimeType: string;
        category: string;
    }): Promise<PutBlobResult> {
        if (!file) throw new Error("Missing file");
        if (!mimeType?.trim()) throw new Error("Missing mime type");
        if (!category?.trim()) throw new Error("Missing category");
        if (!BLOB_SECRET) throw new Error("Missing vercel storage token");

        const ext = this.#extensionFromMimeType(mimeType) || "bin";
        const uuid = crypto.randomUUID();
        const path = `${category}/${uuid}.${ext}`;

        const result = await put(path, file, {
            access: "private",
            token: BLOB_SECRET,
        });
        return result;
    }

    /**
     * Copy an AI-generated image into our store at `generated/{uuid}.{ext}`.
     * Generator URLs are temporary, so the card must reference our copy.
     * Only fal.ai media URLs are accepted, so this can't be used to make the
     * server fetch arbitrary addresses.
     */
    async storeGeneratedImage({
        sourceUrl,
        uuid,
    }: {
        sourceUrl: string;
        uuid: string;
    }): Promise<PutBlobResult> {
        if (!BLOB_SECRET) throw new Error("Missing vercel storage token");

        const url = new URL(sourceUrl);
        const trusted =
            url.protocol === "https:" &&
            (url.hostname === "fal.media" ||
                url.hostname.endsWith(".fal.media"));
        if (!trusted) throw new Error("Untrusted image source");

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Image download failed: ${res.status}`);
        const mimeType = res.headers.get("content-type") ?? "image/jpeg";
        if (!mimeType.startsWith("image/")) {
            throw new Error(`Unexpected image type: ${mimeType}`);
        }

        const ext = this.#extensionFromMimeType(mimeType) || "jpg";
        return put(`generated/${uuid}.${ext}`, await res.blob(), {
            access: "private",
            token: BLOB_SECRET,
            contentType: mimeType,
        });
    }

    /**
     * Delete the blobs that belong to a single card: its generated image
     * (`generated/`) and voice recording (`records/`). Anything else, such as
     * a shared template background, is skipped so deleting a card can never
     * remove assets other cards depend on. Deleting a missing blob is a no-op,
     * so this is safe to retry.
     */
    async deleteCardAssets(urls: (string | null | undefined)[]): Promise<void> {
        const owned = urls.filter((u): u is string => {
            if (!u) return false;
            try {
                const { protocol, hostname, pathname } = new URL(u);
                return (
                    protocol === "https:" &&
                    hostname.endsWith(".blob.vercel-storage.com") &&
                    /^\/(generated|records)\//.test(pathname)
                );
            } catch {
                return false;
            }
        });
        // A token only works for its own store, so delete per store
        const byToken = new Map<string, string[]>();
        for (const u of owned) {
            const token = blobTokenForUrl(u);
            if (!token) throw new Error("Missing vercel storage token");
            byToken.set(token, [...(byToken.get(token) ?? []), u]);
        }
        for (const [token, group] of byToken) {
            await del(group, { token });
        }
    }

    /** Delete a blob by its URL (from store/storeWithCategory). */
    async deleteByUrl(url: string): Promise<void> {
        if (!url?.trim()) throw new Error("Missing url");
        await del([url], { token: blobTokenForUrl(url) });
    }

    /**
     * Fetch a private blob by its URL (or pathname). Returns the response
     * stream and metadata so callers can stream it back to the browser, or
     * `null` when the blob does not exist (404).
     *
     * Forward `ifNoneMatch` from the browser's `If-None-Match` header to get
     * a `304 Not Modified` response (no stream) when the blob is unchanged.
     *
     * Forward `range` from the browser's `Range` header to get a `206 Partial
     * Content` response — required for Safari to play audio. The SDK passes it
     * as a low-level fetch header override. A 206 response has `response.ok`
     * true so the SDK streams it normally; we detect it via the `Content-Range`
     * response header and surface the correct status code to the caller.
     *
     * The headers object comes from undici and is structurally compatible
     * with the standard Headers interface (has `get(name)`), so it's exposed
     * via a minimal contract rather than the full DOM Headers type.
     */
    async getAsset(
        pathnameOrUrl: string,
        options: { ifNoneMatch?: string; range?: string } = {},
    ): Promise<{
        stream: ReadableStream | null;
        headers: { get(name: string): string | null };
        status: number;
    } | null> {
        if (!pathnameOrUrl?.trim()) throw new Error("Missing pathname or url");
        const token = blobTokenForUrl(pathnameOrUrl);
        if (!token) throw new Error("Missing vercel storage token");

        const result = await get(pathnameOrUrl, {
            access: "private",
            token,
            ifNoneMatch: options.ifNoneMatch,
            headers: options.range ? { Range: options.range } : undefined,
        });

        if (!result) return null;

        const isPartial = !!result.headers.get("content-range");
        const status = result.statusCode === 304 ? 304 : isPartial ? 206 : 200;

        return {
            stream: result.stream as unknown as ReadableStream | null,
            headers: result.headers,
            status,
        };
    }
}

export const VercelStorageController = new VercelStorage();
