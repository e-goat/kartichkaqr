<script lang="ts">
    import WishCard from "$lib/components/WishCard.svelte";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    const cardTitle = data.title || data.template.title || "Картичка QR";
    const cardDesc =
        data.description ||
        data.template.description ||
        "Персонализирана поздравителна картичка с гласово съобщение.";

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

<div class="mt-6 flex gap-3 justify-center">
    <button
        type="button"
        onclick={shareCard}
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-custom-orange-600 text-white text-sm font-medium shadow hover:bg-custom-orange-700 transition-colors"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
        </svg>
        Сподели
    </button>
    <button
        type="button"
        onclick={copyLink}
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
        {#if copied}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                />
            </svg>
            Копирано!
        {:else}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
            </svg>
            Копирай линк
        {/if}
    </button>
</div>
