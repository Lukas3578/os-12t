# VortexOS OTA für Xiaomi 12T (`plato`)

Dieses Repository enthält den **sicheren OTA-Grundstock** für VortexOS auf dem Xiaomi 12T. Das System prüft den GitHub-Stable-Kanal automatisch alle zwölf Stunden, lädt nur ein gültig signiertes und per SHA-256 geprüftes Paket in einen geschützten Pending-Bereich und verlangt vor jeder Installation eine sichtbare Bestätigung in der Systemoberfläche.

Es ist bewusst noch **kein flashbares Betriebssystem**. Bevor ein Update auf dem Telefon installiert werden kann, muss ein Xiaomi-12T-spezifischer Installer gegen den tatsächlichen Partitionsplan und eine Wiederherstellungsstrategie geprüft sein. Der vorhandene Installer-Stummel verweigert bis dahin jede Partitionsänderung.

## Was bereits funktioniert

| Baustein | Status |
|---|---|
| Automatische Stable-Kanalprüfung | Implementiert über einen `systemd`-Timer im 12-Stunden-Intervall |
| GitHub-Release-Anbindung | Fester Stable-Kanal mit Release-Asset-Pfad für `Lukas3578/os-12t` |
| Vertrauensprüfung | Ed25519-Manifestsignatur, Gerätekennung, Version, Dateigröße und SHA-256 |
| Schutz vor unbemerkter Installation | Paket wird nur vorbereitet; `confirm` ist erforderlich |
| Testabdeckung | Lokaler End-to-End-Test für gültige, manipulierte und falsche Artefakte sowie WLAN-/Akkuschutz |
| Update-Erlebnis | Interaktive Updateansicht mit Details, Release-Notizen, Aufschub und bestätigtem Neustart |
| Bewegungsdesign | Wiederverwendbarer animierter Neon-Obsidian-Hintergrund, sanfte Kartenübergänge und automatische Reduktion der Bewegung |
| System Hub | Interaktive Verbindung-, Fokus-, Medien-, Speicher-, Datenschutz- und Update-Steuerung als zentrale VortexOS-Ansicht |
| Partitionsschutz | Kein getesteter `plato`-Installer vorhanden; Anwendung wird abgelehnt |

## Lokale Prüfung

```sh
make test
make install-rootfs OTA_PUBLIC_KEY=/sicherer/pfad/vortex-release-ed25519.pub
```

Der erste Befehl führt die OTA-Sicherheitstests aus. Der zweite installiert den Client, die Beispielkonfiguration, den Timer und den **öffentlichen** Freigabeschlüssel in `out/rootfs`; dies verändert weder ein Telefon noch lokale Systempartitionen.

## Wie das Telefon später automatisch aktualisiert

1. Das Systemabbild enthält `vortex-update`, die Konfiguration sowie den **öffentlichen** Release-Schlüssel.
2. Der Dienst `vortex-update.timer` startet nach dem Booten und anschließend alle zwölf Stunden mit zufälliger Verzögerung.
3. Der Dienst prüft `ota/channels/stable.json` und dessen Ed25519-Signatur.
4. Nur ein neueres, für `plato` bestimmtes Release-Asset mit passender SHA-256-Prüfsumme wird bei sicherem WLAN und mindestens 50 % Akku geladen.
5. VortexOS zeigt dir Version, Änderungen, Fortschritt und Prüfsumme. Erst nach deiner Bestätigung darf der geprüfte Geräteinstaller beim kontrollierten Neustart starten.

## Ersten echten Release vorbereiten

Der private Ed25519-Schlüssel bleibt **außerhalb** des Repositorys. Erzeuge ihn offline, übernimm nur dessen öffentlichen Teil in das Systemabbild und verwende den privaten Teil ausschließlich zum Signieren:

```sh
export VORTEX_RELEASE_PRIVATE_KEY=/sicherer/pfad/vortex-release-private.pem
openssl pkey -in "$VORTEX_RELEASE_PRIVATE_KEY" -pubout -out /sicherer/pfad/vortex-release-ed25519.pub
export MIN_VERSION=0.1.0
ota/release/make-release.sh 0.2.0 /sicherer/pfad/vortexos-plato-0.2.0.ota release-output
```

Lade anschließend das OTA-Paket als Asset eines GitHub-Releases mit dem Tag `v0.2.0` hoch und übernimm `release-output/stable.json` sowie `release-output/stable.json.sig` gemeinsam nach `ota/channels/`. Der GitHub-Release-Endpunkt kann veröffentlichte Releases und ihre Assets bereitstellen.[1] Die vollständige Vertrauenskette, der Schlüsselumgang und die Testreihenfolge sind in [`ota/docs/SECURITY_MODEL.md`](ota/docs/SECURITY_MODEL.md) dokumentiert.

## Projektstruktur

| Pfad | Zweck |
|---|---|
| `ota/bin/vortex-update` | Update-Client auf dem Telefon |
| `ota/bin/apply-ota` | Sicherer Platzhalter bis zum getesteten Xiaomi-12T-Installer |
| `ota/config/ota.conf` | Stable-Kanal, Gerätekennung und Automatikregeln |
| `ota/systemd/` | Hintergrunddienst für automatische Prüfung und Download |
| `ota/release/make-release.sh` | Offline-Signierung des Release-Manifests |
| `ota/tests/test-vortex-update.sh` | End-to-End-Sicherheitstests |
| `ota/docs/SECURITY_MODEL.md` | Sicherheitsmodell und reale Freigabereihenfolge |
| `ota/docs/RELEASE_CHECKLIST.md` | Abnahmekriterien vor jeder Stable-Veröffentlichung |
| `ota/docs/UPDATE_EXPERIENCE.md` | Zustände, Schutzregeln und Texte der Update-Oberfläche |
| `ota/ui/update-center-preview.html` | Interaktive Neon-Obsidian-Vorschau des VortexOS-Updatebereichs |
| `ota/ui/vortex-motion.css` | Systemweit einbindbare Bewegungssprache und animierter Hintergrund |
| `ota/docs/MOTION_SYSTEM.md` | Bewegungsprinzipien, Dauerstufen und Zugänglichkeit |
| `system-hub/ui/system-hub-preview.html` | Interaktives VortexOS-System-Hub mit zusätzlichen Alltagsfunktionen |
| `system-hub/docs/SYSTEM_HUB.md` | Funktionsumfang, Systemgrenzen und Updateverknüpfung des Hubs |

## Reference

[1] [GitHub Docs: REST API endpoints for releases](https://docs.github.com/en/rest/releases/releases)
