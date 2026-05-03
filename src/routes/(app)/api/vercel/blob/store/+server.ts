import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validateAdminAuth } from "$lib/server/adminAuth";
import { VercelStorageController } from "$lib/controller/VercelStorage";

function errorResponse(message: string, status: number) {
    return json({ success: false, message }, { status });
}

export const POST: RequestHandler = async ({ request }) => {
    const authResponse = validateAdminAuth(request);
    if (authResponse) return authResponse;

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
        return errorResponse("Content-Type must be multipart/form-data", 400);
    }

    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return errorResponse("Invalid form data", 400);
    }

    const category = formData.get("category");
    const file = formData.get("file");
    const mimeType = formData.get("mimeType");

    const categoryStr = typeof category === "string" ? category.trim() : "";
    const mimeTypeStr = typeof mimeType === "string" ? mimeType.trim() : "";

    if (!categoryStr) return errorResponse("Missing or invalid category", 400);
    if (!(file instanceof File) || file.size === 0)
        return errorResponse("Missing or invalid file", 400);
    if (!mimeTypeStr) return errorResponse("Missing or invalid mimeType", 400);

    try {
        const result = await VercelStorageController.storeWithCategory({
            file,
            mimeType: mimeTypeStr,
            category: categoryStr,
        });
        return json({
            success: true,
            message: "Blob stored",
            url: result.url,
        });
    } catch (err) {
        console.error("Blob store error", err);
        return errorResponse("Failed to store blob", 500);
    }
};
