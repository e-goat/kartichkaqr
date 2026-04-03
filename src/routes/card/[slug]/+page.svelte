<script lang="ts">
    import WishCard from "$lib/components/WishCard.svelte";

    type CardData = {
        id: number;
        description: string;
        sender: string | null;
        receiver: string | null;
        slug: string;
        audioUrl: string | null;
        cardPageUrl?: string;
        template: {
            id: number;
            background: string;
            backgroundBack: string;
            title?: string;
            description?: string;
        };
    };

    let { data }: { data: CardData } = $props();
</script>

<div class="card-page">
    <button onclick={() => history.back()} type="button" aria-label="Назад">
        ← Назад
    </button>

    <WishCard
        cardFront={data.template.background ?? ""}
        cardBack={data.template.backgroundBack}
        title={data.template.title}
        description={data.description !== ""
            ? data.description
            : data.template.description}
        sender={data.sender ?? undefined}
        receiver={data.receiver ?? undefined}
        audioUrl={data.audioUrl}
        cardPageUrl={data.cardPageUrl ?? null}
    />
</div>

<style>
    .card-page {
        position: relative;
        min-height: 60vh;
        padding: 1rem;
        padding-top: 4rem;
    }

    @media (max-width: 640px) {
        .card-page {
            padding-left: max(1rem, env(safe-area-inset-left));
            padding-right: max(1rem, env(safe-area-inset-right));
        }
    }
</style>
