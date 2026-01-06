<script lang="ts">
    import { cs } from "$lib/state.svelte";
    import { getContrastingColor } from "$lib/utils/helpers";

    interface Props {
        cardFront?: string;
        cardBack?: string;
        title?: string;
        description?: string;
    }

    let {
        cardFront = "",
        cardBack = "",
        title = "",
        description = "",
    }: Props = $props();

    let isOpened = $state(false);
    let isTransitioning = $state(false);
    let isHovered = $state(false);
    let textColor = $state("black");
    let frontElement = $state<HTMLDivElement>();

    let hasCardFront = $derived(cardFront != "");
    let hasCardBack = $derived(cardBack != "");

    function toggleCard() {
        if (isTransitioning) return;
        isTransitioning = true;
        isOpened = !isOpened;
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }

    $effect(() => {
        if (frontElement) {
            const computedStyle = window.getComputedStyle(frontElement);
            const bgColor = computedStyle.backgroundColor;

            if (hasCardFront) {
                textColor = "white";
            } else {
                textColor = getContrastingColor(bgColor);
            }
        }
    });
</script>

<div
    id="wishcard-container"
    class:card-opened={isOpened}
    class:card-hovered={isHovered && !isOpened}
    onmouseenter={() => (isHovered = true)}
    onmouseleave={() => (isHovered = false)}
    onclick={toggleCard}
    onkeydown={(e) => e.key === "Enter" && toggleCard()}
    role="button"
    tabindex="0"
