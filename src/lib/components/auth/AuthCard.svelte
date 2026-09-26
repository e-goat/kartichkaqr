<script lang="ts">
    import type { Snippet } from "svelte";
    import { enhance } from "$app/forms";
    import Loader2Icon from "@lucide/svelte/icons/loader-2";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";

    interface Props {
        title: string;
        description: string;
        submitLabel: string;
        error?: string | null;
        fields: Snippet;
        footer: Snippet;
    }

    let { title, description, submitLabel, error, fields, footer }: Props =
        $props();
    let pending = $state(false);
</script>

<div class="flex justify-center py-6 sm:py-12">
    <Card.Root class="w-full max-w-sm">
        <Card.Header>
            <Card.Title class="text-2xl">{title}</Card.Title>
            <Card.Description>{description}</Card.Description>
        </Card.Header>
        <form
            method="POST"
            use:enhance={() => {
                pending = true;
                return async ({ update }) => {
                    await update();
                    pending = false;
                };
            }}
        >
            <Card.Content class="flex flex-col gap-4">
                {@render fields()}
                {#if error}
                    <p class="text-sm text-destructive" role="alert">{error}</p>
                {/if}
            </Card.Content>
            <Card.Footer class="mt-6 flex flex-col gap-4">
                <Button type="submit" class="w-full" disabled={pending}>
                    {#if pending}<Loader2Icon class="animate-spin" />{/if}
                    {submitLabel}
                </Button>
                <p class="text-sm text-muted-foreground">
                    {@render footer()}
                </p>
            </Card.Footer>
        </form>
    </Card.Root>
</div>
