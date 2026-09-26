import type { Handle } from "@sveltejs/kit";
import { building } from "$app/environment";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { auth } from "$lib/server/auth";

/** Template images are public showcase art that search engines may index. */
function isTemplateImage(url: URL) {
    if (url.pathname !== "/api/asset") return false;
    try {
        return new URL(url.searchParams.get("u") ?? "").pathname.startsWith(
            "/templates/",
        );
    } catch {
        return false;
    }
}

export const handle: Handle = async ({ event, resolve }) => {
    const session = await auth.api.getSession({
        headers: event.request.headers,
    });
    event.locals.user = session?.user ?? null;
    event.locals.session = session?.session ?? null;

    const response = await svelteKitHandler({ event, resolve, auth, building });
    if (event.url.pathname.startsWith("/api/") && !isTemplateImage(event.url)) {
        response.headers.set("X-Robots-Tag", "noindex");
    }
    return response;
};
