<script lang="ts">
    import type { PageProps, ActionData } from "./$types";
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";

    import Stepper from "$lib/components/Stepper.svelte";
    import Intro from "$lib/components/stepper/Intro.svelte";
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
                        confirmButtonText: "Към началната страница",
                        cancelButtonText: "Копирай линк",
                        customClass: {
                            confirmButton: "swal-confirm-button",
                            cancelButton: "swal-copy-button",
                        },
                        buttonsStyling: false,
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            resetCardState();
                            goto("/");
                        } else if (
                            result.dismiss === Swal.DismissReason.cancel
                        ) {
                            const copied = await copyToClipboard(cardUrl);
                            if (copied) {
                                await Swal.fire({
                                    title: "Копирано!",
                                    text: "Линкът е копиран в клипборда.",
                                    icon: "success",
                                    confirmButtonText: "Към началната страница",
                                    customClass: {
                                        confirmButton: "swal-confirm-button",
                                    },
                                    buttonsStyling: false,
                                });
                            }
                            resetCardState();
                            goto("/");
                        }
                    });
                } else {
                    // No physical copy - show link directly with warning
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
                        confirmButtonText: "Копирай линк",
                        cancelButtonText: "Към началната страница",
                        customClass: {
                            confirmButton: "swal-confirm-button",
                            cancelButton: "swal-cancel-button",
                        },
                        buttonsStyling: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            const copied = await copyToClipboard(cardUrl);
                            if (copied) {
                                await Swal.fire({
                                    title: "Копирано!",
                                    text: "Линкът е копиран в клипборда. Запазете го на сигурно място!",
                                    icon: "success",
                                    confirmButtonText: "Към началната страница",
                                    customClass: {
                                        confirmButton: "swal-confirm-button",
                                    },
                                    buttonsStyling: false,
                                });
                            }
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
    <title>{"Картичка QR - Създаи Картичка"}</title>
    <meta
        name="description"
        content="Създайте персонализирана поздравителна картичка с вашия почерк и глас. Изберете дизайн, запишете съобщение и споделете с близките си. Перфектни картички за подаръци за всички поводи. Create personalized greeting cards with handwriting and voice messages."
    />
</svelte:head>

<Stepper steps={4} {form}>
    {#if ss.currentStep == 1}
        <Intro />
    {:else if ss.currentStep == 2}
        <Design {data} />
    {:else if ss.currentStep == 3}
        <Record />
    {:else if ss.currentStep == 4}
        <Review templates={data.templates} />
    {/if}
</Stepper>
