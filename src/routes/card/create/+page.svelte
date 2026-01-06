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

    $effect(() => {
        if (form) {
            ss.isSubmitting = false;

            if (form.success) {
                Swal.fire({
                    title: "Успех!",
                    text: "Картичката беше създадена успешно!",
                    icon: "success",
                    confirmButtonText: "Към началната страница",
                    customClass: {
                        confirmButton: "swal-confirm-button",
                    },
                    buttonsStyling: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        resetCardState();
                        goto("/");
                    }
                });
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
            } else if (form.missing) {
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
