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

    // Constant for card height - scaled by factor of 2
    // Will be adjusted via CSS for mobile
    const CARD_HEIGHT = 600; // 300px * 2
    const CARD_WIDTH = 400; // 200px * 2

    // 0 = closed, 1 = front view, 2 = back view
    let cardState = $state(0);
    let isTransitioning = $state(false);
    let isHovered = $state(false);
    let isContentHovered = $state(false);
    let textColor = $state("black");
    let frontElement = $state<HTMLDivElement>();

    let hasCardFront = $derived(cardFront != "");
    let hasCardBack = $derived(cardBack != "");
    let isOpened = $derived(cardState > 0);
    let isBackView = $derived(cardState === 2);

    function toggleCard() {
        if (isTransitioning) return;
        isTransitioning = true;

        // Cycle through states: closed -> front -> back -> closed
        cardState = (cardState + 1) % 3;

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
    style="--card-height: {CARD_HEIGHT}px; --card-width: {CARD_WIDTH}px;"
>
    {#if isOpened}
        <div class="opened-card">
            <div
                class="card-content"
                class:show-back={isBackView}
                onmouseenter={() => (isContentHovered = true)}
                onmouseleave={() => (isContentHovered = false)}
                class:content-hovered={isContentHovered}
            >
                <!-- Front Section -->
                <div
                    class="front-section"
                    class:section-hovered={isContentHovered && !isBackView}
                >
                    <!-- Watermark Top Left -->
                    <div class="watermark watermark-left">KartichkaQR</div>

                    <!-- Left Side -->
                    <div class="left-side">
                        <div class="qr-container">
                            <div class="qr-code-placeholder">
                                <!-- Dummy QR Code SVG -->
                                <svg
                                    width="128"
                                    height="128"
                                    viewBox="0 0 64 64"
                                    class="dummy-qr"
                                    style="max-width: 100%; height: auto;"
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
                            <p class="qr-instruction">
                                Сканирайте QR кода за да чуете поздрав
                            </p>
                        </div>
                    </div>

                    <!-- Divider Line -->
                    <div class="vertical-divider"></div>

                    <!-- Right Side -->
                    <div class="right-side">
                        <!-- Watermark Top Right -->
                        <div class="watermark watermark-right">KartichkaQR</div>
                        <div class="right-content">
                            <h1 class="card-title">
                                {cs.title || title}
                            </h1>
                            <p class="card-description">
                                {cs.description || description}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Back Section -->
                <div
                    class="back-section"
                    class:section-hovered={isContentHovered && isBackView}
                >
                    <!-- Watermark Top Left -->
                    <div class="watermark watermark-left">KartichkaQR</div>

                    <!-- Watermark Top Right -->
                    <div class="watermark watermark-right">KartichkaQR</div>

                    <div class="contact-content">
                        <div class="brand-section">
                            <div class="brand-logo">
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <rect
                                        x="3"
                                        y="3"
                                        width="18"
                                        height="18"
                                        rx="2"
                                    />
                                    <path d="M9 9h6v6H9z" />
                                </svg>
                            </div>
                            <p class="brand-name">KartichkaQR</p>
                            <p class="brand-tagline">
                                Вашата персонализирана картичка
                            </p>
                        </div>
                        <div class="contact-section">
                            <p class="contact-label">Свържете се с нас:</p>
                            <a
                                href="mailto:example@yahoo.com"
                                class="contact-email"
                            >
                                example@yahoo.com
                            </a>
                            <p class="contact-note">
                                Благодарим ви, че се доверихте на нас!
                            </p>
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
        min-height: 800px;
        margin: 2rem 0;
        cursor: pointer;
        overflow: visible;
        padding: 1rem;
        box-sizing: border-box;
        width: 100%;
    }

    @media (max-width: 768px) {
        #wishcard-container {
            perspective: 800px;
        }
    }

    @media (max-width: 480px) {
        #wishcard-container {
            perspective: 600px;
        }
    }

    #wishcard-container:has(.opened-card) {
        min-height: 800px;
        margin: 2rem 0;
    }

    @media (max-width: 768px) {
        #wishcard-container {
            min-height: 500px;
            margin: 1rem 0;
            padding: 0.5rem;
        }

        #wishcard-container:has(.opened-card) {
            min-height: 500px;
        }
    }

    @media (max-width: 480px) {
        #wishcard-container {
            min-height: 400px;
            margin: 0.5rem 0;
            padding: 0.25rem;
        }

        #wishcard-container:has(.opened-card) {
            min-height: 400px;
        }
    }

    .box-holder {
        transform: rotateX(16deg) rotateY(0deg);
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
        width: 100%;
        max-width: var(--card-width);
    }

    @media (max-width: 768px) {
        .box-holder {
            max-width: min(90vw, 300px);
        }
    }

    @media (max-width: 480px) {
        .box-holder {
            max-width: min(85vw, 250px);
        }
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
        width: var(--card-width);
        height: var(--card-height);
        background-size: auto 100%;
        transform: translate3d(
                calc(var(--card-width) / -2),
                calc(var(--card-height) / -2),
                0
            )
            translate3d(0, 0, 0) rotateY(0deg);
        border: 2px solid rgba(0, 0, 0, 0.15);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    }

    .box--back {
        width: var(--card-width);
        height: var(--card-height);
        background-size: auto 100%;
        transform: translate3d(
                calc(var(--card-width) / -2),
                calc(var(--card-height) / -2),
                0
            )
            translate3d(0, 0, -16px) rotateY(180deg);
    }

    .box--side-left {
        width: 16px;
        height: var(--card-height);
        background-size: auto 100%;
        transform: translate3d(
                calc(var(--card-width) / -2),
                calc(var(--card-height) / -2),
                0
            )
            translate3d(-8px, 0, -8px) rotateY(-90deg);
    }

    .box--side-right {
        width: 16px;
        height: var(--card-height);
        background-size: cover;
        transform: translate3d(
                calc(var(--card-width) / -2),
                calc(var(--card-height) / -2),
                0
            )
            translate3d(calc(var(--card-width) - 8px), 0px, -8px) rotateY(90deg);
    }

    .box--top {
        width: var(--card-width);
        height: 16px;
        background-size: cover;
        transform: translate3d(
                calc(var(--card-width) / -2),
                calc(var(--card-height) / -2),
                0
            )
            translate3d(0px, -8px, 8px) rotateX(90deg);
    }

    .box--bottom {
        width: var(--card-width);
        height: 16px;
        background-size: cover;
        transform: translate3d(
                calc(var(--card-width) / -2),
                calc(var(--card-height) / -2),
                0
            )
            translate3d(0px, calc(var(--card-height) - 8px), -8px)
            rotateX(-90deg);
    }

    @media (max-width: 768px) {
        .box--front,
        .box--back {
            width: min(90vw, 300px);
            height: min(135vw, 450px);
        }

        .box--front {
            transform: translate3d(
                    calc(min(90vw, 300px) / -2),
                    calc(min(135vw, 450px) / -2),
                    0
                )
                translate3d(0, 0, 0) rotateY(0deg);
        }

        .box--back {
            transform: translate3d(
                    calc(min(90vw, 300px) / -2),
                    calc(min(135vw, 450px) / -2),
                    0
                )
                translate3d(0, 0, -12px) rotateY(180deg);
        }

        .box--side-left {
            transform: translate3d(
                    calc(min(90vw, 300px) / -2),
                    calc(min(135vw, 450px) / -2),
                    0
                )
                translate3d(-6px, 0, -6px) rotateY(-90deg);
        }

        .box--side-right {
            transform: translate3d(
                    calc(min(90vw, 300px) / -2),
                    calc(min(135vw, 450px) / -2),
                    0
                )
                translate3d(calc(min(90vw, 300px) - 6px), 0px, -6px)
                rotateY(90deg);
        }

        .box--top {
            width: min(90vw, 300px);
            transform: translate3d(
                    calc(min(90vw, 300px) / -2),
                    calc(min(135vw, 450px) / -2),
                    0
                )
                translate3d(0px, -6px, 6px) rotateX(90deg);
        }

        .box--bottom {
            width: min(90vw, 300px);
            transform: translate3d(
                    calc(min(90vw, 300px) / -2),
                    calc(min(135vw, 450px) / -2),
                    0
                )
                translate3d(0px, calc(min(135vw, 450px) - 6px), -6px)
                rotateX(-90deg);
        }
    }

    @media (max-width: 480px) {
        .box--front,
        .box--back {
            width: min(85vw, 250px);
            height: min(127.5vw, 375px);
        }

        .box--front {
            transform: translate3d(
                    calc(min(85vw, 250px) / -2),
                    calc(min(127.5vw, 375px) / -2),
                    0
                )
                translate3d(0, 0, 0) rotateY(0deg);
        }

        .box--back {
            transform: translate3d(
                    calc(min(85vw, 250px) / -2),
                    calc(min(127.5vw, 375px) / -2),
                    0
                )
                translate3d(0, 0, -10px) rotateY(180deg);
        }

        .box--side-left {
            transform: translate3d(
                    calc(min(85vw, 250px) / -2),
                    calc(min(127.5vw, 375px) / -2),
                    0
                )
                translate3d(-5px, 0, -5px) rotateY(-90deg);
        }

        .box--side-right {
            transform: translate3d(
                    calc(min(85vw, 250px) / -2),
                    calc(min(127.5vw, 375px) / -2),
                    0
                )
                translate3d(calc(min(85vw, 250px) - 5px), 0px, -5px)
                rotateY(90deg);
        }

        .box--top {
            width: min(85vw, 250px);
            transform: translate3d(
                    calc(min(85vw, 250px) / -2),
                    calc(min(127.5vw, 375px) / -2),
                    0
                )
                translate3d(0px, -5px, 5px) rotateX(90deg);
        }

        .box--bottom {
            width: min(85vw, 250px);
            transform: translate3d(
                    calc(min(85vw, 250px) / -2),
                    calc(min(127.5vw, 375px) / -2),
                    0
                )
                translate3d(0px, calc(min(127.5vw, 375px) - 5px), -5px)
                rotateX(-90deg);
        }
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
        box-sizing: border-box;
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
        height: var(--card-height);
        transform-style: preserve-3d;
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        width: 100%;
    }

    @media (max-width: 768px) {
        .card-content {
            height: min(135vw, 450px);
        }
    }

    @media (max-width: 480px) {
        .card-content {
            height: min(127.5vw, 375px);
        }
    }

    .card-content.show-back {
        transform: rotateY(180deg);
    }

    .card-content.content-hovered {
        transform: scale(1.01);
    }

    .card-content.show-back.content-hovered {
        transform: rotateY(180deg) scale(1.01);
    }

    @media (min-width: 768px) {
        .card-content {
            flex-direction: row;
            height: var(--card-height);
        }
    }

    /* Front Section */
    .front-section {
        background: linear-gradient(
            135deg,
            rgba(147, 197, 253, 0.15) 0%,
            rgba(147, 197, 253, 0.05) 100%
        );
        border-radius: 12px;
        padding: 2rem;
        flex: 1;
        display: flex;
        align-items: stretch;
        justify-content: stretch;
        transition:
            background-color 0.3s ease,
            box-shadow 0.3s ease,
            opacity 0.3s ease;
        backface-visibility: hidden;
        transform: rotateY(0deg);
        height: var(--card-height);
    }

    @media (max-width: 768px) {
        .front-section {
            height: min(135vw, 450px);
        }
    }

    @media (max-width: 480px) {
        .front-section {
            height: min(127.5vw, 375px);
        }
    }

    .card-content.show-back .front-section {
        opacity: 0;
        pointer-events: none;
    }

    .front-section.section-hovered {
        background: linear-gradient(
            135deg,
            rgba(147, 197, 253, 0.2) 0%,
            rgba(147, 197, 253, 0.1) 100%
        );
        box-shadow: 0 4px 12px rgba(147, 197, 253, 0.2);
    }

    .left-side {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .vertical-divider {
        width: 1px;
        background: linear-gradient(180deg, transparent, #d1d5db, transparent);
        margin: 0 2rem;
        flex-shrink: 0;
    }

    .right-side {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .right-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        width: 100%;
        max-width: 400px;
        text-align: center;
        padding: 0 1rem;
        box-sizing: border-box;
    }

    @media (max-width: 767px) {
        .front-section {
            padding: 1rem;
            flex-direction: column;
            min-height: auto;
        }

        .vertical-divider {
            width: 100%;
            height: 1px;
            background: linear-gradient(
                90deg,
                transparent,
                #d1d5db,
                transparent
            );
            margin: 1rem 0;
        }

        .left-side {
            min-height: 150px;
            width: 100%;
        }

        .right-side {
            width: 100%;
        }

        .right-content {
            max-width: 100%;
            padding: 0;
            gap: 1rem;
        }
    }

    @media (max-width: 480px) {
        .front-section {
            padding: 0.75rem;
        }

        .left-side {
            min-height: 120px;
        }

        .right-content {
            gap: 0.75rem;
        }
    }

    .card-title {
        font-size: clamp(1.25rem, 4vw, 2rem);
        font-weight: bold;
        color: #1f2937;
        margin: 0;
        line-height: 1.3;
        transition: color 0.2s ease;
        word-wrap: break-word;
        overflow-wrap: break-word;
        max-width: 100%;
    }

    .content-hovered .card-title {
        color: #111827;
    }

    .card-description {
        color: #374151;
        font-size: clamp(0.875rem, 2.5vw, 1.1rem);
        line-height: 1.6;
        transition: color 0.2s ease;
        margin: 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 8;
        -webkit-box-orient: vertical;
    }

    .content-hovered .card-description {
        color: #1f2937;
    }

    /* QR Code Section */
    .qr-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        gap: 0.75rem;
        width: 100%;
        max-width: 200px;
    }

    @media (max-width: 480px) {
        .qr-container {
            max-width: 150px;
            gap: 0.5rem;
        }
    }

    .qr-code-placeholder {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
    }

    .content-hovered .qr-code-placeholder {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .qr-instruction {
        font-size: 0.75rem;
        color: #9ca3af;
        text-align: center;
        margin: 0;
        line-height: 1.4;
    }

    .dummy-qr {
        display: block;
        max-width: 100%;
        height: auto;
    }

    @media (max-width: 480px) {
        .dummy-qr {
            width: 96px;
            height: 96px;
        }
    }

    /* Watermarks */
    .watermark {
        position: absolute;
        top: 1rem;
        font-size: 0.75rem;
        color: rgba(0, 0, 0, 0.08);
        font-weight: 300;
        letter-spacing: 0.1em;
        pointer-events: none;
        z-index: 1;
        user-select: none;
    }

    .watermark-left {
        left: 1.5rem;
    }

    .watermark-right {
        right: 1.5rem;
    }

    @media (max-width: 767px) {
        .watermark {
            font-size: 0.65rem;
            top: 0.75rem;
        }

        .watermark-left {
            left: 0.75rem;
        }

        .watermark-right {
            right: 0.75rem;
        }
    }

    @media (max-width: 480px) {
        .watermark {
            font-size: 0.55rem;
            top: 0.5rem;
        }

        .watermark-left {
            left: 0.5rem;
        }

        .watermark-right {
            right: 0.5rem;
        }
    }

    /* Back Section */
    .back-section {
        background: linear-gradient(
            135deg,
            rgba(167, 139, 250, 0.15) 0%,
            rgba(167, 139, 250, 0.05) 100%
        );
        border-radius: 12px;
        padding: 2rem;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color 0.3s ease,
            box-shadow 0.3s ease,
            opacity 0.3s ease;
        backface-visibility: hidden;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        pointer-events: none;
        transform: rotateY(180deg);
        height: var(--card-height);
        box-sizing: border-box;
    }

    .card-content.show-back .back-section {
        opacity: 1;
        pointer-events: auto;
    }

    @media (min-width: 768px) {
        .back-section {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            height: var(--card-height);
        }
    }

    .back-section.section-hovered {
        background: linear-gradient(
            135deg,
            rgba(167, 139, 250, 0.2) 0%,
            rgba(167, 139, 250, 0.1) 100%
        );
        box-shadow: 0 4px 12px rgba(167, 139, 250, 0.2);
    }

    @media (max-width: 767px) {
        .back-section {
            padding: 1rem;
            height: min(135vw, 450px);
        }
    }

    @media (max-width: 480px) {
        .back-section {
            padding: 0.75rem;
            height: min(127.5vw, 375px);
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
        position: relative;
        z-index: 0;
    }

    .brand-section {
        margin-bottom: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .brand-logo {
        color: #6366f1;
        margin-bottom: 0.25rem;
        opacity: 0.8;
    }

    .brand-name {
        font-size: 1.25rem;
        font-weight: bold;
        color: #1f2937;
        margin: 0;
    }

    .brand-tagline {
        font-size: 0.75rem;
        color: #6b7280;
        font-style: italic;
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
        margin: 0 0 0.5rem 0;
        font-weight: 500;
    }

    .contact-email {
        color: #2563eb;
        text-decoration: none;
        font-size: 0.95rem;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        display: inline-block;
        transition:
            background-color 0.2s ease,
            color 0.2s ease;
    }

    .contact-email:hover {
        color: #1d4ed8;
        background-color: rgba(37, 99, 235, 0.1);
    }

    .contact-note {
        font-size: 0.75rem;
        color: #9ca3af;
        margin: 0.75rem 0 0 0;
        font-style: italic;
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
