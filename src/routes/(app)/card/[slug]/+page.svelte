<script lang="ts">
    import WishCard from "$lib/components/WishCard.svelte";
    import Share2Icon from "@lucide/svelte/icons/share-2";
    import CopyIcon from "@lucide/svelte/icons/copy";
    import CheckIcon from "@lucide/svelte/icons/check";
    import { Button } from "$lib/components/ui/button";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    const cardTitle = $derived(data.title || "Картичка QR");
    const cardDesc = $derived(
        data.description ||
            "Персонализирана поздравителна картичка с гласово съобщение.",
    );

    let copied = $state(false);

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(data.cardPageUrl ?? "");
            copied = true;
            setTimeout(() => (copied = false), 2000);
        } catch {
            // ignore
        }
    }

    async function shareCard() {
        const url = data.cardPageUrl ?? "";
        if (navigator.share) {
            await navigator.share({ title: cardTitle, url }).catch(() => {});
        } else {
            await copyLink();
        }
    }
</script>

<svelte:head>
    <title>{cardTitle} | Картичка QR</title>
    <meta name="description" content={cardDesc} />
    <link rel="canonical" href={data.cardPageUrl ?? ""} />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="KartichkaQR" />
    <meta property="og:title" content="{cardTitle} | Картичка QR" />
    <meta property="og:description" content={cardDesc} />
    <meta property="og:url" content={data.cardPageUrl ?? ""} />
    {#if data.ogImageUrl}
        <meta property="og:image" content={data.ogImageUrl} />
        <meta name="twitter:image" content={data.ogImageUrl} />
    {/if}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{cardTitle} | Картичка QR" />
    <meta name="twitter:description" content={cardDesc} />
</svelte:head>

<WishCard
    cardFront={data.background}
    cardBack={data.backgroundBack}
    font={data.titleFont}
    fontColor={data.titleColor}
    titlePosition={data.titlePos}
    titleRotation={data.titleRotation}
    titleFontSize={data.titleFontSize}
    title={data.title}
    description={data.description}
    sender={data.sender ?? undefined}
    audioUrl={data.audioUrl}
    cardPageUrl={data.cardPageUrl ?? null}
    descriptionFont={data.descriptionFont}
    descriptionFontSize={data.descriptionFontSize}
    descriptionColor={data.descriptionColor}
/>

<div class="mt-6 flex gap-3 justify-center">
    <Button type="button" onclick={shareCard}>
        <Share2Icon /> Сподели
    </Button>
    <Button type="button" variant="outline" onclick={copyLink}>
        {#if copied}
            <CheckIcon class="text-green-600" /> Копирано!
        {:else}
            <CopyIcon /> Копирай линк
        {/if}
    </Button>
</div>
