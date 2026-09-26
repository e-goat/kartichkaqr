import type { PageServerLoad } from "./$types";
import { getCardBySlug } from "$lib/server/database";
import { toAssetProxyUrl } from "$lib/server/blobUrl";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, url }) => {
    const data = await getCardBySlug(params.slug);

    if (!data) {
        throw error(404, "Картичката не е намерена.");
    }

    const { template } = data;

    // Per-card values win; template values are the fallback (older cards
    // only have the template).
    const background =
        toAssetProxyUrl(data.backgroundUrl ?? template?.background) ?? "";
    const ogImageUrl = background.startsWith("http")
        ? background
        : `${url.origin}${background}`;

    return {
        title: data.title || template?.title || "",
        description: data.description || template?.description || "",
        sender: data.sender,
        audioUrl: toAssetProxyUrl(data.audioUrl),
        background,
        backgroundBack: toAssetProxyUrl(template?.backgroundBack) ?? "",
        titlePos: data.titlePos ?? template?.titlePos ?? "top",
        titleRotation: data.titleRotation,
        titleFont: data.titleFont ?? template?.font.name ?? "",
        titleFontSize: data.titleFontSize ?? template?.titleFontSize ?? 24,
        titleColor: data.titleColor ?? template?.fontColor ?? "#ffffff",
        descriptionFont: data.descriptionFont,
        descriptionFontSize: data.descriptionFontSize,
        descriptionColor: data.descriptionColor,
        cardPageUrl: `${url.origin}/card/${params.slug}`,
        ogImageUrl,
    };
};
