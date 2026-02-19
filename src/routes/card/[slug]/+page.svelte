<script lang="ts">
    import PlaceholderQR from "$lib/components/PlaceholderQR.svelte";
    import { cs } from "$lib/state.svelte";
    import { buildQR } from "$lib/utils/qr";

    let qrCodeUrl = $state("");
    let hasSlug = $derived(!!cs.audioUrl);

    $effect(() => {
        const audioUrl = cs.audioUrl || "";
        if (!audioUrl) return;
        buildQR(audioUrl).then((qr) => {
            qrCodeUrl = qr;
        });
    });

    type CardData = {
        name: string;
        description: string;
    };

    let { data }: { data: CardData } = $props();
</script>

{#if data}
    <div class="card">
        <h1>{data.name}</h1>
        <p>{data.description}</p>
    </div>
{:else}
    <p>Картичката за подаръци не е намерена.</p>
{/if}

<button onclick={() => history.back()} class="btn btn-secondary">← Назад</button
>
