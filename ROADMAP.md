# TENNILO Umpire – technische Roadmap

## U0.1 – lokaler Prototyp (im Repository umgesetzt)

- [x] Eigenes privates GitHub-Repository und manuell auslösbarer FTPS-Upload
- [x] TENNILO-Umpire-Original-Hauptlogo eingebunden
- [x] Matchstart Einzel, Best of 3/5, Aufschlagwahl, No-Ad
- [x] Punktelogik, regulärer Tie-Break bei 6:6, Satz-/Matchgewinn
- [x] Basic / Pro mit identischer Matchakte, Korrekturen per Journal
- [x] Anzeigetafel als lokale Vorschau im selben Browserprofil
- [x] Automatisierte Zähllogik-Tests
- [ ] Manueller Upload / Server-Praxistest auf umpire.tennilo.de

## U0.2 – echte geräteübergreifende Live-Anzeige (nächste Priorität)

- [ ] Authentifizierter Punktesender, Viewer-Link/QR-Code ohne Schreibrechte
- [ ] Backend mit geschützter serverseitiger Matchakte, synchronisiert über Geräte
- [ ] Offline-Puffer, geordnete Ereignis-Synchronisierung, Konfliktschutz
- [ ] Eindeutige Kennzeichnung veralteter Scoreboards, automatische Wiederverbindung
- [ ] Browser-/iPad-/TV-Praxistest an mehreren unabhängigen Geräten

## U0.3 – professionelle Matchverwaltung

- [ ] Doppel, Aufschlag-/Rückschlagreihenfolgen, finaler Match-Tie-Break
- [ ] Frühere Punkte korrigieren, nachfolgende Zählung automatisch neu berechnen
- [ ] Offizielle scorecard-nahe Notation und PDF-Export
- [ ] Unterbrechungen, Zeitkontrollen, Regelereignisse / Sanktionen

## Später

- [ ] SB02 Broadcast / SB03 Club / SB04 Stream-Overlay
- [ ] TENNILO Tournament-Integration, Benutzerrollen, Live-Zentrale, Watch

## Veröffentlichung / Sicherheit

Der manuelle FTPS-Workflow darf **keine Secrets in Logs ausgeben**, nur freigegebene `public/`-Dateien hochladen und nie bei normalem Git-Push automatisch live gehen. Bei unabhängigen Displays ist die lokale Vorschau nicht ausreichend; U0.2 ist vor produktivem Einsatz erforderlich.
