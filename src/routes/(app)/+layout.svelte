<script lang="ts">
    import { injectAnalytics } from "@vercel/analytics/sveltekit";
    import { ModeWatcher } from "mode-watcher";
    import "../../app.css";
    import Logo from "$lib/assets/logo.jpg";
    import Footer from "$lib/components/Footer.svelte";
    import Header from "$lib/components/Header.svelte";
    import CookieModal from "$lib/components/CookieModal.svelte";
    import { Toaster } from "$lib/components/ui/sonner";
    let { children, data } = $props();
    injectAnalytics();

    const organizationSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "KartichkaQR",
        url: "https://kartichkaqr.com",
        logo: "https://kartichkaqr.com/favicon.ico",
        description:
            "Персонализирани поздравителни картички с QR кодове и гласови съобщения.",
        foundingDate: "2025",
        areaServed: "BG",
        inLanguage: "bg",
    });
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${organizationSchema}<\/script>`}
</svelte:head>

<!-- "theme" keeps the preference users saved with the previous toggle -->
<ModeWatcher modeStorageKey="theme" />
<Toaster richColors position="top-center" />

<main class="min-h-screen flex flex-col">
    <Header logo={Logo} user={data.user} />
    <section class="flex justify-center flex-1 px-4 py-6 sm:py-8">
        <div class="max-w-6xl w-full">
            {@render children()}
        </div>
    </section>
    <Footer />
    <CookieModal cookieConsent={data.cookieConsent} />
</main>
