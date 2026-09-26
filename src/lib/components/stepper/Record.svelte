<script lang="ts">
    import Recorder from "$lib/components/Recorder.svelte";
</script>

<section class="w-full flex flex-col gap-6">
    <div class="flex flex-col gap-1 text-center">
        <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">
            Запишете гласов поздрав
        </h1>
        <p class="text-muted-foreground">
            По избор. Получателят ще го чуе, като сканира QR кода на картичката.
        </p>
    </div>
    <Recorder />
    <input type="hidden" name="record" id="record" />
</section>
