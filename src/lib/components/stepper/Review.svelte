<script lang="ts">
    import WishCard from "$lib/components/WishCard.svelte";
    import { cs } from "$lib/state.svelte.js";

    interface Props {
        templates?: Array<{
            id: number;
            title: string;
            description: string;
            background: string;
            font: string;
            type: string;
        }>;
    }

    let { templates = [] }: Props = $props();

    let selectedTemplate = $derived(
        templates.find((t) => t.id === cs.templateId) || null,
    );

    let physicalCopy = $state({
        requested: false,
        name: "",
        email: "",
        phone: "",
        comment: "",
    });
</script>

<section>
    <div class="flex flex-col gap-2 sm:gap-3 md:gap-4">
        <aside class="flex flex-col gap-2 sm:gap-3 md:gap-4">
            <h1
                class="mb-2 sm:mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl leading-none text-gray-900 text-center"
            >
                {"Прегледайте картичката си"}
            </h1>
            <p
                class="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl italic drop-shadow-sm tracking-wide text-center"
            >
                {"Проверете дизайна, съобщението и гласовата поздрав преди да завършите."}
            </p>
            <div class="flex flex-col gap-2 sm:gap-3 md:gap-4">
                <aside id="wish-card-preview" class="mt-6 wish-card">
                    <WishCard
                        cardFront={selectedTemplate?.background || ""}
                        cardBack={selectedTemplate?.background || ""}
                        title={selectedTemplate?.title || ""}
                        description={selectedTemplate?.description || ""}
                    />
                </aside>
                <aside
                    id="additional-info"
                    class="flex flex-col gap-2 sm:gap-3 md:gap-4 mt-6"
                >
                    <div class="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="physical-copy-checkbox"
                            class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200 cursor-pointer"
                            bind:checked={physicalCopy.requested}
                        />
                        <label
                            for="physical-copy-checkbox"
                            class="text-sm sm:text-base font-medium text-gray-700 cursor-pointer select-none"
                        >
                            Желаете ли да изготвим картичката за вас?
                        </label>
                    </div>

                    {#if physicalCopy.requested}
                        <div
                            class="flex flex-col gap-2 sm:gap-3 md:gap-4 mt-2 pl-2 sm:pl-4"
                        >
                            <div class="flex flex-col w-full">
                                <label
                                    class="mb-1 text-sm font-medium text-gray-700"
                                    for="physical-copy-name"
                                >
                                    Име
                                </label>
                                <input
                                    id="physical-copy-name"
                                    name="physical-copy-name"
                                    type="text"
                                    class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors w-full"
                                    placeholder="Вашето име"
                                    autocomplete="name"
                                    bind:value={physicalCopy.name}
                                    required={physicalCopy.requested}
                                />
                            </div>

                            <div class="flex flex-col w-full">
                                <label
                                    class="mb-1 text-sm font-medium text-gray-700"
                                    for="physical-copy-email"
                                >
                                    Имейл
                                </label>
                                <input
                                    id="physical-copy-email"
                                    name="physical-copy-email"
                                    type="email"
                                    class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors w-full"
                                    placeholder="your.email@example.com"
                                    autocomplete="email"
                                    bind:value={physicalCopy.email}
                                    required={physicalCopy.requested}
                                />
                            </div>

                            <div class="flex flex-col w-full">
                                <label
                                    class="mb-1 text-sm font-medium text-gray-700"
                                    for="physical-copy-phone"
                                >
                                    Телефон
                                </label>
                                <input
                                    id="physical-copy-phone"
                                    name="physical-copy-phone"
                                    type="tel"
                                    class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors w-full"
                                    placeholder="+359 ..."
                                    autocomplete="tel"
                                    bind:value={physicalCopy.phone}
                                    required={physicalCopy.requested}
                                />
                            </div>

                            <div class="flex flex-col w-full">
                                <label
                                    class="mb-1 text-sm font-medium text-gray-700"
                                    for="physical-copy-phone"
                                >
                                    Допълнителен коментар
                                </label>
                                <textarea
                                    id="physical-copy-comment"
                                    name="physical-copy-comment"
                                    class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors w-full h-24 resize-none"
                                    placeholder="Коментар..."
                                    bind:value={physicalCopy.comment}
                                ></textarea>
                            </div>
                        </div>
                    {/if}
                </aside>
            </div>
        </aside>
    </div>
</section>
