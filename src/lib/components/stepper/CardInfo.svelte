<script lang="ts">
    import { cs, ss, ts } from "$lib/state.svelte";
    import * as helpers from "$lib/utils/helpers";

    cs.slug = helpers.generateSlug(6);
    cs.cardUuid = helpers.generateCardUuid();

    $effect(() => {
        if (cs.title && ss.validationErrors.title) {
            delete ss.validationErrors.title;
        }
        if (cs.sender && ss.validationErrors.sender) {
            delete ss.validationErrors.sender;
        }
        if (cs.description && ss.validationErrors.description) {
            delete ss.validationErrors.description;
        }
    });
</script>

<section>
    <div class="flex flex-col-reverse lg:flex-row">
        <aside class="flex flex-col gap-2 sm:gap-3 md:gap-4 md:w-full">
            <h1
                class="mb-2 sm:mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl leading-none text-gray-900 text-center"
            >
                {"Поздравителна картичка с вашия личен почерк"}
            </h1>
            <p
                class="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl italic drop-shadow-sm tracking-wide text-center"
            >
                {"Моля, попълнете данните по-долу, за да персонализирате картичката си. Създайте уникална картичка за подаръци с вашия личен принос."}
            </p>
            <div
                class="mt-3 sm:mt-4 md:mt-6 flex flex-col gap-2 sm:gap-3 md:gap-4 w-full max-w-full"
            >
                <div class="flex flex-col w-full mb-2 sm:mb-3 md:mb-4">
                    <label
                        class="mb-1 text-sm font-medium text-gray-700"
                        for="title-input"
                    >
                        Заглавие
                        <span class="text-gray-400 font-normal text-xs ml-1"
                            >(по избор)</span
                        >
                    </label>
                    <input
                        id="title-input"
                        name="title"
                        type="text"
                        class="rounded-xl border px-4 py-3 text-base shadow focus:outline-none focus:ring-2 transition-colors w-full"
                        class:border-red-300={!!ss.validationErrors.title}
                        class:border-gray-200={!ss.validationErrors.title}
                        class:focus:border-red-500={!!ss.validationErrors.title}
                        class:focus:ring-red-200={!!ss.validationErrors.title}
                        class:focus:border-blue-500={!ss.validationErrors.title}
                        class:focus:ring-blue-200={!ss.validationErrors.title}
                        placeholder="Заглавие на картичката"
                        autocomplete="off"
                        bind:value={cs.title}
                    />
                    {#if ss.validationErrors.title}
                        <p class="mt-1 text-sm text-red-600">
                            {ss.validationErrors.title}
                        </p>
                    {/if}
                </div>
                <div class="flex flex-col w-full mb-2 sm:mb-3 md:mb-4">
                    <label
                        class="mb-1 text-sm font-medium text-gray-700"
                        for="from-input"
                    >
                        От
                        <span class="text-gray-400 font-normal text-xs ml-1"
                            >(по избор)</span
                        >
                    </label>
                    <input
                        id="from-input"
                        name="sender"
                        type="text"
                        class="rounded-xl border px-4 py-3 text-base shadow focus:outline-none focus:ring-2 transition-colors w-full"
                        class:border-red-300={!!ss.validationErrors.sender}
                        class:border-gray-200={!ss.validationErrors.sender}
                        class:focus:border-red-500={!!ss.validationErrors
                            .sender}
                        class:focus:ring-red-200={!!ss.validationErrors.sender}
                        class:focus:border-blue-500={!ss.validationErrors
                            .sender}
                        class:focus:ring-blue-200={!ss.validationErrors.sender}
                        placeholder="Вашето име"
                        autocomplete="off"
                        bind:value={cs.sender}
                    />
                    {#if ss.validationErrors.sender}
                        <p class="mt-1 text-sm text-red-600">
                            {ss.validationErrors.sender}
                        </p>
                    {/if}
                </div>
                <div class="flex flex-col w-full mb-2 sm:mb-3 md:mb-4">
                    <label
                        class="mb-1 text-sm font-medium text-gray-700"
                        for="desc-input"
                    >
                        Описание
                        <span class="text-gray-400 font-normal text-xs ml-1"
                            >(по избор)</span
                        >
                    </label>
                    <textarea
                        id="desc-input"
                        name="description"
                        class="rounded-xl border px-4 py-3 text-base shadow focus:outline-none focus:ring-2 transition-colors resize-none min-h-[80px] w-full"
                        class:border-red-300={!!ss.validationErrors.description}
                        class:border-gray-200={!ss.validationErrors.description}
                        class:focus:border-red-500={!!ss.validationErrors
                            .description}
                        class:focus:ring-red-200={!!ss.validationErrors
                            .description}
                        class:focus:border-blue-500={!ss.validationErrors
                            .description}
                        class:focus:ring-blue-200={!ss.validationErrors
                            .description}
                        placeholder="Добавете кратко съобщение"
                        bind:value={cs.description}
                        rows="4"
                        maxlength="512"
                    ></textarea>
                    {#if ss.validationErrors.description}
                        <p class="mt-1 text-sm text-red-600">
                            {ss.validationErrors.description}
                        </p>
                    {:else}
                        <p class="mt-1 text-sm text-gray-500">
                            {cs.description?.length || 0} / 500 символа
                        </p>
                    {/if}
                </div>
                <input type="hidden" name="slug" value={cs.slug} disabled />
            </div>
        </aside>
    </div>
</section>
