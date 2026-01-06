import { ss } from "$lib/state.svelte";
import { error } from "@sveltejs/kit";
import { validateStep, type ValidationResult } from "$lib/utils/validation";

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
        case "next":
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

            // Only proceed if validation passes
            if (!(ss.currentStep == steps)) {
                ss.currentStep += 1;
            }
            return { success: true };

        case "prev":
            // No validation needed for going back
            if (ss.currentStep != initialStep) {
                ss.currentStep -= 1;
            }
            return { success: true };

        case "submit":
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
            // Note: Physical copy validation should be handled in Review component
            return { success: true };

        default:
            error(406, `Wrong event: ${stepEvent}`);
            return {
                success: false,
                errorMessage: `Wrong event: ${stepEvent}`,
            };
    }
}
