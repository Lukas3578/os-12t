# Freigabe-Checkliste für VortexOS OTA

Diese Checkliste gilt für **jede** Veröffentlichung im Stable-Kanal. Ein Release darf erst nach vollständiger Erfüllung aller Punkte in `ota/channels/stable.json` eingetragen werden.

## 1. Build und Schlüssel

| Prüfung | Erforderlicher Nachweis |
|---|---|
| Gerätebezug | Das Paket ist aus dem geprüften Build für Xiaomi 12T (`plato`) erzeugt. |
| Dateiname | Das Paket heißt exakt `vortexos-plato-<Version>.ota`. |
| Öffentlicher Schlüssel | Der im Systemabbild installierte Schlüssel stimmt mit dem offline verwahrten Release-Schlüssel überein. |
| Privater Schlüssel | Er befindet sich außerhalb des Repositorys und wird weder geloggt noch hochgeladen. |
| Lokale Prüfung | `make test` läuft vollständig erfolgreich durch. |

## 2. Testgerät und Wiederherstellung

| Prüfung | Erforderlicher Nachweis |
|---|---|
| Separates Testgerät | Das Update wird zuerst auf einem nicht produktiv benötigten Xiaomi 12T geprüft. |
| Wiederherstellung | Der getestete Installer kann bei Fehlern auf eine nachweislich funktionsfähige Systemversion zurückkehren. |
| Grundfunktionen | Boot, Display, Touch, Speicher, Laden, Mobilfunk, WLAN und Audio werden nach der Installation getestet. |
| Wiederanlauf | Mindestens ein weiterer Neustart bestätigt, dass der neue Slot bzw. die neue Systemversion stabil startet. |
| Abbruch | Unterbrochener Download und abgebrochene Installation führen nicht zu einer beschädigten Primärinstallation. |

## 3. GitHub-Release und Kanal

1. Erzeuge mit `ota/release/make-release.sh` ein Manifest und eine Signatur für das bereits geprüfte OTA-Paket.
2. Erstelle ein GitHub-Release mit dem Tag `v<Version>` und lade ausschließlich das exakt benannte OTA-Paket hoch.
3. Prüfe, ob die tatsächliche Asset-URL, Größe und SHA-256 dem generierten Manifest entsprechen.
4. Übernimm `stable.json` und `stable.json.sig` zusammen in einen einzelnen geprüften Commit auf `main`.
5. Warte den erfolgreichen Lauf **VortexOS OTA security tests** ab.
6. Teste den Stable-Kanal auf dem separaten Testgerät: `vortex-update check`, `stage`, sichtbare Bestätigung, kontrollierter Installationslauf und Neustart.

> Der Stable-Kanal wird nie vor dem GitHub-Release veröffentlicht. Andernfalls würde der Client zwar ein gültiges Manifest sehen, aber kein erreichbares Paket finden.

## 4. Verhalten auf dem Alltagstelefon

Nach erfolgreichem Test sucht VortexOS alle zwölf Stunden mit zufälliger Verzögerung nach einer neuen Stable-Version. Es kann ein vollständiges, gültiges Paket automatisch vorbereiten. **Es installiert nichts unbemerkt:** Der Update-Bildschirm zeigt Version, Änderungen, Größe und Prüfsumme und fordert eine Bestätigung. Erst dann darf die Systemoberfläche einen kontrollierten Neustart anfordern.

## 5. Sofortmaßnahmen bei fehlerhaftem Release

| Ereignis | Sofortmaßnahme |
|---|---|
| Signatur oder Prüfsumme ist falsch | Stable-Kanal nicht ändern; Paket und Release untersuchen. |
| Paket ist fehlerhaft, aber noch nicht installiert | `stable.json` und Signatur auf die letzte funktionsfähige Version zurücksetzen; fehlerhaften GitHub-Release als Pre-release kennzeichnen oder löschen. |
| Fehler nach Installation auf Testgerät | Release stoppen, Logs sichern, keine Ausweitung in den Stable-Kanal. |
| Privater Schlüssel könnte kompromittiert sein | Release-Schlüssel rotieren, neues Systemabbild mit neuem öffentlichen Schlüssel verteilen und alle weiteren Releases sperren. |
