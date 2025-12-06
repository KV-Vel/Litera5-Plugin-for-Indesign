import { UXP_Manifest, UXP_Config } from "vite-uxp-plugin";
import { version } from "./package.json";

const extraPrefs = {
    hotReloadPort: 8080,
    copyZipAssets: ["public-zip/*"],
};

const manifest: UXP_Manifest = {
    id: "literainindd.uxp.plugin",
    name: "Litera5_Plugin",
    version,
    main: "index.html",
    manifestVersion: 6,
    host: [
        {
            app: "ID",
            minVersion: "18.5",
        },
    ],
    entrypoints: [
        {
            type: "panel",
            id: "literainindd.uxp.plugin.panel",
            label: {
                default: "Litera5",
            },
            minimumSize: { width: 350, height: 280 },
            maximumSize: { width: 2000, height: 2000 },
            preferredDockedSize: { width: 400, height: 280 },
            preferredFloatingSize: { width: 480, height: 800 },
            /**
             * B
             */
            icons: [
                {
                    width: 23,
                    height: 23,
                    path: "icons/dark.png",
                    scale: [1, 2],
                    theme: ["darkest", "dark", "medium"],
                },
                {
                    width: 23,
                    height: 23,
                    path: "icons/light.png",
                    scale: [1, 2],
                    theme: ["lightest", "light"],
                },
            ],
        },
    ],
    featureFlags: {
        enableAlerts: true,
        enableSWCSupport: true,
    },
    requiredPermissions: {
        localFileSystem: "fullAccess",
        launchProcess: {
            schemes: ["https", "slack", "file", "ws"],
            extensions: [".xd", ".psd", ".bat", ".cmd", ""],
        },
        network: {
            domains: [
                "all",
                `ws://localhost:${extraPrefs.hotReloadPort}`, // Required for hot reload
                "https://litera5.ru",
            ],
        },
        clipboard: "readAndWrite",
        webview: {
            allow: "yes",
            domains: ["https://*.hyperbrew.co"],
        },
        ipc: {
            enablePluginCommunication: true,
        },
        allowCodeGenerationFromStrings: true,
    },
    icons: [
        {
            width: 48,
            height: 48,
            path: "icons/plugin-icon.png",
            scale: [1, 2],
            theme: ["darkest", "dark", "medium", "lightest", "light", "all"],
            species: ["pluginList"],
        },
    ],
};

export const config: UXP_Config = {
    manifest,
    ...extraPrefs,
};
