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

export const DEFAULT_CARD_STYLE = {
    titleFont: "PlayfairDisplay",
    titleFontSize: TITLE_FONT_SIZE.default,
    titleColor: "#ffffff",
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
