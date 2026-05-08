<script lang="ts">
    import NavItem from "$lib/components/NavItem.svelte";
    import { goto } from "$app/navigation";
    import Loader from "$lib/components/Loader.svelte";
    import Hamburger from "$lib/components/Hamburger.svelte";
    import ModeToggle from "$lib/components/ModeToggle.svelte";
    import { ss } from "$lib/state.svelte";
    import { onMount } from "svelte";

    let { logo = "" }: { logo?: string } = $props();
    let mobileMenuOpen = $state(false);
    let isLoading = $state(false);
    let isScrolled = $state(false);
    let headerElement = $state<HTMLElement>();

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function closeMobileMenu(e: MouseEvent) {
        mobileMenuOpen = false;
    }

    async function handleCreateCard() {
        isLoading = true;
        await goto("/card/create");
        isLoading = false;
        mobileMenuOpen = false;
    }

    function handleHome(e: MouseEvent) {
        goto("/");
    }

    onMount(() => {
        if (typeof window === "undefined") return;

        let lastScrollY = window.scrollY;
        const scrollThreshold = 50;

        function handleScroll() {
            const currentScrollY = window.scrollY;
            isScrolled = currentScrollY > scrollThreshold;
            lastScrollY = currentScrollY;
        }

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });
</script>

<link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Geologica:wght@400;700&family=Montserrat:wght@400;500&display=swap"
/>

<header
    class="flex py-4 justify-center items-center border-b border-[#eed9b0] dark:border-gray-700 w-full relative bg-white dark:bg-gray-900 z-50"
    bind:this={headerElement}
