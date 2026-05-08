<script lang="ts">
    import WishCard from "$lib/components/WishCard.svelte";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    const cardTitle = data.title || data.template.title || "Картичка QR";
    const cardDesc =
        data.description ||
        data.template.description ||
        "Персонализирана поздравителна картичка с гласово съобщение.";
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
    cardFront={data.template.background ?? ""}
    cardBack={data.template.backgroundBack}
    font={data.template.font?.name ?? ""}
    fontColor={data.template.fontColor}
    titlePosition={data.template.titlePos}
    titleFontSize={data.template.titleFontSize}
    title={data.title !== "" ? data.title : (data.template.title ?? "")}
    description={data.description !== ""
        ? data.description
        : (data.template.description ?? "")}
    sender={data.sender ?? undefined}
    audioUrl={data.audioUrl}
    cardPageUrl={data.cardPageUrl ?? null}
/>
