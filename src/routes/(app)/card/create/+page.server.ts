import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// Card creation lives at /create; keep old links (and their query) working.
export const load: PageServerLoad = ({ url }) => {
    redirect(301, `/create${url.search}`);
};
