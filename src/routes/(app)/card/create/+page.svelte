<script lang="ts">
    import type { PageProps, ActionData } from "./$types";
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";

    import Stepper from "$lib/components/Stepper.svelte";
    import CardInfo from "$lib/components/stepper/CardInfo.svelte";
    import Design from "$lib/components/stepper/Design.svelte";
    import Record from "$lib/components/stepper/Record.svelte";
    import Review from "$lib/components/stepper/Review.svelte";
    import { ss, resetCardState } from "$lib/state.svelte";

    let { data, form }: PageProps & { form: ActionData } = $props();

    /**
     * Copies the provided text to the clipboard
     */
    async function copyToClipboard(text: string): Promise<boolean> {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            return false;
        }
    }

    $effect(() => {
        if (form) {
            ss.isSubmitting = false;

            if (form.success) {
                const cardUrl = form.cardUrl || "";
                const physicalCopyRequested = form.physicalCopyRequested;

                const cardPath = new URL(cardUrl).pathname;

                if (physicalCopyRequested) {
                    // Physical copy requested - user will receive email
                    Swal.fire({
                        title: "Успех!",
                        html: `
                            <p class="mb-4">Картичката беше създадена успешно!</p>
                            <p class="text-sm text-gray-600">Скоро ще получите имейл с линк към вашата картичка.</p>
                            <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                                <p class="text-xs text-gray-500 break-all font-mono">${cardUrl}</p>
                            </div>
                        `,
                        icon: "success",
                        showCancelButton: true,
                        showDenyButton: true,
                        confirmButtonText: "Към картичката",
                        denyButtonText: "Копирай линк",
                        cancelButtonText: "Към началната страница",
                        customClass: {
                            confirmButton: "swal-navigate-button",
                            denyButton: "swal-copy-button",
                            cancelButton: "swal-cancel-button",
                        },
                        buttonsStyling: false,
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            resetCardState();
                            goto(cardPath);
                        } else if (result.isDenied) {
                            await copyToClipboard(cardUrl);
                            resetCardState();
                            goto("/");
                        } else {
                            resetCardState();
                            goto("/");
                        }
                    });
                } else {
                    // No physical copy - warn user to save the link
                    Swal.fire({
                        title: "Успех!",
                        html: `
                            <p class="mb-4">Картичката беше създадена успешно!</p>
                            <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                                <p class="text-sm text-amber-800 font-semibold mb-2">⚠️ Важно!</p>
                                <p class="text-sm text-amber-700">Запазете този линк! Той няма да бъде изпратен по имейл и няма да може да бъде възстановен по-късно.</p>
                            </div>
                            <div class="p-3 bg-gray-100 rounded-lg">
                                <p class="text-xs text-gray-600 mb-1">Линк към картичката:</p>
                                <p class="text-sm text-blue-600 break-all font-mono select-all">${cardUrl}</p>
                            </div>
                        `,
                        icon: "warning",
                        showCancelButton: true,
                        showDenyButton: true,
                        confirmButtonText: "Към картичката",
                        denyButtonText: "Копирай линк",
                        cancelButtonText: "Към началната страница",
                        customClass: {
                            confirmButton: "swal-navigate-button",
                            denyButton: "swal-copy-button",
                            cancelButton: "swal-cancel-button",
                        },
                        buttonsStyling: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            resetCardState();
                            goto(cardPath);
                        } else if (result.isDenied) {
                            await copyToClipboard(cardUrl);
                            resetCardState();
                            goto("/");
                        } else {
                            resetCardState();
                            goto("/");
                        }
                    });
                }
            } else if (form.error) {
                Swal.fire({
                    title: "Грешка!",
                    text: `${form.error}`,
                    icon: "error",
                    confirmButtonText: "Разбрано",
                    customClass: {
                        confirmButton: "swal-confirm-button",
                    },
                    buttonsStyling: false,
                });
                ss.currentStep = 1;
                goto("/card/create");
            } else if ("missing" in form && form.missing) {
                Swal.fire({
                    title: "Липсват данни!",
                    text: "Моля, попълнете всички необходими полета.",
                    icon: "warning",
                    confirmButtonText: "Разбрано",
                    customClass: {
                        confirmButton: "swal-confirm-button",
                    },
                    buttonsStyling: false,
                });
            }
        }
    });
</script>

<svelte:head>
    <title>{"Картичка QR - Създай Картичка"}</title>
    <meta
        name="description"
        content="Създайте персонализирана поздравителна картичка с вашия почерк и глас. Изберете дизайн, запишете съобщение и споделете с близките си. Перфектни картички за подаръци за всички поводи. Create personalized greeting cards with handwriting and voice messages."
    />
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="https://kartichkaqr.com/card/create" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="KartichkaQR" />
    <meta property="og:title" content="Картичка QR - Създай Картичка" />
    <meta
        property="og:description"
        content="Създайте персонализирана поздравителна картичка с вашия почерк и глас. Изберете дизайн, запишете съобщение и споделете с близките си."
    />
    <meta property="og:url" content="https://kartichkaqr.com/card/create" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Картичка QR - Създай Картичка" />
    <meta
        name="twitter:description"
        content="Създайте персонализирана поздравителна картичка с вашия почерк и глас. Изберете дизайн, запишете съобщение и споделете с близките си."
    />
</svelte:head>

<Stepper steps={4} {form}>
    {#if ss.currentStep == 1}
        <CardInfo />
    {:else if ss.currentStep == 2}
        <Design categories={data.categories} />
    {:else if ss.currentStep == 3}
        <Record />
    {:else if ss.currentStep == 4}
        <Review />
    {/if}
</Stepper>
