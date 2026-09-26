import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";
import { SITE_URL } from "$lib/config/seo";

type Entry = {
    path: string;
    changefreq: string;
    priority: number;
    lastmod?: Date;
};

function escapeXml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/** Home, about, the creator and one creator page per category and template. */
export const GET: RequestHandler = async () => {
    const [categories, templates] = await Promise.all([
        prisma.category.findMany({
            select: { id: true },
            orderBy: { id: "asc" },
        }),
        prisma.template.findMany({
            select: { id: true, createdAt: true },
            where: { background: { startsWith: "http" } },
            orderBy: { id: "asc" },
        }),
    ]);

    const entries: Entry[] = [
        { path: "/", changefreq: "weekly", priority: 1.0 },
        { path: "/create", changefreq: "weekly", priority: 0.9 },
        { path: "/about", changefreq: "monthly", priority: 0.6 },
        ...categories.map((c) => ({
            path: `/create?category=${c.id}`,
            changefreq: "weekly",
            priority: 0.8,
        })),
        ...templates.map((t) => ({
            path: `/create?template=${t.id}`,
            changefreq: "monthly",
            priority: 0.5,
            lastmod: t.createdAt,
        })),
    ];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
    .map(
        (e) => `  <url>
    <loc>${escapeXml(SITE_URL + e.path)}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod.toISOString().slice(0, 10)}</lastmod>` : ""}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join("\n")}
</urlset>
`;

    return new Response(body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
};