>
    {#if isOpened}
        <div class="opened-card">
            <div class="card-content">
                <!-- Front Section -->
                <div class="front-section">
                    <div class="content-wrapper">
                        <div class="text-content">
                            <h1 class="card-title">
                                {cs.title || title}
                            </h1>
                            <p class="card-description">
                                {cs.description || description}
                            </p>
                        </div>
                        <div class="qr-container">
                            <div class="qr-code-placeholder">
                                <!-- Dummy QR Code SVG -->
                                <svg
                                    width="64"
                                    height="64"
                                    viewBox="0 0 64 64"
                                    class="dummy-qr"
                                >
                                    <rect width="64" height="64" fill="white" />
                                    <!-- QR code pattern simulation -->
                                    <rect
                                        x="8"
                                        y="8"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="16"
                                        y="8"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="32"
                                        y="8"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="40"
                                        y="8"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="48"
                                        y="8"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />

                                    <rect
                                        x="8"
                                        y="16"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="24"
                                        y="16"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="40"
                                        y="16"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="48"
                                        y="16"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />

                                    <rect
                                        x="8"
                                        y="24"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="16"
                                        y="24"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="32"
                                        y="24"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="48"
                                        y="24"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />

                                    <rect
                                        x="8"
                                        y="32"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="24"
                                        y="32"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="32"
                                        y="32"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="40"
                                        y="32"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />

                                    <rect
                                        x="8"
                                        y="40"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="16"
                                        y="40"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="40"
                                        y="40"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="48"
                                        y="40"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />

                                    <rect
                                        x="8"
                                        y="48"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="24"
                                        y="48"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="32"
                                        y="48"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                    <rect
                                        x="48"
                                        y="48"
                                        width="6"
                                        height="6"
                                        fill="black"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Divider -->
                <div class="section-divider"></div>

                <!-- Back Section -->
                <div class="back-section">
                    <div class="contact-content">
                        <div class="brand-section">
                            <p class="brand-name">KartichkaQR</p>
                        </div>
                        <div class="contact-section">
                            <p class="contact-label">Контакт:</p>
                            <a
                                href="mailto:example@yahoo.com"
                                class="contact-email"
                            >
                                example@yahoo.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div
            class="box-holder"
            class:transitioning={isTransitioning}
            style="--card-front-img: url({cardFront}); --card-back-img: url({cardBack});"
        >
            <div
                bind:this={frontElement}
                class="box--front flex flex-col text-center justify-center gap-8"
                class:bg-custom-teal-300={!hasCardFront}
                class:card-front-img={hasCardFront}
            >
                <h1
                    class="text-lg px-2"
                    class:text-white={textColor === "white"}
                    class:text-black={textColor === "black"}
                    class:text-shadow={hasCardFront}
                >
                    {cs.title || title}
                </h1>
            </div>
            <div class="box--side-left bg-white border-2 border-black"></div>
            <div class="box--side-right bg-white border-2 border-black"></div>
            <div class="box--top bg-white"></div>
            <div class="box--bottom bg-white border-2 border-black"></div>
            <div class="box--back border-2 border-black bg-white">
                <div
                    class="flex flex-col items-center justify-center h-full p-4 text-center"
                >
                    <div class="mb-4">
                        <p class="text-sm text-gray-700 mb-2">
                            Благодарим ви че се доверихте на
                        </p>
                        <p class="text-lg font-bold text-gray-800">
                            KartichkaQR
                        </p>
                    </div>

                    <div class="mb-4">
                        <a
                            href="mailto:example@yahoo.com"
                            class="text-sm text-blue-600 underline"
                            >example@yahoo.com</a
                        >
                    </div>

                    <!-- QR Code Template -->
                    <div
                        class="qr-code-template bg-gray-100 border-2 border-gray-300 rounded-lg p-2"
                    >
                        <div
                            class="w-16 h-16 bg-white border border-gray-200 rounded flex items-center justify-center"
                        >
                            <div class="text-xs text-gray-400">QR</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    #wishcard-container {
        position: relative;
        perspective: 1200px;
        background: radial-gradient(
                ellipse at center,
                rgba(255, 255, 255, 0.75) 0%,
                rgba(255, 255, 255, 0) 75%
            )
            center center;
        background-size: contain;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
        margin: 2rem 0;
        cursor: pointer;
        overflow: visible;
    }

    #wishcard-container:has(.opened-card) {
        min-height: fit-content;
        margin: 1rem 0;
    }

    .box-holder {
        transform: rotateX(16deg) rotateY(0deg);
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
    }

    .box-holder.transitioning {
        transform: rotateX(16deg) rotateY(0deg);
    }

    /* Hover effect - gentle lift and slight opening */
    #wishcard-container.card-hovered .box-holder:not(.transitioning) {
        transform: rotateX(16deg) rotateY(-8deg) translateY(-8px) translateZ(0);
    }

    .box-holder > div {
        position: absolute;
        top: 50%;
        left: 50%;
        backface-visibility: hidden;
    }

    .box--front {
        width: 200px;
        height: 300px;
        background-size: auto 100%;
        transform: translate3d(-100px, -150px, 0) translate3d(0, 0, 0)
            rotateY(0deg);
        border: 2px solid rgba(0, 0, 0, 0.15);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    }

    .box--back {
        width: 200px;
        height: 300px;
        background-size: auto 100%;
        transform: translate3d(-100px, -150px, 0) translate3d(0, 0, -16px)
            rotateY(180deg);
    }

    .box--side-left {
        width: 16px;
        height: 300px;
        background-size: auto 100%;
        transform: translate3d(-100px, -150px, 0) translate3d(-8px, 0, -8px)
            rotateY(-90deg);
    }

    .box--side-right {
        width: 16px;
        height: 300px;
        background-size: cover;
        transform: translate3d(-100px, -150px, 0) translate3d(192px, 0px, -8px)
            rotateY(90deg);
    }

    .box--top {
        width: 200px;
        height: 16px;
        background-size: cover;
        transform: translate3d(-100px, -150px, 0) translate3d(0px, -8px, 8px)
            rotateX(90deg);
    }

    .box--bottom {
        width: 200px;
        height: 16px;
        background-size: cover;
        transform: translate3d(-100px, -150px, 0) translate3d(0px, 292px, -8px)
            rotateX(-90deg);
    }

    .card-front-img {
        background-image: var(--card-front-img);
        background-size: auto 100%;
        background-position: center;
    }

    /* Opened card styles */
    .opened-card {
        width: 100%;
        max-width: 800px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        animation: slideIn 0.6s ease-out;
        border: 1px solid #e5e7eb;
        margin: 0 auto;
    }

    @media (max-width: 768px) {
        .opened-card {
            padding: 1.5rem;
            max-width: 95%;
        }
    }

    @media (max-width: 480px) {
        .opened-card {
            padding: 1rem;
        }
    }

    .card-content {
        display: flex;
        flex-direction: column;
        gap: 0;
        min-height: 300px;
    }

    @media (min-width: 768px) {
        .card-content {
            flex-direction: row;
            min-height: 250px;
        }
    }

    /* Front Section */
    .front-section {
        background-color: rgba(147, 197, 253, 0.1);
        border-radius: 12px;
        padding: 1.5rem;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    @media (max-width: 767px) {
        .front-section {
            padding: 1rem;
            min-height: 200px;
        }
    }

    .content-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        gap: 1.5rem;
    }

    @media (min-width: 768px) {
        .content-wrapper {
            flex-direction: row;
            align-items: center;
            gap: 2rem;
        }
    }

    .text-content {
        text-align: center;
        flex: 1;
    }

    @media (min-width: 768px) {
        .text-content {
            text-align: left;
        }
    }

    .card-title {
        font-size: 1.5rem;
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 0.5rem;
        line-height: 1.3;
    }

    @media (max-width: 480px) {
        .card-title {
            font-size: 1.25rem;
        }
    }

    .card-description {
        color: #374151;
        font-size: 0.95rem;
        line-height: 1.5;
    }

    /* QR Code Section */
    .qr-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .qr-code-placeholder {
        background: white;
        border-radius: 8px;
        padding: 0.75rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
    }

    .dummy-qr {
        display: block;
    }

    /* Section Divider */
    .section-divider {
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, #d1d5db, transparent);
        margin: 1rem 0;
    }

    @media (min-width: 768px) {
        .section-divider {
            width: 1px;
            height: 100%;
            background: linear-gradient(
                180deg,
                transparent,
                #d1d5db,
                transparent
            );
            margin: 0 1rem;
        }
    }

    /* Back Section */
    .back-section {
        background-color: rgba(167, 139, 250, 0.1);
        border-radius: 12px;
        padding: 1.5rem;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    @media (max-width: 767px) {
        .back-section {
            padding: 1rem;
            min-height: 150px;
        }
    }

    .contact-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        text-align: center;
        width: 100%;
    }

    .brand-section {
        margin-bottom: 0.5rem;
    }

    .brand-name {
        font-size: 1.25rem;
        font-weight: bold;
        color: #1f2937;
        margin: 0;
    }

    .contact-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
    }

    .contact-label {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0;
    }

    .contact-email {
        color: #2563eb;
        text-decoration: underline;
        font-size: 0.95rem;
        font-weight: 500;
    }

    .contact-email:hover {
        color: #1d4ed8;
    }

    @keyframes slideIn {
        0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .text-shadow {
        text-shadow:
            0 2px 4px rgba(0, 0, 0, 0.8),
            0 1px 2px rgba(0, 0, 0, 0.6);
    }
</style>
