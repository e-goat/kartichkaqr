<script lang="ts">
    import { ss } from "$lib/state.svelte";
    import ConnectorIcon from "$lib/assets/connector-icon.svg";
    import StepIconOne from "$lib/assets/step-1-icon.svg";
    import StepIconTwo from "$lib/assets/step-2-icon.svg";
    import StepIconThree from "$lib/assets/step-3-icon.svg";
    import StepIconFour from "$lib/assets/step-4-icon.svg";

    export let steps: number = 0;

    const stepLabels = [
        "Изберете дизайн",
        "Базова информация",
        "Добавете съдържание",
        "Добавете гласово съобщение",
    ];

    const stepIcons = [StepIconOne, StepIconTwo, StepIconThree, StepIconFour];
</script>

<!-- Mobile/Tablet view: single item with swipe animation -->
<div class="block lg:hidden">
    <div class="relative overflow-hidden h-16">
        <div
            class="flex transition-transform duration-300 ease-in-out"
            style="transform: translateX(-{(ss.currentStep - 1) * 100}%)"
        >
            {#each Array(steps) as _, index}
                {@const stepNum = index + 1}
                {@const isActive = stepNum === ss.currentStep}
                {@const isCompleted = stepNum < ss.currentStep}

                <div
                    class="w-full shrink-0 flex gap-3 items-center justify-center text-base font-medium text-zinc-800"
                >
                    <enhanced:img
                        src={stepIcons[index]}
                        alt="Step {stepNum} icon"
                        class="object-contain shrink-0 {index === 0
                            ? 'w-8 aspect-square'
                            : index === 1
                              ? 'aspect-[0.93] w-7.5'
                              : index === 2
                                ? 'w-9 aspect-[1.1]'
                                : 'aspect-[1.05] w-8.5'} {isActive
                            ? 'opacity-100'
                            : isCompleted
                              ? 'opacity-100'
                              : 'opacity-50'}"
                    />
                    <div
                        class={isActive
                            ? "text-zinc-800"
                            : isCompleted
                              ? "text-zinc-800"
                              : "text-zinc-400"}
                        data-name={stepLabels[index]}
                    >
                        {stepLabels[index]}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Step indicator dots -->
    <div class="flex justify-center gap-2 mt-3">
        {#each Array(steps) as _, index}
            {@const stepNum = index + 1}
            {@const isActive = stepNum === ss.currentStep}
            {@const isCompleted = stepNum < ss.currentStep}

            <div
                class="w-2 h-2 rounded-full transition-colors duration-200 {isActive
                    ? 'bg-custom-orange-400'
                    : isCompleted
                      ? 'bg-custom-orange-600'
                      : 'bg-gray-300'}"
            ></div>
        {/each}
    </div>
</div>

<!-- Desktop view: full horizontal layout -->
<div
    class="hidden lg:flex overflow-hidden gap-6 items-center text-xl font-medium text-zinc-800"
>
    {#each Array(steps) as _, index}
        {@const stepNum = index + 1}
        {@const isActive = stepNum === ss.currentStep}
        {@const isCompleted = stepNum < ss.currentStep}

        <div
            class="flex gap-4 items-center self-stretch my-auto {index === 0 ||
            index === 2
                ? 'min-w-60'
                : ''}"
        >
            <enhanced:img
                src={stepIcons[index]}
                alt="Step {stepNum} icon"
                class="object-contain shrink-0 self-stretch my-auto {index === 0
                    ? 'w-10 aspect-square'
                    : index === 1
                      ? 'aspect-[0.93] w-9.25'
                      : index === 2
                        ? 'w-11 aspect-[1.1]'
                        : 'aspect-[1.05] w-10.5'} {isActive
                    ? 'opacity-100'
                    : isCompleted
                      ? 'opacity-100'
                      : 'opacity-50'}"
            />
            <div
                class="self-stretch my-auto {isActive
                    ? 'text-zinc-800'
                    : isCompleted
                      ? 'text-zinc-800'
                      : 'text-zinc-400'}"
                data-name={stepLabels[index]}
            >
                {stepLabels[index]}
            </div>
        </div>

        {#if index < steps - 1}
            <enhanced:img
                src={ConnectorIcon}
                alt="Step connector"
                class="object-contain shrink-0 self-stretch my-auto aspect-[20.83] w-10.5 {isCompleted
                    ? 'opacity-100'
                    : 'opacity-30'}"
            />
        {/if}
    {/each}
</div>
