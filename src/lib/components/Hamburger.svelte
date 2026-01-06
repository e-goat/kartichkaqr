<script lang="ts">
    export let isOpen = false;
    export let onClick: () => void = () => {};
    export let size: "sm" | "md" | "lg" = "md";

    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-10 h-10",
    };

    const lineClasses = {
        sm: "h-px",
        md: "h-0.5",
        lg: "h-1",
    };
</script>

<button
    class="hamburger-button {sizeClasses[size]}"
    aria-label={isOpen ? "Затвори меню" : "Отвори меню"}
    aria-expanded={isOpen}
    onclick={onClick}
>
    <span class="hamburger-container">
        <span
            class="hamburger-line hamburger-line-1 {lineClasses[size]}"
            class:open={isOpen}
        ></span>
        <span
            class="hamburger-line hamburger-line-2 {lineClasses[size]}"
            class:open={isOpen}
        ></span>
        <span
            class="hamburger-line hamburger-line-3 {lineClasses[size]}"
            class:open={isOpen}
        ></span>
    </span>
</button>

<style>
    .hamburger-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: background-color 0.2s ease;
        position: relative;
        z-index: 60;
        min-height: 44px;
        min-width: 44px;
    }

    @media (max-width: 640px) {
        .hamburger-button {
            display: flex;
        }
    }

    @media (min-width: 641px) {
        .hamburger-button {
            display: none;
        }
    }

    .hamburger-button:hover {
        background-color: rgba(48, 48, 48, 0.1);
    }

    .hamburger-button:active {
        background-color: rgba(48, 48, 48, 0.2);
    }

    .hamburger-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        position: relative;
    }

    .hamburger-line {
        background-color: #303030;
        border-radius: 2px;
        transition:
            transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            margin-top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: center;
        display: block;
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    /* Initial positioning for closed state */
    .hamburger-line-1 {
        margin-top: -6px;
    }

    .hamburger-line-2 {
        margin-top: 0;
    }

    .hamburger-line-3 {
        margin-top: 6px;
    }

    /* Animation when open - all lines converge to center */
    .hamburger-line.open {
        margin-top: 0;
    }

    .hamburger-line-1.open {
        transform: translate(-50%, -50%) rotate(45deg);
    }

    .hamburger-line-2.open {
        opacity: 0;
        transform: translate(-50%, -50%) scaleX(0);
    }

    .hamburger-line-3.open {
        transform: translate(-50%, -50%) rotate(-45deg);
    }

    /* Adjust line spacing for different sizes using absolute positioning */
    .hamburger-container {
        gap: 0; /* Remove flexbox gap since we use absolute positioning */
    }
</style>
