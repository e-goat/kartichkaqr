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
        const name = String(form.get("name") ?? "").trim();
        const email = String(form.get("email") ?? "").trim();
        const password = String(form.get("password") ?? "");

        if (!name || !email || password.length < 8) {
            return fail(400, {
                name,
                email,
                error: "Попълнете всички полета. Паролата трябва да е поне 8 символа.",
            });
        }

        try {
            await auth.api.signUpEmail({
                body: { name, email, password },
                headers: request.headers,
            });
        } catch (e) {
            if (e instanceof APIError) {
                return fail(400, {
                    name,
                    email,
                    error: e.body?.code?.startsWith("USER_ALREADY_EXISTS")
                        ? "Вече има профил с този имейл."
                        : "Регистрацията не успя. Опитайте отново.",
                });
            }
            console.error("Auth error", e);
            return fail(500, {
                name,
                email,
                error: "Регистрацията не успя. Опитайте отново по-късно.",
            });
        }

        redirect(303, safeRedirectTarget(url.searchParams.get("redirectTo")));
    },
};
