<script lang="ts">
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
