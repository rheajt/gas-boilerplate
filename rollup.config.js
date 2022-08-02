import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import html from "./plugins/rollup-plugin-html";
import getEntries from "./scripts/get-entries";

const production = !process.env.ROLLUP_WATCH;

const entryDir = "src/client/entries";
const buildDir = "src/client/build";

const entries = getEntries(entryDir);

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require("child_process").spawn(
                "npm",
                ["run", "start", "--", "--dev"],
                {
                    stdio: ["ignore", "inherit", "inherit"],
                    shell: true,
                }
            );

            process.on("SIGTERM", toExit);
            process.on("exit", toExit);
        },
    };
}

export default entries.map((file) => ({
    input: `${entryDir}/${file}`,
    output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        dir: buildDir,
    },
    plugins: [
        svelte({
            preprocess: sveltePreprocess({ sourceMap: !production }),
            compilerOptions: {
                dev: !production,
            },
        }),
        css({ output: "bundle.css" }),
        resolve({
            browser: true,
            dedupe: ["svelte"],
        }),
        commonjs(),
        typescript({
            sourceMap: !production,
            inlineSources: !production,
        }),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload("public"),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),

        production && html({ fileName: `${file}.html` }),
    ],
    watch: {
        clearScreen: false,
    },
}));
