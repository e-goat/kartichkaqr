<script lang="ts">
    import { cs, ss, tcc, ts } from "$lib/state.svelte";
    import Pagination from "../Pagination.svelte";
    import { onMount, tick } from "svelte";

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

    type PageProp = {
        data: {
            templates: Template[];
            total: number;
            currentPage: number;
            pageSize: number;
            categories: Category[];
        };
    };

    let { data }: PageProp = $props();

    // Local reactive state for templates (initialized from server data)
    let templates = $derived<Template[]>(data.templates);
    let total = $derived(data.total);
    let currentPage = $derived(data.currentPage);
    let pageSize = $derived(data.pageSize);
    let selectedCategory = $state<number | null>(ts.designCategory);
    let isLoading = $state(false);

    async function fetchTemplates(categoryId: number | null, page: number = 1) {
        isLoading = true;
        const skip = (page - 1) * pageSize;
        const params = new URLSearchParams({
            limit: String(pageSize),
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

            await tick();
        } catch (error) {
            console.error("Error fetching templates:", error);
        } finally {
            isLoading = false;
        }
    }

    function handleClickEvent(event: MouseEvent) {
        const target = event.currentTarget as HTMLElement | null;
        const cards = document.querySelectorAll(".wish-card");
        for (const card of cards) {
            card.classList.add("border", "border-transparent");
            card.classList.remove(
                "border",
                "border-solid",
                "border-custom-orange-600",
            );
        }
        cs.templateId = parseInt(target?.dataset.templateId ?? "0");
        ts.background = target?.dataset.templateBackground ?? "";
        ts.backgroundBack = target?.dataset.templateBackgroundBack ?? "";
        ts.titlePosition = (target?.dataset.titlePosition ?? "center") as
            | "top"
            | "bottom"
            | "center";
        ts.titleFontSize = parseInt(target?.dataset.titleFontSize ?? "24");
        ts.font = target?.dataset.font ?? "";
        ts.fontColor = target?.dataset.fontColor ?? "";

        const newTemplateTitle = target?.dataset.templateTitle ?? "";
        const newTemplateDescription =
            target?.dataset.templateDescription ?? "";

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

        target?.classList.remove("border", "border-transparent");
        target?.classList.add(
            "border",
            "border-solid",
            "border-custom-orange-600",
        );

        // Clear validation error when template is selected
        if (cs.templateId > 0 && ss.validationErrors.templateId) {
            delete ss.validationErrors.templateId;
        }
    }

    function handleClickEventAll(event: MouseEvent) {
        event.preventDefault();
        selectedCategory = null;
        ts.designCategory = null;
        ts.designPage = 1;
        fetchTemplates(null);
    }

    function handleClickEventCategory(event: MouseEvent, categoryId: number) {
        event.preventDefault();
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
        if (ts.designPage > 1 || ts.designCategory !== null) {
            fetchTemplates(ts.designCategory, ts.designPage);
        }
    });

    let loadedImages = $state(new Set<number>());

    $effect(() => {
        templates;
        loadedImages = new Set();
    });

    function handleImageLoad(id: number) {
        loadedImages = new Set([...loadedImages, id]);
    }

    function lazyReveal(node: HTMLElement) {
        node.style.opacity = "0";
        node.style.transform = "translateY(8px)";
        node.style.transition = "opacity 0.3s ease, transform 0.3s ease";

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        node.style.opacity = "1";
                        node.style.transform = "translateY(0)";
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

<section class="w-full">
    <aside>
        <h1
            class="mb-2 sm:mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl leading-none text-gray-900 dark:text-gray-100 text-center"
        >
            {"Изберете дизайн"}
        </h1>
        <p
            class="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl italic drop-shadow-sm tracking-wide text-center"
        >
            {"Моля, изберете един от показаните шаблони"}
        </p>

        <div
            class="relative mt-6 sm:mt-10 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 px-3 py-2.5 sm:px-4 sm:py-3"
        >
            <section
                class="flex gap-1.5 sm:gap-2 overflow-x-auto sm:flex-wrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                <button
                    type="button"
                    class="shrink-0 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-1.5 rounded-md cursor-pointer transition-colors duration-200"
                    class:bg-custom-orange-600={selectedCategory === null}
                    class:bg-gray-400={selectedCategory !== null}
                    class:dark:bg-gray-600={selectedCategory !== null}
                    onclick={handleClickEventAll}
                >
                    Всички
                </button>
                {#each data.categories as c}
                    <button
                        type="button"
                        class="shrink-0 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-1.5 rounded-md cursor-pointer transition-colors duration-200"
                        class:bg-custom-orange-600={selectedCategory === c.id}
                        class:bg-gray-400={selectedCategory !== c.id}
                        class:dark:bg-gray-600={selectedCategory !== c.id}
                        onclick={(e) => handleClickEventCategory(e, c.id)}
                    >
                        {c.name}
                    </button>
                {/each}
            </section>
            <div
                class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 dark:from-gray-800 to-transparent pointer-events-none rounded-r-xl sm:hidden"
            ></div>
        </div>
        {#if ss.validationErrors.templateId}
            <div
                class="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg"
            >
                <p class="text-sm text-red-600 dark:text-red-400">
                    {ss.validationErrors.templateId}
                </p>
            </div>
        {/if}

        {#if isLoading}
            <div class="mt-6 flex justify-center items-center py-20">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-4 border-custom-orange-600 border-t-transparent"
                ></div>
            </div>
        {:else if templates.length === 0}
            <div class="mt-6 flex justify-center items-center py-20">
                <p class="text-gray-500 dark:text-gray-400 text-lg italic">
                    Няма налични шаблони за тази категория.
                </p>
            </div>
        {:else}
            <ul
                class="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
            >
                {#each templates as t (t.id)}
                    <li use:lazyReveal>
                        <button
                            type="button"
                            class="wish-card border-4 w-full rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:cursor-pointer relative aspect-3/4 bg-gray-50 dark:bg-gray-700"
                            class:border-custom-orange-600={t.id ==
                                cs.templateId}
                            class:border-red-500={ss.validationErrors
                                .templateId && t.id == cs.templateId}
                            class:border-transparent={t.id != cs.templateId &&
                                !ss.validationErrors.templateId}
                            onclick={handleClickEvent}
                            data-template-id={t.id}
                            data-template-title={t.title}
                            data-template-description={t.description}
                            data-template-background={t.background}
                            data-template-background-back={t.backgroundBack}
                            data-title-position={t.titlePos}
                            data-title-font-size={t.titleFontSize}
                            data-font={t.font.name}
                            data-font-color={t.fontColor ?? ""}
                            aria-label={t.title}
                            style="container-type: inline-size"
                        >
                            {#if !loadedImages.has(t.id)}
                                <div
                                    class="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-600 rounded-lg"
                                ></div>
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
                                    cs.title && cs.title !== ts.templateTitle
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
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}

        <Pagination
            amount={total}
            url="/card/create"
            {currentPage}
            {pageSize}
            onPageChange={handlePageChange}
        />
        <input type="hidden" name="templateId" value={cs.templateId} />
    </aside>
</section>
