<script lang="ts">
    import { ss } from "$lib/state.svelte";
    import { STEP_LABELS } from "$lib/config/steps";
    import SparklesIcon from "@lucide/svelte/icons/sparkles";
    import ImageIcon from "@lucide/svelte/icons/image";
    import TypeIcon from "@lucide/svelte/icons/type";
    import MicIcon from "@lucide/svelte/icons/mic";
    import EyeIcon from "@lucide/svelte/icons/eye";
    import CheckIcon from "@lucide/svelte/icons/check";
    import { cn } from "$lib/utils/cn";

    let { steps = 0 }: { steps?: number } = $props();

    const stepIcons = [SparklesIcon, ImageIcon, TypeIcon, MicIcon, EyeIcon];
</script>

<ol class="flex items-center gap-2" aria-label="Стъпки">
    {#each Array(steps) as _, index (index)}
        {@const stepNum = index + 1}
        {@const isActive = stepNum === ss.currentStep}
        {@const isCompleted = stepNum < ss.currentStep}
        {@const Icon = isCompleted ? CheckIcon : stepIcons[index]}

        <li
            class={cn(
                "flex items-center gap-2",
                isActive && "flex-1 sm:flex-none",
            )}
            aria-current={isActive ? "step" : undefined}
        >
            <span
                class={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm transition-colors",
                    isActive &&
                        "border-primary bg-primary text-primary-foreground",
                    isCompleted &&
                        "border-primary/40 bg-primary/10 text-primary",
                    !isActive && !isCompleted && "text-muted-foreground",
                )}
            >
                <Icon class="size-4" />
            </span>
            <span
                class={cn(
                    "text-sm font-medium whitespace-nowrap",
                    isActive ? "inline" : "hidden lg:inline",
                    !isActive && "text-muted-foreground",
                )}
            >
                {STEP_LABELS[index]}
            </span>
        </li>
        {#if index < steps - 1}
            <li
                aria-hidden="true"
                class={cn(
                    "h-px flex-1 min-w-3 bg-border",
                    isCompleted && "bg-primary/40",
                )}
            ></li>
        {/if}
    {/each}
</ol>
