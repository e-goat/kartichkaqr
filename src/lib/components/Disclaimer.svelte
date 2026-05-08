<script lang="ts">
    export let title: string;
    export let description: string;
</script>

<div
    class="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 dark:border-amber-600 p-4 rounded-r-lg mt-4"
>
    <div class="flex">
        <div class="shrink-0">
            <span class="text-amber-400 text-xl">⚠️</span>
        </div>
        <div class="ml-3">
            <h3 class="text-sm font-medium text-amber-800 dark:text-amber-400">
                {title}
            </h3>
            <p class="mt-1 text-sm text-amber-700 dark:text-amber-500">
                {description}
            </p>
        </div>
    </div>
</div>
