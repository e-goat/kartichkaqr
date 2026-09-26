import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
    const cookieConsent = cookies.get("cookieConsent");

    return {
        cookieConsent: cookieConsent === "accepted",
        user: locals.user
            ? { name: locals.user.name, email: locals.user.email }
            : null,
    };
};
