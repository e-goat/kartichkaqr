import type { Handle } from "@sveltejs/kit";
import { building } from "$app/environment";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { auth } from "$lib/server/auth";

export const handle: Handle = async ({ event, resolve }) => {
    const session = await auth.api.getSession({
        headers: event.request.headers,
    });
    event.locals.user = session?.user ?? null;
    event.locals.session = session?.session ?? null;

    const response = await svelteKitHandler({ event, resolve, auth, building });
    if (event.url.pathname.startsWith("/api/")) {
        response.headers.set("X-Robots-Tag", "noindex");
    }
    return response;
};
