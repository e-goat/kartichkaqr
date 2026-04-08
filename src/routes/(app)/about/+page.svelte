<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import Loader from "$lib/components/Loader.svelte";
    import "../../app.css";

    let mounted = false;
    let activeCard: number | null = null;
    let isNavigating = false;

    onMount(() => {
        mounted = true;
    });

    async function handleCreateCard() {
        isNavigating = true;
        try {
            await goto("/card/create");
        } finally {
            isNavigating = false;
        }
    }
</script>

<svelte:head>
    <title>{"Картичка QR - За нас"}</title>
    <meta
        name="description"
        content="Научете за KartichkaQR - български екип, който революционизира поздравителните картички с QR кодове и гласови съобщения. Създаваме уникални картички за подаръци, които свързват хората чрез технологии. Мисия, ценности и визия за свързване на хората чрез персонализирани картички. Learn about KartichkaQR - Bulgarian team revolutionizing greeting cards with QR codes and voice messages."
    />
</svelte:head>

<div class="bg-transparent relative z-10">
    {#if mounted}
        <section>
            <div class="p-4" in:fly={{ y: 50, duration: 800, delay: 200 }}>
                <h1
                    class="text-4xl md:text-5xl lg:text-6xl text-gray-900 text-center"
                >
                    За нашата компания
                </h1>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- За нас -->
                <div
                    class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300"
                    in:fly={{ y: 50, duration: 600, delay: 400 }}
                >
                    <div class="text-5xl mb-6 text-center">🏠</div>
                    <h3
                        class="text-3xl font-bold text-slate-800 mb-6 text-center"
                    >
                        За нас
                    </h3>
                    <div
                        class="text-slate-700 leading-relaxed space-y-4 text-base"
                    >
                        <p>
                            Ние сме малък български екип с една проста, но добре
                            обмислена идея: да внесем топлина и човешко
                            отношение в поздравите.
                        </p>
                        <p>
                            В мига, в който някой чуе любим за него глас в
                            картичка, емоцията оживява – и това е нашият принос
                            към това дигиталният свят да изпълнява истинското си
                            предназначение: да събира хората заедно.
                        </p>
                        <p>
                            Започнахме през 2025 година с вярата, че
                            технологията трябва да служи на човешките емоции, а
                            не да ги заменя. Всяка картичка, която създаваме,
                            носи частичка от сърцето на подателя.
                        </p>
                    </div>
                </div>

                <!-- Нашата мисия -->
                <div
                    class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300"
                    in:fly={{ y: 50, duration: 600, delay: 500 }}
                >
                    <div class="text-5xl mb-6 text-center">🎯</div>
                    <h3
                        class="text-3xl font-bold text-slate-800 mb-6 text-center"
                    >
                        Нашата мисия
                    </h3>
                    <div
                        class="text-slate-700 leading-relaxed space-y-4 text-base"
                    >
                        <p>
                            KartichkaQR прави персоналните поздравителни
                            картички прости и значими. Създаваме уникални
                            картички за подаръци, които оставят траен спомен.
                        </p>
                        <p>
                            Записвате гласовото си съобщение, избирате красив
                            дизайн, а ние отпечатваме и доставяме
                            висококачествена картичка с QR код. Перфектни
                            картички за подаръци за всички поводи.
                        </p>
                        <p>
                            Когато се сканира, получателите чуват вашето лично
                            съобщение — създавайки трайни емоционални връзки.
                        </p>
                        <p>
                            Без акаунти, без сложности — просто сърдечна
                            комуникация направена лесна.
                        </p>
                    </div>
                </div>

                <!-- Нашата философия -->
                <div
                    class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300"
                    in:fly={{ y: 50, duration: 600, delay: 600 }}
                >
                    <div class="text-5xl mb-6 text-center">💭</div>
                    <h3
                        class="text-3xl font-bold text-slate-800 mb-6 text-center"
                    >
                        Нашата философия
                    </h3>
                    <div
                        class="text-slate-700 leading-relaxed space-y-4 text-base"
                    >
                        <p
                            class="italic text-center font-medium text-green-700 text-lg"
                        >
                            "Най-важните думи не се четат — те се чуват."
                        </p>
                        <p>
                            Гласът е мостът, който свързва сърцата независимо от
                            разстоянието.
                        </p>
                        <p>
                            Един прост жест — картичка с глас — се превръща в
                            спомен, който може да се слуша отново и отново, дори
                            след години.
                        </p>
                        <p>
                            Вярваме, че в света на бързите съобщения и
                            емотикони, истинската емоция се предава най-добре
                            чрез човешкия глас.
                        </p>
                        <p>
                            Затова създаваме продукт, който съчетава
                            традиционната красота на хартиените картички с
                            магията на съвременните технологии.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="pt-8">
            <div
                class="bg-gradient-to-br from-green-400/50 to-emerald-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 backdrop-blur-sm border border-green-200/50 shadow-xl"
                in:scale={{ duration: 800, delay: 300 }}
            >
                <div class="text-center mb-8 sm:mb-10">
                    <h2
                        class="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6"
                    >
                        Нашата визия
                    </h2>
                    <p
                        class="text-base sm:text-lg lg:text-xl text-black/95 leading-relaxed"
                    >
                        "Да революционизираме начина, по който хората се
                        свързват, като направим всяка поздравителна картичка
                        уникално, лично преживяване, което преодолява разстояния
                        и докосва сърца. Ние не просто създаваме картички за
                        подаръци – ние изграждаме моменти, които имат значение."
                    </p>
                </div>

                <div
                    class="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-white/30"
                    in:fly={{ y: 30, duration: 600, delay: 200 }}
                >
                    <div class="text-center">
                        <h3
                            class="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-3 sm:mb-4 lg:mb-6"
                        >
                            Готови да създадете магия?
                        </h3>
                        <p
                            class="text-slate-600 mb-6 sm:mb-8 lg:mb-10 text-sm sm:text-base lg:text-lg leading-relaxed"
                        >
                            Присъединете се към хилядите потребители, които вече
                            са открили радостта от персонализираните
                            поздравителни картички за подаръци.
                        </p>
                        <div class="space-y-3 sm:space-y-0">
                            <button
                                class="inline-flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-transform duration-300 text-sm sm:text-base lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                on:click={handleCreateCard}
                                disabled={isNavigating}
                            >
                                {#if isNavigating}
                                    <div class="flex items-center">
                                        <div class="mr-2">
                                            <Loader size="sm" color="white" />
                                        </div>
                                        <span>Зареждане...</span>
                                    </div>
                                {:else}
                                    <span>Започни да създаваш сега</span>
                                    <svg
                                        class="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                {/if}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    {/if}
</div>

<style>
    @keyframes float {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
    }
</style>
