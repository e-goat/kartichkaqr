import { Storage } from "@google-cloud/storage";
import { GOOGLE_CLOUD_STORAGE_JSON } from "$lib/server/secrets";

class GoogleStorage {
    #storage: Storage;

    constructor() {
        this.#storage = new Storage({ credentials: GOOGLE_CLOUD_STORAGE_JSON });
    }

    async store({
        file,
        mimeType,
        uuid,
    }: {
        file: File;
        mimeType: string;
        uuid: string;
    }): Promise<void> {
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

            const buffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(buffer);

            await this.#storage
                .bucket("kartichkaqr_bucket_1")
                .file(uuid + "." + mimeType)
                .save(uint8Array);

            console.log("Recording stored successfully");
        } catch (error) {
            console.error("Recording storage failed", error);
            throw error;
        }
    }
}

export const GoogleStorageController = new GoogleStorage();
