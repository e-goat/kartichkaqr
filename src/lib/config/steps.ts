/**
 * Card wizard steps (rendered by $lib/components/Stepper.svelte).
 * Data flow: PROMPT (ai.*) → DESIGN (AI image or template → cs.backgroundUrl /
 * cs.templateId, ts.*) → INFO (title/description + typography, live preview)
 * → RECORD (rs.blob → hidden `record` file input) → REVIEW (submit `cs`).
 */
export const STEP = {
    PROMPT: 1,
    DESIGN: 2,
    INFO: 3,
    RECORD: 4,
    REVIEW: 5,
} as const;

export const TOTAL_STEPS = 5;

export const STEP_LABELS = [
    "Идея",
    "Дизайн",
    "Текст и стил",
    "Гласов поздрав",
    "Преглед",
];
