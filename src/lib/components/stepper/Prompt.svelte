<script lang="ts">
    import { onMount } from "svelte";
    import SparklesIcon from "@lucide/svelte/icons/sparkles";
    import WandIcon from "@lucide/svelte/icons/wand-sparkles";
    import { ai, ss } from "$lib/state.svelte";
    import { AI_PROMPT_MAX_LENGTH } from "$lib/config/card";
    import {
        loadEnhancePreference,
        saveEnhancePreference,
    } from "$lib/controller/AiImage";
    import { Label } from "$lib/components/ui/label";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Switch } from "$lib/components/ui/switch";
    import * as Select from "$lib/components/ui/select";

    type Category = { id: number; name: string };
    let { categories }: { categories: Category[] } = $props();

    const AUTO = "auto";
    let categoryValue = $state(ai.categoryId ? String(ai.categoryId) : AUTO);
    const categoryLabel = $derived(
        categoryValue === AUTO
            ? "Автоматично (AI избира)"
            : (categories.find((c) => String(c.id) === categoryValue)?.name ??
                  "Автоматично (AI избира)"),
    );

    $effect(() => {
        ai.categoryId = categoryValue === AUTO ? null : Number(categoryValue);
    });

    $effect(() => {
        if (ai.prompt && ss.validationErrors.prompt) {
            delete ss.validationErrors.prompt;
        }
    });

    onMount(loadEnhancePreference);

    const examples = [
        "Рожден ден на баба, която обича рози и градината си",
        "Благодарност към учител, акварел с книги и есенни листа",
        "Сватба на море, залез и нежни пастелни цветове",
    ];
</script>

<section class="w-full max-w-2xl flex flex-col gap-6">
    <div class="flex flex-col gap-2 text-center">
        <span
            class="mx-auto flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
            <SparklesIcon class="size-5" />
        </span>
        <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">
            Каква картичка искате да създадете?
        </h1>
        <p class="text-muted-foreground">
            Опишете повода и настроението. AI ще нарисува уникален дизайн, а
            след това ще добавите текст и гласов поздрав.
        </p>
    </div>

    <div class="flex flex-col gap-2">
        <Label for="ai-prompt">Вашата идея</Label>
        <Textarea
            id="ai-prompt"
            bind:value={ai.prompt}
            rows={4}
            maxlength={AI_PROMPT_MAX_LENGTH}
            placeholder="Напр. „Рожден ден на баба, която обича рози“"
            aria-invalid={!!ss.validationErrors.prompt}
            class="text-base resize-none min-h-28"
        />
        <div class="flex justify-between text-xs text-muted-foreground">
            {#if ss.validationErrors.prompt}
                <span class="text-destructive"
                    >{ss.validationErrors.prompt}</span
                >
            {:else}
                <span>Натиснете „Напред“, за да генерирате изображение.</span>
            {/if}
            <span>{ai.prompt.length} / {AI_PROMPT_MAX_LENGTH}</span>
        </div>
        <div class="flex flex-wrap gap-2 pt-1">
            {#each examples as example (example)}
                <button
                    type="button"
                    class="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onclick={() => (ai.prompt = example)}
                >
                    {example}
                </button>
            {/each}
        </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
            <Label for="ai-category">Повод</Label>
            <Select.Root type="single" bind:value={categoryValue}>
                <Select.Trigger id="ai-category" class="w-full">
                    {categoryLabel}
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value={AUTO} label="Автоматично (AI избира)" />
                    {#each categories as c (c.id)}
                        <Select.Item value={String(c.id)} label={c.name} />
                    {/each}
                </Select.Content>
            </Select.Root>
        </div>

        <div
            class="flex items-start justify-between gap-3 rounded-lg border p-3"
        >
            <div class="flex flex-col gap-1">
                <Label for="ai-enhance" class="flex items-center gap-1.5">
                    <WandIcon class="size-4 text-primary" /> Подобри моя промпт
                </Label>
                <p class="text-xs text-muted-foreground">
                    AI превежда и допълва идеята за по-добър резултат. Запомня
                    се в този браузър.
                </p>
            </div>
            <Switch
                id="ai-enhance"
                checked={ai.enhance}
                onCheckedChange={saveEnhancePreference}
            />
        </div>
    </div>
</section>
