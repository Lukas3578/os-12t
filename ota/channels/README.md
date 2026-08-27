# VortexOS Stable-Kanal

Nach der ersten erfolgreichen Veröffentlichung liegen hier genau zwei Dateien:

| Datei | Inhalt |
|---|---|
| `stable.json` | Signiertes Manifest für das aktuell freigegebene Xiaomi-12T-OTA-Paket |
| `stable.json.sig` | Ed25519-Signatur der unveränderten Manifest-Bytefolge |

Der OTA-Client ruft diese Dateien alle zwölf Stunden ab. Ein Stable-Kanal darf erst aktualisiert werden, nachdem das zugehörige Paket als GitHub-Release-Asset veröffentlicht wurde und dessen Signatur, Größe, Prüfsumme, Gerätekennung sowie Installation auf einem separaten Testgerät geprüft sind.

Die erste Veröffentlichung wird mit `ota/release/make-release.sh` vorbereitet. Anschließend werden Manifest und Signatur gemeinsam in einem einzelnen Commit aktualisiert. Der Release-Tag und die in `payload_url` festgelegte Asset-Bezeichnung müssen exakt übereinstimmen.
