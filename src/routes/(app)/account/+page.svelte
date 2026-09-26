<script lang="ts">
    import PlusIcon from "@lucide/svelte/icons/plus";
    import MicIcon from "@lucide/svelte/icons/mic";
    import SparklesIcon from "@lucide/svelte/icons/sparkles";
    import TruckIcon from "@lucide/svelte/icons/truck";
    import Trash2Icon from "@lucide/svelte/icons/trash-2";
    import { enhance } from "$app/forms";
    import { reveal } from "$lib/actions/reveal";
    import { toast } from "svelte-sonner";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    let pendingDelete = $state<{ id: number; title: string } | null>(null);
    let deleting = $state(false);

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
            {#each data.cards as card, i (card.id)}
                <li class="relative" use:reveal={{ delay: (i % 4) * 60 }}>
                    <Button
                        variant="secondary"
                        size="icon-sm"
                        class="absolute right-2 top-2 z-10 shadow-sm"
                        aria-label="Изтрий „{card.title}“"
                        onclick={() =>
                            (pendingDelete = {
                                id: card.id,
                                title: card.title,
                            })}
                    >
                        <Trash2Icon />
                    </Button>
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

<AlertDialog.Root
    open={!!pendingDelete}
    onOpenChange={(open) => {
        if (!open && !deleting) pendingDelete = null;
    }}
>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Изтриване на картичката?</AlertDialog.Title>
            <AlertDialog.Description>
                „{pendingDelete?.title}“ ще бъде изтрита заедно с изображението
                и гласовия поздрав. Линкът и QR кодът ще спрат да работят. Това
                действие не може да бъде отменено.
            </AlertDialog.Description>
        </AlertDialog.Header>
        <form
            method="POST"
            action="?/delete"
            use:enhance={() => {
                deleting = true;
                return async ({ result, update }) => {
                    deleting = false;
                    if (result.type === "success") {
                        toast.success("Картичката е изтрита");
                        pendingDelete = null;
                    } else if (result.type === "failure") {
                        toast.error(
                            String(
                                result.data?.error ?? "Грешка при изтриването",
                            ),
                        );
                    } else if (result.type === "error") {
                        toast.error("Грешка при изтриването");
                    }
                    await update();
                };
            }}
        >
            <input type="hidden" name="cardId" value={pendingDelete?.id} />
            <AlertDialog.Footer>
                <AlertDialog.Cancel type="button" disabled={deleting}
                    >Отказ</AlertDialog.Cancel
                >
                <Button type="submit" variant="destructive" disabled={deleting}>
                    {deleting ? "Изтриване…" : "Изтрий"}
                </Button>
            </AlertDialog.Footer>
        </form>
    </AlertDialog.Content>
</AlertDialog.Root>
