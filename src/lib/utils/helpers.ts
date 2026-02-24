import slug from "slug";

export function randomStringWithSpaces(length: number): string {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
    }
    return result;
}

export function randomBase64(length: number): string {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    while (result.length % 4 !== 0) {
        result += "=";
    }
    return result;
}

export function generateSlug(slugLength: number): string {
    const randomString = randomStringWithSpaces(slugLength);
    const slugified = slug(randomString, {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
    });
    return slugified;
}

export function generateCardUuid(): string {
    return randomStringWithSpaces(10).trim();
}

/**
 * Calculate the relative luminance of a color using WCAG formula
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Luminance value between 0 and 1
 */
export function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Get a contrasting text color (black or white) based on background color
 * @param bgColor - Background color in any CSS format (rgb, rgba, hex)
 * @returns 'black' or 'white' depending on which provides better contrast
 */
export function getContrastingColor(bgColor: string): string {
    // Handle rgba/rgb
    const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
        const [_, r, g, b] = rgbMatch.map(Number);
        const luminance = getLuminance(r, g, b);
        return luminance > 0.5 ? "black" : "white";
    }

    // Handle hex colors
    const hexMatch = bgColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (hexMatch) {
        const r = parseInt(hexMatch[1], 16);
        const g = parseInt(hexMatch[2], 16);
        const b = parseInt(hexMatch[3], 16);
        const luminance = getLuminance(r, g, b);
        return luminance > 0.5 ? "black" : "white";
    }

    // Default to white for images and unknown colors
    return "white";
}

/**
 * Extract RGB values from a background image by sampling the center pixel
 * Requires an HTMLElement with a background image
 * @param element - The HTML element with background image
 * @returns Promise that resolves to 'black' or 'white'
 */
export async function getContrastingColorFromImage(
    element: HTMLElement,
): Promise<string> {
    return new Promise((resolve) => {
        const bgImage = window.getComputedStyle(element).backgroundImage;
        const urlMatch = bgImage.match(/url\(['"]?(.+?)['"]?\)/);

        if (!urlMatch) {
            resolve("white");
            return;
        }

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                resolve("white");
                return;
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Sample center pixel
            const x = Math.floor(img.width / 2);
            const y = Math.floor(img.height / 2);
            const pixel = ctx.getImageData(x, y, 1, 1).data;

            const luminance = getLuminance(pixel[0], pixel[1], pixel[2]);
            resolve(luminance > 0.5 ? "black" : "white");
        };
        img.onerror = () => resolve("white");
        img.src = urlMatch[1];
    });
}

export function generateSecureRandomString(): string {
    // Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
    const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";

    // Generate 24 bytes = 192 bits of entropy.
    // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);

    let id = "";
    for (let i = 0; i < bytes.length; i++) {
        // >> 3 "removes" the right-most 3 bits of the byte
        id += alphabet[bytes[i] >> 3];
    }
    return id;
}

export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    let c = 0;
    for (let i = 0; i < a.byteLength; i++) {
        c |= a[i] ^ b[i];
    }
    return c === 0;
}
