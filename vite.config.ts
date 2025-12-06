import { defineConfig } from "vite";
import { runAction, uxp } from "vite-uxp-plugin";
import react from "@vitejs/plugin-react";

import { config } from "./uxp.config";

const action = process.env.BOLT_ACTION;
const mode = process.env.MODE;

if (action) runAction(config, action);

export default defineConfig({
    plugins: [uxp(config, mode), react()],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "/src/variables.scss" as *;`,
            },
        },
    },
    build: {
        sourcemap: mode && ["dev", "build"].includes(mode) ? true : false,
        minify: false,
        emptyOutDir: true,
        assetsInlineLimit: 0,
        rollupOptions: {
            external: ["indesign", "uxp", "fs", "os", "path", "process", "shell"],
            output: {
                format: "cjs",
            },
        },
    },
    publicDir: "public",
});
