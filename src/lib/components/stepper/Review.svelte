<script lang="ts">
    import WishCard from "$lib/components/WishCard.svelte";
    import { cs, ss, pcs, ts } from "$lib/state.svelte";
    import TruckIcon from "@lucide/svelte/icons/truck";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Switch } from "$lib/components/ui/switch";
    import { Textarea } from "$lib/components/ui/textarea";

    const fields = [
        {
            id: "name",
            label: "Име",
            type: "text",
            placeholder: "Вашето име",
            autocomplete: "name",
        },
        {
            id: "email",
            label: "Имейл",
            type: "email",
            placeholder: "your.email@example.com",
            autocomplete: "email",
        },
        {
            id: "phone",
            label: "Телефон",
            type: "tel",
            placeholder: "+359 ...",
            autocomplete: "tel",
        },
        {
            id: "address",
            label: "Адрес до офис на доставчик",
            type: "text",
            placeholder: "Например: София, офис Еконт №123",
            autocomplete: "street-address",
            required: true,
        },
    ] as const;

    $effect(() => {
        // Clear validation errors when user starts typing
        if (pcs.name && ss.validationErrors.name) {
            delete ss.validationErrors.name;
        }
        if (pcs.email && ss.validationErrors.email) {
            delete ss.validationErrors.email;
        }
        if (pcs.phone && ss.validationErrors.phone) {
            delete ss.validationErrors.phone;
        }
        if (pcs.address && ss.validationErrors.address) {
            delete ss.validationErrors.address;
        }
        if (pcs.comment && ss.validationErrors.comment) {
            delete ss.validationErrors.comment;
        }
    });

    // Handle physical copy checkbox toggle - no validation, just clear fields when unchecked
    function handlePhysicalCopyToggle() {
        if (!pcs.requested) {
            // Checkbox is unchecked - clear all fields and validation errors
            pcs.name = "";
            pcs.email = "";
            pcs.phone = "";
            pcs.address = "";
            pcs.comment = "";

            // Clear validation errors
            delete ss.validationErrors.name;
            delete ss.validationErrors.email;
            delete ss.validationErrors.phone;
            delete ss.validationErrors.address;
            delete ss.validationErrors.comment;
        }
    }
</script>

<section class="w-full flex flex-col gap-6">
    <div class="flex flex-col gap-1 text-center">
        <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">
            Прегледайте картичката си
        </h1>
        <p class="text-muted-foreground">
            Проверете дизайна, съобщението и гласовия поздрав преди да
            завършите.
        </p>
    </div>

    <div id="wish-card-preview" class="wish-card">
        <WishCard
            cardFront={ts.background}
            cardBack={ts.backgroundBack}
            font={cs.titleFont}
            fontColor={cs.titleColor}
            title={cs.title}
            description={cs.description}
            sender={cs.sender ?? undefined}
            previewMode={true}
            titlePosition={ts.titlePosition}
            titleFontSize={cs.titleFontSize}
            descriptionFont={cs.descriptionFont}
            descriptionFontSize={cs.descriptionFontSize}
            descriptionColor={cs.descriptionColor}
        />
    </div>

    <div
        id="additional-info"
        class="mx-auto flex w-full max-w-2xl flex-col gap-4"
    >
        <div
            class="flex items-start justify-between gap-4 rounded-lg border p-4"
        >
            <div class="flex gap-3">
                <TruckIcon class="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                    <Label
                        for="physical-copy-checkbox"
                        class="text-sm sm:text-base"
                    >
                        Готови ли сте? Ние ще отпечатаме и изпратим картичката
                        веднага.
                    </Label>
                    <p class="text-xs mt-1 text-muted-foreground">
                        Включете, за да поръчате физическа картичка
                    </p>
                </div>
            </div>
            <Switch
                id="physical-copy-checkbox"
                checked={pcs.requested}
                onCheckedChange={(v) => {
                    pcs.requested = v;
                    handlePhysicalCopyToggle();
                }}
            />
        </div>
        <input
            type="hidden"
            name="physical-copy-requested-value"
            value={pcs.requested ? "true" : "false"}
        />

        {#if pcs.requested}
            <p
                class="rounded-lg bg-muted p-3 text-xs leading-relaxed text-muted-foreground"
            >
                <strong>Ценообразуване:</strong> Изработката на персонализирана
                картичка е 5,99€.<br />
                Доставката се изчислява отделно според адреса и тарифите на куриерските
                фирми.
            </p>
            <div class="grid gap-4 sm:grid-cols-2">
                {#each fields as f (f.id)}
                    <div
                        class="flex flex-col gap-2 {f.id === 'address'
                            ? 'sm:col-span-2'
                            : ''}"
                    >
                        <Label for="physical-copy-{f.id}">
                            {f.label}
                            {#if "required" in f}<span class="text-destructive"
                                    >*</span
                                >{/if}
                        </Label>
                        <Input
                            id="physical-copy-{f.id}"
                            name="physical-copy-{f.id}"
                            type={f.type}
                            placeholder={f.placeholder}
                            autocomplete={f.autocomplete}
                            aria-invalid={!!ss.validationErrors[f.id]}
                            bind:value={pcs[f.id]}
                            required={pcs.requested}
                        />
                        {#if ss.validationErrors[f.id]}
                            <p class="text-sm text-destructive">
                                {ss.validationErrors[f.id]}
                            </p>
                        {/if}
                    </div>
                {/each}
                <div class="flex flex-col gap-2 sm:col-span-2">
                    <Label for="physical-copy-comment"
                        >Допълнителен коментар</Label
                    >
                    <Textarea
                        id="physical-copy-comment"
                        name="physical-copy-comment"
                        class="h-24 resize-none"
                        placeholder="Коментар..."
                        aria-invalid={!!ss.validationErrors.comment}
                        bind:value={pcs.comment}
                    />
                    {#if ss.validationErrors.comment}
                        <p class="text-sm text-destructive">
                            {ss.validationErrors.comment}
                        </p>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</section>
