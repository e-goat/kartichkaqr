<script lang="ts">
    import { ai, cs, ss, ts } from "$lib/state.svelte";
    import { CARD_FONT_KEYS, TITLE_FONT_SIZE, toCqw } from "$lib/config/card";
    import { generateImage, useAiImage } from "$lib/controller/AiImage";
    import Pagination from "../Pagination.svelte";
    import { onMount, tick, untrack } from "svelte";
    import RefreshCwIcon from "@lucide/svelte/icons/refresh-cw";
    import CheckIcon from "@lucide/svelte/icons/check";
    import SparklesIcon from "@lucide/svelte/icons/sparkles";
    import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";
    import Loader2Icon from "@lucide/svelte/icons/loader-2";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import * as Tabs from "$lib/components/ui/tabs";
    import { cn } from "$lib/utils/cn";

    type Template = {
        id: number;
        title: string;
        description: string;
        background: string;
        backgroundBack: string;
        titlePos: string;
        titleFontSize: number;
        font: { id: number; name: string };
        fontColor?: string;
    };

    function getTitleStyle(t: Template): string {
        const cqw = ((t.titleFontSize ?? 24) / 340) * 100 - 2;
        const base = `color: ${t.fontColor ?? "#ffffff"}; font-family: var(--font-family-${t.font.name}); font-size: ${cqw.toFixed(2)}cqw; line-height: 1.4; left: 6%; right: 6%;`;
        if (t.titlePos === "top") return base + " top: 6%;";
        if (t.titlePos === "bottom") return base + " bottom: 6%;";
        return base + " top: 50%; transform: translateY(-50%);";
    }

    type Category = {
        id: number;
        name: string;
    };

    interface Props {
        categories: Category[];
    }

    let { categories }: Props = $props();

    let tab = $state(cs.templateId ? "templates" : "ai");

    const PAGE_SIZE = 10;
    const CACHE_MAX = 10;
    const templateCache = new Map<
        string,
        { templates: Template[]; total: number }
    >();

    let templates = $state<Template[]>([]);
    let total = $state(0);
    let currentPage = $state(ts.designPage);
    let selectedCategory = $state<number | null>(ts.designCategory);
    let isLoading = $state(false);

    const usingAiImage = $derived(
        !!ai.result && cs.backgroundUrl === ai.result.imageUrl,
    );

    function cacheKey(categoryId: number | null, page: number) {
        return `${categoryId ?? "all"}-${page}`;
    }

    async function fetchTemplates(categoryId: number | null, page: number = 1) {
        const key = cacheKey(categoryId, page);
        const cached = templateCache.get(key);
        if (cached) {
            templates = cached.templates;
            total = cached.total;
            currentPage = page;
            return;
        }

        isLoading = true;
        const skip = (page - 1) * PAGE_SIZE;
        const params = new URLSearchParams({
            limit: String(PAGE_SIZE),
            skip: String(skip),
        });

        if (categoryId) {
            params.set("categoryId", String(categoryId));
        }

        try {
            const response = await fetch(`/api/templates?${params}`);
            if (!response.ok) {
                throw new Error("Failed to fetch templates");
            }

            const result = await response.json();
            templates = result.templates;
            total = result.total;
            currentPage = result.currentPage;

            if (templateCache.size >= CACHE_MAX) {
                templateCache.delete(templateCache.keys().next().value!);
            }
            templateCache.set(key, {
                templates: result.templates,
                total: result.total,
            });

            await tick();
        } catch (error) {
            console.error("Error fetching templates:", error);
        } finally {
            isLoading = false;
        }
    }

    function selectTemplate(t: Template) {
        cs.templateId = t.id;
        cs.backgroundUrl = null;
        cs.categoryId = null;
        cs.prompt = null;
        ts.background = t.background;
        ts.backgroundBack = t.backgroundBack;
        ts.titlePosition = (t.titlePos ?? "center") as
            | "top"
            | "bottom"
            | "center";

        // The template's title typography becomes the starting point for
        // the per-card style editor in the next step.
        if (CARD_FONT_KEYS.includes(t.font.name)) cs.titleFont = t.font.name;
        if (t.fontColor) cs.titleColor = t.fontColor;
        cs.titleFontSize = Math.min(
            TITLE_FONT_SIZE.max,
            Math.max(TITLE_FONT_SIZE.min, t.titleFontSize ?? 24),
        );

        const newTemplateTitle = t.title ?? "";
        const newTemplateDescription = t.description ?? "";

        // Update title/description if the user hasn't customized them
        // (empty or still matching the previous template's auto-populated value)
        if (!cs.title || cs.title === ts.templateTitle) {
            cs.title = newTemplateTitle;
        }
        if (!cs.description || cs.description === ts.templateDescription) {
            cs.description = newTemplateDescription;
        }

        ts.templateTitle = newTemplateTitle;
        ts.templateDescription = newTemplateDescription;

        // Clear validation error when template is selected
        if (cs.templateId > 0 && ss.validationErrors.templateId) {
            delete ss.validationErrors.templateId;
        }
    }

    function selectCategory(categoryId: number | null) {
        selectedCategory = categoryId;
        ts.designCategory = categoryId;
        ts.designPage = 1;
        fetchTemplates(categoryId);
    }

    function handlePageChange(page: number) {
        ts.designPage = page;
        fetchTemplates(selectedCategory, page);
    }

    onMount(() => {
        fetchTemplates(ts.designCategory, ts.designPage);
    });

    let loadedImages = $state(new Set<number>());
    let aiImageLoaded = $state(false);

    $effect(() => {
        const newIds = new Set(templates.map((t) => t.id));
        const prev = untrack(() => loadedImages);
        loadedImages = new Set([...prev].filter((id) => newIds.has(id)));
    });

    $effect(() => {
        // Reset the fade-in when a new image arrives
        void ai.result?.imageUrl;
        aiImageLoaded = false;
    });

    function handleImageLoad(id: number) {
        loadedImages = new Set([...loadedImages, id]);
    }

    function lazyReveal(node: HTMLElement, index: number) {
        const createdAt = Date.now();
        node.style.opacity = "0";
        node.style.transform = "translateY(8px)";
        node.style.transition = "opacity 0.3s ease, transform 0.3s ease";

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        // Items already in view when rendered get a left-to-right stagger.
                        // Items revealed by scrolling appear immediately.
                        const delay =
                            Date.now() - createdAt < 500 ? index * 50 : 0;
                        setTimeout(() => {
                            node.style.opacity = "1";
                            node.style.transform = "translateY(0)";
                        }, delay);
                        observer.unobserve(node);
                    }
                }
            },
            { threshold: 0.05 },
        );

        observer.observe(node);

        return {
            destroy() {
                observer.unobserve(node);
            },
        };
    }
