import { env } from "$env/dynamic/private";

export const RESEND_API_KEY = env.RESEND_API_KEY;

export const GOOGLE_CLOUD_STORAGE_JSON = {};

export const BLOB_PROD_READ_WRITE_TOKEN = env.BLOB_PROD_READ_WRITE_TOKEN;

export const BLOB_DEV_READ_WRITE_TOKEN = env.BLOB_DEV_READ_WRITE_TOKEN;

export const OPTIMIZE_API_KEY = env.OPTIMIZE_API_KEY;

export const ADMIN_EMAIL = env.ADMIN_EMAIL;

export const APP_EMAIL = env.APP_EMAIL;

export const APP_NAME = env.APP_NAME;

export const ADMIN_DASHBOARD_KEY = env.ADMIN_DASHBOARD_KEY;

export const APP_ENV = env.APP_ENV;

export const ANTHROPIC_API = env.ANTHROPIC_API;

export const FAL_KEY = env.FAL_KEY;

export const BETTER_AUTH_SECRET = env.BETTER_AUTH_SECRET;

// Vercel system env vars: the per-deployment URL and the stable branch alias.
// Used so preview deployments work without a hard-coded BETTER_AUTH_URL.
export const VERCEL_ORIGINS = [env.VERCEL_BRANCH_URL, env.VERCEL_URL]
    .filter(Boolean)
    .map((host) => `https://${host}`);

export const BETTER_AUTH_URL = env.BETTER_AUTH_URL || VERCEL_ORIGINS[0];
