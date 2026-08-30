import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const [html, headers, wranglerRaw, manifestRaw, serviceWorker] = await Promise.all([
  readFile(resolve(root, "src/index.html"), "utf8"),
  readFile(resolve(root, "public/_headers"), "utf8"),
  readFile(resolve(root, "wrangler.jsonc"), "utf8"),
  readFile(resolve(root, "public/manifest.webmanifest"), "utf8"),
  readFile(resolve(root, "public/sw.js"), "utf8")
]);

const failures = [];
const requireText = (condition, message) => { if (!condition) failures.push(message); };

requireText(/^<!doctype html>/i.test(html), "DOCTYPE fehlt.");
requireText(html.includes("<title>VitaChronik</title>"), "Seitentitel fehlt.");
requireText(html.includes("localStorage"), "Lokale Datenspeicherung fehlt.");
requireText(html.includes('id="healthView"'), "Gesundheitskalender fehlt.");
requireText(html.includes('id="supplementsView"'), "Supplement-Kalender fehlt.");
requireText(html.includes('id="settingsView"'), "Einstellungsseite fehlt.");
requireText((html.match(/data-design-choice=/g) || []).length === 10, "Die zehn App-Designs fehlen.");
requireText(html.includes("settings: { theme:'system', design:'dopamine'"), "Design-Einstellung fehlt.");
requireText(html.includes('rel="manifest"'), "Manifest-Verknüpfung fehlt.");
requireText(html.includes('apple-mobile-web-app-capable'), "iOS-Standalone-Modus fehlt.");
requireText(html.includes("serviceWorker.register('./sw.js')"), "Service-Worker-Registrierung fehlt.");
requireText(!/https?:\/\//i.test(html), "Die App bindet eine externe Ressource ein.");

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
requireText(scripts.length === 1, "Es muss genau ein eingebettetes App-Skript geben.");
if (scripts.length === 1) {
  try { new Function(scripts[0][1]); }
  catch (error) { failures.push(`JavaScript ist ungültig: ${error.message}`); }
}

requireText(headers.includes("Content-Security-Policy"), "Content-Security-Policy fehlt.");
requireText(headers.includes("X-Frame-Options: DENY"), "Clickjacking-Schutz fehlt.");
requireText(serviceWorker.includes("CACHE_NAME"), "Offline-Cache fehlt.");

try {
  const manifest = JSON.parse(manifestRaw);
  requireText(manifest.display === "standalone", "Standalone-Anzeige ist nicht aktiviert.");
  requireText(manifest.start_url === "./", "PWA-Startadresse ist ungültig.");
  requireText(manifest.icons?.some(icon => icon.sizes === "192x192"), "192px-App-Icon fehlt im Manifest.");
  requireText(manifest.icons?.some(icon => icon.sizes === "512x512"), "512px-App-Icon fehlt im Manifest.");
} catch (error) {
  failures.push(`manifest.webmanifest ist ungültig: ${error.message}`);
}

for (const icon of ["icon-192.png", "icon-512.png", "apple-touch-icon.png"]) {
  try { requireText((await stat(resolve(root, "public/icons", icon))).size > 0, `${icon} ist leer.`); }
  catch { failures.push(`${icon} fehlt.`); }
}

try {
  const wrangler = JSON.parse(wranglerRaw);
  requireText(wrangler.assets?.directory === "./dist/", "Cloudflare-Assetpfad ist ungültig.");
  requireText(wrangler.assets?.not_found_handling === "single-page-application", "SPA-Routing ist nicht aktiviert.");
} catch (error) {
  failures.push(`wrangler.jsonc ist ungültig: ${error.message}`);
}

if (failures.length) {
  console.error(failures.map(item => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("Projektprüfung erfolgreich.");
