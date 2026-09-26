import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { building, dev } from "$app/environment";
import { prisma } from "$lib/server/prisma";
import {
    BETTER_AUTH_SECRET,
    BETTER_AUTH_URL,
    VERCEL_ORIGINS,
} from "$lib/server/secrets";

const DAY = 60 * 60 * 24;

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
    session: {
        // Sliding 30-day session: any request made after the session is a
        // day old pushes expiresAt (and the cookie's Max-Age) 30 days out,
        // so active users stay signed in; 30 idle days signs them out.
        expiresIn: 30 * DAY,
        updateAge: DAY,
    },
    advanced: {
        // Secure cookies (and the __Secure- prefix) everywhere except the
        // plain-http dev server.
        useSecureCookies: !dev,
        defaultCookieAttributes: {
            httpOnly: true,
            sameSite: "lax",
            secure: !dev,
            path: "/",
        },
    },
    // Must stay last so it can set cookies from form actions.
    plugins: [sveltekitCookies(getRequestEvent)],
});
