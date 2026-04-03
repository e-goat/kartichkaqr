<script lang="ts">
    import { cs } from "$lib/state.svelte";
    import { getContrastingColor } from "$lib/utils/helpers";
    import { buildQR } from "$lib/utils/qr";
    import PlaceholderQR from "$lib/components/PlaceholderQR.svelte";

    interface Props {
        cardFront?: string;
        cardBack?: string;
        title?: string;
        description?: string;
        sender?: string;
        receiver?: string;
        audioUrl?: string | null;
        previewMode?: boolean;
        cardPageUrl?: string | null;
    }

    let {
        cardFront = "",
        cardBack = "",
        title = "",
        description = "",
        sender,
        receiver,
        audioUrl: audioUrlProp,
        previewMode = false,
        cardPageUrl = null,
    }: Props = $props();

    const displayTitle = $derived(cs.title || title);
    const descriptionLength = $derived(description.length);
    const displaySender = $derived(sender ?? cs.sender ?? "—");
    const displayReceiver = $derived(receiver ?? cs.receiver ?? "—");
    const effectiveAudioUrl = $derived(audioUrlProp ?? cs.audioUrl ?? null);
    const hasAudio = $derived(!!effectiveAudioUrl);
    const showQRSection = $derived(previewMode || !!cardPageUrl || hasAudio);
    const qrTargetUrl = $derived(
        previewMode ? null : cardPageUrl || effectiveAudioUrl || null,
    );
    const showAudioPlayer = $derived(hasAudio && !previewMode);

    let qrCodeUrl = $state("");
    $effect(() => {
        const url = qrTargetUrl;
        if (!url) return;
        buildQR(url, 20).then((qr) => {
            qrCodeUrl = qr;
        });
    });

    const CARD_HEIGHT = 540; // Larger for better visibility
    const CARD_WIDTH = 360; // Maintains 2:3 aspect ratio

    // 0 = closed (front), 1 = open (inner), 2 = back
    let cardState = $state(0);
    let isContentHovered = $state(false);
    let frontElement = $state<HTMLDivElement>();
    let openedCardElement = $state<HTMLDivElement>();
    let textColor = $state("black");

    let hasCardFront = $derived(!!cardFront);
    let isOpened = $derived(cardState > 0);
    let isBackView = $derived(cardState === 2);

    function toggleCard() {
        // Cycle: closed -> inner -> back -> closed
        cardState = (cardState + 1) % 3;
    }

    function handleContainerClick(e: MouseEvent) {
        if (!openedCardElement?.contains(e.target as Node)) return;
        toggleCard();
    }

    $effect(() => {
        if (frontElement && hasCardFront) {
            textColor = "white";
        } else if (frontElement) {
            const computedStyle = window.getComputedStyle(frontElement);
            textColor = getContrastingColor(computedStyle.backgroundColor);
        }
    });
</script>

<div
    id="wishcard-container"
    class:card-opened={isOpened}
    onclick={handleContainerClick}
    onkeydown={(e) => e.key === "Enter" && toggleCard()}
    role="button"
    tabindex="0"
    style="--card-height: {CARD_HEIGHT}px; --card-width: {CARD_WIDTH}px;"
