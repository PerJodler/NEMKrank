import { copyFile, cp, mkdir, readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const publicDirectory = resolve(root, "public");
const publicEntries = await readdir(publicDirectory);

await copyFile(resolve(root, "src/index.html"), resolve(dist, "index.html"));
await Promise.all(publicEntries.map(entry => cp(resolve(publicDirectory, entry), resolve(dist, entry), { recursive: true })));

console.log("VitaChronik wurde nach dist/ gebaut.");
