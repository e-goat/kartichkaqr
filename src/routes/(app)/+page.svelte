<script lang="ts">
    import type { PageProps } from "./$types";
    import ClockIcon from "@lucide/svelte/icons/clock";
    import SparklesIcon from "@lucide/svelte/icons/sparkles";
    import PaletteIcon from "@lucide/svelte/icons/palette";
    import MicIcon from "@lucide/svelte/icons/mic";
    import QrCodeIcon from "@lucide/svelte/icons/qr-code";
    import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";

    import Seo from "$lib/components/Seo.svelte";
    import ShowcaseCarousel from "$lib/components/ShowcaseCarousel.svelte";
    import { reveal } from "$lib/actions/reveal";
    import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from "$lib/config/seo";
    import { imageUrl } from "$lib/utils/image";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";

    let { data }: PageProps = $props();

    const title = "Картичка QR - Поздравителни картички с AI дизайн и глас";

    const howItWorks = [
        {
            icon: SparklesIcon,
            title: "Опишете идеята",
            text: "Напишете с няколко думи какво искате и AI ще нарисува уникален дизайн.",
        },
        {
            icon: PaletteIcon,
            title: "Добавете текст и стил",
            text: "Заглавие, съобщение, шрифт, цвят, позиция и завъртане.",
        },
        {
            icon: MicIcon,
            title: "Запишете гласа си",
            text: "Добавете личен гласов поздрав, който се пуска от картичката.",
        },
        {
            icon: QrCodeIcon,
            title: "Споделете",
            text: "Изпратете линк или поръчайте отпечатана картичка с QR код.",
        },
    ];

    const heroImage = $derived(data.showcase[0]);

    const schema = $derived([
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: SITE_NAME,
            inLanguage: "bg",
        },
        {
            "@type": "WebApplication",
            name: SITE_NAME,
            url: `${SITE_URL}/create`,
            applicationCategory: "LifestyleApplication",
            operatingSystem: "Web",
            inLanguage: "bg",
            description: DEFAULT_DESCRIPTION,
            offers: { "@type": "Offer", price: "0", priceCurrency: "BGN" },
        },
        {
            "@type": "ItemList",
            name: "Примерни картички",
            itemListElement: data.showcase.map((t, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                    "@type": "CreativeWork",
                    name: t.title || "Шаблон за картичка",
                    url: `${SITE_URL}/create?template=${t.id}`,
                    inLanguage: "bg",
                    ...(t.categories?.name && { genre: t.categories.name }),
                    ...(t.description && { description: t.description }),
                    image: {
                        "@type": "ImageObject",
                        contentUrl: `${SITE_URL}${imageUrl(t.background, 1200)}`,
                        caption: t.title || undefined,
                    },
                },
            })),
        },
    ]);
</script>

<Seo
    {title}
    description="Създайте персонализирана поздравителна картичка с AI дизайн и вашия глас. Разгледайте примерни картички, изберете повод и споделете с QR код — онлайн или отпечатана."
    canonical="/"
    image={heroImage
        ? {
              url: imageUrl(heroImage.background, 1200),
              alt: heroImage.title ?? "Примерна картичка",
          }
        : null}
    {schema}
/>

<!-- Hero -->
<section
    class="grid items-center gap-10 pb-12 lg:grid-cols-2 lg:gap-12 lg:pb-16"
    aria-labelledby="hero-title"
