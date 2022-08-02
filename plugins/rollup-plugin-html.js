import { extname } from "path";

const getFiles = (bundle) => {
    const files = Object.values(bundle).filter(
        (file) =>
            file.type === "chunk" ||
            (typeof file.type === "string"
                ? file.type === "asset"
                : file.isAsset)
    );
    const result = {};
    for (const file of files) {
        const { fileName } = file;
        const extension = extname(fileName).substring(1);

        result[extension] = (result[extension] || []).concat(file);
    }

    return result;
};

export const makeHtmlAttributes = (attributes) => {
    if (!attributes) {
        return "";
    }

    const keys = Object.keys(attributes);
    // eslint-disable-next-line no-param-reassign
    return keys.reduce(
        (result, key) => (result += ` ${key}="${attributes[key]}"`),
        ""
    );
};

const defaultTemplate = async ({ attributes, files, meta, title }) => {
    // console.log(files);
    const scripts = (files.js || [])
        .map(({ code }) => {
            return `<script>{${code}}</script>`;
        })
        .join("\n");

    const links = (files.css || [])
        .map(({ source }) => {
            return `<style>${source}</style>`;
        })
        .join("\n");

    const metas = meta
        .map((input) => {
            const attrs = makeHtmlAttributes(input);
            return `<meta${attrs}>`;
        })
        .join("\n");

    return `
<!doctype html>
<html${makeHtmlAttributes(attributes.html)}>
  <head>
    ${metas}
    <title>${title}</title>
    ${links}
  </head>
  <body>
    ${scripts}
  </body>
</html>`;
};

const supportedFormats = ["es", "esm", "iife", "umd"];

const defaults = {
    attributes: {
        link: null,
        html: { lang: "en" },
        script: null,
    },
    fileName: "index.html",
    meta: [{ charset: "utf-8" }],
    publicPath: "",
    template: defaultTemplate,
    title: "Rollup Bundle",
};

export default function html(opts = {}) {
    const { attributes, fileName, meta, publicPath, template, title } =
        Object.assign({}, defaults, opts);

    return {
        name: "html",

        async generateBundle(output, bundle) {
            if (!supportedFormats.includes(output.format) && !opts.template) {
                this.warn(
                    `plugin-html: The output format '${output.format
                    }' is not directly supported. A custom \`template\` is probably required. Supported formats include: ${supportedFormats.join(
                        ", "
                    )}`
                );
            }

            if (output.format === "es") {
                attributes.script = Object.assign({}, attributes.script, {
                    type: "module",
                });
            }

            const files = getFiles(bundle);
            const source = await template({
                attributes,
                bundle,
                files,
                meta,
                publicPath,
                title,
            });

            const htmlFile = {
                type: "asset",
                source,
                name: "Rollup HTML Asset",
                fileName,
            };

            this.emitFile(htmlFile);
        },
    };
}
