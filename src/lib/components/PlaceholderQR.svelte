<script lang="ts">
    /**
     * Placeholder QR code component.
     * Displays a dummy QR-like pattern before the real QR is generated after card submission.
     */
    interface Props {
        size?: number;
    }

    let { size = 100 }: Props = $props();

    // Generate a deterministic pseudo-random grid pattern (QR-like appearance)
    const gridSize = 9;
    const cellSize = size / gridSize;
</script>

<svg
    width={size}
    height={size}
    viewBox="0 0 {size} {size}"
    role="img"
    aria-label="QR code placeholder"
>
    <rect width={size} height={size} fill="white" />
    <!-- Finder patterns (3 corners - QR-like) -->
    <rect x="0" y="0" width={cellSize * 3} height={cellSize * 3} fill="black" />
    <rect
        x={cellSize}
        y={cellSize}
        width={cellSize}
        height={cellSize}
        fill="white"
    />
    <rect
        x={size - cellSize * 3}
        y="0"
        width={cellSize * 3}
        height={cellSize * 3}
        fill="black"
    />
    <rect
        x={size - cellSize * 2}
        y={cellSize}
        width={cellSize}
        height={cellSize}
        fill="white"
    />
    <rect
        x="0"
        y={size - cellSize * 3}
        width={cellSize * 3}
        height={cellSize * 3}
        fill="black"
    />
    <rect
        x={cellSize}
        y={size - cellSize * 2}
        width={cellSize}
        height={cellSize}
        fill="white"
    />
    <!-- Scattered data cells -->
    {#each [2, 3, 4, 5, 6, 7] as i}
        {#each [2, 3, 4, 5, 6] as j}
            {@const fill = (i * 7 + j * 11) % 3 !== 0}
            {#if fill}
                <rect
                    x={i * cellSize}
                    y={j * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill="black"
                />
            {/if}
        {/each}
    {/each}
</svg>
