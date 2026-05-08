<script lang="ts">
    import Recorder from "$lib/components/Recorder.svelte";
</script>

<section>
    <div class="flex flex-col-reverse lg:flex-row">
        <aside class="flex flex-col gap-2 sm:gap-3 md:gap-4 md:w-full">
            <h1
                class="mb-2 sm:mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl leading-none text-gray-900 dark:text-gray-100 text-center"
            >
                {"Запишете гласовата си поздрав"}
            </h1>
            <p
                class="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl italic drop-shadow-sm tracking-wide text-center"
            >
                {"Моля, запишете гласовата си поздрав, за да персонализирате картичката си"}
            </p>
            <Recorder />
            <input type="hidden" name="record" id="record" />
        </aside>
    </div>
</section>
