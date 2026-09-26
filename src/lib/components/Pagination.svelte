<script lang="ts">
    import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
    import { Button } from "$lib/components/ui/button";
    type Props = {
        pageSize?: number;
        url?: string;
        amount: number;
        currentPage?: number;
        onPageChange?: (page: number) => void;
    };

    let {
        pageSize = 9,
        url = "",
        amount,
        currentPage = 1,
        onPageChange,
    }: Props = $props();

    const totalPages = $derived(Math.ceil(amount / pageSize));

    const visiblePages = $derived.by(() => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage <= 4) {
                for (let i = 2; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push("...");
            } else if (currentPage >= totalPages - 3) {
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages - 1; i++) {
                    pages.push(i);
                }
            } else {
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push("...");
            }

            if (totalPages > 1 && !pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }

        return pages;
    });

    function handlePageClick(event: MouseEvent, page: number) {
        if (onPageChange) {
            event.preventDefault();
            onPageChange(page);
        }
    }

    function buildHref(page: number): string {
        return `${url}?limit=${pageSize}&skip=${pageSize * (page - 1)}`;
    }
</script>

{#if totalPages > 1}
    <nav
        class="flex items-center justify-center gap-1 mt-8"
        aria-label="Странициране"
    >
        <Button
            href={currentPage > 1 ? buildHref(currentPage - 1) : undefined}
            variant="outline"
            size="icon"
            aria-label="Предишна страница"
            disabled={currentPage <= 1}
            onclick={(e: MouseEvent) => handlePageClick(e, currentPage - 1)}
        >
            <ChevronLeftIcon />
        </Button>

        <!-- Page numbers -->
        {#each visiblePages as page, i (i)}
            {#if page === "..."}
                <span
                    class="flex size-9 items-center justify-center text-sm text-muted-foreground"
                >
                    ...
                </span>
            {:else}
                <Button
                    href={buildHref(Number(page))}
                    variant={page === currentPage ? "default" : "outline"}
                    size="icon"
                    aria-current={page === currentPage ? "page" : undefined}
                    onclick={(e: MouseEvent) =>
                        handlePageClick(e, Number(page))}
                >
                    {page}
                </Button>
            {/if}
        {/each}

        <Button
            href={currentPage < totalPages
                ? buildHref(currentPage + 1)
                : undefined}
            variant="outline"
            size="icon"
            aria-label="Следваща страница"
            disabled={currentPage >= totalPages}
            onclick={(e: MouseEvent) => handlePageClick(e, currentPage + 1)}
        >
            <ChevronRightIcon />
        </Button>
    </nav>
{/if}
