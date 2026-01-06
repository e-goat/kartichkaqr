<script lang="ts">
    import { injectAnalytics } from "@vercel/analytics/sveltekit";
    import "../app.css";
    import Logo from "$lib/assets/logo.jpg";
    import Footer from "$lib/components/Footer.svelte";
    import Header from "$lib/components/Header.svelte";
    import CookieModal from "$lib/components/CookieModal.svelte";

    let { children, data } = $props();
    injectAnalytics();
</script>

<main class="min-h-screen flex flex-col">
    <Header logo={Logo} />
    <section class="flex justify-center flex-1 pt-4 mx-4">
        <div class="max-w-7xl w-full">
            {@render children()}
        </div>
    </section>
    <Footer />
    <CookieModal cookieConsent={data.cookieConsent} />
</main>
