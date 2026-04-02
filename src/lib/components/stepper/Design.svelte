<script lang="ts">
    import { cs, ss, tcc } from "$lib/state.svelte";
    import Pagination from "../Pagination.svelte";
    import { getContrastingColorFromImage } from "$lib/utils/helpers";
    import { onMount, tick } from "svelte";

    type Template = {
        id: number;
        title: string;
        description: string;
        background: string;
        backgroundBack: string;
    };

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
    let templates = $state<Template[]>(data.templates);
    let total = $state(data.total);
    let currentPage = $state(data.currentPage);
    let pageSize = $state(data.pageSize);
    let selectedCategory = $state<number | null>(null);
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
            calculateTemplateColors();
        } catch (error) {
            console.error("Error fetching templates:", error);
        } finally {
            isLoading = false;
        }
    }

    function calculateTemplateColors() {
        const cards = document.querySelectorAll(".wish-card");
        cards.forEach(async (card, index) => {
            const template = templates[index];
            if (template && !tcc.colors.has(template.id)) {
                const color = await getContrastingColorFromImage(
                    card as HTMLElement,
                );
                tcc.colors = new Map(tcc.colors.set(template.id, color));
            }
        });
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
        fetchTemplates(null);
    }

    function handleClickEventCategory(event: MouseEvent, categoryId: number) {
        event.preventDefault();
        selectedCategory = categoryId;
        fetchTemplates(categoryId);
    }

    function handlePageChange(page: number) {
        fetchTemplates(selectedCategory, page);
    }

    onMount(() => {
        calculateTemplateColors();
    });
</script>

<section>
    <aside>
        <h1
            class="mb-2 sm:mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl leading-none text-gray-900 text-center"
        >
            {"Изберете дизайн"}
        </h1>
        <p
            class="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl italic drop-shadow-sm tracking-wide text-center"
        >
            {"Моля, изберете един от показаните шаблони"}
        </p>

        <section class="flex flex-wrap gap-2 mt-12">
            <button
                type="button"
                class="text-white text-sm md:text-base lg:text-lg px-2.5 py-0.5 rounded-full p-5 cursor-pointer transition-colors duration-200"
                class:bg-custom-orange-600={selectedCategory === null}
                class:bg-gray-500={selectedCategory !== null}
                onclick={handleClickEventAll}
            >
                Всички
            </button>
            {#each data.categories as c}
                <button
                    type="button"
                    class="text-white text-sm md:text-base lg:text-lg px-2.5 py-0.5 rounded-full p-5 cursor-pointer transition-colors duration-200"
                    class:bg-custom-orange-600={selectedCategory === c.id}
                    class:bg-gray-500={selectedCategory !== c.id}
                    onclick={(e) => handleClickEventCategory(e, c.id)}
                >
                    {c.name}
                </button>
            {/each}
        </section>
        {#if ss.validationErrors.templateId}
            <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600">
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
                <p class="text-gray-500 text-lg italic">
                    Няма налични шаблони за тази категория.
                </p>
            </div>
        {:else}
            <ul
                class="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
                {#each templates as t (t.id)}
                    <li>
                        <button
                            type="button"
                            class="wish-card border-4 w-full h-60 rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:cursor-pointer relative bg-cover bg-center"
                            class:border-custom-orange-600={t.id ==
                                cs.templateId}
                            class:border-red-500={ss.validationErrors
                                .templateId && t.id == cs.templateId}
                            class:border-transparent={t.id != cs.templateId &&
                                !ss.validationErrors.templateId}
                            style="background-image: url('{t.background}');"
                            onclick={handleClickEvent}
                            data-template-id={t.id}
                        >
                            <!-- Card text -->
                            <div
                                class="absolute inset-0 flex items-center justify-center"
                            >
                                <h2
                                    class="text-lg font-bold text-center px-4"
                                    class:text-white={tcc.colors.get(t.id) ===
                                        "white"}
                                    class:text-black={tcc.colors.get(t.id) ===
                                        "black"}
                                >
                                    {t.title}
                                </h2>
                            </div>

                            <div
                                class="absolute top-3 right-3 w-3 h-3 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            ></div>
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
