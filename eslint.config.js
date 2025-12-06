import globals from "globals";
import eslint from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintConfigPrettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";

export default tseslint.config([
    { ignores: ["dist", "src/types/"] },
    {
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs["recommended-latest"],
            eslintConfigPrettier,
            eslintPluginPrettierRecommended,
        ],
        files: ["**/*.{ts,tsx}"],
        plugins: {
            react: reactPlugin,
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
            },
        },
    },
]);
