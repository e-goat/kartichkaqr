<script lang="ts">
    import { page } from "$app/state";
    import AuthCard from "$lib/components/auth/AuthCard.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import type { PageProps } from "./$types";

    let { form }: PageProps = $props();
    const redirectTo = page.url.searchParams.get("redirectTo") ?? "/";
</script>

<svelte:head>
    <title>Вход | Картичка QR</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<AuthCard
    title="Вход"
    description="Влезте, за да създавате и преглеждате вашите картички."
    submitLabel="Вход"
    error={form?.error}
>
    {#snippet fields()}
        <div class="flex flex-col gap-2">
            <Label for="email">Имейл</Label>
            <Input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                value={form?.email ?? ""}
            />
        </div>
        <div class="flex flex-col gap-2">
            <Label for="password">Парола</Label>
            <Input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
            />
        </div>
    {/snippet}
    {#snippet footer()}
        Нямате профил?
        <a
            href="/register?redirectTo={encodeURIComponent(redirectTo)}"
            class="font-medium text-primary underline-offset-4 hover:underline"
            >Регистрация</a
        >
    {/snippet}
</AuthCard>
