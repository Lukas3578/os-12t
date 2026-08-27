# VortexOS OTA-Sicherheitsmodell für Xiaomi 12T

## Gewählter Aktualisierungsmodus

VortexOS verwendet den vom Nutzer gewählten Modus **„automatisch prüfen und laden, anschließend bestätigen“**. Ein Hintergrunddienst fragt im vorgegebenen Intervall einen signierten Stable-Kanal im GitHub-Repository ab. Nur falls das Manifest und das zugehörige Paket alle Prüfungen bestehen, wird das Paket in einem abgeschirmten Pending-Bereich gespeichert. Eine Installation ist danach erst möglich, wenn die Systemoberfläche sie ausdrücklich bestätigt und ein kontrollierter Neustart folgt.

> **Ein gefundener Release ist kein Installationsauftrag.** Erst eine gültige Signatur, eine übereinstimmende Prüfsumme, eine kompatible Gerätekennung, eine zulässige Versionsfolge und die sichtbare Bestätigung des Eigentümers bereiten eine Installation vor.

| Schritt | Durchsetzung | Bei Fehler |
|---|---|---|
| Kanal abrufen | HTTPS, feste GitHub-Quelle, Zeitlimit | Keine Statusänderung, Fehlerstatus schreiben |
| Kanal verifizieren | Ed25519-Signatur gegen fest eingebetteten öffentlichen Schlüssel | Release verwerfen |
| Manifest prüfen | `plato`-Kennung, Schema, semantische Version, vertrauenswürdige Asset-URL | Release verwerfen |
| Versionsschutz | Nur höhere Versionen, Mindestversion beachten | Downgrade und inkompatible Updates verwerfen |
| Paket laden | HTTPS, getrennte `.part`-Datei, erwartete Bytegröße | Unvollständiges Paket löschen |
| Paket verifizieren | SHA-256 exakt gegen signiertes Manifest | Paket löschen und Fehler melden |
| Installation | Nur nach `confirm` durch die Systemoberfläche; eigentlicher Installer ist gerätegebunden | Ohne Freigabe kein Neustart und keine Partitionsänderung |

## Vertrauensanker

Der Client vertraut **nicht** allein dem GitHub-Konto, einem Release-Namen oder einer Download-URL. Der eigentliche Vertrauensanker ist der unveränderlich im Systemabbild mitgelieferte Ed25519-**öffentliche** Freigabeschlüssel. Der private Schlüssel bleibt außerhalb des Repositorys und darf niemals in Git, Release-Assets, Logs oder einer App abgelegt werden.

Der Stable-Kanal ist eine signierte JSON-Datei unter `ota/channels/stable.json` und zeigt auf ein unveränderliches GitHub-Release-Asset. GitHub-Releases eignen sich zur Auslieferung versionierter Artefakte und stellen herunterladbare Release-Assets bereit.[1] Der Update-Client ruft **nicht** automatisch beliebige Git-Commits oder ungeprüfte Tags ab.

## Erwartete Artefakte eines Releases

| Datei | Aufgabe |
|---|---|
| `stable.json` | Kompaktes, signiertes Manifest mit Version, Gerätekennung, Paket-URL, Größe und SHA-256 |
| `stable.json.sig` | Ed25519-Signatur der exakten Bytefolge von `stable.json` |
| `vortexos-plato-<Version>.ota` | Späteres, gerätekompatibles Update-Paket in einem GitHub-Release |
| `release-notes.md` | Vom Nutzer lesbare Änderungsliste; nicht sicherheitsrelevant |

Ein reguläres GitHub-Release ist vom Tag getrennt und kann Release-Assets enthalten.[2] Der Client akzeptiert deshalb ausschließlich im signierten Manifest genannte Assets der festen Release-URL von `Lukas3578/os-12t`.

## Automatik und Freigabe

Der mitgelieferte Hintergrunddienst ruft `vortex-update auto` auf. Diese Aktion darf nur den Kanal prüfen, ein gültiges neueres Paket laden und seinen Status festhalten. Sie darf **weder** das Paket anwenden **noch** einen Neustart auslösen. Die eigene VortexOS-Einstellungen-App kann den Status anzeigen und ruft bei sichtbarer Zustimmung `vortex-update confirm` auf. Erst ein anschließender Installationsauftrag ruft den späteren, gerätespezifischen A/B- oder Recovery-Installer auf.

Solange noch kein echter Xiaomi-12T-spezifischer Partitions-Installer getestet wurde, verweigert der mitgelieferte Stub die Anwendung bewusst. Diese Grenze verhindert, dass der OTA-Client ein Paket auf eine unbekannte Partition schreibt.

## Schlüsselbereitstellung vor der ersten echten Veröffentlichung

1. Erzeuge den Ed25519-Schlüssel **offline** auf einem vertrauenswürdigen Build-Rechner.
2. Übernimm ausschließlich den öffentlichen Schlüssel in `ota/keys/vortex-release-ed25519.pub` und später nach `/usr/share/vortexos/keys/` ins Systemabbild.
3. Bewahre den privaten Schlüssel verschlüsselt und außerhalb dieses Repositorys auf.
4. Signiere vor einer Veröffentlichung das Manifest mit `ota/release/make-release.sh`.
5. Prüfe das Update zunächst auf einem Testgerät mit entsperrtem Bootloader und funktionierender Wiederherstellung.

## References

[1] [GitHub Docs: REST API endpoints for releases](https://docs.github.com/en/rest/releases/releases)

[2] [GitHub Docs: About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
