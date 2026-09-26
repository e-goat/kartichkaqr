import { z } from "zod";
import {
    AI_PROMPT_MAX_LENGTH,
    CARD_FONT_KEYS,
    DESCRIPTION_FONT_SIZE,
    TITLE_FONT_SIZE,
} from "$lib/config/card";

/**
 * Validation schema for Step 1 (Prompt) - AI image idea
 */
export const aiPromptStepSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(3, "Опишете идеята си с поне няколко думи")
        .max(
            AI_PROMPT_MAX_LENGTH,
            `Идеята не може да бъде повече от ${AI_PROMPT_MAX_LENGTH} символа`,
        ),
});

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Невалиден цвят");

/**
 * Per-card typography (validated on the client and in the create action)
 */
export const cardStyleSchema = z.object({
    titleFont: z.enum(CARD_FONT_KEYS, "Невалиден шрифт"),
    titleFontSize: z
        .number()
        .int()
        .min(TITLE_FONT_SIZE.min)
        .max(TITLE_FONT_SIZE.max),
    titleColor: hexColor,
    descriptionFont: z.enum(CARD_FONT_KEYS, "Невалиден шрифт"),
    descriptionFontSize: z
        .number()
        .int()
        .min(DESCRIPTION_FONT_SIZE.min)
        .max(DESCRIPTION_FONT_SIZE.max),
    descriptionColor: hexColor,
});

/**
 * Validation schema for Step 1 (Intro) - Basic card information
 */
export const introStepSchema = z.object({
    title: z
        .string()
        .min(1, "Заглавието е задължително")
        .max(100, "Заглавието не може да бъде повече от 100 символа")
        .trim(),
    sender: z
        .string()
        .max(100, "Вашето име не може да бъде повече от 100 символа")
        .trim()
        .optional()
        .default(""),
    description: z
        .string()
        .max(500, "Описанието не може да бъде повече от 500 символа")
        .trim()
        .optional()
        .default(""),
});

/**
 * Validation schema for Step 2 (Design) - AI image or template selection
 */
export const designStepSchema = z
    .object({
        templateId: z.number().int().nonnegative(),
        backgroundUrl: z.string().url().nullable(),
    })
    .refine((d) => d.templateId > 0 || !!d.backgroundUrl, {
        message: "Моля, генерирайте изображение или изберете шаблон",
        path: ["templateId"],
    });

/**
 * Validation schema for Step 3 (Record) - Audio recording (optional)
 */
export const recordStepSchema = z.object({
    audioUrl: z.string().url().nullable().optional(),
});

/**
 * Validation schema for Step 4 (Review) - Physical copy request (optional)
 */
export const physicalCopySchema = z.object({
    name: z
        .string()
        .min(1, "Име е задължително")
        .max(100, "Име не може да бъде повече от 100 символа")
        .trim()
        .optional(),
    email: z
        .string()
        .email("Невалиден имейл адрес")
        .max(255, "Имейл адресът не може да бъде повече от 255 символа")
        .trim()
        .optional(),
    phone: z
        .string()
        .regex(
            /^\+?[0-9\s\-()]+$/,
            "Невалиден телефонен номер. Използвайте само цифри, +, -, () и интервали",
        )
        .min(5, "Телефонният номер трябва да бъде поне 5 символа")
        .max(20, "Телефонният номер не може да бъде повече от 20 символа")
        .trim()
        .optional(),
    address: z
        .string()
        .min(1, "Адрес до офис на доставчик е задължителен")
        .max(200, "Адресът не може да бъде повече от 200 символа")
        .trim()
        .optional(),
    comment: z
        .string()
        .max(500, "Коментарът не може да бъде повече от 500 символа")
        .trim()
        .optional()
        .default(""),
});

export const completeCardSchema = introStepSchema.extend({
    designStepSchema,
    recordStepSchema,
});

export type AiPromptStepData = z.infer<typeof aiPromptStepSchema>;
export type CardStyleData = z.infer<typeof cardStyleSchema>;
export type CardInfoStepSchema = z.infer<typeof introStepSchema>;
export type DesignStepData = z.infer<typeof designStepSchema>;
export type RecordStepData = z.infer<typeof recordStepSchema>;
export type PhysicalCopyData = z.infer<typeof physicalCopySchema>;
export type CompleteCardData = z.infer<typeof completeCardSchema>;
