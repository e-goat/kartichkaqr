import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { building } from "$app/environment";
import { prisma } from "$lib/server/prisma";
import {
    BETTER_AUTH_SECRET,
    BETTER_AUTH_URL,
    VERCEL_ORIGINS,
} from "$lib/server/secrets";

export const auth = betterAuth({
    // SvelteKit imports this module while analysing the build, where secrets
    // aren't needed. At runtime a missing secret still makes better-auth throw.
    secret: building ? "build-time-placeholder" : BETTER_AUTH_SECRET,
    baseURL: BETTER_AUTH_URL,
    trustedOrigins: VERCEL_ORIGINS,
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
    },
    // Must stay last so it can set cookies from form actions.
    plugins: [sveltekitCookies(getRequestEvent)],
});
