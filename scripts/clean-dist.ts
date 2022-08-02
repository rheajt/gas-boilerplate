import { readdirSync, rmSync } from "fs";
import { join } from "path";

function cleanDist() {
    const distDir = join(__dirname, "..", "dist");
    const files = readdirSync(distDir);

    files.forEach((file) => {
        if (file.includes(".html")) {
            return;
        }

        rmSync(join(distDir, file));
    });

    console.log("cleaned");
}

cleanDist();
