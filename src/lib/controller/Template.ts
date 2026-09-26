import { cs, ss, ts } from "$lib/state.svelte";
import {
    CARD_FONT_KEYS,
    TITLE_FONT_SIZE,
    toTitlePosition,
} from "$lib/config/card";

/** Template shape returned by /api/templates and the home page showcase. */
export type Template = {
    id: number;
    title: string | null;
    description: string | null;
    background: string;
    backgroundBack: string;
    titlePos: string;
    titleFontSize: number;
    font: { id: number; name: string };
    fontColor?: string;
};

/** Makes `t` the card front (replacing any AI image). */
export function selectTemplate(t: Template) {
    cs.templateId = t.id;
    cs.backgroundUrl = null;
    cs.categoryId = null;
    cs.prompt = null;
    ts.background = t.background;
    ts.backgroundBack = t.backgroundBack;
    cs.titlePos = toTitlePosition(t.titlePos);

    // The template's title typography becomes the starting point for
    // the per-card style editor in the next step.
    if (CARD_FONT_KEYS.includes(t.font.name)) cs.titleFont = t.font.name;
    if (t.fontColor) cs.titleColor = t.fontColor;
    cs.titleFontSize = Math.min(
        TITLE_FONT_SIZE.max,
        Math.max(TITLE_FONT_SIZE.min, t.titleFontSize ?? 24),
    );

    const newTemplateTitle = t.title ?? "";
    const newTemplateDescription = t.description ?? "";

    // Update title/description if the user hasn't customized them
    // (empty or still matching the previous template's auto-populated value)
    if (!cs.title || cs.title === ts.templateTitle) {
        cs.title = newTemplateTitle;
    }
    if (!cs.description || cs.description === ts.templateDescription) {
        cs.description = newTemplateDescription;
    }

    ts.templateTitle = newTemplateTitle;
    ts.templateDescription = newTemplateDescription;

    // Clear validation error when template is selected
    if (cs.templateId > 0 && ss.validationErrors.templateId) {
        delete ss.validationErrors.templateId;
    }
}
