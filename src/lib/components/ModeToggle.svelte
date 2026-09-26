<script lang="ts">
    import { toggleMode } from "mode-watcher";
    import SunIcon from "@lucide/svelte/icons/sun";
    import MoonIcon from "@lucide/svelte/icons/moon";
    import { Button } from "$lib/components/ui/button";
</script>

<Button
    onclick={toggleMode}
    variant="ghost"
    size="icon"
    aria-label="Смени темата"
>
    <SunIcon
        class="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
    />
    <MoonIcon
        class="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
    />
</Button>
