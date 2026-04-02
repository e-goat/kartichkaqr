<script lang="ts">
    export let size: "sm" | "md" | "lg" = "md";
    export let color: string = "white";

    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-8 h-8",
    };
</script>

<div class="flex items-center justify-center">
    <div
        class="animate-spin rounded-full border-2 border-transparent border-t-current {sizeClasses[
            size
        ]}"
        style="color: {color}"
        role="status"
        aria-label="Loading"
    >
        <span class="sr-only">Loading...</span>
    </div>
</div>

<style>
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .animate-spin {
        animation: spin 1s linear infinite;
    }
</style>
