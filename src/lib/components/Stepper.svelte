<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { defineStepperEvent } from "$lib/controller/Stepper";
    import { cs, ss } from "$lib/state.svelte";
    import Breadcrumb from "./stepper/Breadcrumb.svelte";
    import { enhance } from "$app/forms";
    import { onMount, onDestroy } from "svelte";
    import Swal from "sweetalert2";

    let { children, steps = 0, form } = $props();
    let initialStep: number = steps + 1 - steps;
    let globalErrorMessage = $state<string | null>(null);

    ss.currentStep = initialStep;
    ss.isRendering = false;
    ss.validationErrors = {};

    onMount(() => {
        ss.isRendering = true;
    });

    onDestroy(() => {
        ss.isRendering = false;
    });

    async function handleNext() {
        const result = await defineStepperEvent("next", steps, initialStep);

        if (!result.success) {
            if (result.validationResult?.errors) {
                ss.validationErrors = result.validationResult.errors;
            }
            if (result.errorMessage) {
                globalErrorMessage = result.errorMessage;
                await Swal.fire({
                    icon: "error",
                    title: "Грешка при валидация",
                    text: result.errorMessage,
                    confirmButtonText: "Разбрах",
                });
            }
        } else {
            ss.validationErrors = {};
            globalErrorMessage = null;
        }
    }

    async function handlePrev() {
        const result = await defineStepperEvent("prev", steps, initialStep);
        if (result.success) {
            ss.validationErrors = {};
            globalErrorMessage = null;
        }
    }

    async function handleSubmit() {
        const result = await defineStepperEvent("submit", steps, initialStep);

        if (!result.success) {
            if (result.validationResult?.errors) {
                ss.validationErrors = result.validationResult.errors;
            }
            if (result.errorMessage) {
                globalErrorMessage = result.errorMessage;
                await Swal.fire({
                    icon: "error",
                    title: "Грешка при валидация",
                    text: result.errorMessage,
                    confirmButtonText: "Разбрах",
                });
            }
            return false;
        }

        ss.validationErrors = {};
        globalErrorMessage = null;
        return true;
    }
</script>

<div
    class="px-px text-3xl font-medium max-w-[381px] text-zinc-800 mx-auto mb-6"
>
    <div class="flex flex-col justify-center">
        <div class="self-center" data-name="Създаване на картичка">
            Създаване на картичка
        </div>
        <img
            src="https://api.builder.io/api/v1/image/assets/4a0213629c3d4d16819d485544a6041f/fcdd06e83421f850362bbf1507002e7f74febf42?placeholderIfAbsent=true"
            class="object-contain mt-4 w-full aspect-[200]"
            alt="Card creation illustration"
        />
    </div>
</div>

<article class="shadow rounded-xl bg-white/70 w-full flex flex-col">
    <form
        id="step-form"
        method="POST"
        action="?/create"
        enctype="multipart/form-data"
        use:enhance
        class="flex flex-col"
    >
        <div class="p-8 flex flex-col min-h-[85vh]">
            <div class="mb-10">
                <Breadcrumb {steps} />
            </div>
            <div
                class="flex-1 overflow-y-auto flex items-center justify-center bg-custom-orange-200/5 p-5 rounded-xl border border-gray-300"
            >
                {@render children()}
            </div>
        </div>
        <div class="flex justify-between px-8 pb-8 flex-shrink-0">
            <Button
                ariaLabel="Предишна стъпка"
                text={"Назад"}
                clickEvent={handlePrev}
                disabled={ss.currentStep == initialStep}
                buttonType="button"
            />
            {#if ss.currentStep != steps}
                <Button
                    ariaLabel="Следваща стъпка"
                    text={"Напред"}
                    clickEvent={handleNext}
                    disabled={ss.currentStep == steps}
                    buttonType="button"
                />
            {:else}
                <input type="hidden" name="card" value={JSON.stringify(cs)} />
                <Button
                    ariaLabel="Бутон за запазване на картата"
                    text={"Запази"}
                    buttonType="submit"
                    loading={ss.isSubmitting}
                    clickEvent={async (e) => {
                        e.preventDefault();
                        const isValid = await handleSubmit();
                        if (isValid) {
                            const form = document.getElementById(
                                "step-form",
                            ) as HTMLFormElement;
                            form?.requestSubmit();
                        }
                    }}
                />
            {/if}
        </div>
    </form>
</article>
