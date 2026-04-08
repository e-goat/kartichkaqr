import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, request }) => {
    const formData = await request.formData();
    const consent = formData.get("consent") as string;

    if (consent === "accepted") {
        cookies.set("cookieConsent", "accepted", {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365, // 1 year
        });
    }

    return json({ success: true });
};
