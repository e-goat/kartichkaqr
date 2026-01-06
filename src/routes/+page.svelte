<script lang="ts">
    import { goto } from "$app/navigation";
    import Loader from "$lib/components/Loader.svelte";
    import openerLogo from "$lib/assets/opener-logo.svg";

    let isLoading = false;

    function handleCreateCard() {
        isLoading = true;
        goto("/card/create");
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
    class="flex flex-col gap-20 justify-center items-center px-5 py-20 mx-auto my-0 w-full max-w-[1203px] max-md:gap-16 max-md:px-5 max-md:py-16 max-sm:gap-10 max-sm:px-4 max-sm:py-10"
>
    <!-- Header Section -->
    <div class="flex flex-col gap-4 justify-center items-center w-full">
        <div
            class="text-4xl font-medium text-center text-zinc-800 max-md:text-3xl max-sm:text-2xl"
        >
            Поздравителна картичка с вашия личен почерк
        </div>
        <div>
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
    </div>

    <!-- Main Content -->
    <div
        class="flex justify-between items-center w-full flex-col-reverse lg:flex-row gap-16"
    >
        <!-- Features Section -->
        <div
            class="flex flex-col flex-1 gap-10 items-start max-w-[600px] max-md:max-w-full"
        >
            <!-- Feature 1: Design -->
            <div class="flex flex-col md:flex-row gap-4 items-start w-full">
                <div>
                    <svg
                        width="56"
                        height="60"
                        viewBox="0 0 56 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-14 h-15 flex-shrink-0"
                    >
                        <path
                            d="M20.1361 16.531C7.27151 -5.51033 48.7285 -5.51033 35.8639 16.531C48.7285 -5.51033 69.4582 30 43.7266 30C69.4582 30 48.7285 65.5103 35.8639 43.469C48.7285 65.5103 7.27151 65.5103 20.1361 43.469C7.27151 65.5103 -13.4582 30 12.2734 30C-13.4582 30 7.27151 -5.51033 20.1361 16.531Z"
                            fill="#E7B85C"
                        ></path>
                    </svg>
                </div>
                <div class="flex flex-col gap-2 items-start w-full">
                    <div
                        class="text-xl font-medium text-zinc-800 max-sm:text-lg"
                    >
                        Изберете дизайн
                    </div>
                    <div
                        class="w-full text-base font-medium opacity-50 text-zinc-800 max-sm:text-sm"
                    >
                        Избирайте от красиви шаблони или създайте свой уникален
                        дизайн.
                    </div>
                </div>
            </div>

            <!-- Feature 2: Message -->
            <div class="flex flex-col md:flex-row gap-4 items-start w-full">
                <div>
                    <svg
                        width="66"
                        height="60"
                        viewBox="0 0 66 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-14 h-15 flex-shrink-0"
                    >
                        <path
                            d="M33.0012 6.47879C51.8023 -12.4594 78.3692 14.3012 59.5681 33.2394L33.0012 60L6.43186 33.2394C-12.3693 14.3012 14.1977 -12.4594 33.0012 6.47879Z"
                            fill="#F27979"
                        ></path>
                    </svg>
                </div>
                <div class="flex flex-col gap-2 items-start w-full">
                    <div
                        class="text-xl font-medium text-zinc-800 max-sm:text-lg"
                    >
                        Добавете съобщението си
                    </div>
                    <div
                        class="w-full text-base font-medium opacity-50 text-zinc-800 max-sm:text-sm"
                    >
                        Създавайте красиви картички за подаръци за секунди.
                    </div>
                </div>
            </div>

            <!-- Feature 3: Voice -->
            <div class="flex flex-col md:flex-row gap-4 items-start w-full">
                <div>
                    <svg
                        width="64"
                        height="60"
                        viewBox="0 0 64 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-14 h-15 flex-shrink-0"
                    >
                        <path
                            d="M0 30C0 32.7404 12.5252 33.4953 13.3408 35.9689C14.1861 38.5314 4.53567 46.3849 6.11277 48.5172C7.70575 50.6711 18.2865 44.0531 20.4752 45.6205C22.6422 47.1734 19.5068 59.128 22.1102 59.9597C24.6223 60.7626 29.2161 49.3033 32 49.3033C34.7839 49.3033 39.3777 60.7626 41.8898 59.9597C44.4932 59.128 41.3578 47.1734 43.525 45.6205C45.7137 44.0531 56.2945 50.6711 57.8875 48.5172C59.4646 46.3825 49.8139 38.5314 50.659 35.9689C51.4748 33.4953 64 32.7404 64 30C64 27.2596 51.4748 26.5048 50.659 24.0311C49.8139 21.4686 59.4643 13.6151 57.8872 11.4828C56.2943 9.32893 45.7135 15.9469 43.5248 14.3795C41.3578 12.8266 44.4932 0.87205 41.8898 0.0403034C39.3777 -0.762596 34.7839 10.6968 32 10.6968C29.2161 10.6968 24.6223 -0.762596 22.1102 0.0403034C19.5068 0.87205 22.6419 12.8266 20.475 14.3795C18.2863 15.9469 7.7055 9.32893 6.11252 11.4828C4.53542 13.6151 14.1861 21.4686 13.3408 24.0311C12.5252 26.5048 0 27.2596 0 30Z"
                            fill="#DE8CFC"
                        ></path>
                    </svg>
                </div>
                <div class="flex flex-col gap-2 items-start w-full">
                    <div
                        class="text-xl font-medium text-zinc-800 max-sm:text-lg"
                    >
                        Запишете гласов поздрав
                    </div>
                    <div
                        class="w-full text-base font-medium opacity-50 text-zinc-800 max-sm:text-sm"
                    >
                        Добавете личен гласов поздрав, за да направите
                        картичката си наистина специална. Перфектни картички за
                        подаръци с личен принос.
                    </div>
                </div>
            </div>
        </div>

        <!-- Card Preview Section -->
        <div class="shrink-0">
            <div
                class="flex flex-col gap-10 justify-center items-center p-10 bg-white rounded-2xl shadow-md max-md:p-8 max-sm:gap-8 max-sm:p-5"
            >
                <div
                    class="relative w-96 h-[269px] max-md:w-80 max-md:h-[223px] max-sm:h-[195px] max-sm:w-[280px]"
                >
                    <img
                        src={openerLogo}
                        alt="Opener logo"
                        class="absolute top-0 left-0 w-full h-full"
                    />
                </div>
                <div
                    class="text-xl font-medium text-center text-zinc-800 max-sm:text-lg"
                >
                    Създайте персонализирана картичка за подаръци за секунди.
                </div>
                <button
                    on:click={handleCreateCard}
                    disabled={isLoading}
                    class="flex gap-4 justify-center items-center px-6 py-3 bg-green-600 transition-button cursor-pointer rounded-full hover:bg-green-700 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <div class="flex items-center justify-center w-5 h-5">
                        {#if isLoading}
                            <Loader size="sm" color="black" />
                        {:else}
                            <svg
                                width="20"
                                height="21"
                                viewBox="0 0 20 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-5 h-5"
                            >
                                <path
                                    d="M11 14.2709L18 14.2239V4.25687L12.83 4.26387L11.016 6.07787L11 14.2709ZM9 6.07787L7.179 4.30287L2 4.26787V14.2239L9 14.2709V6.07787ZM8 2.30787L10 4.26487L12 2.26487L17.997 2.25687C18.2596 2.25647 18.5198 2.30782 18.7626 2.40796C19.0054 2.50811 19.2261 2.65509 19.4121 2.84053C19.5981 3.02597 19.7457 3.24623 19.8466 3.48873C19.9475 3.73123 19.9996 3.99122 20 4.25387V14.2239C20 14.7519 19.7912 15.2585 19.4192 15.6332C19.0471 16.0078 18.542 16.2202 18.014 16.2239L12 16.2649L10.004 18.2649L8 16.2649L1.986 16.2239C1.458 16.2202 0.952878 16.0078 0.580828 15.6332C0.208778 15.2585 -1.2936e-05 14.7519 6.01176e-10 14.2239V4.26787C6.01176e-10 3.73744 0.210714 3.22873 0.585786 2.85366C0.960859 2.47858 1.46957 2.26787 2 2.26787L8 2.30787Z"
                                    fill="black"
                                ></path>
                            </svg>
                        {/if}
                    </div>
                    <div
                        class="text-lg font-medium text-black max-sm:text-base"
                    >
                        {isLoading ? "Зареждане..." : "Създай картичка"}
                    </div>
                </button>
            </div>
        </div>
    </div>
</div>
