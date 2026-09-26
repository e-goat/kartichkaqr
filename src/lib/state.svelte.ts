import { DEFAULT_CARD_STYLE, type TitlePosition } from "$lib/config/card";

// IN YOUR INTERFACE
//
interface CardState {
    title: string;
    sender: string;
    tel?: string | null;
    email?: string | null;
    description: string;
    templateId: number;
    slug: string;
    audioUrl: string | null;
    cardUuid: string;
    // Set when the front is an AI image (mutually exclusive with templateId)
    backgroundUrl: string | null;
    categoryId: number | null;
    prompt: string | null;
    // Per-card typography
    titleFont: string;
    titleFontSize: number;
    titleColor: string;
    titlePos: TitlePosition;
    titleRotation: number;
    descriptionFont: string;
    descriptionFontSize: number;
    descriptionColor: string;
}

interface AiState {
    prompt: string;
    // null = let Claude pick from the DB categories
    categoryId: number | null;
    enhance: boolean;
    generating: boolean;
    error: string | null;
    // prompt/category/enhance of the last request, to skip identical re-runs
    lastRequestKey: string | null;
    result: {
        imageUrl: string;
        imagePrompt: string;
        category: { id: number; name: string };
    } | null;
}

interface StepperState {
    initialStep: number;
    currentStep: number;
    finalStep: number;
    steps: number;
    isSubmitting: boolean;
    isRendering: boolean;
    validationErrors: Record<string, string>;
}

interface RecorderState {
    blob: Blob | null;
    finalTimeLeft: number | null;
}

interface TemplateColorCache {
    colors: Map<number, string>;
}

interface PhysicalCopyState {
    requested: boolean;
    name: string;
    email: string;
    phone: string;
    address: string;
    comment: string;
}

// I only care for those props
interface TemplateState {
    description: string;
    title: string;
    background: string;
    backgroundBack: string;
    templateDescription: string;
    templateTitle: string;
    designPage: number;
    designCategory: number | null;
}

// UNITED STATES
export const cs: CardState = $state({
    title: "",
    sender: "",
    description: "",
    templateId: 0,
    slug: "",
    audioUrl: null,
    cardUuid: "",
    backgroundUrl: null,
    categoryId: null,
    prompt: null,
    ...DEFAULT_CARD_STYLE,
});

export const ai: AiState = $state({
    prompt: "",
    categoryId: null,
    enhance: false,
    generating: false,
    error: null,
    lastRequestKey: null,
    result: null,
});

export const ss: StepperState = $state({
    initialStep: 0,
    currentStep: 0,
    finalStep: 0,
    steps: 0,
    isSubmitting: false,
    isRendering: false,
    validationErrors: {},
});

export const rs: RecorderState = $state({
    blob: null,
    finalTimeLeft: null,
});

export const tcc: TemplateColorCache = $state({
    colors: new Map(),
});

export const ts: TemplateState = $state({
    description: "",
    title: "",
    background: "",
    backgroundBack: "",
    templateDescription: "",
    templateTitle: "",
    designPage: 1,
    designCategory: null,
});

export const pcs: PhysicalCopyState = $state({
    requested: false,
    name: "",
    email: "",
    phone: "",
    address: "",
    comment: "",
});

// Well, you need this...
export function resetCardState() {
    cs.title = "";
    cs.sender = "";
    cs.description = "";
    cs.templateId = 0;
    cs.slug = "";
    cs.audioUrl = null;
    cs.cardUuid = "";
    cs.backgroundUrl = null;
    cs.categoryId = null;
    cs.prompt = null;
    Object.assign(cs, DEFAULT_CARD_STYLE);

    ts.background = "";
    ts.backgroundBack = "";
    ts.templateTitle = "";
    ts.templateDescription = "";

    // Keep ai.enhance: it's a saved preference, not per-card state
    ai.prompt = "";
    ai.categoryId = null;
    ai.generating = false;
    ai.error = null;
    ai.lastRequestKey = null;
    ai.result = null;

    ss.currentStep = 1;
    ss.isSubmitting = false;
    ss.validationErrors = {};

    rs.blob = null;
    rs.finalTimeLeft = null;

    pcs.requested = false;
    pcs.name = "";
    pcs.email = "";
    pcs.phone = "";
    pcs.address = "";
    pcs.comment = "";
}
