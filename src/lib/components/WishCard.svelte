<script lang="ts">
    import { cs } from "$lib/state.svelte";
    import { buildQR } from "$lib/utils/qr";
    import paperTexture from "$lib/assets/paper-texture.avif";
    import QrCodeExample from "$lib/assets/qr-code-example.svg";
    import logo from "$lib/assets/logo.jpg";
    import { onMount, onDestroy } from "svelte";
    import EmblaCarousel from "embla-carousel";
    import type { EmblaCarouselType } from "embla-carousel";

    interface Props {
        cardFront?: string;
        fontColor?: string;
        font?: string;
        cardBack?: string;
        title?: string;
        description?: string;
        sender?: string;
        audioUrl?: string | null;
        previewMode?: boolean;
        cardPageUrl?: string | null;
        titlePosition?: string | "center";
        titleFontSize?: number;
    }

    let {
        cardFront = "",
        fontColor = "black",
        font = "",
        cardBack = "",
        title = "",
        description = "",
        sender,
        audioUrl: audioUrlProp,
        previewMode = false,
        cardPageUrl = null,
        titlePosition = "center",
        titleFontSize = 24,
    }: Props = $props();

    const displayTitle = $derived(cs.title || title);
    const displaySender = $derived(sender ?? cs.sender ?? "");
    const titleFontSizeCqw = $derived(((titleFontSize ?? 24) / 340) * 100);

    const titlePositionClass = $derived(
        titlePosition === "top"
            ? "absolute top-4 left-4 right-4 text-center"
            : titlePosition === "bottom"
              ? "absolute bottom-4 left-4 right-4 text-center"
              : "absolute top-[calc(50%-var(--card-title-center-offset))] -translate-y-1/2 left-4 right-4 text-center",
    );

    let qrCodeUrl = $state("");
    let emblaNode = $state<HTMLElement | null>(null);
    let emblaApi: EmblaCarouselType | null = null;
    let selectedIndex = $state(0);

    const slideLabels = ["Лице", "Вляво", "Вдясно", "Гръб"];

    onMount(async () => {
        if (cardPageUrl) {
            qrCodeUrl = await buildQR(cardPageUrl, 24);
        }

        if (emblaNode) {
            emblaApi = EmblaCarousel(emblaNode, { loop: false });
            emblaApi.on("select", () => {
                selectedIndex = emblaApi?.selectedScrollSnap() ?? 0;
            });
        }
    });

    onDestroy(() => {
        emblaApi?.destroy();
    });

    function scrollPrev() {
        emblaApi?.scrollPrev();
    }

    function scrollNext() {
        emblaApi?.scrollNext();
    }
</script>

<div class="w-full flex flex-col items-center gap-3">
    <!-- Slide indicator dots -->
    <div class="flex gap-2">
        {#each slideLabels as label, i}
            <span
                class="text-xs px-2 py-0.5 rounded-full transition-colors"
                class:bg-custom-orange-600={selectedIndex === i}
                class:text-white={selectedIndex === i}
                class:bg-gray-200={selectedIndex !== i}
                class:dark:bg-gray-700={selectedIndex !== i}
                class:text-gray-500={selectedIndex !== i}
                class:dark:text-gray-400={selectedIndex !== i}
            >
                {label}
            </span>
        {/each}
    </div>

    <div class="relative w-full flex items-center justify-center">
        <!-- Prev button -->
        <button
            type="button"
            onclick={scrollPrev}
            class="absolute left-0 z-10 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 rounded-full p-1.5 shadow transition-colors"
            aria-label="Предишен слайд"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-gray-700 dark:text-gray-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                />
            </svg>
        </button>

        <!-- Embla viewport -->
        <div
            bind:this={emblaNode}
            class="overflow-hidden w-65 md:w-85 lg:w-95 h-100 md:h-128 lg:h-156 rounded-xl shadow-xl border border-dashed"
        >
            <div class="flex h-full">
                <!-- Slide 1: Front -->
                <div
                    class="flex-[0_0_100%] min-w-0 relative h-full"
                    style="container-type: inline-size"
                >
                    <enhanced:img
                        src={cardFront}
                        class="absolute inset-0 w-full h-full object-cover"
                        alt={displayTitle}
                    />
                    {#if displayTitle}
                        <div
                            class={titlePositionClass}
                            style="color: {fontColor}; font-family: var(--font-family-{font}); font-size: {titleFontSizeCqw.toFixed(
                                2,
                            )}cqw; line-height: 1.4;"
                        >
                            {displayTitle}
                        </div>
                    {/if}
                </div>

                <!-- Slide 2: Left inner (audio / QR) -->
                <div
                    class="flex-[0_0_100%] min-w-0 h-full bg-white flex flex-col items-center justify-center gap-3 p-6"
                >
                    {#if audioUrlProp}
                        <div
                            class="flex flex-col items-center gap-3 text-center w-full"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-10 h-10 text-custom-orange-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                />
                            </svg>
                            <p class="text-sm font-medium text-gray-700">
                                Аудио поздрав
                            </p>
                            <audio
                                controls
                                src={audioUrlProp}
                                class="w-full max-w-xs mt-1"
                            >
                                <track kind="captions" />
                            </audio>
                        </div>
                    {:else if previewMode}
                        <img
                            src={QrCodeExample}
                            alt="QR код"
                            class="w-24 h-24 opacity-40"
                        />
                        <span class="text-xs text-gray-400"
                            >(Примерен QR код)</span
                        >
                        <p class="text-xs text-center text-gray-500">
                            Сканирайте за да чуете вашият аудио поздрав.
                        </p>
                    {:else}
                        <div
                            class="flex flex-col items-center gap-3 text-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-10 h-10 text-gray-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                />
                            </svg>
                            <p class="text-sm text-gray-500 italic">
                                Няма записано аудио съобщение за тази картичка.
                            </p>
                        </div>
                    {/if}
                </div>

                <!-- Slide 3: Right inner (message) -->
                <div
                    class="flex-[0_0_100%] min-w-0 h-full bg-white flex flex-col justify-center p-6 gap-4"
                >
                    <p
                        class="text-sm md:text-base text-gray-800 leading-relaxed"
                    >
                        {description}
                    </p>
                    {#if displaySender}
                        <p
                            class="text-xs text-end underline text-gray-600 mt-auto"
                        >
                            От: {displaySender}
                        </p>
                    {/if}
                </div>

                <!-- Slide 4: Back -->
                <div
                    class="flex-[0_0_100%] min-w-0 h-full relative overflow-hidden"
                >
                    <img
                        src={paperTexture}
                        class="absolute inset-0 w-full h-full object-cover"
                        alt="Текстура"
                    />
                    <div class="absolute inset-0 bg-amber-950/10"></div>
                    <div
                        class="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-8 gap-2 z-10"
                    >
                        <img
                            src={logo}
                            alt="Kartichka QR"
                            class="w-14 h-14 rounded-2xl border-2 border-white/60"
                        />
                        <div class="text-center">
                            <p
                                class="text-black font-bold text-sm tracking-widest uppercase"
                            >
                                Kartichka QR
                            </p>
                            <p class="text-gray-900 text-xs mt-0.5 opacity-80">
                                {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Next button -->
        <button
            type="button"
            onclick={scrollNext}
            class="absolute right-0 z-10 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 rounded-full p-1.5 shadow transition-colors"
            aria-label="Следващ слайд"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-gray-700 dark:text-gray-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                />
            </svg>
        </button>
    </div>
</div>
