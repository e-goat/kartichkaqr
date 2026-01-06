<script lang="ts">
    import { cs } from "$lib/state.svelte";
    import * as helpers from "$lib/utils/helpers";
    cs.slug = helpers.generateSlug(6);
    cs.cardUuid = helpers.generateCardUuid();
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
                        for="to-input"
                    >
                        До
                    </label>
                    <input
                        id="to-input"
                        name="receiver"
                        type="text"
                        class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors w-full"
                        placeholder="Име на получателя"
                        autocomplete="off"
                        bind:value={cs.receiver}
                    />
                </div>
                <div class="flex flex-col w-full mb-2 sm:mb-3 md:mb-4">
                    <label
                        class="mb-1 text-sm font-medium text-gray-700"
                        for="from-input"
                    >
                        От
                    </label>
                    <input
                        id="from-input"
                        name="sender"
                        type="text"
                        class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors w-full"
                        placeholder="Вашето име"
                        autocomplete="off"
                        bind:value={cs.sender}
                    />
                </div>
                <div class="flex flex-col w-full mb-2 sm:mb-3 md:mb-4">
                    <label
                        class="mb-1 text-sm font-medium text-gray-700"
                        for="to-input"
                    >
                        Заглавие
                    </label>
                    <input
                        id="title-input"
                        name="title"
                        type="text"
                        class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors w-full"
                        placeholder="Заглавие"
                        autocomplete="off"
                        bind:value={cs.title}
                        required
                    />
                </div>
                <div class="flex flex-col w-full mb-2 sm:mb-3 md:mb-4">
                    <label
                        class="mb-1 text-sm font-medium text-gray-700"
                        for="desc-input"
                    >
                        Описание
                    </label>
                    <textarea
                        id="desc-input"
                        name="description"
                        class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors resize-none min-h-[80px] w-full"
                        placeholder="Добавете кратко съобщение"
                        bind:value={cs.description}
                        required
                        rows="4"
                        maxlength="1024"
                    ></textarea>
                </div>
                <input type="hidden" name="slug" value={cs.slug} disabled />
            </div>
        </aside>
    </div>
</section>
