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

export default appConfig;
