<script lang="ts">
    import WishCard from "$lib/components/WishCard.svelte";
    import { cs, ss, pcs } from "$lib/state.svelte.js";

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

    $effect(() => {
        // Clear validation errors when user starts typing
        if (pcs.name && ss.validationErrors.name) {
            delete ss.validationErrors.name;
        }
        if (pcs.email && ss.validationErrors.email) {
            delete ss.validationErrors.email;
        }
        if (pcs.phone && ss.validationErrors.phone) {
            delete ss.validationErrors.phone;
        }
        if (pcs.address && ss.validationErrors.address) {
            delete ss.validationErrors.address;
        }
        if (pcs.comment && ss.validationErrors.comment) {
            delete ss.validationErrors.comment;
        }
    });

    // Handle physical copy checkbox toggle - no validation, just clear fields when unchecked
    function handlePhysicalCopyToggle() {
        if (!pcs.requested) {
            // Checkbox is unchecked - clear all fields and validation errors
            pcs.name = "";
            pcs.email = "";
            pcs.phone = "";
            pcs.address = "";
            pcs.comment = "";

            // Clear validation errors
            delete ss.validationErrors.name;
            delete ss.validationErrors.email;
            delete ss.validationErrors.phone;
            delete ss.validationErrors.address;
            delete ss.validationErrors.comment;
        }
    }
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
                {"Проверете дизайна, съобщението и гласовата поздрав преди да завършите. Вашата персонализирана картичка за подаръци е готова!"}
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
                            name="physical-copy-requested"
                            class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200 cursor-pointer"
                            bind:checked={pcs.requested}
                            onchange={handlePhysicalCopyToggle}
                        />
                        <input
                            type="hidden"
                            name="physical-copy-requested-value"
                            value={pcs.requested ? "true" : "false"}
                        />
                        <label
                            for="physical-copy-checkbox"
                            class="text-sm sm:text-base font-medium text-gray-700 cursor-pointer select-none"
                        >
                            Желаете ли да изготвим картичката за вас?
                        </label>
                    </div>

                    {#if pcs.requested}
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
                                    class="rounded-xl border px-4 py-3 text-base shadow focus:outline-none focus:ring-2 transition-colors w-full"
                                    class:border-red-300={!!ss.validationErrors
                                        .name}
                                    class:border-gray-200={!ss.validationErrors
                                        .name}
                                    class:focus:border-red-500={!!ss
                                        .validationErrors.name}
                                    class:focus:ring-red-200={!!ss
                                        .validationErrors.name}
                                    class:focus:border-blue-500={!ss
                                        .validationErrors.name}
                                    class:focus:ring-blue-200={!ss
                                        .validationErrors.name}
                                    placeholder="Вашето име"
                                    autocomplete="name"
                                    bind:value={pcs.name}
                                    required={pcs.requested}
                                />
                                {#if ss.validationErrors.name}
                                    <p class="mt-1 text-sm text-red-600">
                                        {ss.validationErrors.name}
                                    </p>
                                {/if}
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
                                    class="rounded-xl border px-4 py-3 text-base shadow focus:outline-none focus:ring-2 transition-colors w-full"
                                    class:border-red-300={!!ss.validationErrors
                                        .email}
                                    class:border-gray-200={!ss.validationErrors
                                        .email}
                                    class:focus:border-red-500={!!ss
                                        .validationErrors.email}
                                    class:focus:ring-red-200={!!ss
                                        .validationErrors.email}
                                    class:focus:border-blue-500={!ss
                                        .validationErrors.email}
                                    class:focus:ring-blue-200={!ss
                                        .validationErrors.email}
                                    placeholder="your.email@example.com"
                                    autocomplete="email"
                                    bind:value={pcs.email}
                                    required={pcs.requested}
                                />
                                {#if ss.validationErrors.email}
                                    <p class="mt-1 text-sm text-red-600">
                                        {ss.validationErrors.email}
                                    </p>
                                {/if}
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
                                    class="rounded-xl border px-4 py-3 text-base shadow focus:outline-none focus:ring-2 transition-colors w-full"
                                    class:border-red-300={!!ss.validationErrors
                                        .phone}
                                    class:border-gray-200={!ss.validationErrors
                                        .phone}
                                    class:focus:border-red-500={!!ss
                                        .validationErrors.phone}
                                    class:focus:ring-red-200={!!ss
                                        .validationErrors.phone}
                                    class:focus:border-blue-500={!ss
                                        .validationErrors.phone}
                                    class:focus:ring-blue-200={!ss
                                        .validationErrors.phone}
                                    placeholder="+359 ..."
                                    autocomplete="tel"
                                    bind:value={pcs.phone}
                                    required={pcs.requested}
                                />
                                {#if ss.validationErrors.phone}
                                    <p class="mt-1 text-sm text-red-600">
                                        {ss.validationErrors.phone}
                                    </p>
                                {/if}
                            </div>

                            <div class="flex flex-col w-full">
                                <label
                                    class="mb-1 text-sm font-medium text-gray-700"
                                    for="physical-copy-address"
                                >
                                    Адрес до офис на доставчик
                                    <span class="text-red-500">*</span>
                                </label>
                                <input
                                    id="physical-copy-address"
                                    name="physical-copy-address"
                                    type="text"
                                    class="rounded-xl border px-4 py-3 text-base shadow focus:outline-none focus:ring-2 transition-colors w-full"
                                    class:border-red-300={!!ss.validationErrors
                                        .address}
                                    class:border-gray-200={!ss.validationErrors
                                        .address}
                                    class:focus:border-red-500={!!ss
                                        .validationErrors.address}
                                    class:focus:ring-red-200={!!ss
                                        .validationErrors.address}
                                    class:focus:border-blue-500={!ss
                                        .validationErrors.address}
                                    class:focus:ring-blue-200={!ss
                                        .validationErrors.address}
                                    placeholder="Например: София, офис Еконт №123"
                                    autocomplete="street-address"
                                    bind:value={pcs.address}
                                    required={pcs.requested}
                                />
                                {#if ss.validationErrors.address}
                                    <p class="mt-1 text-sm text-red-600">
                                        {ss.validationErrors.address}
                                    </p>
                                {/if}
                            </div>

                            <div class="flex flex-col w-full">
                                <label
                                    class="mb-1 text-sm font-medium text-gray-700"
                                    for="physical-copy-comment"
                                >
                                    Допълнителен коментар
                                </label>
                                <textarea
                                    id="physical-copy-comment"
                                    name="physical-copy-comment"
                                    class="rounded-xl border px-4 py-3 text-base shadow focus:outline-none focus:ring-2 transition-colors w-full h-24 resize-none"
                                    class:border-red-300={!!ss.validationErrors
                                        .comment}
                                    class:border-gray-200={!ss.validationErrors
                                        .comment}
                                    class:focus:border-red-500={!!ss
                                        .validationErrors.comment}
                                    class:focus:ring-red-200={!!ss
                                        .validationErrors.comment}
                                    class:focus:border-blue-500={!ss
                                        .validationErrors.comment}
                                    class:focus:ring-blue-200={!ss
                                        .validationErrors.comment}
                                    placeholder="Коментар..."
                                    bind:value={pcs.comment}
                                ></textarea>
                                {#if ss.validationErrors.comment}
                                    <p class="mt-1 text-sm text-red-600">
                                        {ss.validationErrors.comment}
                                    </p>
                                {/if}
                            </div>

                            <!-- Pricing Information -->
                            <div
                                class="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                            >
                                <p
                                    class="text-xs text-gray-600 leading-relaxed"
                                >
                                    <strong>Ценообразуване:</strong> Изработката
                                    на една картичка на принтер струва приблизително
                                    4-5 евро. Разходите за доставка се изчисляват
                                    според тарифите на българските превозвачи като
                                    Еконт и зависят от теглото и разстоянието.
                                </p>
                            </div>
                        </div>
                    {/if}
                </aside>
            </div>
        </aside>
    </div>
</section>
