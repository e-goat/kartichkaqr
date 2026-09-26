<script lang="ts">
    import { cs, ts } from "$lib/state.svelte";
    import { titlePlacementClass, toCqw } from "$lib/config/card";
</script>

<!-- Live preview of the card front and the inner message page -->
<div class="grid grid-cols-2 gap-3">
    <div
        class="relative aspect-3/4 overflow-hidden rounded-lg border bg-muted shadow-md"
        style="container-type: inline-size"
    >
        {#if ts.background}
            <img
                src={ts.background}
                alt="Лице на картичката"
                class="absolute inset-0 size-full object-cover"
            />
        {/if}
        {#if cs.title}
            <div
                class="absolute inset-x-[6%] text-center {titlePlacementClass(
                    cs.titlePos,
                )}"
                style="color: {cs.titleColor}; font-family: var(--font-family-{cs.titleFont}); font-size: {toCqw(
                    cs.titleFontSize,
                )}; line-height: 1.4; transform: rotate({cs.titleRotation}deg);"
            >
                {cs.title}
            </div>
        {/if}
    </div>
    <div
        class="relative flex aspect-3/4 flex-col rounded-lg border bg-white p-[8%] shadow-md"
        style="container-type: inline-size"
    >
        <div class="flex flex-1 items-center justify-center">
            <p
                class="w-full text-center leading-relaxed break-words"
                style="color: {cs.descriptionColor}; font-family: var(--font-family-{cs.descriptionFont}); font-size: {toCqw(
                    cs.descriptionFontSize,
                )};"
            >
                {cs.description || "Вашето съобщение..."}
            </p>
        </div>
        {#if cs.sender}
            <p class="text-end text-[4cqw] text-gray-600 underline">
                От: {cs.sender}
            </p>
        {/if}
    </div>
</div>