>
    <div
        bind:this={openedCardElement}
        class="opened-card"
        class:closed-preview={!isOpened}
        class:card-open={isOpened && !isBackView}
    >
        {#if isOpened}
            <div
                class="card-pages-flip"
                class:show-back={isBackView}
                onmouseenter={() => (isContentHovered = true)}
                onmouseleave={() => (isContentHovered = false)}
                role="presentation"
            >
                <div
                    class="card-pages card-pages-inner"
                    class:content-hovered={isContentHovered && !isBackView}
                >
                    <div bind:this={frontElement} class="card-inner">
                        {#if showQRSection}
                            <div class="inner-left">
                                <div class="qr-block">
                                    <p class="qr-label">От:</p>
                                    <p class="qr-value">{displaySender}</p>
                                    <div class="qr-image-wrap">
                                        {#if qrCodeUrl}
                                            <img
                                                src={qrCodeUrl}
                                                alt="QR код за картичката"
                                                width="100"
                                                height="100"
                                            />
                                        {:else}
                                            <PlaceholderQR size={100} />
                                        {/if}
                                    </div>
                                    <p class="qr-instruction">
                                        {#if previewMode || cardPageUrl}
                                            Сканирайте за да отворите картичката
                                        {:else}
                                            Сканирайте за да чуете вашият гласов
                                            поздрав
                                        {/if}
                                    </p>
                                    <p class="qr-label">До:</p>
                                    <p class="qr-value">{displayReceiver}</p>
                                    {#if showAudioPlayer}
                                        <audio
                                            src={effectiveAudioUrl || ""}
                                            controls
                                            class="audio-player"
                                            preload="metadata"
                                            aria-label="Възпроизвеждане на гласов поздрав"
                                        ></audio>
                                    {/if}
                                </div>
                            </div>
                            <div class="vertical-divider"></div>
                        {/if}
                        <div class="inner-right">
                            <div class="right-content">
                                <h1 class="card-title">
                                    {displayTitle}
                                </h1>
                                <p
                                    class="card-description"
                                    class:description-medium={descriptionLength >
                                        200}
                                    class:description-long={descriptionLength >
                                        400}
                                >
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="card-pages-back"
                    style="background-color: {cardBack}"
                >
                    <div class="back-content">
                        <span class="back-rule" aria-hidden="true"></span>
                        <span class="back-brand">kartichkaqr</span>
                    </div>
                </div>
            </div>
        {:else}
            <div
                bind:this={frontElement}
                class="front-section front-preview"
                class:card-front-img={hasCardFront}
                style="--card-front-img: url('{cardFront}');"
            >
                <h1
                    class="card-title-preview"
                    class:text-white={textColor === "white"}
                    class:text-black={textColor === "black"}
                    class:text-shadow={hasCardFront}
                >
                    {displayTitle}
                </h1>
            </div>
        {/if}
    </div>
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
        min-height: 520px;
        margin: 1rem 0;
        cursor: pointer;
        overflow: visible;
        padding: 1rem;
        padding-left: max(1rem, env(safe-area-inset-left));
        padding-right: max(1rem, env(safe-area-inset-right));
        box-sizing: border-box;
        width: 100%;
    }

    #wishcard-container:has(.closed-preview) {
        pointer-events: none;
    }

    #wishcard-container:has(.closed-preview) .opened-card {
        pointer-events: auto;
    }

    @media (max-width: 768px) {
        #wishcard-container {
            perspective: 800px;
            min-height: 380px;
            margin: 0.75rem 0;
            padding: 0.5rem;
            padding-left: max(0.5rem, env(safe-area-inset-left));
            padding-right: max(0.5rem, env(safe-area-inset-right));
        }
    }

    @media (max-width: 480px) {
        #wishcard-container {
            perspective: 600px;
            min-height: 280px;
            margin: 0.5rem 0;
            padding: 0.375rem;
            padding-left: max(0.375rem, env(safe-area-inset-left));
            padding-right: max(0.375rem, env(safe-area-inset-right));
        }
    }

    #wishcard-container:has(.opened-card) {
        min-height: 600px;
        margin: 1rem 0;
    }

    @media (max-width: 768px) {
        #wishcard-container:has(.opened-card) {
            min-height: auto;
        }
    }

    @media (max-width: 480px) {
        #wishcard-container:has(.opened-card) {
            min-height: auto;
        }
    }

    /* Card styles - narrow when closed, wider when open */
    .opened-card {
        width: 100%;
        max-width: var(--card-width);
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.6s ease-out;
        border: 1px solid #111827;
        margin: 0 auto;
        box-sizing: border-box;
        overflow: hidden;
        transition: max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .opened-card.card-open {
        max-width: min(95vw, 700px);
    }

    @media (max-width: 768px) {
        .opened-card {
            padding: 1rem;
        }

        .opened-card.card-open {
            max-width: var(--card-width);
        }
    }

    @media (max-width: 480px) {
        .opened-card {
            padding: 0.75rem;
            border-radius: 12px;
        }

        .opened-card.card-open {
            max-width: var(--card-width);
        }
    }

    /* Flip container for inner (state 1) <-> back (state 2) */
    .card-pages-flip {
        position: relative;
        width: 100%;
        min-height: var(--card-height);
        transform-style: preserve-3d;
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @media (max-width: 768px) {
        .card-pages-flip {
            min-height: 320px;
        }
    }

    @media (max-width: 480px) {
        .card-pages-flip {
            min-height: 280px;
        }
    }

    .card-pages-flip.show-back {
        transform: rotateY(180deg);
    }

    /* Inner view - single panel with left (QR) and right (title/description) */
    .card-pages {
        display: flex;
        min-height: var(--card-height);
        width: 100%;
        position: relative;
        backface-visibility: hidden;
        transition: transform 0.2s ease;
    }

    @media (max-width: 768px) {
        .card-pages {
            min-height: 320px;
        }
    }

    @media (max-width: 480px) {
        .card-pages {
            min-height: 280px;
        }
    }

    .card-pages.content-hovered {
        transform: scale(1.01);
    }

    @media (hover: none) and (pointer: coarse) {
        .card-pages.content-hovered {
            transform: none;
        }
    }

    .card-inner {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        justify-content: stretch;
        width: 100%;
        min-height: var(--card-height);
        background: white;
        border-radius: 12px;
        padding: 2rem;
    }

    .inner-left,
    .inner-right {
        position: relative;
        min-width: 0;
        flex: 1 1 0;
    }

    .inner-left {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .inner-right {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    @media (max-width: 767px) {
        .card-inner {
            flex-direction: column;
            padding: 1.25rem;
            min-height: 320px;
        }
    }

    @media (max-width: 480px) {
        .card-inner {
            padding: 1rem;
            min-height: 280px;
        }
    }

    /* Back view (3rd click) - modern minimal light palette */
    .card-pages-back {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        border-radius: 12px;
        border: 1px solid #e7e5e4;
        background: #fafaf9;
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            0 1px 2px rgba(0, 0, 0, 0.04);
        backface-visibility: hidden;
        transform: rotateY(180deg);
    }

    .back-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
        align-self: stretch;
    }

    .back-rule {
        display: block;
        width: 2.5rem;
        height: 1px;
        background: #a8a29e;
    }

    .back-brand {
        font-size: 0.65rem;
        font-weight: 400;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #262626;
    }

    @media (prefers-color-scheme: dark) {
        .card-pages-back {
            border-color: #404040;
            background: #262626;
            box-shadow:
                inset 0 1px 0 rgba(255, 255, 255, 0.05),
                0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .back-rule {
            background: #737373;
        }

        .back-brand {
            color: #a3a3a3;
        }
    }
    /* Front Section (closed state) */
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
        min-height: var(--card-height);
    }

    .front-section.card-front-img {
        background-image: var(--card-front-img);
        background-size: cover;
        background-position: center;
    }

    .front-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: var(--card-height);
    }

    .card-title-preview {
        font-size: clamp(1.25rem, 4vw, 2rem);
        font-weight: bold;
        margin: 0;
        text-align: center;
        padding: 0 1rem;
    }

    @media (max-width: 768px) {
        .front-section {
            padding: 1.25rem;
            min-height: 320px;
        }

        .card-pages-back {
            padding: 1.25rem;
        }
    }

    @media (max-width: 480px) {
        .front-section {
            padding: 1rem;
            min-height: 280px;
        }

        .card-pages-back {
            padding: 1rem;
        }
    }

    .vertical-divider {
        width: 1px;
        background: linear-gradient(180deg, transparent, #d1d5db, transparent);
        margin: 0 2rem;
        flex-shrink: 0;
    }

    .right-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        width: 100%;
        min-width: 0;
        max-width: 400px;
        text-align: center;
        padding: 0 1rem;
        box-sizing: border-box;
        overflow: hidden;
    }

    @media (max-width: 767px) {
        .front-section {
            flex-direction: column;
            align-items: center;
            gap: 0;
        }

        .card-inner .vertical-divider {
            width: 100%;
            height: 1px;
            background: linear-gradient(
                90deg,
                transparent,
                #d1d5db,
                transparent
            );
            margin: 0.75rem 0;
        }

        .inner-left {
            width: 100%;
            flex-shrink: 0;
        }

        .inner-right {
            width: 100%;
            flex: 1;
            min-height: 0;
        }

        .right-content {
            max-width: 100%;
            padding: 0;
            gap: 1rem;
        }
    }

    @media (max-width: 480px) {
        .right-content {
            gap: 0.75rem;
        }

        .card-inner .qr-block {
            max-width: 160px;
        }

        .card-inner .qr-image-wrap img,
        .card-inner .qr-image-wrap :global(svg) {
            width: 80px;
            height: 80px;
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
        line-clamp: 8;
        -webkit-box-orient: vertical;
    }

    .card-description.description-medium {
        font-size: 0.9rem;
    }

    .card-description.description-long {
        font-size: 0.8rem;
    }

    .content-hovered .card-description {
        color: #1f2937;
    }

    /* QR Code Section */
    .qr-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        gap: 0.5rem;
        width: 100%;
        max-width: 200px;
    }

    .qr-instruction {
        font-size: 0.75rem;
        color: #9ca3af;
        text-align: center;
        margin: 0;
        line-height: 1.3;
    }

    .qr-label {
        font-size: 0.7rem;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin: 0;
    }

    .qr-value {
        font-size: 0.85rem;
        color: #374151;
        text-align: center;
        margin: 0;
        word-break: break-word;
        max-width: 100%;
    }

    .qr-image-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
    }

    .qr-image-wrap img,
    .qr-image-wrap :global(svg) {
        width: 100px;
        height: 100px;
        transition: transform 0.2s ease;
    }

    .qr-block .audio-player {
        width: 100%;
        max-width: 180px;
        margin-top: 0.5rem;
        height: 32px;
    }

    .content-hovered .qr-image-wrap img,
    .content-hovered .qr-image-wrap :global(svg) {
        transform: scale(1.05);
    }

    @media (hover: none) and (pointer: coarse) {
        .content-hovered .qr-image-wrap img,
        .content-hovered .qr-image-wrap :global(svg) {
            transform: none;
        }
    }

    .text-shadow {
        text-shadow:
            0 2px 4px rgba(0, 0, 0, 0.8),
            0 1px 2px rgba(0, 0, 0, 0.6);
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
</style>
