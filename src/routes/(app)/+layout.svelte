<script lang="ts">
    import { injectAnalytics } from "@vercel/analytics/sveltekit";
    import "../../app.css";
    import Logo from "$lib/assets/logo.jpg";
    import Footer from "$lib/components/Footer.svelte";
    import Header from "$lib/components/Header.svelte";
    import CookieModal from "$lib/components/CookieModal.svelte";
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
