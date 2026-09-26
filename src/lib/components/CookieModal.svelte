<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";
    import CookieIcon from "@lucide/svelte/icons/cookie";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";

    let { cookieConsent } = $props();
    let showModal = $state(false);

    onMount(() => {
        if (!cookieConsent) {
            setTimeout(() => {
                showModal = true;
            }, 500);
        }
    });

    async function handleAcceptAll() {
        const formData = new FormData();
        formData.append("consent", "accepted");

        await fetch("/api/cookie-consent", {
            method: "POST",
            body: formData,
        });

        showModal = false;
        await invalidateAll();
    }

    function handleClose() {
        showModal = false;
    }
</script>

{#if showModal && !cookieConsent}
    <div
        class="fixed bottom-4 right-4 left-4 sm:left-auto z-50 sm:max-w-md animate-in fade-in slide-in-from-bottom-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
    >
        <Card.Root class="shadow-xl">
            <Card.Content class="flex gap-3">
                <CookieIcon class="mt-0.5 size-5 shrink-0 text-primary" />
                <p id="cookie-modal-title" class="text-sm leading-relaxed">
                    Нашият сайт използва бисквитки, за да подобри вашето
                    изживяване, анализира използването на сайта и подпомага
                    нашите маркетингови усилия.
                </p>
            </Card.Content>
            <Card.Footer class="justify-end gap-2">
                <Button
                    variant="outline"
                    onclick={handleClose}
                    aria-label="Затвори известието за бисквитки"
                >
                    Затвори
                </Button>
                <Button
                    onclick={handleAcceptAll}
                    aria-label="Приемам всички бисквитки"
                >
                    Приемам всички
                </Button>
            </Card.Footer>
        </Card.Root>
    </div>
{/if}
