<script lang="ts">
    import { goto } from "$app/navigation";
    import Loader from "$lib/components/Loader.svelte";

    interface Props {
        label?: string;
        fullWidth?: boolean;
        class?: string;
    }

    let {
        label = "Създай картичка",
        fullWidth = false,
        class: className = "",
    }: Props = $props();

    let isLoading = $state(false);

    async function handleCreateCard() {
        isLoading = true;
        try {
            await goto("/card/create");
        } finally {
            isLoading = false;
        }
    }
</script>

<button
    onclick={handleCreateCard}
    disabled={isLoading}
    class="card-create-btn {fullWidth ? 'full-width' : ''} {className}"
    aria-label={label}
>
    <span class="cta-icon">
        {#if isLoading}
            <Loader size="sm" color="white" />
        {:else}
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M11 14.2709L18 14.2239V4.25687L12.83 4.26387L11.016 6.07787L11 14.2709ZM9 6.07787L7.179 4.30287L2 4.26787V14.2239L9 14.2709V6.07787ZM8 2.30787L10 4.26487L12 2.26487L17.997 2.25687C18.2596 2.25647 18.5198 2.30782 18.7626 2.40796C19.0054 2.50811 19.2261 2.65509 19.4121 2.84053C19.5981 3.02597 19.7457 3.24623 19.8466 3.48873C19.9475 3.73123 19.9996 3.99122 20 4.25387V14.2239C20 14.7519 19.7912 15.2585 19.4192 15.6332C19.0471 16.0078 18.542 16.2202 18.014 16.2239L12 16.2649L10.004 18.2649L8 16.2649L1.986 16.2239C1.458 16.2202 0.952878 16.0078 0.580828 15.6332C0.208778 15.2585 -1.2936e-05 14.7519 6.01176e-10 14.2239V4.26787C6.01176e-10 3.73744 0.210714 3.22873 0.585786 2.85366C0.960859 2.47858 1.46957 2.26787 2 2.26787L8 2.30787Z"
                    fill="white"
                />
            </svg>
        {/if}
    </span>
    <span class="cta-text">{isLoading ? "Зареждане..." : label}</span>
</button>

<style>
    .card-create-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        padding: 14px 20px;
        width: fit-content;
        border-radius: 14px;
        background-color: #229e32;
        border: 2px solid #1a7a27;
        outline: 3px solid rgba(34, 158, 50, 0.2);
        outline-offset: 2px;
        box-shadow: 0 2px 8px rgba(34, 158, 50, 0.2);
        cursor: pointer;
        transition:
            background-color 0.2s ease,
            transform 0.15s ease,
            box-shadow 0.2s ease,
            outline-color 0.25s ease,
            outline-offset 0.25s ease;
    }

    .card-create-btn.full-width {
        width: 100%;
    }

    .card-create-btn:hover {
        background-color: #1e8a2c;
        box-shadow: 0 4px 14px rgba(34, 158, 50, 0.35);
        outline-color: rgba(34, 158, 50, 0.55);
        outline-offset: 5px;
    }

    .card-create-btn:active {
        transform: scale(0.98);
        box-shadow: 0 1px 4px rgba(34, 158, 50, 0.2);
        outline-offset: 2px;
    }

    .card-create-btn:disabled {
        opacity: 0.65;
        cursor: not-allowed;
        transform: none;
    }

    .cta-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
    }

    .cta-text {
        font:
            500 18px Montserrat,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
        color: white;
    }

    @media (max-width: 991px) {
        .cta-text {
            font-size: 16px;
        }
    }

    @media (max-width: 640px) {
        .card-create-btn {
            padding: 12px 16px;
        }
    }
</style>
