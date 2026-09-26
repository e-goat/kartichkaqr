<script lang="ts">
    import { cs, ss } from "$lib/state.svelte";
    import * as helpers from "$lib/utils/helpers";
    import CardStyleEditor from "$lib/components/CardStyleEditor.svelte";
    import CardPreview from "$lib/components/CardPreview.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Textarea } from "$lib/components/ui/textarea";

    // Generated once per card so revisiting this step keeps the same link
    if (!cs.slug) cs.slug = helpers.generateSlug(6);
    if (!cs.cardUuid) cs.cardUuid = helpers.generateCardUuid();

    $effect(() => {
        if (cs.title && ss.validationErrors.title) {
            delete ss.validationErrors.title;
        }
        if (cs.sender && ss.validationErrors.sender) {
            delete ss.validationErrors.sender;
        }
        if (cs.description && ss.validationErrors.description) {
            delete ss.validationErrors.description;
        }
    });
</script>

<section class="w-full flex flex-col gap-6">
    <div class="flex flex-col gap-1 text-center">
        <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">
            Текст и стил
        </h1>
        <p class="text-muted-foreground">
            Добавете заглавие и съобщение, после изберете шрифт, размер и цвят.
        </p>
    </div>

    <div class="grid gap-8 lg:grid-cols-2">
        <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-2">
                <Label for="title-input">
                    Заглавие <span class="text-destructive">*</span>
                </Label>
                <Input
                    id="title-input"
                    name="title"
                    placeholder="Заглавие на картичката"
                    autocomplete="off"
                    aria-invalid={!!ss.validationErrors.title}
                    bind:value={cs.title}
                />
                {#if ss.validationErrors.title}
                    <p class="text-sm text-destructive">
                        {ss.validationErrors.title}
                    </p>
                {/if}
            </div>
            <div class="flex flex-col gap-2">
                <Label for="from-input">
                    От
                    <span class="text-xs font-normal text-muted-foreground"
                        >(по избор)</span
                    >
                </Label>
                <Input
                    id="from-input"
                    name="sender"
                    placeholder="Вашето име"
                    autocomplete="off"
                    aria-invalid={!!ss.validationErrors.sender}
                    bind:value={cs.sender}
                />
                {#if ss.validationErrors.sender}
                    <p class="text-sm text-destructive">
                        {ss.validationErrors.sender}
                    </p>
                {/if}
            </div>
            <div class="flex flex-col gap-2">
                <Label for="desc-input">
                    Съобщение
                    <span class="text-xs font-normal text-muted-foreground"
                        >(по избор)</span
                    >
                </Label>
                <Textarea
                    id="desc-input"
                    name="description"
                    placeholder="Добавете кратко съобщение"
                    class="min-h-24 resize-none"
                    rows={4}
                    maxlength={512}
                    aria-invalid={!!ss.validationErrors.description}
                    bind:value={cs.description}
                />
                {#if ss.validationErrors.description}
                    <p class="text-sm text-destructive">
                        {ss.validationErrors.description}
                    </p>
                {:else}
                    <p class="text-xs text-muted-foreground">
                        {cs.description?.length || 0} / 500 символа
                    </p>
                {/if}
            </div>
            <input type="hidden" name="slug" value={cs.slug} disabled />

            <CardStyleEditor />
        </div>

        <div class="lg:sticky lg:top-20 self-start flex flex-col gap-2">
            <p class="text-sm font-medium text-muted-foreground">
                Преглед на живо
            </p>
            <CardPreview />
        </div>
    </div>
</section>