>
    <div
        class={[
            "flex flex-col gap-5 text-center lg:text-left",
            data.showcase.length === 0 && "lg:col-span-2 lg:text-center",
        ]}
    >
        <div use:reveal={{ effect: "fade" }}>
            <Badge variant="secondary" class="gap-1.5">
                <SparklesIcon class="size-3.5 text-primary" /> AI дизайн + гласов
                поздрав
            </Badge>
        </div>
        <h1
            id="hero-title"
            use:reveal={{ delay: 80 }}
            class="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl"
        >
            Картичка с
            <span
                class="bg-linear-to-r from-brand-gold via-brand-coral to-brand-purple bg-clip-text text-transparent"
                >вашия глас</span
            >
            и уникален дизайн
        </h1>
        <p
            use:reveal={{ delay: 160 }}
            class="text-lg text-pretty text-muted-foreground"
        >
            Опишете идеята си, изберете стил, запишете поздрав и споделете
            картичката с QR код — онлайн или отпечатана.
        </p>
        <div
            use:reveal={{ delay: 240 }}
            class={[
                "flex flex-wrap justify-center gap-3",
                data.showcase.length > 0 && "lg:justify-start",
            ]}
        >
            <Button href="/create" size="lg">
                <SparklesIcon /> Създай картичка
            </Button>
            {#if data.categories.length > 0}
                <Button href="#categories" size="lg" variant="outline">
                    Разгледай поводите
                </Button>
            {/if}
        </div>
    </div>

    {#if data.showcase.length > 0}
        <div use:reveal={{ delay: 120, effect: "fade" }}>
            <ShowcaseCarousel templates={data.showcase} />
        </div>
    {/if}
</section>

<!-- Categories: plain links so crawlers can reach every occasion -->
{#if data.categories.length > 0}
    <section
        id="categories"
        class="flex flex-col gap-6 py-12"
        aria-labelledby="categories-title"
    >
        <div use:reveal class="flex flex-col gap-2 text-center">
            <h2
                id="categories-title"
                class="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
                Картички за всеки повод
            </h2>
            <p class="text-muted-foreground">
                Изберете повод и започнете с AI дизайн или готов шаблон.
            </p>
        </div>
        <nav aria-label="Поводи за картички">
            <ul class="flex flex-wrap justify-center gap-3">
                {#each data.categories as c, i (c.id)}
                    <li use:reveal={{ delay: (i % 6) * 60 }}>
                        <a
                            href="/create?category={c.id}"
                            class="group flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                            Картички за {c.name}
                            {#if c.templates > 0}
                                <span
                                    class="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                                    aria-label="{c.templates} шаблона"
                                    >{c.templates}</span
                                >
                            {/if}
                            <ArrowRightIcon
                                class="size-3.5 transition-transform group-hover:translate-x-0.5"
                            />
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </section>
{/if}

<!-- How it works -->
<section id="how" class="flex flex-col gap-8 py-12" aria-labelledby="how-title">
    <div use:reveal class="flex flex-col gap-2 text-center">
        <h2
            id="how-title"
            class="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
            Как работи
        </h2>
        <p class="text-muted-foreground">
            Четири стъпки до картичка, която ще запомнят.
        </p>
    </div>
    <ol class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each howItWorks as step, i (step.title)}
            <li
                use:reveal={{ delay: i * 100 }}
                class="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
                <div class="flex items-center gap-3">
                    <span
                        class="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"
                    >
                        <step.icon class="size-5" />
                    </span>
                    <span class="text-sm font-medium text-muted-foreground"
                        >Стъпка {i + 1}</span
                    >
                </div>
                <h3 class="font-sans text-base font-semibold">{step.title}</h3>
                <p class="text-sm text-muted-foreground">{step.text}</p>
            </li>
        {/each}
    </ol>
    <div use:reveal class="flex justify-center">
        <Button href="/create" size="lg">
            Започни сега <ArrowRightIcon />
        </Button>
    </div>
</section>

<!-- Storage duration -->
<section use:reveal class="py-12" aria-labelledby="storage-title">
    <Card.Root>
        <Card.Header>
            <Card.Title class="font-sans text-base">
                <h2
                    id="storage-title"
                    class="flex items-center gap-2 font-sans"
                >
                    <ClockIcon class="size-5 text-primary" /> Съхранение на вашата
                    картичка
                </h2>
            </Card.Title>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div
                    class="flex flex-col items-center gap-1 rounded-lg border p-5"
                >
                    <span class="text-5xl leading-none font-bold text-primary"
                        >3</span
                    >
                    <span class="text-sm font-semibold tracking-wide uppercase"
                        >години</span
                    >
                    <p class="text-center text-xs text-muted-foreground">
                        При закупуване на физическа картичка
                    </p>
                </div>
                <div
                    class="flex flex-col items-center gap-1 rounded-lg border p-5"
                >
                    <span
                        class="text-5xl leading-none font-bold text-brand-coral"
                        >3</span
                    >
                    <span class="text-sm font-semibold tracking-wide uppercase"
                        >дни</span
                    >
                    <p class="text-center text-xs text-muted-foreground">
                        За картички предназначени само за онлайн употреба
                    </p>
                </div>
            </div>
            <p class="text-sm leading-relaxed text-muted-foreground">
                Вашата картичка със звукозапис ще бъде запазена в базата данни
                до
                <strong class="text-foreground">3 години</strong> при закупуване
                на физическа картичка или до
                <strong class="text-foreground">3 дни</strong> за картички, предназначени
                само за онлайн употреба. Всички ваши картички са достъпни в „Моите
                картички“.
            </p>
        </Card.Content>
    </Card.Root>
</section>
