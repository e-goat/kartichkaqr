import { put, del } from "@vercel/blob";
import type { PutBlobResult } from "@vercel/blob";
import { BLOB_READ_WRITE_TOKEN } from "$lib/server/secrets";

/** Derive file extension from mime type (e.g. image/png → png). If no "/", use value as extension. */
function extensionFromMimeType(mimeType: string): string {
    const slash = mimeType.indexOf("/");
    return slash >= 0 ? mimeType.slice(slash + 1).trim() : mimeType.trim();
}

class VercelStorage {
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

            if (!BLOB_READ_WRITE_TOKEN) {
                throw new Error("Missing vercel storage token");
            }

            const result = await put(`${uuid}.${mimeType}`, file, {
                access: "public",
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

            if (!BLOB_READ_WRITE_TOKEN) {
                throw new Error("Missing vercel storage token");
            }

            const result = await put(
                `${category}/${file.name}.${mimeType}`,
                file,
                {
                    access: "public",
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
        if (!BLOB_READ_WRITE_TOKEN)
            throw new Error("Missing vercel storage token");

        const ext = extensionFromMimeType(mimeType) || "bin";
        const uuid = crypto.randomUUID();
        const path = `${category}/${uuid}.${ext}`;

        const result = await put(path, file, { access: "public" });
        return result;
    }

    /** Delete a blob by its URL (from store/storeWithCategory). */
    async deleteByUrl(url: string): Promise<void> {
        if (!url?.trim()) throw new Error("Missing url");
        await del([url]);
    }
}

export const VercelStorageController = new VercelStorage();
