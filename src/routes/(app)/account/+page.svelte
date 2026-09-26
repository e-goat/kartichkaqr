<script lang="ts">
    import PlusIcon from "@lucide/svelte/icons/plus";
    import MicIcon from "@lucide/svelte/icons/mic";
    import SparklesIcon from "@lucide/svelte/icons/sparkles";
    import TruckIcon from "@lucide/svelte/icons/truck";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    const dateFormat = new Intl.DateTimeFormat("bg-BG", {
        dateStyle: "medium",
    });
</script>

<svelte:head>
    <title>Моите картички | Картичка QR</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<div class="flex flex-col gap-6">
    <div class="flex items-end justify-between gap-4">
        <div>
            <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">
                Моите картички
            </h1>
            <p class="text-muted-foreground">
                {data.cards.length}
                {data.cards.length === 1 ? "картичка" : "картички"}
            </p>
        </div>
        <Button href="/"><PlusIcon /> Нова картичка</Button>
    </div>

    {#if data.cards.length === 0}
        <Card.Root class="items-center py-16 text-center">
            <Card.Content class="flex flex-col items-center gap-3">
                <SparklesIcon class="size-8 text-primary" />
                <p class="text-muted-foreground">
                    Все още нямате създадени картички.
                </p>
                <Button href="/">Създайте първата си картичка</Button>
            </Card.Content>
        </Card.Root>
    {:else}
        <ul class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {#each data.cards as card (card.slug)}
                <li>
                    <a
                        href="/card/{card.slug}"
                        class="group flex flex-col gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                        <div
                            class="relative aspect-3/4 overflow-hidden rounded-xl border bg-muted shadow-sm transition-shadow group-hover:shadow-md"
                        >
                            {#if card.image}
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    loading="lazy"
                                    class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                            {/if}
                            <div class="absolute left-2 top-2 flex gap-1">
                                {#if card.generated}
                                    <Badge class="gap-1"
                                        ><SparklesIcon class="size-3" /> AI</Badge
                                    >
                                {/if}
                                {#if card.hasAudio}
                                    <Badge
                                        variant="secondary"
                                        aria-label="С гласов поздрав"
                                        ><MicIcon class="size-3" /></Badge
                                    >
                                {/if}
                                {#if card.physical}
                                    <Badge
                                        variant="secondary"
                                        aria-label="Поръчана физическа картичка"
                                        ><TruckIcon class="size-3" /></Badge
                                    >
                                {/if}
                            </div>
                        </div>
                        <div>
                            <p class="truncate text-sm font-medium">
                                {card.title}
                            </p>
                            <p class="text-xs text-muted-foreground">
                                {dateFormat.format(new Date(card.createdAt))}
                                {#if card.category}· {card.category}{/if}
                            </p>
                        </div>
                    </a>
                </li>
            {/each}
        </ul>
    {/if}
</div>
