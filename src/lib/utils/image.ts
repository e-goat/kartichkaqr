/**
 * Responsive image URLs for blobs served through the `/api/asset` proxy,
 * which can resize (`w`) and re-encode (`f`) images. Any other src (static
 * imports, hex colors, external URLs) is returned unchanged.
 */

/** Widths the proxy accepts; keep in sync with the asset route. */
export const IMAGE_WIDTHS = [320, 480, 640, 960, 1200] as const;
export type ImageWidth = (typeof IMAGE_WIDTHS)[number];
export type ImageFormat = "avif" | "webp";

const PROXY_PREFIX = "/api/asset?";

export function isProxiedImage(src: string | null | undefined): src is string {
    return !!src?.startsWith(PROXY_PREFIX);
}

/** URL of `src` resized to `width`, optionally converted to `format`. */
export function imageUrl(
    src: string,
    width: ImageWidth,
    format?: ImageFormat,
): string {
    if (!isProxiedImage(src)) return src;
    const url = new URL(src, "http://x");
    url.searchParams.set("w", String(width));
    if (format) url.searchParams.set("f", format);
    return `${url.pathname}${url.search}`;
}

/** `srcset` for `src` in `format` (or the original format) at every width up to `max`. */
export function imageSrcset(
    src: string,
    format?: ImageFormat,
    max: ImageWidth = 1200,
): string | undefined {
    if (!isProxiedImage(src)) return undefined;
    return IMAGE_WIDTHS.filter((w) => w <= max)
        .map((w) => `${imageUrl(src, w, format)} ${w}w`)
        .join(", ");
}
