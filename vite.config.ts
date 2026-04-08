import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import commonJS from "vite-plugin-commonjs";
import tailwindcss from "@tailwindcss/vite";
import { enhancedImages } from "@sveltejs/enhanced-img";

export default defineConfig({
    plugins: [
        tailwindcss(),
        enhancedImages(),
        sveltekit(),
        commonJS({
            filter: (id) => id.includes("/db"),
        }),
    ],
    define: {
        __dirname: "import.meta.dirname",
        global: "globalThis",
    },
    ssr: {
        external: ["$lib/db"],
    },
    optimizeDeps: {
        exclude: ["$lib/db"],
    },
});