>
    <div
        class="flex w-full max-w-7xl justify-between items-center px-3 sm:px-4 lg:px-5 relative"
    >
        <button class="z-[60]" aria-label="Начало" onclick={handleHome}>
            <enhanced:img
                alt="KartichkaQR"
                src={logo}
                class="logo-img w-10 h-10 rounded-xl object-cover shadow-sm outline outline-2 outline-amber-400/60 outline-offset-2 transition-transform duration-300 ease-out"
                class:scale-90={isScrolled}
            />
        </button>

        <!-- Desktop Navigation -->
        <nav class="hidden sm:flex items-center gap-5 lg:gap-6 relative">
            <NavItem target="/">Начало</NavItem>
            <NavItem target="/about">За нас</NavItem>
        </nav>

        <!-- Desktop ModeToggle + CTA Button -->
        <div class="hidden sm:flex items-center gap-2">
            <ModeToggle />
            <button
                class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#229e32] hover:bg-[#1e8a2c] active:scale-95 hover:scale-110 transition-[background-color,transform] duration-200 ease-out"
                class:opacity-50={isLoading || ss.isRendering}
                class:pointer-events-none={isLoading || ss.isRendering}
                aria-label="Създай картичка"
                onclick={handleCreateCard}
            >
                {#if isLoading}
                    <Loader size="sm" color="black" />
                {:else}
                    <svg
                        class="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11 14.01L18 13.963V3.99597L12.83 4.00297L11.016 5.81697L11 14.01ZM9 5.81697L7.179 4.04197L2 4.00697V13.963L9 14.01V5.81697ZM8 2.04697L10 4.00397L12 2.00397L17.997 1.99597C18.2596 1.99558 18.5198 2.04692 18.7626 2.14707C19.0054 2.24721 19.2261 2.3942 19.4121 2.57964C19.5981 2.76508 19.7457 2.98533 19.8466 3.22784C19.9475 3.47034 19.9996 3.73033 20 3.99297V13.963C20 14.491 19.7912 14.9976 19.4192 15.3723C19.0471 15.7469 18.542 15.9593 18.014 15.963L12 16.004L10.004 18.004L8 16.004L1.986 15.963C1.458 15.9593 0.952878 15.7469 0.580828 15.3723C0.208778 14.9976 -1.2936e-05 14.491 6.01176e-10 13.963V4.00697C6.01176e-10 3.47654 0.210714 2.96783 0.585786 2.59276C0.960859 2.21769 1.46957 2.00697 2 2.00697L8 2.04697Z"
                            fill="white"
                        />
                    </svg>
                {/if}
            </button>
        </div>

        <!-- Mobile right controls -->
        <div class="flex sm:hidden items-center gap-1">
            <ModeToggle />
            <Hamburger
                isOpen={mobileMenuOpen}
                onClick={toggleMobileMenu}
                size="md"
            />
        </div>
    </div>

    <!-- Mobile Menu Overlay -->
    {#if mobileMenuOpen}
        <button
            type="button"
            class="fixed inset-0 bg-black/50 z-40 animate-[fadeIn_0.2s_ease-out]"
            onclick={closeMobileMenu}
            aria-label="Затвори меню"
        ></button>
    {/if}

    <!-- Mobile Menu -->
    <nav
        class="fixed top-0 right-0 w-[280px] max-w-[80vw] h-dvh bg-white dark:bg-gray-900 border-l border-[#eed9b0] dark:border-gray-700 z-50 overflow-y-auto shadow-[-4px_0_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out"
        class:translate-x-full={!mobileMenuOpen}
        class:translate-x-0={mobileMenuOpen}
        class:mobile-nav-open={mobileMenuOpen}
    >
        <div
            class="mobile-nav-content flex flex-col min-h-full pt-20 px-6 gap-8"
        >
            <div class="flex flex-col gap-2">
                <NavItem
                    target="/"
                    class="mobile-nav-item"
                    onclick={closeMobileMenu}
                >
                    Начало
                </NavItem>
                <NavItem
                    target="/about"
                    class="mobile-nav-item"
                    onclick={closeMobileMenu}
                >
                    За нас
                </NavItem>
            </div>

            <!-- Mobile CTA Button -->
            <button
                class="mt-auto flex w-full px-5 py-3.5 justify-center items-center gap-3 rounded-[14px] cursor-pointer bg-[#229e32] border-2 border-[#1a7a27] outline outline-[3px] outline-[rgba(34,158,50,0.25)] outline-offset-2 shadow-[0_2px_8px_rgba(34,158,50,0.2)] hover:bg-[#1e8a2c] hover:shadow-[0_4px_12px_rgba(34,158,50,0.3)] active:scale-[0.98] active:shadow-[0_1px_4px_rgba(34,158,50,0.2)] transition-[background-color,transform,box-shadow] duration-200"
                class:opacity-50={isLoading || ss.isRendering}
                class:pointer-events-none={isLoading || ss.isRendering}
                aria-label="Създай картичка"
                onclick={handleCreateCard}
            >
                {#if isLoading}
                    <Loader size="sm" color="black" />
                {:else}
                    <div class="w-5 h-5">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M11 14.01L18 13.963V3.99597L12.83 4.00297L11.016 5.81697L11 14.01ZM9 5.81697L7.179 4.04197L2 4.00697V13.963L9 14.01V5.81697ZM8 2.04697L10 4.00397L12 2.00397L17.997 1.99597C18.2596 1.99558 18.5198 2.04692 18.7626 2.14707C19.0054 2.24721 19.2261 2.3942 19.4121 2.57964C19.5981 2.76508 19.7457 2.98533 19.8466 3.22784C19.9475 3.47034 19.9996 3.73033 20 3.99297V13.963C20 14.491 19.7912 14.9976 19.4192 15.3723C19.0471 15.7469 18.542 15.9593 18.014 15.963L12 16.004L10.004 18.004L8 16.004L1.986 15.963C1.458 15.9593 0.952878 15.7469 0.580828 15.3723C0.208778 14.9976 -1.2936e-05 14.491 6.01176e-10 13.963V4.00697C6.01176e-10 3.47654 0.210714 2.96783 0.585786 2.59276C0.960859 2.21769 1.46957 2.00697 2 2.00697L8 2.04697Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                {/if}
                <span class="text-white font-medium text-base lg:text-lg"
                    >Създай картичка</span
                >
            </button>
        </div>
    </nav>
</header>

<style>
    @keyframes logo-glow {
        0%,
        100% {
            outline-color: rgba(251, 191, 36, 0.65);
            outline-offset: 2px;
        }
        50% {
            outline-color: rgba(251, 191, 36, 0.1);
            outline-offset: 6px;
        }
    }

    .logo-img {
        animation: logo-glow 3s ease-in-out infinite;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .mobile-nav-content {
        padding-bottom: max(24px, calc(24px + env(safe-area-inset-bottom)));
    }

    :global(body:has(.mobile-nav-open)) {
        overflow: hidden;
    }

    :global(.nav-item.mobile-nav-item) {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        border-radius: 12px;
        text-decoration: none;
        color: #303030;
        font:
            500 18px Montserrat,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
        transition:
            background-color 0.2s ease,
            color 0.2s ease;
        min-height: 44px;
    }

    :global(.nav-item.mobile-nav-item:hover) {
        background-color: rgba(48, 48, 48, 0.05);
        color: rgba(48, 48, 48, 0.8);
    }

    :global(.nav-item.mobile-nav-item:active) {
        background-color: rgba(48, 48, 48, 0.1);
    }

    :global(.dark .nav-item.mobile-nav-item) {
        color: #e4e4e4;
    }

    :global(.dark .nav-item.mobile-nav-item:hover) {
        background-color: rgba(255, 255, 255, 0.08);
        color: rgba(228, 228, 228, 0.8);
    }

    :global(.dark .nav-item.mobile-nav-item:active) {
        background-color: rgba(255, 255, 255, 0.12);
    }
</style>
