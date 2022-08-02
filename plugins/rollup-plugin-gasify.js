// const defaultTemplate = async ({ attributes, files, meta, title }) => {
//     const scripts = (files.js || [])
//         .map(({ code }) => {
//             return `<script>{${code}}</script>`;
//         })
//         .join("\n");

//     return ``;
// };

// const defaults = {
//     attributes: {
//         link: null,
//         html: { lang: "en" },
//         script: null,
//     },
//     fileName: "index.html",
//     meta: [{ charset: "utf-8" }],
//     publicPath: "",
//     template: defaultTemplate,
//     title: "Rollup Bundle",
// };

export default function gasify(opts = {}) {
    // const { attributes, fileName, meta, publicPath, template, title } =
    //     Object.assign({}, defaults, opts);

    return {
        name: "gasify",

        async generateBundle(output, bundle) {
            // if (!supportedFormats.includes(output.format) && !opts.template) {
            //     this.warn(
            //         `plugin-html: The output format '${output.format
            //         }' is not directly supported. A custom \`template\` is probably required. Supported formats include: ${supportedFormats.join(
            //             ", "
            //         )}`
            //     );
            // }

            // if (output.format === "es") {
            //     attributes.script = Object.assign({}, attributes.script, {
            //         type: "module",
            //     });
            // }

            // const source = await template({
            //     attributes,
            //     bundle,
            //     files,
            //     meta,
            //     publicPath,
            //     title,
            // });

            // const htmlFile = {
            //     type: "asset",
            //     source,
            //     name: "Rollup HTML Asset",
            //     fileName,
            // };

            // this.emitFile(htmlFile);
            const allCode = Object.keys(bundle)
                .map((file) => {
                    // console.log(bundle[file].code);
                    return `${opts.comments}\n${bundle[file].code}`;
                })
                .shift();

            const gasFile = {
                type: "asset",
                source: allCode,
                fileName: "main.js",
            };

            this.emitFile(gasFile);
            console.log("emit gas file");
        },
    };
}
