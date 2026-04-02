import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    eslintConfigPrettier,
    {
        ignores: [
            "node_modules/*",
            ".svelte-kit/*",
            // '**/*.svelte',
            "prisma/*",
            "src/lib/assets/*",
            "src/lib/db/*",
            ".vercel/*",
            ".husky/*",
            ".cursor/*",
            ".vscode/*",
            "src/lib/components/*",
        ],
    },
    prettier,
    ...svelte.configs.prettier,
    {
        languageOptions: {
            globals: {
                browser: true,
                node: true,
            },
        },
    },
);
