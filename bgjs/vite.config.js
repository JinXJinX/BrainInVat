/// <reference types="vitest" />
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    envDir: "./config",
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, "src/main.ts"),
            name: "bgjs",
            // the proper extensions will be added
            fileName: "background",
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            output: {
                entryFileNames: "background.js",
                extend: true,
            },
        },
    },
    test: {
        name: "happy-dom",
        root: "./tests",
        environment: "happy-dom",
        setupFiles: ["./vitest-setup.ts"],
    },
});
