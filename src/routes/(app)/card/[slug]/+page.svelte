<script lang="ts">
    import WishCard from "$lib/components/WishCard.svelte";
    import type { cardsModel } from "$lib/db";

    let { data }: { data: cardsModel } = $props();
</script>

<WishCard
    cardFront={data.template.background ?? ""}
    cardBack={data.template.backgroundBack}
    font={data.template.font?.name ?? ""}
    fontColor={data.template.fontColor}
    titlePosition={data.template.titlePos}
    titleFontSize={data.template.titleFontSize}
    title={data.title !== "" ? data.title : (data.template.title ?? "")}
    description={data.description !== ""
        ? data.description
        : (data.template.description ?? "")}
    sender={data.sender ?? undefined}
    audioUrl={data.audioUrl}
    cardPageUrl={data.cardPageUrl ?? null}
/>
