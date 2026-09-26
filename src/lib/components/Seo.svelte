<script lang="ts">
    import { page } from "$app/state";
    import {
        DEFAULT_DESCRIPTION,
        SITE_NAME,
        canonicalUrl,
        jsonLd,
    } from "$lib/config/seo";

    interface Props {
        title: string;
        description?: string;
        /** Path + query of the canonical page, e.g. "/create?category=3". */
        canonical: string;
        /** Image path or URL; relative paths resolve against this deployment. */
        image?: {
            url: string;
            width?: number;
            height?: number;
            alt?: string;
        } | null;
        type?: "website" | "article";
        /** schema.org objects, rendered as one JSON-LD graph. */
        schema?: Record<string, unknown>[];
    }

    let {
        title,
        description = DEFAULT_DESCRIPTION,
        canonical,
        image = null,
        type = "website",
        schema = [],
    }: Props = $props();

    const href = $derived(canonicalUrl(canonical));
    // Social crawlers fetch the image from where the page is served, so a
    // preview deployment points at its own copy.
    const imageUrl = $derived(
        image ? new URL(image.url, page.url.origin).toString() : null,
    );
    const graph = $derived(
        schema.length
            ? jsonLd({ "@context": "https://schema.org", "@graph": schema })
            : null,
    );
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" {href} />

    <meta property="og:type" content={type} />
    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:locale" content="bg_BG" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={href} />
    {#if imageUrl && image}
        <meta property="og:image" content={imageUrl} />
        {#if image.width && image.height}
            <meta property="og:image:width" content={String(image.width)} />
            <meta property="og:image:height" content={String(image.height)} />
        {/if}
        {#if image.alt}
            <meta property="og:image:alt" content={image.alt} />
        {/if}
        <meta name="twitter:image" content={imageUrl} />
    {/if}
    <meta
        name="twitter:card"
        content={imageUrl ? "summary_large_image" : "summary"}
    />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />

    {#if graph}
        {@html `<script type="application/ld+json">${graph}<\/script>`}
    {/if}
</svelte:head>
