export const handle = async ({ event, resolve }) => {
    const response = await resolve(event);
    if (event.url.pathname.startsWith("/api/")) {
        response.headers.set("X-Robots-Tag", "noindex");
    }
    return response;
};
