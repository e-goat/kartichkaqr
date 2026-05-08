<script lang="ts">
    let { children, target, onclick = undefined, ...props } = $props();
</script>

<a href={target} class="nav-item {props.class || ''}" {onclick}>
    {@render children?.()}
</a>

<style>
    .nav-item {
        color: #303030;
        position: relative;
        cursor: pointer;
        font:
            500 18px Montserrat,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
        text-decoration: none;
        transition: color 0.2s ease;
    }

    .nav-item:hover {
        color: rgba(48, 48, 48, 0.8);
    }

    :global(.dark) .nav-item {
        color: #e4e4e4;
    }

    :global(.dark) .nav-item:hover {
        color: rgba(228, 228, 228, 0.75);
    }

    @media (max-width: 991px) {
        .nav-item {
            font-size: 16px;
        }
    }
</style>
