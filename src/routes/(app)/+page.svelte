<script lang="ts">
    import CardCreate from "$lib/components/CardCreate.svelte";
    import openerLogo from "$lib/assets/opener-logo.svg";

    function revealOnScroll(node: HTMLElement) {
        if (typeof IntersectionObserver === "undefined") {
            node.classList.add("in-view");
            return {};
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    node.classList.add("in-view");
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
        );
        observer.observe(node);
        return {
            destroy() {
                observer.disconnect();
            },
        };
    }
</script>

<svelte:head>
    <title>{"Картичка QR - Поздравителна картичка с вашия личен почерк"}</title>
    <meta
        name="description"
        content="Създайте персонализирана поздравителна картичка с вашия почерк и глас. Перфектни картички за подаръци - изберете дизайн, запишете съобщение и споделете с близките си. Create personalized greeting cards with handwriting and voice messages. KartichkaQR - български екип, който революционизира поздравителните картички с QR кодове и гласови съобщения. Идеални картички за подаръци за всички поводи."
    />
</svelte:head>

<div
    class="flex flex-col mx-auto my-0 w-full max-w-[1203px] px-5 py-12 max-md:px-5 max-md:py-10 max-sm:px-4 max-sm:py-8"
>
    <!-- Section A: Features & Preview -->
    <section
        class="w-full bg-[#F9F7F2] rounded-3xl border border-[#EED9B0]/70 px-10 py-12 flex flex-col gap-16 max-md:px-7 max-md:py-10 max-md:gap-12 max-sm:px-5 max-sm:py-8 max-sm:gap-10"
    >
        <!-- Title -->
        <div class="flex flex-col gap-4 justify-center items-center w-full">
            <div
                class="text-4xl font-medium text-center text-zinc-800 max-md:text-3xl max-sm:text-2xl"
            >
                Поздравителна картичка с вашия личен почерк
            </div>
            <svg
                width="991"
                height="2"
                viewBox="0 0 991 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="h-[2px] w-full max-w-[991px]"
            >
                <path
                    d="M1 1H990"
                    stroke="#E7B85C"
                    stroke-width="2"
                    stroke-linecap="round"
                ></path>
            </svg>
        </div>

        <!-- Features + Preview row -->
        <div
            class="flex justify-between items-center w-full flex-col-reverse lg:flex-row gap-16"
        >
            <!-- Feature cards -->
            <div
                class="flex flex-col flex-1 gap-4 w-full max-w-[600px] max-md:max-w-full"
            >
                <div
                    class="card-enter card-enter-1 flex items-center gap-4 p-5 bg-white rounded-2xl border border-amber-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200"
                >
                    <div
                        class="flex-shrink-0 w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center"
                    >
                        <svg
                            width="28"
                            height="30"
                            viewBox="0 0 56 60"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M20.1361 16.531C7.27151 -5.51033 48.7285 -5.51033 35.8639 16.531C48.7285 -5.51033 69.4582 30 43.7266 30C69.4582 30 48.7285 65.5103 35.8639 43.469C48.7285 65.5103 7.27151 65.5103 20.1361 43.469C7.27151 65.5103 -13.4582 30 12.2734 30C-13.4582 30 7.27151 -5.51033 20.1361 16.531Z"
                                fill="#E7B85C"
                            ></path>
                        </svg>
                    </div>
                    <div class="flex flex-col gap-1 min-w-0">
                        <p class="font-semibold text-base text-zinc-800">
                            Изберете дизайн
                        </p>
                        <p class="text-sm text-zinc-500 leading-relaxed">
                            Изберете от красиви шаблони по наш дизайн и създайте
                            вашата специална картичка.
                        </p>
                    </div>
                </div>

                <div
                    class="card-enter card-enter-2 flex items-center gap-4 p-5 bg-white rounded-2xl border border-rose-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-200"
                >
                    <div
                        class="flex-shrink-0 w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center"
                    >
                        <svg
                            width="28"
                            height="26"
                            viewBox="0 0 66 60"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M33.0012 6.47879C51.8023 -12.4594 78.3692 14.3012 59.5681 33.2394L33.0012 60L6.43186 33.2394C-12.3693 14.3012 14.1977 -12.4594 33.0012 6.47879Z"
                                fill="#F27979"
                            ></path>
                        </svg>
                    </div>
                    <div class="flex flex-col gap-1 min-w-0">
                        <p class="font-semibold text-base text-zinc-800">
                            Добавете съобщението си
                        </p>
                        <p class="text-sm text-zinc-500 leading-relaxed">
                            Създавайте красиви картички за подаръци за секунди.
                        </p>
                    </div>
                </div>

                <div
                    class="card-enter card-enter-3 flex items-center gap-4 p-5 bg-white rounded-2xl border border-purple-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200"
                >
                    <div
                        class="flex-shrink-0 w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center"
                    >
                        <svg
                            width="28"
                            height="26"
                            viewBox="0 0 64 60"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0 30C0 32.7404 12.5252 33.4953 13.3408 35.9689C14.1861 38.5314 4.53567 46.3849 6.11277 48.5172C7.70575 50.6711 18.2865 44.0531 20.4752 45.6205C22.6422 47.1734 19.5068 59.128 22.1102 59.9597C24.6223 60.7626 29.2161 49.3033 32 49.3033C34.7839 49.3033 39.3777 60.7626 41.8898 59.9597C44.4932 59.128 41.3578 47.1734 43.525 45.6205C45.7137 44.0531 56.2945 50.6711 57.8875 48.5172C59.4646 46.3825 49.8139 38.5314 50.659 35.9689C51.4748 33.4953 64 32.7404 64 30C64 27.2596 51.4748 26.5048 50.659 24.0311C49.8139 21.4686 59.4643 13.6151 57.8872 11.4828C56.2943 9.32893 45.7135 15.9469 43.5248 14.3795C41.3578 12.8266 44.4932 0.87205 41.8898 0.0403034C39.3777 -0.762596 34.7839 10.6968 32 10.6968C29.2161 10.6968 24.6223 -0.762596 22.1102 0.0403034C19.5068 0.87205 22.6419 12.8266 20.475 14.3795C18.2863 15.9469 7.7055 9.32893 6.11252 11.4828C4.53542 13.6151 14.1861 21.4686 13.3408 24.0311C12.5252 26.5048 0 27.2596 0 30Z"
                                fill="#DE8CFC"
                            ></path>
                        </svg>
                    </div>
                    <div class="flex flex-col gap-1 min-w-0">
                        <p class="font-semibold text-base text-zinc-800">
                            Запишете гласов поздрав
                        </p>
                        <p class="text-sm text-zinc-500 leading-relaxed">
                            Добавете личен гласов поздрав, за да направите
                            картичката си наистина специална.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Card preview / CTA -->
            <div
                class="shrink-0 w-full lg:w-auto card-enter card-enter-preview"
            >
                <div
                    class="flex flex-col gap-6 justify-center items-center p-6 bg-white rounded-2xl border border-amber-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200"
                >
                    <div
                        class="relative w-full max-w-sm h-[220px] sm:h-[250px]"
                    >
                        <img
                            src={openerLogo}
                            alt="Opener logo"
                            class="absolute top-0 left-0 w-full h-full object-contain"
                        />
                    </div>
                    <p
                        class="text-base font-semibold text-center text-zinc-800"
                    >
                        Създайте персонализирана картичка за подаръци за
                        секунди.
                    </p>
                    <CardCreate fullWidth />
                </div>
            </div>
        </div>
    </section>

    <!-- Ornamental separator -->
    <div class="flex items-center gap-5 w-full py-10 max-sm:py-7">
        <div
            class="flex-1 h-[1.5px] bg-gradient-to-r from-transparent to-[#E7B85C]"
        ></div>
        <svg
            width="22"
            height="24"
            viewBox="0 0 56 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="flex-shrink-0 opacity-80"
        >
            <path
                d="M20.1361 16.531C7.27151 -5.51033 48.7285 -5.51033 35.8639 16.531C48.7285 -5.51033 69.4582 30 43.7266 30C69.4582 30 48.7285 65.5103 35.8639 43.469C48.7285 65.5103 7.27151 65.5103 20.1361 43.469C7.27151 65.5103 -13.4582 30 12.2734 30C-13.4582 30 7.27151 -5.51033 20.1361 16.531Z"
                fill="#E7B85C"
            ></path>
        </svg>
        <div
            class="flex-1 h-[1.5px] bg-gradient-to-l from-transparent to-[#E7B85C]"
        ></div>
    </div>

    <!-- Section B: Storage Duration -->
    <section
        use:revealOnScroll
        class="scroll-reveal w-full bg-[#FEF3DA] rounded-3xl border border-[#E7B85C]/35 px-10 py-12 flex flex-col gap-8 max-md:px-7 max-md:py-10 max-sm:px-5 max-sm:py-8"
    >
        <!-- Header -->
        <div class="flex items-center gap-3">
            <div
                class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#E7B85C]/20 flex items-center justify-center"
            >
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="#E7B85C"
                        stroke-width="2"
                    />
                    <path
                        d="M12 7v5l3 3"
                        stroke="#E7B85C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </div>
            <p class="text-base font-semibold text-zinc-700">
                Съхранение на вашата картичка
            </p>
        </div>

        <!-- Stat cards -->
        <div class="flex gap-4 flex-col sm:flex-row">
            <div
                class="flex-1 flex flex-col items-center gap-2 px-6 py-5 bg-white rounded-2xl border border-[#E7B85C]/40 shadow-sm"
            >
                <span class="text-5xl font-bold text-[#C9943A] leading-none"
                    >3</span
                >
                <span
                    class="text-sm font-semibold text-zinc-600 tracking-wide uppercase"
                >
                    години
                </span>
                <p
                    class="text-xs text-zinc-400 text-center leading-relaxed mt-1"
                >
                    При закупуване на физическа картичка
                </p>
            </div>
            <div
                class="flex-1 flex flex-col items-center gap-2 px-6 py-5 bg-white rounded-2xl border border-rose-200 shadow-sm"
            >
                <span class="text-5xl font-bold text-rose-400 leading-none"
                    >3</span
                >
                <span
                    class="text-sm font-semibold text-zinc-600 tracking-wide uppercase"
                >
                    дни
                </span>
                <p
                    class="text-xs text-zinc-400 text-center leading-relaxed mt-1"
                >
                    За картички предназначени само за онлайн употреба
                </p>
            </div>
        </div>

        <!-- Description -->
        <p class="text-sm text-zinc-500 leading-relaxed max-w-2xl">
            Вашата картичка със звукозапис ще бъде запазена в базата данни до <strong
                class="text-zinc-700">3 години</strong
            >
            при закупуване на физическа картичка или до
            <strong class="text-zinc-700">3 дни</strong> за картички, предназначени
            само за онлайн употреба.
        </p>
    </section>
</div>

<style>
    @keyframes fadeUp {
        from {
            opacity: 0;
            transform: translateY(24px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .card-enter {
        animation: fadeUp 0.5s ease-out both;
    }

    .card-enter-1 {
        animation-delay: 0ms;
    }
    .card-enter-2 {
        animation-delay: 130ms;
    }
    .card-enter-3 {
        animation-delay: 260ms;
    }
    .card-enter-preview {
        animation-delay: 80ms;
    }

    .scroll-reveal {
        opacity: 0;
        transform: translateY(36px);
        transition:
            opacity 0.65s ease-out,
            transform 0.65s ease-out;
    }

    .scroll-reveal:global(.in-view) {
        opacity: 1;
        transform: translateY(0);
    }
</style>
