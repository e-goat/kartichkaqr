<script lang="ts">
    import NavItem from "$lib/components/NavItem.svelte";
    import { goto } from "$app/navigation";
    import Loader from "$lib/components/Loader.svelte";
    import Hamburger from "$lib/components/Hamburger.svelte";
    import { ss } from "$lib/state.svelte";

    let { logo = "" }: { logo?: string } = $props();
    let mobileMenuOpen = $state(false);
    let isLoading = $state(false);

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
</script>

<link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Geologica:wght@400;700&family=Montserrat:wght@400;500&display=swap"
/>

<header class="header-container">
    <div class="header-content">
        <button
            class="logo-link flex items-center gap-2 text-amber-600 font-bold text-lg hover:text-amber-800 transition-colors"
            aria-label="Начало"
            onclick={handleHome}
        >
            <img
                alt="KartichkaQR"
                src={logo}
                class="w-10 h-10 rounded-full object-cover shadow"
            />
        </button>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav">
            <NavItem target="/">Начало</NavItem>
            <NavItem target="/about">За нас</NavItem>
        </nav>

        <!-- Desktop CTA Button -->
        <button
            class="cta-button desktop-cta"
            class:loading={isLoading || ss.isRendering}
            aria-label="Създай картичка"
            onclick={handleCreateCard}
        >
            {#if isLoading}
                <Loader size="sm" color="black" />
            {:else}
                <div class="cta-icon">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11 14.01L18 13.963V3.99597L12.83 4.00297L11.016 5.81697L11 14.01ZM9 5.81697L7.179 4.04197L2 4.00697V13.963L9 14.01V5.81697ZM8 2.04697L10 4.00397L12 2.00397L17.997 1.99597C18.2596 1.99558 18.5198 2.04692 18.7626 2.14707C19.0054 2.24721 19.2261 2.3942 19.4121 2.57964C19.5981 2.76508 19.7457 2.98533 19.8466 3.22784C19.9475 3.47034 19.9996 3.73033 20 3.99297V13.963C20 14.491 19.7912 14.9976 19.4192 15.3723C19.0471 15.7469 18.542 15.9593 18.014 15.963L12 16.004L10.004 18.004L8 16.004L1.986 15.963C1.458 15.9593 0.952878 15.7469 0.580828 15.3723C0.208778 14.9976 -1.2936e-05 14.491 6.01176e-10 13.963V4.00697C6.01176e-10 3.47654 0.210714 2.96783 0.585786 2.59276C0.960859 2.21769 1.46957 2.00697 2 2.00697L8 2.04697Z"
                            fill="black"
                        />
                    </svg>
                </div>
            {/if}
            <span class="cta-text">Създай картичка</span>
        </button>

        <!-- Mobile Menu Button -->
        <Hamburger
            isOpen={mobileMenuOpen}
            onClick={toggleMobileMenu}
            size="md"
        />
    </div>

    <!-- Mobile Menu Overlay -->
    {#if mobileMenuOpen}
        <button
            type="button"
            class="mobile-overlay"
            onclick={closeMobileMenu}
            aria-label="Затвори меню"
        ></button>
    {/if}

    <!-- Mobile Menu -->
    <nav class="mobile-nav" class:mobile-nav-open={mobileMenuOpen}>
        <div class="mobile-nav-content">
            <div class="mobile-nav-items">
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
                class="mobile-cta-button"
                class:loading={isLoading || ss.isRendering}
                aria-label="Създай картичка"
                onclick={handleCreateCard}
            >
                {#if isLoading}
                    <Loader size="sm" color="black" />
                {:else}
                    <div class="cta-icon">
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
                <span class="cta-text">Създай картичка</span>
            </button>
        </div>
    </nav>
</header>

<style>
    .header-container {
        display: flex;
        padding: 16px 0;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #eed9b0;
        width: 100%;
        position: relative;
        background-color: #fff;
        z-index: 50;
    }

    .header-content {
        display: flex;
        width: 100%;
        max-width: 1280px;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        position: relative;
    }

    @media (max-width: 991px) {
        .header-content {
            padding: 0 16px;
        }
    }

    @media (max-width: 640px) {
        .header-content {
            padding: 0 12px;
        }
    }

    .logo-link {
        text-decoration: none;
        z-index: 60;
    }

    .desktop-nav {
        display: flex;
        align-items: center;
        gap: 24px;
        position: relative;
    }

    @media (max-width: 991px) {
        .desktop-nav {
            gap: 20px;
        }
    }

    @media (max-width: 640px) {
        .desktop-nav {
            display: none;
        }
    }

    .cta-button,
    .mobile-cta-button {
        display: flex;
        padding: 12px 24px;
        justify-content: center;
        align-items: center;
        gap: 16px;
        border-radius: 360px;
        position: relative;
        cursor: pointer;
        background-color: #229e32;
        border: none;
        transition:
            background-color 0.2s ease,
            transform 0.1s ease;
    }

    .cta-button:hover,
    .mobile-cta-button:hover {
        background-color: #1e8a2c;
    }

    .cta-button:active,
    .mobile-cta-button:active {
        transform: scale(0.98);
    }

    @media (max-width: 991px) {
        .cta-button,
        .mobile-cta-button {
            padding: 10px 20px;
        }
    }

    .desktop-cta {
        @media (max-width: 640px) {
            display: none;
        }
    }

    .cta-icon {
        display: flex;
        width: 20px;
        height: 20px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        position: relative;
    }

    .cta-text {
        color: #000;
        position: relative;
        font:
            500 18px Montserrat,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
    }

    @media (max-width: 991px) {
        .cta-text {
            font-size: 16px;
        }
    }

    /* Hamburger component styles are now in Hamburger.svelte */

    .mobile-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 40;
        animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .mobile-nav {
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        max-width: 80vw;
        height: 100vh;
        background-color: #fff;
        border-left: 1px solid #eed9b0;
        z-index: 50;
        transition: right 0.3s ease-out;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
    }

    .mobile-nav-open {
        right: 0;
    }

    .mobile-nav-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 80px 24px 24px;
        gap: 32px;
    }

    .mobile-nav-items {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    /* Override NavItem styles for mobile */
    .mobile-nav-items :global(.nav-item.mobile-nav-item) {
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

    .mobile-nav-items :global(.nav-item.mobile-nav-item:hover) {
        background-color: rgba(48, 48, 48, 0.05);
        color: rgba(48, 48, 48, 0.8);
    }

    .mobile-nav-items :global(.nav-item.mobile-nav-item:active) {
        background-color: rgba(48, 48, 48, 0.1);
    }

    .mobile-cta-button {
        margin-top: auto;
        width: 100%;
        padding: 16px 24px;
    }

    /* Prevent body scroll when mobile menu is open */
    :global(body:has(.mobile-nav-open)) {
        overflow: hidden;
    }

    @media (max-width: 320px) {
        .header-content {
            padding: 0 8px;
        }

        .mobile-nav {
            width: 100%;
            max-width: 100vw;
        }
    }

    .loading {
        opacity: 0.5;
        pointer-events: none;
    }
</style>
