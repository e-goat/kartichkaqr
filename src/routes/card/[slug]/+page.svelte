<script lang="ts">
    import WishCard from "$lib/components/WishCard.svelte";

    type CardData = {
        id: number;
        title: string;
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
        };
    };

    let { data }: { data: CardData } = $props();
</script>

<div class="card-page">
    <button
        onclick={() => history.back()}
        class="back-button"
        type="button"
        aria-label="Назад"
    >
        ← Назад
    </button>

    <WishCard
        cardFront={data.template?.background ?? ""}
        cardBack={data.template?.backgroundBack ??
            data.template?.background ??
            ""}
        title={data.title}
        description={data.description}
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

    .back-button {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.25rem;
        font-size: 0.9375rem;
        font-weight: 600;
        color: black;
        background: #229e32;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition:
            background-color 0.2s ease,
            transform 0.2s ease;
    }

    .back-button:hover {
        background: #1e8a2c;
        transform: translateY(-1px);
    }

    .back-button:active {
        transform: translateY(0);
    }

    .back-button:focus-visible {
        outline: 2px solid #229e32;
        outline-offset: 2px;
    }

    @media (prefers-color-scheme: dark) {
        .back-button {
            color: black;
            background: #229e32;
        }

        .back-button:hover {
            background: #1e8a2c;
        }
    }

    .not-found {
        padding-top: 3rem;
    }

    @media (max-width: 640px) {
        .card-page {
            padding-left: max(1rem, env(safe-area-inset-left));
            padding-right: max(1rem, env(safe-area-inset-right));
        }

        .back-button {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
        }
    }
</style>
