/** Only allow same-site relative paths as post-auth redirect targets. */
export function safeRedirectTarget(value: string | null, fallback = "/") {
    if (!value || !value.startsWith("/") || value.startsWith("//")) {
        return fallback;
    }
    return value;
}
