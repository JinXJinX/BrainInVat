import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Need to renmane _plugin-vueexport-helper.js to plugin-vueexport-helper.js
const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        rollupOptions: {
            output: {
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
                // https://github.com/rollup/rollup/blob/master/src/utils/sanitizeFileName.ts
                sanitizeFileName(name) {
                    const match = DRIVE_LETTER_REGEX.exec(name);
                    const driveLetter = match ? match[0] : "";
                    // A `:` is only allowed as part of a windows drive letter (ex: C:\foo)
                    // Otherwise, avoid them because they can refer to NTFS alternate data streams.
                    return (
                        driveLetter +
                        name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "")
                    );
                },
            },
        },
    },
});
