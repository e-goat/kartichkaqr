<script lang="ts">
    import { onMount } from "svelte";
    import EmblaCarousel from "embla-carousel";
    import type { EmblaCarouselType } from "embla-carousel";
    import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
    import PauseIcon from "@lucide/svelte/icons/pause";
    import PlayIcon from "@lucide/svelte/icons/play";
    import { Button } from "$lib/components/ui/button";
    import { titlePlacementClass, toCqw } from "$lib/config/card";
    import type { Template } from "$lib/controller/Template";
    import { cn } from "$lib/utils/cn";

    interface Props {
        templates: Template[];
        /** Called when a visitor picks a slide's design. */
        onSelect: (t: Template) => void;
        /** Milliseconds between automatic slide changes. */
        interval?: number;
    }

    let { templates, onSelect, interval = 4000 }: Props = $props();

    let viewport = $state<HTMLElement | null>(null);
    let embla: EmblaCarouselType | null = null;
    let selected = $state(0);
    // Paused by the visitor via the play/pause button
    let userPaused = $state(false);
    // Paused while the visitor hovers, focuses or drags the carousel
    let interacting = $state(false);
    let reducedMotion = $state(false);
    let timer: ReturnType<typeof setInterval> | null = null;

    const autoplaying = $derived(
        !userPaused && !interacting && !reducedMotion && templates.length > 1,
    );

    function stop() {
        if (timer) clearInterval(timer);
        timer = null;
    }

    function restart() {
        stop();
        if (!autoplaying || document.hidden) return;
        timer = setInterval(() => embla?.scrollNext(), interval);
    }

    $effect(() => {
        void autoplaying;
        restart();
        return stop;
    });

    onMount(() => {
        const motion = matchMedia("(prefers-reduced-motion: reduce)");
        reducedMotion = motion.matches;
        const onMotion = () => (reducedMotion = motion.matches);
        motion.addEventListener("change", onMotion);

        if (viewport) {
            embla = EmblaCarousel(viewport, {
                loop: templates.length > 2,
                align: "center",
                skipSnaps: false,
                duration: reducedMotion ? 10 : 30,
            });
            embla.on("select", () => {
                selected = embla?.selectedScrollSnap() ?? 0;
            });
            // Manual navigation resets the countdown
            embla.on("pointerDown", () => (interacting = true));
            embla.on("pointerUp", () => {
                interacting = false;
                restart();
            });
        }

        document.addEventListener("visibilitychange", restart);

        return () => {
            motion.removeEventListener("change", onMotion);
            document.removeEventListener("visibilitychange", restart);
            embla?.destroy();
        };
    });

    function go(index: number) {
        embla?.scrollTo(index);
        restart();
    }

    function onKeydown(e: KeyboardEvent) {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            embla?.scrollPrev();
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            embla?.scrollNext();
        }
    }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
    class="relative"
    aria-roledescription="carousel"
    aria-label="Примерни картички"
    onmouseenter={() => (interacting = true)}
    onmouseleave={() => (interacting = false)}
    onfocusin={() => (interacting = true)}
    onfocusout={() => (interacting = false)}
    onkeydown={onKeydown}
>
    <div bind:this={viewport} class="overflow-hidden py-4">
        <ul class="flex touch-pan-y">
            {#each templates as t, i (t.id)}
                <li
                    class="min-w-0 flex-[0_0_62%] px-2 sm:flex-[0_0_42%] lg:flex-[0_0_34%]"
                    aria-roledescription="slide"
                    aria-label="{i + 1} от {templates.length}"
                >
                    <div
                        class={cn(
                            "group relative aspect-3/4 overflow-hidden rounded-2xl border bg-muted shadow-lg transition-all duration-500 ease-out",
                            i === selected
                                ? "scale-100 opacity-100"
                                : "scale-90 opacity-60",
                        )}
                        style="container-type: inline-size"
                    >
                        <img
                            src={t.background}
                            alt={t.title ?? "Примерна картичка"}
                            loading={i < 3 ? "eager" : "lazy"}
                            draggable="false"
                            class="absolute inset-0 size-full object-cover select-none"
                        />
                        {#if t.title}
                            <div
                                class="pointer-events-none absolute inset-x-[6%] text-center {titlePlacementClass(
                                    t.titlePos,
                                )}"
                                style="color: {t.fontColor ??
                                    '#ffffff'}; font-family: var(--font-family-{t
                                    .font.name}); font-size: {toCqw(
                                    t.titleFontSize ?? 24,
                                )}; line-height: 1.4;"
                            >
                                {t.title}
                            </div>
                        {/if}
                        <div
                            class={cn(
                                "absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t from-black/60 to-transparent p-4 pt-12 transition-opacity duration-300",
                                i === selected
                                    ? "opacity-100"
                                    : "pointer-events-none opacity-0",
                            )}
                        >
                            <Button
                                size="sm"
                                tabindex={i === selected ? 0 : -1}
                                onclick={() => onSelect(t)}
                            >
                                Използвай този дизайн
                            </Button>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    </div>

    {#if templates.length > 1}
        <div class="mt-2 flex items-center justify-center gap-3">
            <Button
                variant="outline"
                size="icon-sm"
                class="rounded-full"
                aria-label="Предишна картичка"
                onclick={() => {
                    embla?.scrollPrev();
                    restart();
                }}
            >
                <ChevronLeftIcon />
            </Button>

            <div class="flex items-center gap-1.5">
                {#each templates as t, i (t.id)}
                    <button
                        type="button"
                        class={cn(
                            "h-2 rounded-full transition-all duration-300",
                            i === selected
                                ? "w-6 bg-primary"
                                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60",
                        )}
                        aria-label="Картичка {i + 1}"
                        aria-current={i === selected}
                        onclick={() => go(i)}
                    ></button>
                {/each}
            </div>

            <Button
                variant="outline"
                size="icon-sm"
                class="rounded-full"
                aria-label="Следваща картичка"
                onclick={() => {
                    embla?.scrollNext();
                    restart();
                }}
            >
                <ChevronRightIcon />
            </Button>

            {#if !reducedMotion}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    class="rounded-full"
                    aria-label={userPaused
                        ? "Пусни автоматичното превъртане"
                        : "Спри автоматичното превъртане"}
                    onclick={() => (userPaused = !userPaused)}
                >
                    {#if userPaused}<PlayIcon />{:else}<PauseIcon />{/if}
                </Button>
            {/if}
        </div>
    {/if}
</section>
