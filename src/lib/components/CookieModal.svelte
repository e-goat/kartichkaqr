<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";

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
        class="fixed bottom-4 right-4 z-50 max-w-md w-full sm:w-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
    >
        <div
            class="bg-white rounded-lg shadow-xl p-6 transform transition-transform duration-300"
        >
            <p class="text-gray-800 mb-6 text-base md:text-lg leading-relaxed">
                Нашият сайт използва бисквитки, за да подобри вашето изживяване,
                анализира използването на сайта и подпомага нашите маркетингови
                усилия.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
                <button
                    onclick={handleClose}
                    class="px-6 py-2.5 border-2 border-green-600 text-green-600 bg-white rounded-lg font-medium hover:bg-green-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                    aria-label="Затвори известието за бисквитки"
                >
                    Затвори
                </button>
                <button
                    onclick={handleAcceptAll}
                    class="px-6 py-2.5 border-2 border-green-600 text-green-600 bg-white rounded-lg font-medium hover:bg-green-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                    aria-label="Приемам всички бисквитки"
                >
                    Приемам всички
                </button>
            </div>
        </div>
    </div>
{/if}
