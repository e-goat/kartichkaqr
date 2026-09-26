import type { Action } from "svelte/action";

type RevealOptions = {
    /** Delay in ms before the element animates in (for staggering). */
    delay?: number;
    /** Starting offset: "up" slides up into place, "fade" only fades. */
    effect?: "up" | "fade";
};

// One observer for every revealed element on the page.
let observer: IntersectionObserver | null = null;

function getObserver() {
    observer ??= new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.setAttribute("data-revealed", "");
                observer?.unobserve(entry.target);
            }
        },
        // Reveal slightly before the element is fully on screen
        { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    return observer;
}

/**
 * Fades/slides an element in the first time it scrolls into view. The hidden
 * starting state lives in app.css under `html.js [data-reveal]`, so content
 * stays visible without JavaScript and users who prefer reduced motion see
 * it immediately.
 */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (
    node,
    options = {},
) => {
    node.setAttribute("data-reveal", options.effect ?? "up");
    if (options.delay) {
        node.style.setProperty("--reveal-delay", `${options.delay}ms`);
    }
    const io = getObserver();
    io.observe(node);

    return {
        destroy() {
            io.unobserve(node);
        },
    };
};
