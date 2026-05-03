import { ADMIN_DASHBOARD_KEY } from "$lib/server/secrets";

/**
 * Validates the admin key from the request.
 * Reads from `Authorization: Bearer <key>` or `X-Admin-Key: <key>`.
 * @param request - The incoming request
 * @returns 401 Response if invalid or key missing; null if valid (proceed).
 */
export function validateAdminAuth(request: Request): Response | null {
    const key = getAdminKeyFromRequest(request);
    if (!ADMIN_DASHBOARD_KEY || key !== ADMIN_DASHBOARD_KEY) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Unauthorized Key: " + key,
                body: request.body,
            }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" },
            },
        );
    }
    return null;
}

function getAdminKeyFromRequest(request: Request): string | null {
    const auth = request.headers.get("Authorization");
    if (auth?.startsWith("Bearer ")) {
        return auth.slice(7).trim() || null;
    }
    const xKey = request.headers.get("X-Admin-Key");
    return xKey?.trim() ?? null;
}
