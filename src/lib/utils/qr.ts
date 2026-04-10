import QRCode from "qrcode";

/**
 * Generates a QR code data URL for a given string (typically a URL or slug).
 * @ref https://www.npmjs.com/package/qrcode
 */
export async function buildQR(
    url: string,
    qr_width: number = 24,
): Promise<string> {
    if (!url || typeof url !== "string") {
        throw new Error("Invalid URL for QR");
    }

    const opts = {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.3,
        margin: 1,
        width: qr_width,
    };

    return QRCode.toDataURL(url, opts);
}
