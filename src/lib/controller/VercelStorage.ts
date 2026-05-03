import { put, del, get } from "@vercel/blob";
import type { PutBlobResult } from "@vercel/blob";
import appConfig from "$lib/config/app";

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

            const result = await put(`${uuid}.${mimeType}`, file, {
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

    /** Delete a blob by its URL (from store/storeWithCategory). */
    async deleteByUrl(url: string): Promise<void> {
        if (!url?.trim()) throw new Error("Missing url");
        await del([url], { token: BLOB_SECRET });
    }

    /**
     * Fetch a private blob by its URL (or pathname). Returns the response
     * stream and metadata so callers can stream it back to the browser, or
     * `null` when the blob does not exist (404).
     *
     * Forward `ifNoneMatch` from the browser's `If-None-Match` header to get
     * a `304 Not Modified` response (no stream) when the blob is unchanged.
     *
     * The headers object comes from undici and is structurally compatible
     * with the standard Headers interface (has `get(name)`), so it's exposed
     * via a minimal contract rather than the full DOM Headers type.
     */
    async getAsset(
        pathnameOrUrl: string,
        options: { ifNoneMatch?: string } = {},
    ): Promise<{
        stream: ReadableStream | null;
        headers: { get(name: string): string | null };
        status: number;
    } | null> {
        if (!pathnameOrUrl?.trim()) throw new Error("Missing pathname or url");
        if (!BLOB_SECRET) throw new Error("Missing vercel storage token");

        const result = await get(pathnameOrUrl, {
            access: "private",
            token: BLOB_SECRET,
            ifNoneMatch: options.ifNoneMatch,
        });

        if (!result) return null;

        return {
            stream: result.stream as unknown as ReadableStream | null,
            headers: result.headers,
            status: result.statusCode,
        };
    }
}

export const VercelStorageController = new VercelStorage();
