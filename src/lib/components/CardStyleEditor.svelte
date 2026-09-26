<script lang="ts">
    import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
    import { cs } from "$lib/state.svelte";
    import {
        CARD_FONTS,
        DEFAULT_CARD_STYLE,
        DESCRIPTION_FONT_SIZE,
        TITLE_FONT_SIZE,
    } from "$lib/config/card";
    import { Button } from "$lib/components/ui/button";
    import { Label } from "$lib/components/ui/label";
    import { Slider } from "$lib/components/ui/slider";
    import * as Select from "$lib/components/ui/select";

    const groups = [
        {
            id: "title",
            label: "Заглавие",
            font: "titleFont",
            size: "titleFontSize",
            color: "titleColor",
            bounds: TITLE_FONT_SIZE,
        },
        {
            id: "description",
            label: "Съобщение",
            font: "descriptionFont",
            size: "descriptionFontSize",
            color: "descriptionColor",
            bounds: DESCRIPTION_FONT_SIZE,
        },
    ] as const;

    function fontLabel(key: string) {
        return CARD_FONTS.find((f) => f.key === key)?.label ?? key;
    }

    function reset() {
        Object.assign(cs, DEFAULT_CARD_STYLE);
    }
</script>

<div class="flex flex-col gap-5">
    {#each groups as g (g.id)}
        <fieldset class="flex flex-col gap-3 rounded-lg border p-4">
            <legend class="px-1 text-sm font-medium">{g.label}</legend>

            <div class="flex flex-col gap-2">
                <Label for="{g.id}-font">Шрифт</Label>
                <Select.Root type="single" bind:value={cs[g.font]}>
                    <Select.Trigger id="{g.id}-font" class="w-full">
                        <span
                            style="font-family: var(--font-family-{cs[g.font]})"
                        >
                            {fontLabel(cs[g.font])}
                        </span>
                    </Select.Trigger>
                    <Select.Content class="max-h-72">
                        {#each CARD_FONTS as f (f.key)}
                            <Select.Item value={f.key} label={f.label}>
                                <span
                                    style="font-family: var(--font-family-{f.key})"
                                >
                                    {f.label}
                                </span>
                            </Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            </div>

            <div class="grid grid-cols-[1fr_auto] items-end gap-4">
                <div class="flex flex-col gap-3">
                    <div class="flex justify-between">
                        <Label for="{g.id}-size">Размер</Label>
                        <span
                            class="text-xs tabular-nums text-muted-foreground"
                        >
                            {cs[g.size]}px
                        </span>
                    </div>
                    <Slider
                        id="{g.id}-size"
                        type="single"
                        bind:value={cs[g.size]}
                        min={g.bounds.min}
                        max={g.bounds.max}
                        step={1}
                    />
                </div>
                <div class="flex flex-col gap-2">
                    <Label for="{g.id}-color">Цвят</Label>
                    <input
                        id="{g.id}-color"
                        type="color"
                        bind:value={cs[g.color]}
                        class="h-9 w-14 cursor-pointer rounded-md border bg-transparent p-1"
                    />
                </div>
            </div>
        </fieldset>
    {/each}

    <Button
        type="button"
        variant="ghost"
        size="sm"
        class="self-start"
        onclick={reset}
    >
        <RotateCcwIcon /> Стил по подразбиране
    </Button>
</div>
