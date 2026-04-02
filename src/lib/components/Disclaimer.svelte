<script lang="ts">
    export let title: string;
    export let description: string;
</script>

<div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mt-4">
    <div class="flex">
        <div class="flex-shrink-0">
            <span class="text-amber-400 text-xl">⚠️</span>
        </div>
        <div class="ml-3">
            <h3 class="text-sm font-medium text-amber-800">
                {title}
            </h3>
            <p class="mt-1 text-sm text-amber-700">
                {description}
            </p>
        </div>
    </div>
</div>
