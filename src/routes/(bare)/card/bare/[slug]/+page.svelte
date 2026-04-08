<script lang="ts">
    import DestructuredWishCard from "$lib/components/DestructuredWishCard.svelte";
    import type { cardsModel } from "$lib/db";

    let { data }: { data: cardsModel } = $props();
</script>

<DestructuredWishCard
    cardFront={data.template.background ?? ""}
    cardBack={data.template.backgroundBack}
    title={data.template.title}
    description={data.description !== ""
        ? data.description
        : data.template.description}
    sender={data.sender ?? undefined}
    audioUrl={data.audioUrl}
    cardPageUrl={data.cardPageUrl ?? null}
/>
