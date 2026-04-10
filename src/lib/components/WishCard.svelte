<script lang="ts">
    import { cs } from "$lib/state.svelte";
    import { buildQR } from "$lib/utils/qr";
    import paperTexture from "$lib/assets/paper-texture.avif";
    import QrCodeExample from "$lib/assets/qr-code-example.svg";

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

    async function clickHandler(): Promise<void> {
        cardState = (cardState + 1) % 3;

        if (cardPageUrl && !qrCodeUrl) {
            const qrCode = await buildQR(cardPageUrl, 24);
            qrCodeUrl = qrCode;
        }
    }
</script>

<div class="w-full flex justify-center">
    <button
        type="button"
        class="main-card-wrapper relative cursor-pointer
        {isOpened ? 'h-140' : 'h-57.5'} w-65 md:w-85 {isOpened
            ? 'lg:w-190'
            : 'lg:w-95'} lg:h-155
        border border-dashed rounded-xl overflow-hidden shadow-xl"
        onclick={clickHandler}
    >
        {#if cardState === 0}
            <enhanced:img
                src={cardFront}
                class="absolute inset-0 w-full h-full object-cover"
                alt={title}
            />
        {:else if cardState === 1}
            <div
                class="h-full flex flex-col lg:flex-row items-center z-10 p-6 bg-white"
            >
                <!-- Left inner section -->
                <div
                    class="flex justify-center items-center h-full w-full flex-1 border-r border-dotted rotate-90 lg:rotate-none"
                >
                    <div
                        class="left flex flex-col max-w-35 md:max-w-1xl justify-center items-center"
                    >
                        {#if cardPageUrl}
                            <enhanced:img
                                src={qrCodeUrl}
                                alt="QR code"
                                class="w-24 h-24"
                            />
                            <p class="mt-2.5 text-xs md:text-sm lg:text-base">
                                Сканирайте за да чуете вашият аудио поздрав.
                            </p>
                        {:else}
                            <enhanced:img
                                src={QrCodeExample}
                                alt="QR code"
                                class="w-24 h-24"
                            />
                            <span class="text-xs text-gray-400"
                                >(Примерен QR код)</span
                            >
                            <p class="mt-2.5 text-xs md:text-sm lg:text-base">
                                Сканирайте за да чуете вашият аудио поздрав.
                            </p>
                        {/if}
                    </div>
                </div>

                <!-- Right inner section -->
                <div
                    class="p-2 h-full flex flex-col justify-between flex-1 rotate-90 lg:rotate-none"
                >
                    <p class="mt-2.5 text-xs md:text-sm lg:text-base">
                        {description}
                    </p>
                    <p class="w-full text-xs text-end underline">
                        От: {displaySender}
                    </p>
                </div>
            </div>
        {:else}
            <enhanced:img
                src={paperTexture}
                class="absolute inset-0 w-full h-full object-cover mask-y-from-70% mask-y-to-90%"
                alt="Paper texture background"
            />
            <div class="relative z-10 p-4 text-amber-950">
                Kartichka QR {new Date().getFullYear()}
            </div>
        {/if}
    </button>
</div>
