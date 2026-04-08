<script lang="ts">
    import { cs } from "$lib/state.svelte";
    import { buildQR } from "$lib/utils/qr";
    import paperTexture from "$lib/assets/paper-texture.avif";
    import QrCodeExample from "$lib/assets/qr-code-example.svg";
    import { onMount } from "svelte";

    interface Props {
        cardFront?: string;
        fontColor?: string;
        cardBack?: string;
        title?: string;
        description?: string;
        sender?: string;
        audioUrl?: string | null;
        previewMode?: boolean;
        cardPageUrl?: string | null;
        titlePosition?: string | "center";
    }

    let {
        cardFront = "",
        fontColor = "black",
        cardBack = "",
        title = "",
        description = "",
        sender,
        audioUrl: audioUrlProp,
        previewMode = false,
        cardPageUrl = null,
        titlePosition = "center",
    }: Props = $props();

    const displayTitle = $derived(cs.title || title);
    const descriptionLength = $derived(description.length);
    const displaySender = $derived(sender ?? cs.sender ?? "—");
    let cardState = $state(0);
    let isFrontView = $derived(!!cardState);
    let isOpened = $derived(cardState === 1);
    let isBackView = $derived(cardState === 2);
    let qrCodeUrl = $state("");

    onMount(async () => {
        if (cardPageUrl && !qrCodeUrl) {
            const qrCode = await buildQR(cardPageUrl, 24);
            qrCodeUrl = qrCode;
        }
    });
</script>

<div class="w-full flex flex-col items-center">
    <!-- FRONT -->
    <div class="a6-page shadow">
        <img src={cardFront} alt={title} class="page-content object-cover" />
    </div>

    <!-- INSIDE LEFT (QR) -->
    <div class="a6-page flex items-center justify-center bg-white shadow">
        <div class="flex flex-col items-center text-center p-6">
            {#if cardPageUrl}
                <img src={qrCodeUrl} alt="QR code" class="w-24 h-24" />
                <p class="mt-3 text-sm">
                    Сканирайте за да чуете вашият аудио поздрав.
                </p>
            {:else}
                <img src={QrCodeExample} alt="QR code" class="w-24 h-24" />
                <span class="text-xs text-gray-400">(Примерен QR код)</span>
                <p class="mt-3 text-sm">
                    Сканирайте за да чуете вашият аудио поздрав.
                </p>
            {/if}
        </div>
    </div>

    <div class="a6-page flex flex-col justify-between bg-white shadow p-6">
        <p class="text-sm">
            {description}
        </p>

        <p class="text-xs text-right underline">
            От: {displaySender}
        </p>
    </div>

    <!-- BACK -->
    <div class="a6-page shadow relative">
        <img
            src={paperTexture}
            alt="Paper texture background"
            class="absolute inset-0 w-full h-full object-cover"
        />
        <div class="relative z-10 p-4 text-amber-950">
            Kartichka QR {new Date().getFullYear()}
        </div>
    </div>
</div>

<style>
    /* A6 size */
    .a6-page {
        width: 105mm;
        height: 148mm;
        page-break-after: always;
        position: relative;
        overflow: hidden;
    }

    .page-content {
        width: 100%;
        height: 100%;
    }
</style>
