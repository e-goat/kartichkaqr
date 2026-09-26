import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// Card creation now lives on the home page.
export const load: PageServerLoad = () => {
    redirect(301, "/");
};
