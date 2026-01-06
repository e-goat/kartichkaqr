import { z } from "zod";
import type { ZodType, ZodError } from "zod";
import { cs } from "$lib/state.svelte";
import {
    introStepSchema,
    designStepSchema,
    recordStepSchema,
    physicalCopySchema,
    type IntroStepData,
    type DesignStepData,
    type PhysicalCopyData,
} from "$lib/schemas/card.schema";

/**
 * Validation result type
 */
export interface ValidationResult {
    success: boolean;
    errors?: Record<string, string>;
    errorMessage?: string;
}

/**
 * Validate data against a Zod schema
 */
function validateSchema<T>(
    schema: ZodType<T>,
    data: unknown,
): ValidationResult {
    try {
        schema.parse(data);
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            error.issues.forEach((err) => {
                const path = err.path.join(".");
                errors[path] = err.message;
            });
            return {
                success: false,
                errors,
                errorMessage: error.issues[0]?.message || "Validation failed",
            };
        }
        return {
            success: false,
            errorMessage: "Validation failed",
        };
    }
}

/**
 * Validate Step 1 (Intro) data
 */
export function validateIntroStep(): ValidationResult {
    const data: IntroStepData = {
        receiver: cs.receiver,
        sender: cs.sender,
        title: cs.title,
        description: cs.description || "",
    };

    return validateSchema(introStepSchema, data);
}

/**
 * Validate Step 2 (Design) data
 */
export function validateDesignStep(): ValidationResult {
    const data: DesignStepData = {
        templateId: cs.templateId,
    };

    return validateSchema(designStepSchema, data);
}

/**
 * Validate Step 3 (Record) - Always valid as audio is optional
 */
export function validateRecordStep(): ValidationResult {
    // Audio recording is optional, so this step is always valid
    return { success: true };
}

/**
 * Validate Step 4 (Review) - Physical copy data if requested
 */
export function validatePhysicalCopy(
    physicalCopy: PhysicalCopyData & { requested?: boolean },
): ValidationResult {
    // Only validate if physical copy is requested
    if (!physicalCopy?.requested) {
        return { success: true };
    }

    // If requested, validate required fields
    const schema = z.object({
        name: z
            .string()
            .min(1, "Име е задължително")
            .max(100, "Име не може да бъде повече от 100 символа")
            .trim(),
        email: z
            .string()
            .email("Невалиден имейл адрес")
            .max(255, "Имейл адресът не може да бъде повече от 255 символа")
            .trim(),
        phone: z
            .string()
            .regex(
                /^\+?[0-9\s\-()]+$/,
                "Невалиден телефонен номер. Използвайте само цифри, +, -, () и интервали",
            )
            .min(5, "Телефонният номер трябва да бъде поне 5 символа")
            .max(20, "Телефонният номер не може да бъде повече от 20 символа")
            .trim(),
        address: z
            .string()
            .min(1, "Адрес до офис на доставчик е задължителен")
            .max(200, "Адресът не може да бъде повече от 200 символа")
            .trim(),
        comment: z.string().max(500).trim().optional().default(""),
    });

    return validateSchema(schema, physicalCopy);
}

/**
 * Validate a specific step by step number
 * @param stepNumber - The step number to validate
 * @param physicalCopyData - Optional physical copy data for step 4
 */
export function validateStep(
    stepNumber: number,
    physicalCopyData?: PhysicalCopyData & { requested?: boolean },
): ValidationResult {
    switch (stepNumber) {
        case 1:
            return validateIntroStep();
        case 2:
            return validateDesignStep();
        case 3:
            return validateRecordStep();
        case 4:
            // If physical copy is requested, validate it
            if (physicalCopyData?.requested) {
                return validatePhysicalCopy(physicalCopyData);
            }
            return { success: true };
        default:
            return { success: true };
    }
}

/**
 * Get field error message from validation result
 */
export function getFieldError(
    validationResult: ValidationResult,
    fieldName: string,
): string | undefined {
    return validationResult.errors?.[fieldName];
}

/**
 * Check if a field has an error
 */
export function hasFieldError(
    validationResult: ValidationResult,
    fieldName: string,
): boolean {
    return !!validationResult.errors?.[fieldName];
}
