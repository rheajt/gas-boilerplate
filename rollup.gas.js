// import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import gasify from "./plugins/rollup-plugin-gasify";

const production = !process.env.ROLLUP_WATCH;

export default {
    input: `src/server/main.ts`,
    output: {
        // sourcemap: true,
        format: "es",
        // name: "app",
        dir: "dist",
    },
    plugins: [
        typescript({
            sourceMap: !production,
            inlineSources: !production,
        }),

        gasify({
            comments: `/* top comments */`,
        }),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        // production && terser(),
    ],
    watch: {
        clearScreen: false,
    },
};
