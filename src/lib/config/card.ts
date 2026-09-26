/**
 * Card typography options. Font keys must match the `--font-family-*` CSS
 * variables in app.css (and the Google Fonts loaded in app.html).
 */
export const CARD_FONTS = [
    { key: "PlayfairDisplay", label: "Playfair Display" },
    { key: "Montserrat", label: "Montserrat" },
    { key: "Roboto", label: "Roboto" },
    { key: "Lora", label: "Lora" },
    { key: "Merriweather", label: "Merriweather" },
    { key: "CormorantGaramond", label: "Cormorant Garamond" },
    { key: "Cinzel", label: "Cinzel" },
    { key: "Raleway", label: "Raleway" },
    { key: "Poppins", label: "Poppins" },
    { key: "Nunito", label: "Nunito" },
    { key: "Quicksand", label: "Quicksand" },
    { key: "JosefinSans", label: "Josefin Sans" },
    { key: "Oswald", label: "Oswald" },
    { key: "BebasNeue", label: "Bebas Neue" },
    { key: "AbrilFatface", label: "Abril Fatface" },
    { key: "Lobster", label: "Lobster" },
    { key: "Pacifico", label: "Pacifico" },
    { key: "Caveat", label: "Caveat" },
    { key: "DancingScript", label: "Dancing Script" },
    { key: "GreatVibes", label: "Great Vibes" },
    { key: "Allura", label: "Allura" },
    { key: "AlexBrush", label: "Alex Brush" },
    { key: "Sacramento", label: "Sacramento" },
    { key: "Satisfy", label: "Satisfy" },
    { key: "Tangerine", label: "Tangerine" },
    { key: "PinyonScript", label: "Pinyon Script" },
    { key: "PermanentMarker", label: "Permanent Marker" },
    { key: "ChironSungHK", label: "Chiron Sung HK" },
] as const;

export const CARD_FONT_KEYS = CARD_FONTS.map((f) => f.key) as [
    string,
    ...string[],
];

/** Font sizes are in px relative to a 340px-wide card and scale with it. */
export const TITLE_FONT_SIZE = { min: 14, max: 64, default: 28 };
export const DESCRIPTION_FONT_SIZE = { min: 10, max: 28, default: 16 };

/** Title placements offered in the editor (a subset of the TitlePosition enum). */
export const TITLE_POSITIONS = ["top", "center", "bottom"] as const;
export type TitlePosition = (typeof TITLE_POSITIONS)[number];

/** Title rotation in whole degrees. */
export const TITLE_ROTATION = { min: -180, max: 180, default: 0 };

/** Narrows a stored/template position to one the editor supports. */
export function toTitlePosition(
    value: string | null | undefined,
): TitlePosition {
    return TITLE_POSITIONS.includes(value as TitlePosition)
        ? (value as TitlePosition)
        : "top";
}

/** Tailwind placement for a title overlay inside a `relative` card front. */
export function titlePlacementClass(pos: string): string {
    if (pos === "top") return "top-[6%]";
    if (pos === "bottom") return "bottom-[6%]";
    return "top-1/2 -translate-y-1/2";
}

export const DEFAULT_CARD_STYLE: {
    titleFont: string;
    titleFontSize: number;
    titleColor: string;
    titlePos: TitlePosition;
    titleRotation: number;
    descriptionFont: string;
    descriptionFontSize: number;
    descriptionColor: string;
} = {
    titleFont: "PlayfairDisplay",
    titleFontSize: TITLE_FONT_SIZE.default,
    titleColor: "#ffffff",
    titlePos: "top",
    titleRotation: TITLE_ROTATION.default,
    descriptionFont: "Montserrat",
    descriptionFontSize: DESCRIPTION_FONT_SIZE.default,
    descriptionColor: "#1f2937",
};

export type CardStyle = typeof DEFAULT_CARD_STYLE;

/** Converts a px size (relative to 340px card width) to container query units. */
export function toCqw(px: number): string {
    return `${((px / 340) * 100).toFixed(2)}cqw`;
}

export const AI_PROMPT_MAX_LENGTH = 500;
