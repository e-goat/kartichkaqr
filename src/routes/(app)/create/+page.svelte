<script lang="ts">
    import type { PageProps } from "./$types";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { toast } from "svelte-sonner";
    import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";

    import Seo from "$lib/components/Seo.svelte";
    import Stepper from "$lib/components/Stepper.svelte";
    import Prompt from "$lib/components/stepper/Prompt.svelte";
    import Design from "$lib/components/stepper/Design.svelte";
    import CardInfo from "$lib/components/stepper/CardInfo.svelte";
    import Record from "$lib/components/stepper/Record.svelte";
    import Review from "$lib/components/stepper/Review.svelte";
    import { selectTemplate } from "$lib/controller/Template";
    import { restoreDraft, saveDraft, clearDraft } from "$lib/controller/Draft";
    import { ai, cs, ss, ts, resetCardState } from "$lib/state.svelte";
    import { STEP, TOTAL_STEPS } from "$lib/config/steps";
    import { SITE_URL } from "$lib/config/seo";
    import { imageUrl } from "$lib/utils/image";
    import { Button } from "$lib/components/ui/button";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";

    let { data, form }: PageProps = $props();

    let successOpen = $state(false);
    let createdUrl = $state("");
    let physicalCopyRequested = $state(false);

    // Category and template pages get their own title and canonical URL so
    // /create?category=<id> can rank for that occasion.
    const seo = $derived.by(() => {
        if (data.template) {
            const name = data.template.title || "Шаблон";
            return {
                title: `${name} — създай картичка | Картичка QR`,
                description: `Персонализирайте дизайна „${name}“${data.category ? ` от категория ${data.category.name}` : ""}: добавете текст, гласов поздрав и QR код.`,
                canonical: `/create?template=${data.template.id}`,
            };
        }
        if (data.category) {
            return {
                title: `Картички за ${data.category.name} с AI дизайн | Картичка QR`,
                description: `Създайте картичка за ${data.category.name}: AI дизайн или готов шаблон, ваш текст и гласов поздрав, споделени с QR код.`,
                canonical: `/create?category=${data.category.id}`,
            };
        }
        return {
            title: "Създай картичка с AI дизайн и глас | Картичка QR",
            description:
                "Опишете идеята си и AI ще нарисува уникален дизайн. Добавете текст, запишете гласов поздрав и споделете картичката с QR код.",
            canonical: "/create",
        };
    });

    const schema = $derived([
        {
            "@type": "WebPage",
            "@id": `${SITE_URL}${seo.canonical}`,
            url: `${SITE_URL}${seo.canonical}`,
            name: seo.title,
            description: seo.description,
            inLanguage: "bg",
            isPartOf: { "@id": `${SITE_URL}/#website` },
            ...(data.category && { about: data.category.name }),
        },
        {
            "@type": "WebApplication",
            name: "KartichkaQR",
            url: `${SITE_URL}/create`,
            applicationCategory: "LifestyleApplication",
            operatingSystem: "Web",
            inLanguage: "bg",
            offers: { "@type": "Offer", price: "0", priceCurrency: "BGN" },
        },
    ]);

    onMount(() => {
        // Query params from the showcase, category links or the sign-in
        // redirect win over the saved draft.
        if (data.template && cs.templateId !== data.template.id) {
            selectTemplate(data.template);
            ss.currentStep = STEP.DESIGN;
        }
        if (data.category) {
            ai.categoryId ??= data.category.id;
            ts.designCategory ??= data.category.id;
        }
        restoreDraft();
    });

    // Keep the typed idea across reloads and the sign-in round trip
    $effect(() => {
        saveDraft({ prompt: ai.prompt, categoryId: ai.categoryId });
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
            clearDraft();
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

<Seo
    title={seo.title}
    description={seo.description}
    canonical={seo.canonical}
    image={data.template
        ? {
              url: imageUrl(data.template.background, 1200),
              alt: data.template.title ?? "Шаблон за картичка",
          }
        : null}
    {schema}
/>

<h1 class="sr-only">{seo.title}</h1>

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
            href="/login?redirectTo={encodeURIComponent(seo.canonical)}"
            class="font-medium text-primary underline-offset-4 hover:underline"
            >влезте</a
        >
        или
        <a
            href="/register?redirectTo={encodeURIComponent(seo.canonical)}"
            class="font-medium text-primary underline-offset-4 hover:underline"
            >създайте безплатен профил</a
        >.
    </p>
{/if}

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
