<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import CardCreate from "$lib/components/CardCreate.svelte";

    let mounted = false;

    onMount(() => {
        mounted = true;
    });
</script>

<svelte:head>
    <title>{"Картичка QR - За нас"}</title>
    <meta
        name="description"
        content="Научете за KartichkaQR - български екип, който революционизира поздравителните картички с QR кодове и гласови съобщения. Създаваме уникални картички за подаръци, които свързват хората чрез технологии. Мисия, ценности и визия за свързване на хората чрез персонализирани картички. Learn about KartichkaQR - Bulgarian team revolutionizing greeting cards with QR codes and voice messages."
    />
</svelte:head>

<div
    class="flex flex-col gap-8 px-5 py-12 mx-auto w-full max-w-[1203px] max-sm:px-4 max-sm:py-8"
>
    {#if mounted}
        <!-- Page heading -->
        <div
            class="flex flex-col gap-3 items-center"
            in:fly={{ y: 30, duration: 500, delay: 100 }}
        >
            <h1
                class="text-3xl md:text-4xl font-medium text-zinc-800 text-center"
            >
                За нашата компания
            </h1>
            <svg
                width="991"
                height="2"
                viewBox="0 0 991 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="h-[2px] w-full max-w-[500px]"
            >
                <path
                    d="M1 1H990"
                    stroke="#E7B85C"
                    stroke-width="2"
                    stroke-linecap="round"
                ></path>
            </svg>
        </div>

        <!-- Three info cards -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- За нас -->
            <div
                class="flex flex-col gap-5 p-6 bg-white rounded-2xl border border-amber-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200"
                in:fly={{ y: 40, duration: 500, delay: 200 }}
            >
                <div
                    class="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center shrink-0"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-7 h-7 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="1.5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </div>
                <div class="flex flex-col gap-3">
                    <h3 class="text-xl font-semibold text-zinc-800">За нас</h3>
                    <div
                        class="text-sm text-zinc-500 leading-relaxed space-y-3"
                    >
                        <p>
                            Ние сме малък български екип с една проста, но добре
                            обмислена идея: да внесем топлина и човешко
                            отношение в поздравите.
                        </p>
                        <p>
                            В мига, в който някой чуе любим за него глас в
                            картичка, емоцията оживява - и това е нашият принос
                            към дигиталния свят.
                        </p>
                        <p>
                            Започнахме през 2025 година с вярата, че
                            технологията трябва да служи на човешките емоции, а
                            не да ги заменя.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Нашата мисия -->
            <div
                class="flex flex-col gap-5 p-6 bg-white rounded-2xl border border-rose-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-200"
                in:fly={{ y: 40, duration: 500, delay: 300 }}
            >
                <div
                    class="w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center shrink-0"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-7 h-7 text-rose-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="1.5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <div class="flex flex-col gap-3">
                    <h3 class="text-xl font-semibold text-zinc-800">
                        Нашата мисия
                    </h3>
                    <div
                        class="text-sm text-zinc-500 leading-relaxed space-y-3"
                    >
                        <p>
                            KartichkaQR прави персоналните поздравителни
                            картички прости и значими. Създаваме картички, които
                            оставят траен спомен.
                        </p>
                        <p>
                            Записвате гласовото си съобщение, избирате красив
                            дизайн, а ние доставяме картичка с QR код. Перфектни
                            за всички поводи.
                        </p>
                        <p>
                            Без акаунти, без сложности - просто сърдечна
                            комуникация направена лесна.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Нашата философия -->
            <div
                class="flex flex-col gap-5 p-6 bg-white rounded-2xl border border-purple-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200"
                in:fly={{ y: 40, duration: 500, delay: 400 }}
            >
                <div
                    class="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center shrink-0"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-7 h-7 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="1.5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                        />
                    </svg>
                </div>
                <div class="flex flex-col gap-3">
                    <h3 class="text-xl font-semibold text-zinc-800">
                        Нашата философия
                    </h3>
                    <div
                        class="text-sm text-zinc-500 leading-relaxed space-y-3"
                    >
                        <p
                            class="italic font-medium text-zinc-600 text-base border-l-2 border-purple-300 pl-3"
                        >
                            "Най-важните думи не се четат - те се чуват."
                        </p>
                        <p>
                            Гласът е мостът, който свързва сърцата независимо от
                            разстоянието.
                        </p>
                        <p>
                            Вярваме, че в света на бързите съобщения, истинската
                            емоция се предава най-добре чрез човешкия глас.
                        </p>
                        <p>
                            Затова съчетаваме традиционната красота на
                            хартиените картички с магията на съвременните
                            технологии.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Vision & CTA -->
        <div
            class="flex flex-col gap-6 p-6 sm:p-8 bg-white rounded-2xl border border-amber-200 shadow-sm"
            in:fly={{ y: 40, duration: 500, delay: 500 }}
        >
            <div class="flex flex-col gap-3 items-center text-center">
                <h2 class="text-2xl sm:text-3xl font-medium text-zinc-800">
                    Нашата визия
                </h2>
                <svg
                    width="991"
                    height="2"
                    viewBox="0 0 991 2"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-[2px] w-full max-w-[300px]"
                >
                    <path
                        d="M1 1H990"
                        stroke="#E7B85C"
                        stroke-width="2"
                        stroke-linecap="round"
                    ></path>
                </svg>
                <p
                    class="text-sm sm:text-base text-zinc-500 leading-relaxed max-w-2xl italic mt-1"
                >
                    "Да революционизираме начина, по който хората се свързват,
                    като направим всяка поздравителна картичка уникално, лично
                    преживяване. Ние не просто създаваме картички за подаръци -
                    ние изграждаме моменти, които имат значение."
                </p>
            </div>

            <div
                class="flex flex-col items-center gap-4 p-6 bg-amber-50 rounded-xl border border-amber-100 text-center"
            >
                <h3 class="text-lg sm:text-xl font-semibold text-zinc-800">
                    Готови да създадете магия?
                </h3>
                <p class="text-sm text-zinc-500 leading-relaxed max-w-md">
                    Присъединете се към потребителите, които вече са открили
                    радостта от персонализираните поздравителни картички.
                </p>
                <CardCreate label="Започни да създаваш сега" />
            </div>
        </div>
    {/if}
</div>

<style>
    h1,
    h2,
    h3 {
        font-family: "Montserrat", sans-serif;
    }
</style>
