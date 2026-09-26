<script lang="ts">
    import { page } from "$app/state";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
</script>

<div class="flex flex-col items-center justify-center text-center gap-8 py-10">
    <h1 class="text-8xl sm:text-9xl font-bold text-primary leading-none">
        {page.status}
    </h1>

    <Card.Root class="max-w-2xl">
        <Card.Header>
            <Card.Title class="text-2xl sm:text-3xl">
                {page.status === 404
                    ? "Страницата не е намерена"
                    : "Възникна грешка"}
            </Card.Title>
            <Card.Description class="text-base leading-relaxed">
                {#if page.status === 404}
                    Съжаляваме, но страницата, която търсите, не съществува или
                    е била преместена.
                {:else}
                    Съжаляваме, но нещо се обърка. Моля, опитайте отново
                    по-късно или се свържете с нас, ако проблемът продължава.
                {/if}
            </Card.Description>
        </Card.Header>
        <Card.Footer class="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/">Към началото</Button>
            <Button
                variant="outline"
                onclick={() => {
                    /*global history*/
                    history.back();
                }}
            >
                Назад
            </Button>
        </Card.Footer>
    </Card.Root>
</div>
