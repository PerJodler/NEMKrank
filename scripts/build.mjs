import { copyFile, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await Promise.all([
  copyFile(resolve(root, "src/index.html"), resolve(dist, "index.html")),
  copyFile(resolve(root, "public/_headers"), resolve(dist, "_headers")),
  copyFile(resolve(root, "public/robots.txt"), resolve(dist, "robots.txt"))
]);

console.log("VitaChronik wurde nach dist/ gebaut.");
