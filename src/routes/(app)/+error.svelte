<script lang="ts">
    import { page } from "$app/state";
</script>

<div class="flex flex-col items-center justify-center text-center space-y-8">
    <h1
        class="text-8xl sm:text-9xl font-bebas text-custom-orange-600 leading-none underline"
    >
        {page.status}
    </h1>

    <div
        class="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-2xl"
    >
        {#if page.status === 404}
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                Страницата не е намерена
            </h2>
            <p class="text-lg text-gray-600 mb-6 leading-relaxed">
                Съжаляваме, но страницата, която търсите, не съществува или е
                била преместена.
            </p>
        {:else}
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                Възникна грешка
            </h2>
            <p class="text-lg text-gray-600 mb-6 leading-relaxed">
                Съжаляваме, но нещо се обърка. Моля, опитайте отново по-късно
                или се свържете с нас, ако проблемът продължава.
            </p>
        {/if}

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
                href="/"
                class="bg-custom-orange-400 border-2 border-custom-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-custom-orange-600 hover:shadow-lg transform hover:-translate-y-1 transition-link"
            >
                Към началото
            </a>
            <button
                onclick={() => {
                    /*global history*/
                    history.back();
                }}
                class="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg transform hover:-translate-y-1 transition-link-border"
            >
                Назад
            </button>
        </div>
    </div>
</div>
