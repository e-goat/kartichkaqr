import { z } from "zod";

/**
 * Validation schema for Step 1 (Intro) - Basic card information
 */
export const introStepSchema = z.object({
    receiver: z
        .string()
        .min(1, "Име на получателя е задължително")
        .max(100, "Име на получателя не може да бъде повече от 100 символа")
        .trim(),
    sender: z
        .string()
        .min(1, "Вашето име е задължително")
        .max(100, "Вашето име не може да бъде повече от 100 символа")
        .trim(),
    title: z
        .string()
        .min(1, "Заглавие е задължително")
        .max(200, "Заглавие не може да бъде повече от 200 символа")
        .trim(),
    description: z
        .string()
        .max(1024, "Описанието не може да бъде повече от 1024 символа")
        .trim()
        .optional()
        .default(""),
});

/**
 * Validation schema for Step 2 (Design) - Template selection
 */
export const designStepSchema = z.object({
    templateId: z
        .number()
        .int("ID на шаблона трябва да бъде цяло число")
        .positive("Моля, изберете шаблон за картичката"),
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
    comment: z
        .string()
        .max(500, "Коментарът не може да бъде повече от 500 символа")
        .trim()
        .optional()
        .default(""),
});

/**
 * Complete card validation schema (for final submission)
 */
export const completeCardSchema = introStepSchema
    .merge(designStepSchema)
    .merge(recordStepSchema);

/**
 * Type exports for TypeScript
 */
export type IntroStepData = z.infer<typeof introStepSchema>;
export type DesignStepData = z.infer<typeof designStepSchema>;
export type RecordStepData = z.infer<typeof recordStepSchema>;
export type PhysicalCopyData = z.infer<typeof physicalCopySchema>;
export type CompleteCardData = z.infer<typeof completeCardSchema>;
