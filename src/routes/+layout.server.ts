import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
    const cookieConsent = cookies.get("cookieConsent");

    return {
        cookieConsent: cookieConsent === "accepted",
    };
};
