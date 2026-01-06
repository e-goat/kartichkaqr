<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { defineStepperEvent } from "$lib/controller/Stepper";
    import { cs, ss } from "$lib/state.svelte";
    import Breadcrumb from "./stepper/Breadcrumb.svelte";
    import { enhance } from "$app/forms";
    import { onMount, onDestroy } from "svelte";

    let { children, steps = 0, form } = $props();
    let initialStep: number = steps + 1 - steps;
    ss.currentStep = initialStep;
    ss.isRendering = false;
    onMount(() => {
        ss.isRendering = true;
    });

    onDestroy(() => {
        ss.isRendering = false;
    });
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
                clickEvent={(e) =>
                    defineStepperEvent("prev", steps, initialStep)}
                disabled={ss.currentStep == initialStep}
                buttonType="button"
            />
            {#if ss.currentStep != steps}
                <Button
                    ariaLabel="Следваща стъпка"
                    text={"Напред"}
                    clickEvent={(e) =>
                        defineStepperEvent("next", steps, initialStep)}
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
                />
            {/if}
        </div>
    </form>
</article>
