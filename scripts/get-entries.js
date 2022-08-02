import { readdirSync } from "fs";
import { join } from "path";

export default function getEntries(dir) {
    const files = readdirSync(join(__dirname, dir));
    return files;
}
