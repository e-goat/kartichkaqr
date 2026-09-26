<script lang="ts">
    import type { PageProps } from "./$types";
    import { goto } from "$app/navigation";
    import { toast } from "svelte-sonner";
    import ClockIcon from "@lucide/svelte/icons/clock";
    import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";

    import Stepper from "$lib/components/Stepper.svelte";
    import Prompt from "$lib/components/stepper/Prompt.svelte";
    import Design from "$lib/components/stepper/Design.svelte";
    import CardInfo from "$lib/components/stepper/CardInfo.svelte";
    import Record from "$lib/components/stepper/Record.svelte";
    import Review from "$lib/components/stepper/Review.svelte";
    import { ss, resetCardState } from "$lib/state.svelte";
    import { STEP, TOTAL_STEPS } from "$lib/config/steps";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";

    let { data, form }: PageProps = $props();

    let successOpen = $state(false);
    let createdUrl = $state("");
    let physicalCopyRequested = $state(false);

    const webAppSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "KartichkaQR",
        url: "https://kartichkaqr.com/",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "BGN",
        },
        description:
            "Създайте персонализирана поздравителна картичка с вашия почерк и глас. Изберете дизайн, запишете съобщение и споделете с близките си.",
        inLanguage: "bg",
    });

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
        if (!form) return;
        ss.isSubmitting = false;

        if (form.success) {
            createdUrl = form.cardUrl || "";
            physicalCopyRequested = !!form.physicalCopyRequested;
            successOpen = true;
        } else if (form.error) {
            toast.error(form.error);
            if ("errorStep" in form && form.errorStep) {
                ss.currentStep = Number(form.errorStep);
            }
        }
    });

    function finish(target: "card" | "home" | "copy") {
        const cardPath = new URL(createdUrl).pathname;
        successOpen = false;
        resetCardState();
        if (target === "card") {
            goto(cardPath);
        } else {
            if (target === "copy") {
                copyToClipboard(createdUrl).then(
                    (ok) => ok && toast.success("Линкът е копиран"),
                );
            }
            goto("/");
        }
    }
</script>

<svelte:head>
    <title>{"Картичка QR - Поздравителна картичка с вашия личен почерк"}</title>
    <meta
        name="description"
        content="Създайте персонализирана поздравителна картичка с вашия почерк и глас. Перфектни картички за подаръци - изберете дизайн, запишете съобщение и споделете с близките си. Create personalized greeting cards with handwriting and voice messages. KartichkaQR - български екип, който революционизира поздравителните картички с QR кодове и гласови съобщения. Идеални картички за подаръци за всички поводи."
    />
    <link rel="canonical" href="https://kartichkaqr.com/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="KartichkaQR" />
    <meta
        property="og:title"
        content="Картичка QR - Поздравителна картичка с вашия личен почерк"
    />
    <meta
        property="og:description"
        content="Създайте персонализирана поздравителна картичка с вашия почерк и глас. Перфектни картички за подаръци за всички поводи."
    />
    <meta property="og:url" content="https://kartichkaqr.com/" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta
        name="twitter:title"
        content="Картичка QR - Поздравителна картичка с вашия личен почерк"
    />
    <meta
        name="twitter:description"
        content="Създайте персонализирана поздравителна картичка с вашия почерк и глас. Перфектни картички за подаръци за всички поводи."
    />
    {@html `<script type="application/ld+json">${webAppSchema}<\/script>`}
</svelte:head>

<Stepper steps={TOTAL_STEPS} authenticated={data.authenticated}>
    {#if ss.currentStep == STEP.PROMPT}
        <Prompt categories={data.categories} />
    {:else if ss.currentStep == STEP.DESIGN}
        <Design categories={data.categories} />
    {:else if ss.currentStep == STEP.INFO}
        <CardInfo />
    {:else if ss.currentStep == STEP.RECORD}
        <Record />
    {:else if ss.currentStep == STEP.REVIEW}
        <Review />
    {/if}
</Stepper>

{#if !data.authenticated}
    <p class="mt-4 text-center text-sm text-muted-foreground">
        За да създадете картичка, <a
            href="/login?redirectTo=/"
            class="font-medium text-primary underline-offset-4 hover:underline"
            >влезте</a
        >
        или
        <a
            href="/register?redirectTo=/"
            class="font-medium text-primary underline-offset-4 hover:underline"
            >създайте безплатен профил</a
        >.
    </p>
{/if}

<!-- Storage duration -->
<Card.Root class="mt-10">
    <Card.Header>
        <Card.Title class="flex items-center gap-2 font-sans text-base">
            <ClockIcon class="size-5 text-primary" /> Съхранение на вашата картичка
        </Card.Title>
    </Card.Header>
    <Card.Content class="flex flex-col gap-4">
        <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col items-center gap-1 rounded-lg border p-5">
                <span class="text-5xl font-bold text-primary leading-none"
                    >3</span
                >
                <span class="text-sm font-semibold uppercase tracking-wide"
                    >години</span
                >
                <p class="text-xs text-muted-foreground text-center">
                    При закупуване на физическа картичка
                </p>
            </div>
            <div class="flex flex-col items-center gap-1 rounded-lg border p-5">
                <span class="text-5xl font-bold text-brand-coral leading-none"
                    >3</span
                >
                <span class="text-sm font-semibold uppercase tracking-wide"
                    >дни</span
                >
                <p class="text-xs text-muted-foreground text-center">
                    За картички предназначени само за онлайн употреба
                </p>
            </div>
        </div>
        <p class="text-sm text-muted-foreground leading-relaxed">
            Вашата картичка със звукозапис ще бъде запазена в базата данни до
            <strong class="text-foreground">3 години</strong> при закупуване на
            физическа картичка или до
            <strong class="text-foreground">3 дни</strong> за картички, предназначени
            само за онлайн употреба. Всички ваши картички са достъпни в „Моите картички“.
        </p>
    </Card.Content>
</Card.Root>

<AlertDialog.Root bind:open={successOpen}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Успех!</AlertDialog.Title>
            <AlertDialog.Description>
                Картичката беше създадена успешно!
                {#if physicalCopyRequested}
                    Скоро ще получите имейл с линк към вашата картичка.
                {/if}
            </AlertDialog.Description>
        </AlertDialog.Header>
        {#if !physicalCopyRequested}
            <div
                class="flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
            >
                <TriangleAlertIcon class="mt-0.5 size-4 shrink-0" />
                <p>
                    Запазете този линк! Той няма да бъде изпратен по имейл, но
                    можете да го намерите в „Моите картички“.
                </p>
            </div>
        {/if}
        <p
            class="rounded-lg bg-muted p-3 font-mono text-xs break-all select-all"
        >
            {createdUrl}
        </p>
        <AlertDialog.Footer class="gap-2">
            <Button variant="ghost" onclick={() => finish("home")}>
                Към началната страница
            </Button>
            <Button variant="outline" onclick={() => finish("copy")}>
                Копирай линк
            </Button>
            <Button onclick={() => finish("card")}>Към картичката</Button>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
