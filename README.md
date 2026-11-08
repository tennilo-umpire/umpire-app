# TENNILO Umpire

Private Entwicklungsumgebung der modularen Tennis-Schiedsrichter-App. Testdomain: **umpire.tennilo.de** (noch nicht automatisch veröffentlicht).

## Stand U0.1

- Funktionierender Einzel-Match-Prototyp für Best-of-3/5, normale Tenniszählung, Tie-Break bei 6:6 und optional No-Ad.
- Großer Basic-Bedienmodus, umschaltbarer Pro-Modus mit Ereignisprotokoll und nachvollziehbarem Undo.
- Lokale Spielstandspeicherung im Browser; Anzeigetafel unter `display.html` funktioniert **nur in demselben Browserprofil**.
- **Noch keine echte geräteübergreifende Live-Synchronisierung**, keine vollständige offizielle Scorecard, keine Zeitstrafen, kein Doppel/Match-Tie-Break.
- Freigegebenes TENNILO-Umpire-Hauptlogo als Originaldatei in `public/assets/tennilo-umpire.png`.

## Lokal starten

`npm test` – sechs Scoring-Tests (Node.js 20+).

`npm run serve` – statischer Webserver unter http://localhost:8080/ (Python 3 erforderlich).

## Veröffentlichung

Die Live-Website wird **nur manuell** über [GitHub Actions – FTPS-Upload](https://github.com/tennilo-umpire/umpire-app/actions/workflows/deploy.yml) übertragen. Keine Veröffentlichung bei Push.

Repository-Secrets in `Settings > Secrets and variables > Actions`:

- `FTP_HOST` – FTPS/FTP-Host von ALL-INKL.
- `FTP_USER` – separater FTP-Benutzer, dessen Startverzeichnis direkt zur Subdomain `umpire.tennilo.de` gehört.
- `FTP_PASSWORD` – zugehöriges Passwort.

Keine Anmeldedaten im Quellcode. Der Upload nutzt explizites TLS (FTPS) per curl und überträgt ausschließlich Dateien aus `deploy-files.txt`. Der Upload löscht keine Serverdateien.

## Projekt- und Produktplanung

Die fachliche Ideensammlung liegt in [Google Drive – TENNILO Umpire](https://docs.google.com/document/d/1HiYIjCtF2FK7cK4bPEXf4nZIaq9AdMjKb9uFRS79ZW0/edit). `ROADMAP.md` beschreibt den technischen Status im Repository.

**Wichtig:** Der Prototyp ist kein offiziell zugelassenes oder validiertes Schiedsrichtersystem. Keine Matchdaten eingeben, die nicht auf diesem Gerät gespeichert sein dürfen; Browserdaten können gelöscht werden.
