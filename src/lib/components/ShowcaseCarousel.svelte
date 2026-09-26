<script lang="ts">
    import { onMount } from "svelte";
    import EmblaCarousel from "embla-carousel";
    import type { EmblaCarouselType } from "embla-carousel";
    import { titlePlacementClass, toCqw } from "$lib/config/card";
    import { CARD_IMAGE } from "$lib/config/seo";
    import { imageSrcset, imageUrl } from "$lib/utils/image";
    import type { Template } from "$lib/controller/Template";

    type ShowcaseTemplate = Template & { categories?: { name: string } };

    interface Props {
        templates: ShowcaseTemplate[];
        /** Milliseconds between automatic slides while nobody interacts. */
        interval?: number;
    }

    let { templates, interval = 3000 }: Props = $props();

    // One card fills the slide; the frame caps its size on wide screens.
    const SIZES = "(min-width: 640px) 24rem, 80vw";

    let viewport = $state<HTMLElement | null>(null);
    let embla: EmblaCarouselType | null = null;
    let selected = $state(0);
    // Hovering, focusing or dragging the slider pauses it
    let interacting = $state(false);
    let reducedMotion = $state(false);
    let timer: ReturnType<typeof setInterval> | null = null;

    const autoplaying = $derived(
        !interacting && !reducedMotion && templates.length > 1,
    );

    function stop() {
        if (timer) clearInterval(timer);
        timer = null;
    }

    // Restarting after every interaction gives a full interval before the
    // next automatic slide.
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
                loop: templates.length > 1,
                align: "center",
                duration: 28,
            });
            embla.on("select", () => {
                selected = embla?.selectedScrollSnap() ?? 0;
            });
            embla.on("pointerDown", () => (interacting = true));
            embla.on("pointerUp", () => (interacting = false));
        }

        document.addEventListener("visibilitychange", restart);

        return () => {
            motion.removeEventListener("change", onMotion);
            document.removeEventListener("visibilitychange", restart);
            embla?.destroy();
        };
    });

    /** Loads the visible card and its neighbours eagerly, the rest lazily. */
    function isNear(i: number) {
        const n = templates.length;
        const distance = Math.min(
            Math.abs(i - selected),
            n - Math.abs(i - selected),
        );
        return distance <= 1;
    }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
    class="mx-auto w-full max-w-sm"
    aria-roledescription="carousel"
    aria-label="Примерни картички"
    onmouseenter={() => (interacting = true)}
    onmouseleave={() => (interacting = false)}
    onfocusin={() => (interacting = true)}
    onfocusout={() => (interacting = false)}
>
    <div
        bind:this={viewport}
        class="cursor-grab overflow-hidden rounded-2xl active:cursor-grabbing"
    >
        <div class="flex touch-pan-y">
            {#each templates as t, i (t.id)}
                {@const title = t.title || "Примерна картичка"}
                <article
                    class="min-w-0 flex-[0_0_100%]"
                    aria-roledescription="slide"
                    aria-label="{i + 1} от {templates.length}: {title}"
                >
                    <a
                        href="/create?template={t.id}"
                        class="group relative block aspect-3/4 overflow-hidden rounded-2xl border bg-muted shadow-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        style="container-type: inline-size"
                        draggable="false"
                    >
                        <picture>
                            <source
                                type="image/avif"
                                srcset={imageSrcset(t.background, "avif", 960)}
                                sizes={SIZES}
                            />
                            <source
                                type="image/webp"
                                srcset={imageSrcset(t.background, "webp", 960)}
                                sizes={SIZES}
                            />
                            <img
                                src={imageUrl(t.background, 640)}
                                srcset={imageSrcset(
                                    t.background,
                                    undefined,
                                    960,
                                )}
                                sizes={SIZES}
                                width={CARD_IMAGE.width}
                                height={CARD_IMAGE.height}
                                alt="{title} — шаблон за картичка"
                                loading={isNear(i) ? "eager" : "lazy"}
                                fetchpriority={i === 0 ? "high" : "auto"}
                                decoding={i === 0 ? "sync" : "async"}
                                draggable="false"
                                class="absolute inset-0 size-full object-cover transition-transform duration-700 select-none group-hover:scale-[1.03]"
                            />
                        </picture>
                        {#if t.title}
                            <h3
                                class="pointer-events-none absolute inset-x-[6%] text-center font-normal {titlePlacementClass(
                                    t.titlePos,
                                )}"
                                style="color: {t.fontColor ??
                                    '#ffffff'}; font-family: var(--font-family-{t
                                    .font.name}); font-size: {toCqw(
                                    t.titleFontSize ?? 24,
                                )}; line-height: 1.4;"
                            >
                                {t.title}
                            </h3>
                        {/if}
                        {#if t.categories?.name}
                            <span
                                class="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
                            >
                                {t.categories.name}
                            </span>
                        {/if}
                        <span class="sr-only">— използвай този дизайн</span>
                    </a>
                </article>
            {/each}
        </div>
    </div>
</section>
