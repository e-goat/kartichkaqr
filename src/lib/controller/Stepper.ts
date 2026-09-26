import { ss, pcs } from "$lib/state.svelte";
import { STEP } from "$lib/config/steps";
import { generateImage } from "$lib/controller/AiImage";
import { error } from "@sveltejs/kit";
import {
    validateStep,
    validatePhysicalCopy,
    type ValidationResult,
} from "$lib/utils/validation";

export interface StepperEventResult {
    success: boolean;
    validationResult?: ValidationResult;
    errorMessage?: string;
}

export async function defineStepperEvent(
    stepEvent: string,
    steps: number,
    initialStep: number,
): Promise<StepperEventResult> {
    switch (stepEvent) {
        case "next": {
            // Validate current step before proceeding
            const validationResult = validateStep(ss.currentStep);

            if (!validationResult.success) {
                return {
                    success: false,
                    validationResult,
                    errorMessage:
                        validationResult.errorMessage ||
                        "Моля, попълнете всички задължителни полета правилно.",
                };
            }

            // Start generating as soon as the prompt is valid; the Design
            // step shows progress. Unchanged prompts are not re-sent.
            if (ss.currentStep === STEP.PROMPT) {
                void generateImage();
            }

            // Only proceed if validation passes
            if (!(ss.currentStep == steps)) {
                ss.currentStep += 1;
            }
            return { success: true };
        }

        case "prev":
            // No validation needed for going back
            if (ss.currentStep != initialStep) {
                ss.currentStep -= 1;
            }
            return { success: true };

        case "submit": {
            // Validate current step before submission
            const finalValidation = validateStep(ss.currentStep);
            if (!finalValidation.success) {
                return {
                    success: false,
                    validationResult: finalValidation,
                    errorMessage:
                        finalValidation.errorMessage ||
                        "Моля, попълнете всички задължителни полета правилно.",
                };
            }

            // Validate physical copy if requested (Review step)
            if (ss.currentStep === STEP.REVIEW && pcs.requested) {
                const physicalCopyValidation = validatePhysicalCopy({
                    name: pcs.name,
                    email: pcs.email,
                    phone: pcs.phone,
                    address: pcs.address,
                    comment: pcs.comment,
                    requested: true,
                });

                if (!physicalCopyValidation.success) {
                    return {
                        success: false,
                        validationResult: physicalCopyValidation,
                        errorMessage:
                            physicalCopyValidation.errorMessage ||
                            "Моля, попълнете всички полета за физическа копия правилно.",
                    };
                }
            }

            return { success: true };
        }

        default:
            error(406, `Wrong event: ${stepEvent}`);
    }
}
