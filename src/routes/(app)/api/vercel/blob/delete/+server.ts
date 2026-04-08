import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validateAdminAuth } from "$lib/server/adminAuth";
import { VercelStorageController } from "$lib/controller/VercelStorage";
import { z } from "zod";

const deleteBodySchema = z.object({ url: z.string().min(1).trim() });

function errorResponse(message: string, status: number) {
    return json({ success: false, message }, { status });
}

export const POST: RequestHandler = async ({ request }) => {
    const authResponse = validateAdminAuth(request);
    if (authResponse) return authResponse;

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
        return errorResponse("Content-Type must be application/json", 400);
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return errorResponse("Invalid JSON body", 400);
    }

    const parsed = deleteBodySchema.safeParse(body);
    if (!parsed.success) {
        return errorResponse("Missing or invalid url", 400);
    }

    try {
        await VercelStorageController.deleteByUrl(parsed.data.url);
        return json({ success: true, message: "Blob deleted" });
    } catch (err) {
        console.error("Blob delete error", err);
        return errorResponse("Failed to delete blob", 500);
    }
};
