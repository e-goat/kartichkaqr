<script lang="ts">
    import { defineStepperEvent } from "$lib/controller/Stepper";
    import { cs, ss } from "$lib/state.svelte";
    import Breadcrumb from "./stepper/Breadcrumb.svelte";
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import { onMount, onDestroy } from "svelte";
    import { toast } from "svelte-sonner";
    import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
    import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
    import CheckIcon from "@lucide/svelte/icons/check";
    import Loader2Icon from "@lucide/svelte/icons/loader-2";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";

    let { children, steps = 0, authenticated = false } = $props();
    let initialStep: number = 1;
    let confirmOpen = $state(false);
    let formEl = $state<HTMLFormElement>();

    ss.currentStep = initialStep;
    ss.isRendering = false;
    ss.validationErrors = {};

    onMount(() => {
        ss.isRendering = true;
    });

    onDestroy(() => {
        ss.isRendering = false;
    });

    function requireAuth() {
        if (authenticated) return true;
        toast.info("Влезте в профила си, за да продължите.");
        goto("/login?redirectTo=/");
        return false;
    }

    async function handleNext() {
        if (!requireAuth()) return;
        const result = await defineStepperEvent("next", steps, initialStep);

        if (!result.success) {
            if (result.validationResult?.errors) {
                ss.validationErrors = result.validationResult.errors;
            }
            if (result.errorMessage) {
                toast.error(result.errorMessage);
            }
        } else {
            ss.validationErrors = {};
        }
    }

    async function handlePrev() {
        const result = await defineStepperEvent("prev", steps, initialStep);
        if (result.success) {
            ss.validationErrors = {};
        }
    }

    async function handleSubmit() {
        const result = await defineStepperEvent("submit", steps, initialStep);

        if (!result.success) {
            if (result.validationResult?.errors) {
                ss.validationErrors = result.validationResult.errors;
            }
            if (result.errorMessage) {
                toast.error(result.errorMessage);
            }
            return false;
        }

        ss.validationErrors = {};
        return true;
    }

    function confirmAndSubmit() {
        confirmOpen = false;
        ss.isSubmitting = true;
        formEl?.requestSubmit();
    }
</script>

{#if ss.isSubmitting}
    <div
        class="fixed inset-0 z-50 bg-black/60 flex flex-col items-center justify-center gap-4"
    >
        <Loader2Icon class="size-12 animate-spin text-white" />
        <p class="text-white text-sm font-medium">Създаване на картичка...</p>
    </div>
{/if}

<Card.Root class="w-full gap-0 py-0 overflow-hidden">
    <form
        id="step-form"
        bind:this={formEl}
        method="POST"
        action="?/create"
        enctype="multipart/form-data"
        use:enhance
        class="flex flex-col"
    >
        <div class="border-b px-4 py-4 sm:px-6">
            <Breadcrumb {steps} />
        </div>
        <div class="p-4 sm:p-6 min-h-[60vh] flex items-start justify-center">
            {@render children()}
        </div>
        <div
            class="flex justify-between gap-3 border-t bg-muted/40 px-4 py-4 sm:px-6"
        >
            <Button
                type="button"
                variant="outline"
                aria-label="Предишна стъпка"
                onclick={handlePrev}
                disabled={ss.currentStep == initialStep}
            >
                <ArrowLeftIcon /> Назад
            </Button>
            {#if ss.currentStep != steps}
                <Button
                    type="button"
                    aria-label="Следваща стъпка"
                    onclick={handleNext}
                >
                    Напред <ArrowRightIcon />
                </Button>
            {:else}
                <input type="hidden" name="card" value={JSON.stringify(cs)} />
                <Button
                    type="button"
                    aria-label="Бутон за запазване на картата"
                    disabled={ss.isSubmitting}
                    onclick={async () => {
                        if (await handleSubmit()) confirmOpen = true;
                    }}
                >
                    {#if ss.isSubmitting}
                        <Loader2Icon class="animate-spin" />
                    {:else}
                        <CheckIcon />
                    {/if}
                    Запази
                </Button>
            {/if}
        </div>
    </form>
</Card.Root>

<AlertDialog.Root bind:open={confirmOpen}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Потвърждение</AlertDialog.Title>
            <AlertDialog.Description>
                Сигурни ли сте, че дизайнът на картичката е окончателен?
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Отказ</AlertDialog.Cancel>
            <AlertDialog.Action onclick={confirmAndSubmit}>
                Да, създай картичката
            </AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
