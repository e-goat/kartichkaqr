/** Only allow same-site relative paths as post-auth redirect targets. */
export function safeRedirectTarget(value: string | null, fallback = "/") {
    // "/\host" is treated like "//host" by browsers
    if (
        !value ||
        !value.startsWith("/") ||
        value.startsWith("//") ||
        value.startsWith("/\\")
    ) {
        return fallback;
    }
    return value;
}
