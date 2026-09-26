<script lang="ts">
    import { cs } from "$lib/state.svelte";
    import { buildQR } from "$lib/utils/qr";
    import paperTexture from "$lib/assets/paper-texture.avif";
    import QrCodeExample from "$lib/assets/qr-code-example.svg";
    import logo from "$lib/assets/logo.jpg";
    import { onMount, onDestroy } from "svelte";
    import EmblaCarousel from "embla-carousel";
    import type { EmblaCarouselType } from "embla-carousel";
    import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
    import MusicIcon from "@lucide/svelte/icons/music";
    import { Button } from "$lib/components/ui/button";
    import { toCqw } from "$lib/config/card";
    import { cn } from "$lib/utils/cn";

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
        // Degrees; applied with transform: rotate() around the title's center
        titleRotation?: number;
        // Optional per-card message styling; unset keeps the classic look
        descriptionFont?: string | null;
        descriptionFontSize?: number | null;
        descriptionColor?: string | null;
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
        titleRotation = 0,
        descriptionFont = null,
        descriptionFontSize = null,
        descriptionColor = null,
    }: Props = $props();

    const descriptionStyle = $derived(
        [
            descriptionFont &&
                `font-family: var(--font-family-${descriptionFont})`,
            descriptionFontSize && `font-size: ${toCqw(descriptionFontSize)}`,
            descriptionColor && `color: ${descriptionColor}`,
        ]
            .filter(Boolean)
            .join("; "),
    );

    const displayTitle = $derived(cs.title || title);
    const displaySender = $derived(sender ?? cs.sender ?? "");

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
                class={cn(
                    "text-xs px-2 py-0.5 rounded-full transition-colors",
                    selectedIndex === i
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                )}
            >
                {label}
            </span>
        {/each}
    </div>

    <div class="relative w-full flex items-center justify-center">
        <!-- Prev button -->
        <Button
            type="button"
            variant="outline"
            size="icon"
            onclick={scrollPrev}
            class="absolute left-0 z-10 rounded-full shadow"
            aria-label="Предишен слайд"
        >
            <ChevronLeftIcon />
        </Button>

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
                            style="color: {fontColor}; font-family: var(--font-family-{font}); font-size: {toCqw(
                                titleFontSize ?? 24,
                            )}; line-height: 1.4; transform: rotate({titleRotation}deg);"
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
                            <MusicIcon class="size-10 text-primary" />
                            <p class="text-sm font-medium text-gray-700">
                                Аудио поздрав
                            </p>
                            <audio
                                controls
                                preload="metadata"
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
                            <MusicIcon class="size-10 text-gray-300" />
                            <p class="text-sm text-gray-500 italic">
                                Няма записано аудио съобщение за тази картичка.
                            </p>
                        </div>
                    {/if}
                </div>

                <!-- Slide 3: Right inner (message) -->
                <div
                    class="flex-[0_0_100%] min-w-0 h-full bg-white flex flex-col p-6"
                    style="container-type: inline-size"
                >
                    <div class="flex-1 flex items-center justify-center">
                        <p
                            class="text-sm md:text-base text-gray-800 leading-relaxed text-center break-words w-full"
                            style={descriptionStyle}
                        >
                            {description}
                        </p>
                    </div>
                    {#if displaySender}
                        <p class="text-xs text-end underline text-gray-600">
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
        <Button
            type="button"
            variant="outline"
            size="icon"
            onclick={scrollNext}
            class="absolute right-0 z-10 rounded-full shadow"
            aria-label="Следващ слайд"
        >
            <ChevronRightIcon />
        </Button>
    </div>
</div>
