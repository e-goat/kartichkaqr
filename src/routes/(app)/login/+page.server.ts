import { fail, redirect } from "@sveltejs/kit";
import { APIError } from "better-auth/api";
import { auth } from "$lib/server/auth";
import { safeRedirectTarget } from "$lib/server/redirect";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals, url }) => {
    if (locals.user) {
        redirect(303, safeRedirectTarget(url.searchParams.get("redirectTo")));
    }
};

export const actions: Actions = {
    default: async ({ request, url }) => {
        const form = await request.formData();
        const email = String(form.get("email") ?? "").trim();
        const password = String(form.get("password") ?? "");

        if (!email || !password) {
            return fail(400, { email, error: "Въведете имейл и парола." });
        }

        try {
            await auth.api.signInEmail({
                body: { email, password },
                headers: request.headers,
            });
        } catch (e) {
            if (e instanceof APIError) {
                return fail(400, { email, error: "Грешен имейл или парола." });
            }
            console.error("Auth error", e);
            return fail(500, {
                email,
                error: "Входът не успя. Опитайте отново по-късно.",
            });
        }

        redirect(303, safeRedirectTarget(url.searchParams.get("redirectTo")));
    },
};
