# VitaChronik

VitaChronik ist eine statische, responsive Web-App zur persönlichen Dokumentation von Symptomen, Krankheiten, Arztbesuchen, Terminen und Nahrungsergänzungsmitteln.

Die Gesundheitsdaten werden ausschließlich im `localStorage` des verwendeten Browsers gespeichert. Die App benötigt kein Backend, kein Benutzerkonto und keine externe Datenbank.

## Funktionen

- Eigener Krankheitskalender für Symptome, Krankheiten, Arztbesuche und Termine
- Schweregrad, Uhrzeit, Arzt/Praxis und persönliche Notizen
- Separater NEM-Kalender mit Einnahmetagen und Uhrzeiten
- Abhakbare Einnahmen und automatische Bestandsreduzierung
- Nachkaufwarnungen mit frei wählbarem Grenzwert
- Responsive Bedienung auf Desktop und Smartphone
- Installierbare Progressive Web App ohne Safari-Leisten im Home-Screen-Modus
- Offline-Nutzung nach dem ersten erfolgreichen Laden
- Einstellungsseite mit Hell-/Dunkelmodus, Installation und Datensicherung
- Sicherheitsheader für das Cloudflare-Deployment

## Voraussetzungen

- Node.js 20 oder neuer
- Ein GitHub-Konto
- Ein Cloudflare-Konto mit aktivierter Workers-Subdomain

## Lokal prüfen

Für Prüfung und Build sind keine installierten Abhängigkeiten notwendig:

```bash
npm run check
npm run build
```

Die fertige Ausgabe liegt danach in `dist/`. Für eine lokale Cloudflare-Vorschau:

```bash
npm run dev
```

Beim ersten Aufruf lädt `npx` Wrangler 4 und kann eine Cloudflare-Anmeldung anfordern.

## Auf iPhone oder iPad als App installieren

1. Die veröffentlichte VitaChronik-Adresse in Safari öffnen.
2. Auf **Teilen** tippen.
3. **Zum Home-Bildschirm** wählen.
4. **Als Web-App öffnen** aktiviert lassen und auf **Hinzufügen** tippen.

Beim Start über das neue App-Symbol läuft VitaChronik im Standalone-Modus ohne Safari-Adress- und Werkzeugleisten. Nach dem ersten vollständigen Online-Start werden alle benötigten App-Dateien lokal zwischengespeichert und VitaChronik kann offline geöffnet werden.

Hinweis: Eine installierte Home-Screen-Web-App kann auf Apple-Geräten einen eigenen lokalen Speicherbereich verwenden. Falls bereits Daten in Safari erfasst wurden, vorher über **Einstellungen → Sicherung herunterladen** exportieren und danach in der installierten App importieren.

## Zu GitHub hochladen

1. Auf GitHub ein **leeres** Repository namens `vitachronik` anlegen. Dabei keine README, Lizenz oder `.gitignore` erzeugen lassen.
2. Dieses Projekt entpacken und im Projektordner ein Terminal öffnen.
3. Die folgenden Befehle ausführen und `DEIN-NAME` ersetzen:

```bash
git init
git add .
git commit -m "VitaChronik initial veröffentlichen"
git branch -M main
git remote add origin https://github.com/DEIN-NAME/vitachronik.git
git push -u origin main
```

Alternativ kann ein vorhandenes lokales Repository mit der GitHub CLI veröffentlicht werden:

```bash
gh repo create vitachronik --private --source=. --remote=origin --push
```

Für eine Gesundheits-App ist ein privates Repository empfehlenswert. Die Beispieldaten im Quellcode sind fiktiv; persönliche Einträge werden nicht in Git gespeichert.

## Automatisch zu Cloudflare deployen

Das Repository enthält bereits den Workflow `.github/workflows/deploy-cloudflare.yml`. Jeder Push auf `main` prüft und baut die App und veröffentlicht sie anschließend als Cloudflare Worker mit Static Assets.

### 1. Cloudflare-Zugang vorbereiten

1. Im Cloudflare Dashboard die Account-ID kopieren.
2. Unter **API Tokens** ein Token mit der Vorlage bzw. Berechtigung **Edit Cloudflare Workers** erstellen.
3. Das Token möglichst auf das verwendete Cloudflare-Konto beschränken.

### 2. GitHub-Secrets anlegen

Im GitHub-Repository **Settings → Secrets and variables → Actions → New repository secret** öffnen und diese beiden Secrets anlegen:

| Secret | Inhalt |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account-ID |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API-Token |

Danach unter **Actions** den Workflow manuell starten oder eine Änderung nach `main` pushen. Die erste Ausführung legt den Worker `vitachronik` an. Seine Adresse wird im Deployment-Protokoll angezeigt.

## Manuelles Cloudflare-Deployment

Nach einer lokalen Anmeldung mit `npx wrangler@4 login` genügt:

```bash
npm run deploy
```

## Eigene Domain und Zugriffsschutz

Eine eigene Domain kann im Cloudflare Dashboard beim Worker unter **Settings → Domains & Routes** verbunden werden. Dort lässt sich bei Bedarf auch Cloudflare Access aktivieren, damit die App nicht öffentlich erreichbar ist.

Wichtig: `robots.txt` verhindert die Aufnahme durch seriöse Suchmaschinen, ist aber kein Zugriffsschutz. Für private Gesundheitsdaten sollte Cloudflare Access verwendet werden oder die App nur lokal genutzt werden.

## Projektstruktur

```text
vitachronik/
├── .github/workflows/deploy-cloudflare.yml
├── public/
│   ├── _headers
│   ├── icons/
│   ├── manifest.webmanifest
│   ├── sw.js
│   └── robots.txt
├── scripts/
│   ├── build.mjs
│   └── check.mjs
├── src/index.html
├── .gitignore
├── package.json
├── README.md
└── wrangler.jsonc
```

## Datenschutz

Der veröffentlichte Server liefert nur die App-Dateien aus. Gesundheitseinträge bleiben lokal im Browser und werden nicht an Cloudflare, GitHub oder andere Dienste übertragen. Das Löschen der Browserdaten entfernt auch die lokal gespeicherten VitaChronik-Einträge.

VitaChronik unterstützt die persönliche Dokumentation und ersetzt keine medizinische Diagnose oder Beratung.
