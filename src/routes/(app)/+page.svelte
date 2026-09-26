<script lang="ts">
    import type { PageProps } from "./$types";
    import { goto } from "$app/navigation";
    import { toast } from "svelte-sonner";
    import ClockIcon from "@lucide/svelte/icons/clock";
    import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";
    import SparklesIcon from "@lucide/svelte/icons/sparkles";
    import PaletteIcon from "@lucide/svelte/icons/palette";
    import MicIcon from "@lucide/svelte/icons/mic";
    import QrCodeIcon from "@lucide/svelte/icons/qr-code";
    import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";

    import Stepper from "$lib/components/Stepper.svelte";
    import Prompt from "$lib/components/stepper/Prompt.svelte";
    import Design from "$lib/components/stepper/Design.svelte";
    import CardInfo from "$lib/components/stepper/CardInfo.svelte";
    import Record from "$lib/components/stepper/Record.svelte";
    import Review from "$lib/components/stepper/Review.svelte";
    import ShowcaseCarousel from "$lib/components/ShowcaseCarousel.svelte";
    import { reveal } from "$lib/actions/reveal";
    import { selectTemplate, type Template } from "$lib/controller/Template";
    import { Badge } from "$lib/components/ui/badge";
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

    const howItWorks = [
        {
            icon: SparklesIcon,
            title: "Опишете идеята",
            text: "Напишете с няколко думи какво искате и AI ще нарисува уникален дизайн.",
        },
        {
            icon: PaletteIcon,
            title: "Добавете текст и стил",
            text: "Заглавие, съобщение, шрифт, цвят, позиция и завъртане.",
        },
        {
            icon: MicIcon,
            title: "Запишете гласа си",
            text: "Добавете личен гласов поздрав, който се пуска от картичката.",
        },
        {
            icon: QrCodeIcon,
            title: "Споделете",
            text: "Изпратете линк или поръчайте отпечатана картичка с QR код.",
        },
    ];

    /** Starts the wizard from a design picked in the showcase carousel. */
    function startFromShowcase(t: Template) {
        selectTemplate(t);
        ss.currentStep = STEP.DESIGN;
        toast.success("Дизайнът е избран");
        // Follows CSS scroll-behavior, so reduced-motion users jump
        document.getElementById("create")?.scrollIntoView();
    }

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

<!-- Hero -->
<section
    class="grid items-center gap-8 pb-10 lg:grid-cols-2 lg:gap-12 lg:pb-16"
>
    <div
        class={[
            "flex flex-col gap-5 text-center lg:text-left",
            data.showcase.length === 0 && "lg:col-span-2 lg:text-center",
        ]}
    >
        <div use:reveal={{ effect: "fade" }}>
            <Badge variant="secondary" class="gap-1.5">
                <SparklesIcon class="size-3.5 text-primary" /> AI дизайн + гласов
                поздрав
            </Badge>
        </div>
        <h1
            use:reveal={{ delay: 80 }}
            class="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl"
        >
            Картичка с
            <span
                class="bg-linear-to-r from-brand-gold via-brand-coral to-brand-purple bg-clip-text text-transparent"
                >вашия глас</span
            >
            и уникален дизайн
        </h1>
        <p
            use:reveal={{ delay: 160 }}
            class="text-lg text-pretty text-muted-foreground"
        >
            Опишете идеята си, изберете стил, запишете поздрав и споделете
            картичката с QR код — онлайн или отпечатана.
        </p>
        <div
            use:reveal={{ delay: 240 }}
            class={[
                "flex flex-wrap justify-center gap-3",
                data.showcase.length > 0 && "lg:justify-start",
            ]}
        >
            <Button href="#create" size="lg">
                <SparklesIcon /> Създай картичка
            </Button>
            <Button href="#how" size="lg" variant="outline">
                Как работи <ArrowDownIcon />
            </Button>
        </div>
    </div>

    {#if data.showcase.length > 0}
        <div use:reveal={{ delay: 200, effect: "fade" }}>
            <ShowcaseCarousel
                templates={data.showcase}
                onSelect={startFromShowcase}
            />
        </div>
    {/if}
</section>

<!-- Card wizard -->
<section id="create">
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
</section>

<!-- How it works -->
<section id="how" class="mt-16 flex flex-col gap-8">
    <div use:reveal class="flex flex-col gap-2 text-center">
        <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
            Как работи
        </h2>
        <p class="text-muted-foreground">
            Четири стъпки до картичка, която ще запомнят.
        </p>
    </div>
    <ol class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each howItWorks as step, i (step.title)}
            <li
                use:reveal={{ delay: i * 100 }}
                class="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
                <div class="flex items-center gap-3">
                    <span
                        class="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"
                    >
                        <step.icon class="size-5" />
                    </span>
                    <span class="text-sm font-medium text-muted-foreground"
                        >Стъпка {i + 1}</span
                    >
                </div>
                <h3 class="font-sans text-base font-semibold">{step.title}</h3>
                <p class="text-sm text-muted-foreground">{step.text}</p>
            </li>
        {/each}
    </ol>
</section>

<!-- Storage duration -->
<div use:reveal>
    <Card.Root class="mt-16">
        <Card.Header>
            <Card.Title class="flex items-center gap-2 font-sans text-base">
                <ClockIcon class="size-5 text-primary" /> Съхранение на вашата картичка
            </Card.Title>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div
                    class="flex flex-col items-center gap-1 rounded-lg border p-5"
                >
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
                <div
                    class="flex flex-col items-center gap-1 rounded-lg border p-5"
                >
                    <span
                        class="text-5xl font-bold text-brand-coral leading-none"
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
                Вашата картичка със звукозапис ще бъде запазена в базата данни
                до
                <strong class="text-foreground">3 години</strong> при закупуване
                на физическа картичка или до
                <strong class="text-foreground">3 дни</strong> за картички, предназначени
                само за онлайн употреба. Всички ваши картички са достъпни в „Моите
                картички“.
            </p>
        </Card.Content>
    </Card.Root>
</div>

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
