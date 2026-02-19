import QRCode from "qrcode";

/**
 * Generates a QR code data URL for a given string (typically a URL or slug).
 * @ref https://www.npmjs.com/package/qrcode
 */
export async function buildQR(url: string): Promise<string> {
    const opts = {
        errorCorrectionLevel: "H",
        type: "image/jpeg",
        quality: 0.3,
        margin: 1,
        width: 100,
    };

    return QRCode.toDataURL(url, opts);
}