</script>

<section class="w-full flex flex-col gap-6">
    <div class="flex flex-col gap-1 text-center">
        <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">
            Изберете дизайн
        </h1>
        <p class="text-muted-foreground">
            Използвайте генерираното изображение или изберете готов шаблон.
        </p>
    </div>

    {#if ss.validationErrors.templateId}
        <p
            class="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
            {ss.validationErrors.templateId}
        </p>
    {/if}

    <Tabs.Root bind:value={tab} class="w-full">
        <Tabs.List class="mx-auto">
            <Tabs.Trigger value="ai">
                <SparklesIcon /> AI изображение
            </Tabs.Trigger>
            <Tabs.Trigger value="templates">Готови шаблони</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="ai" class="pt-4">
            <div class="flex flex-col items-center gap-4">
                <div
                    class={cn(
                        "relative aspect-3/4 w-full max-w-xs overflow-hidden rounded-xl border-4 bg-muted shadow-lg",
                        usingAiImage ? "border-primary" : "border-transparent",
                    )}
                    style="container-type: inline-size"
                >
                    {#if ai.generating}
                        <Skeleton class="absolute inset-0 rounded-none" />
                        <div
                            class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground"
                        >
                            <Loader2Icon class="size-8 animate-spin" />
                            <span class="text-sm"
                                >Рисуваме вашата картичка...</span
                            >
                        </div>
                    {:else if ai.result}
                        {#if !aiImageLoaded}
                            <Skeleton class="absolute inset-0 rounded-none" />
                        {/if}
                        <img
                            src={ai.result.imageUrl}
                            alt={ai.result.imagePrompt}
                            class={cn(
                                "absolute inset-0 size-full object-cover transition-opacity duration-500",
                                aiImageLoaded ? "opacity-100" : "opacity-0",
                            )}
                            onload={() => (aiImageLoaded = true)}
                        />
                        {#if aiImageLoaded && cs.title}
                            <div
                                class="absolute inset-x-[6%] top-1/2 -translate-y-1/2 text-center"
                                style="color: {cs.titleColor}; font-family: var(--font-family-{cs.titleFont}); font-size: {toCqw(
                                    cs.titleFontSize,
                                )}; line-height: 1.4;"
                            >
                                {cs.title}
                            </div>
                        {/if}
                    {:else}
                        <div
                            class="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground"
                        >
                            {#if ai.error}
                                <TriangleAlertIcon
                                    class="size-8 text-destructive"
                                />
                                <span class="text-sm text-destructive"
                                    >{ai.error}</span
                                >
                            {:else}
                                <SparklesIcon class="size-8" />
                                <span class="text-sm">
                                    Все още няма генерирано изображение.
                                </span>
                            {/if}
                        </div>
                    {/if}
                </div>

                {#if ai.result && !ai.generating}
                    <div
                        class="flex flex-col items-center gap-2 max-w-md text-center"
                    >
                        <Badge variant="secondary"
                            >{ai.result.category.name}</Badge
                        >
                        {#if ai.result.imagePrompt !== ai.prompt.trim()}
                            <p class="text-xs text-muted-foreground">
                                <span class="font-medium">Подобрен промпт:</span
                                >
                                {ai.result.imagePrompt}
                            </p>
                        {/if}
                    </div>
                {/if}

                <div class="flex flex-wrap justify-center gap-2">
                    {#if ai.result && !usingAiImage && !ai.generating}
                        <Button type="button" onclick={useAiImage}>
                            <CheckIcon /> Използвай това изображение
                        </Button>
                    {/if}
                    <Button
                        type="button"
                        variant="outline"
                        disabled={ai.generating || ai.prompt.trim().length < 3}
                        onclick={() => generateImage({ force: true })}
                    >
                        <RefreshCwIcon />
                        {ai.result || ai.error
                            ? "Генерирай отново"
                            : "Генерирай"}
                    </Button>
                </div>
            </div>
        </Tabs.Content>

        <Tabs.Content value="templates" class="pt-4">
            <div class="relative">
                <div
                    class="flex gap-1.5 overflow-x-auto sm:flex-wrap [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
                >
                    <Button
                        type="button"
                        size="sm"
                        variant={selectedCategory === null
                            ? "default"
                            : "outline"}
                        onclick={() => selectCategory(null)}
                    >
                        Всички
                    </Button>
                    {#each categories as c (c.id)}
                        <Button
                            type="button"
                            size="sm"
                            variant={selectedCategory === c.id
                                ? "default"
                                : "outline"}
                            onclick={() => selectCategory(c.id)}
                        >
                            {c.name}
                        </Button>
                    {/each}
                </div>
            </div>

            {#if isLoading}
                <ul
                    class="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
                >
                    {#each Array(PAGE_SIZE) as _, i (i)}
                        <li>
                            <Skeleton class="aspect-3/4 w-full rounded-xl" />
                        </li>
                    {/each}
                </ul>
            {:else if templates.length === 0}
                <p class="mt-6 py-20 text-center italic text-muted-foreground">
                    Няма налични шаблони за тази категория.
                </p>
            {:else}
                <ul
                    class="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
                >
                    {#each templates as t, i (t.id)}
                        <li use:lazyReveal={i}>
                            <button
                                type="button"
                                class={cn(
                                    "relative aspect-3/4 w-full overflow-hidden rounded-xl border-4 bg-muted shadow-md transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl cursor-pointer",
                                    t.id == cs.templateId
                                        ? "border-primary"
                                        : "border-transparent",
                                )}
                                onclick={() => selectTemplate(t)}
                                aria-label={t.title}
                                aria-pressed={t.id == cs.templateId}
                                style="container-type: inline-size"
                            >
                                {#if !loadedImages.has(t.id)}
                                    <Skeleton
                                        class="absolute inset-0 rounded-none"
                                    />
                                {/if}
                                <enhanced:img
                                    src={t.background}
                                    class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                                    class:opacity-0={!loadedImages.has(t.id)}
                                    class:opacity-100={loadedImages.has(t.id)}
                                    alt={t.title}
                                    loading="lazy"
                                    onload={() => handleImageLoad(t.id)}
                                />
                                {#if loadedImages.has(t.id)}
                                    {@const displayTitle =
                                        cs.title &&
                                        cs.title !== ts.templateTitle
                                            ? cs.title
                                            : t.title}
                                    {#if displayTitle}
                                        <div
                                            class="absolute text-center"
                                            style={getTitleStyle(t)}
                                        >
                                            {displayTitle}
                                        </div>
                                    {/if}
                                {/if}
                                {#if t.id == cs.templateId}
                                    <span
                                        class="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                                    >
                                        <CheckIcon class="size-4" />
                                    </span>
                                {/if}
                            </button>
                        </li>
                    {/each}
                </ul>
            {/if}

            <Pagination
                amount={total}
                url="/"
                {currentPage}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
            />
        </Tabs.Content>
    </Tabs.Root>
    <input type="hidden" name="templateId" value={cs.templateId} />
</section>
