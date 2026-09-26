import { APP_ENV } from "$env/static/private";
import {
    BLOB_DEV_READ_WRITE_TOKEN,
    BLOB_PROD_READ_WRITE_TOKEN,
} from "$lib/server/secrets";

const env = APP_ENV;

const appConfig = {
    env,
    blob:
        env === "development"
            ? BLOB_DEV_READ_WRITE_TOKEN
            : BLOB_PROD_READ_WRITE_TOKEN,
};

/**
 * Tokens look like `vercel_blob_rw_<storeId>_<secret>` and blob URLs like
 * `https://<storeid>.private.blob.vercel-storage.com/...`, so an existing
 * blob's store can be matched to the token that can access it.
 */
const TOKENS_BY_STORE = new Map(
    [BLOB_DEV_READ_WRITE_TOKEN, BLOB_PROD_READ_WRITE_TOKEN]
        .filter((t): t is string => !!t)
        .map((t) => [t.split("_")[3]?.toLowerCase(), t] as const),
);

/**
 * Token for reading or deleting an existing blob. Local dev and the preview
 * share a database but not a blob store, so a card's files may live in the
 * store other than the one `APP_ENV` selects. New uploads always go to
 * `appConfig.blob`. Pathnames use that token too. Throws for a URL in a
 * store this environment has no token for, since any other token would
 * just get a 403.
 */
export function blobTokenForUrl(pathnameOrUrl: string): string | undefined {
    let storeId: string;
    try {
        storeId = new URL(pathnameOrUrl).hostname.split(".")[0];
    } catch {
        return appConfig.blob;
    }
    const token = TOKENS_BY_STORE.get(storeId);
    if (!token) {
        throw new Error(`No blob token configured for store "${storeId}"`);
    }
    return token;
}

export default appConfig;
