<script lang="ts">
    import { page } from "$app/state";
    import MenuIcon from "@lucide/svelte/icons/menu";
    import UserIcon from "@lucide/svelte/icons/user";
    import LogOutIcon from "@lucide/svelte/icons/log-out";
    import LayoutGridIcon from "@lucide/svelte/icons/layout-grid";
    import ModeToggle from "$lib/components/ModeToggle.svelte";
    import { Button } from "$lib/components/ui/button";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import * as Sheet from "$lib/components/ui/sheet";
    import * as Avatar from "$lib/components/ui/avatar";
    import { cn } from "$lib/utils/cn";

    interface Props {
        logo?: string;
        user: { name: string; email: string } | null;
    }

    let { logo = "", user }: Props = $props();
    let mobileMenuOpen = $state(false);

    const links = [
        { href: "/create", label: "Създай" },
        { href: "/about", label: "За нас" },
    ];

    const initials = $derived(
        (user?.name ?? "")
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
    );

    const loginHref = $derived(
        `/login?redirectTo=${encodeURIComponent(page.url.pathname + page.url.search)}`,
    );
</script>

<header
    class="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
    <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <a href="/" class="flex items-center gap-2" aria-label="Начало">
            <enhanced:img
                alt="KartichkaQR"
                src={logo}
                class="size-8 rounded-lg object-cover ring-2 ring-brand-gold/60"
            />
            <span class="font-serif text-lg font-semibold">Картичка QR</span>
        </a>

        <nav class="hidden sm:flex items-center gap-1">
            {#each links as link (link.href)}
                <Button
                    href={link.href}
                    variant="ghost"
                    class={cn(page.url.pathname === link.href && "bg-muted")}
                >
                    {link.label}
                </Button>
            {/each}
        </nav>

        <div class="flex items-center gap-1">
            <ModeToggle />
            {#if user}
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        {#snippet child({ props })}
                            <Button
                                {...props}
                                variant="ghost"
                                size="icon"
                                aria-label="Профил"
                            >
                                <Avatar.Root class="size-8">
                                    <Avatar.Fallback class="text-xs">
                                        {initials || "?"}
                                    </Avatar.Fallback>
                                </Avatar.Root>
                            </Button>
                        {/snippet}
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end" class="w-56">
                        <DropdownMenu.Label class="font-normal">
                            <p class="text-sm font-medium">{user.name}</p>
                            <p class="text-xs text-muted-foreground truncate">
                                {user.email}
                            </p>
                        </DropdownMenu.Label>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item>
                            {#snippet child({ props })}
                                <a href="/account" {...props}>
                                    <LayoutGridIcon /> Моите картички
                                </a>
                            {/snippet}
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <form method="POST" action="/logout">
                            <DropdownMenu.Item>
                                {#snippet child({ props })}
                                    <button
                                        type="submit"
                                        {...props}
                                        class="{props.class} w-full"
                                    >
                                        <LogOutIcon /> Изход
                                    </button>
                                {/snippet}
                            </DropdownMenu.Item>
                        </form>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            {:else}
                <Button
                    href={loginHref}
                    variant="outline"
                    size="sm"
                    class="hidden sm:inline-flex"
                >
                    <UserIcon /> Вход
                </Button>
            {/if}

            <Sheet.Root bind:open={mobileMenuOpen}>
                <Sheet.Trigger>
                    {#snippet child({ props })}
                        <Button
                            {...props}
                            variant="ghost"
                            size="icon"
                            class="sm:hidden"
                            aria-label="Отвори меню"
                        >
                            <MenuIcon />
                        </Button>
                    {/snippet}
                </Sheet.Trigger>
                <Sheet.Content side="right" class="w-72">
                    <Sheet.Header>
                        <Sheet.Title>Меню</Sheet.Title>
                    </Sheet.Header>
                    <nav class="flex flex-col gap-1 px-4">
                        {#each links as link (link.href)}
                            <Button
                                href={link.href}
                                variant="ghost"
                                class="justify-start"
                                onclick={() => (mobileMenuOpen = false)}
                            >
                                {link.label}
                            </Button>
                        {/each}
                        {#if user}
                            <Button
                                href="/account"
                                variant="ghost"
                                class="justify-start"
                                onclick={() => (mobileMenuOpen = false)}
                            >
                                Моите картички
                            </Button>
                        {:else}
                            <Button
                                href={loginHref}
                                variant="outline"
                                class="mt-2"
                                onclick={() => (mobileMenuOpen = false)}
                            >
                                <UserIcon /> Вход
                            </Button>
                        {/if}
                    </nav>
                </Sheet.Content>
            </Sheet.Root>
        </div>
    </div>
</header>
