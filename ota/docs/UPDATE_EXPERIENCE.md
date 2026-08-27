# VortexOS Update Experience

## Leitidee

Die Updatefunktion soll nicht wie ein technischer Wartungsdialog wirken, sondern wie ein **vertrauenswürdiger Systembereich**. VortexOS erledigt alles Ungefährliche selbst: nach Updates suchen, Signaturen prüfen, ein Paket bei sicheren Bedingungen laden und seinen Status speichern. Die Person am Telefon behält den letzten, folgenreichen Schritt: Sie sieht genau, was installiert werden soll, und bestätigt den kontrollierten Neustart.

## Zustände in der Systemoberfläche

| Zustand | Sichtbarer Text | Erlaubte Aktion |
|---|---|---|
| Aktuell | „VortexOS ist auf dem neuesten Stand.“ | Jetzt prüfen |
| Prüfung | „Signierten Stable-Kanal wird geprüft …“ | Abbrechen, Details öffnen |
| Geschützt verschoben | „Download wartet auf WLAN oder ausreichend Akku.“ | Bedingungen ansehen, jetzt nur prüfen |
| Wird vorbereitet | „Update wird sicher vorbereitet: 42 %“ | Hintergrund fortsetzen, Details öffnen |
| Bereit | Version, Größe, SHA-256-Kurzform und Release-Notizen | „Installation planen“ |
| Bestätigt | „Bereit für einen kontrollierten Neustart.“ | Neustart wählen oder später |
| Abgelehnt | „Update nicht vertrauenswürdig – nichts wurde geändert.“ | Diagnose anzeigen |
| Wiederherstellung | „Vorherige Version wird beibehalten.“ | Status und Logs anzeigen |

## Regeln für automatische Downloads

| Regel | Standard | Grund |
|---|---:|---|
| Stable-Kanal prüfen | Alle 12 Stunden | Regelmäßig, ohne unnötig viele Anfragen |
| Zufällige Verzögerung | Bis 25 Minuten | Viele Geräte rufen den Release-Kanal nicht gleichzeitig ab |
| Automatischer Download | Aktiv | Der sichere, zeitaufwendige Teil läuft selbstständig |
| Nur vertrauenswürdiges Netzwerk | Aktiv | Kein automatischer Download über unbekannte oder mobile Verbindung |
| Mindestakkustand | 50 % | Genug Reserve für Download und anschließenden Neustart |
| Laden erlaubt | Ja | Ein angeschlossenes Ladegerät ersetzt die Akku-Schwelle nicht; es unterstützt nur eine ausreichend sichere Ausgangslage |
| Installation ohne Bestätigung | Nie | Keine überraschende Systemänderung |

Der Client stellt diese Bedingungen vor dem automatischen Download fest. Kann eine Bedingung nicht zuverlässig ermittelt werden, wird das Update **verschoben**, nicht erzwungen. Ein manuell ausgelöster Check darf weiterhin ausschließlich die Verfügbarkeit prüfen; das Herunterladen bleibt an dieselben Integritätsregeln gebunden.

## Detailansicht eines vorbereiteten Updates

Eine vorbereitete Version zeigt den Namen `VortexOS <Version>`, die Gerätekennung `Xiaomi 12T · plato`, die Paketgröße, den Downloadzeitpunkt, den SHA-256-Kurzfingerabdruck, einen Link zu den Release-Notizen und eine verständliche Zusammenfassung der Installationsfolge. Die Schaltfläche lautet erst nach allen Prüfungen „Installation beim Neustart vorbereiten“. Sie enthält nie einen versteckten Sofort-Flash.

## Fehlerkommunikation

Fehlertexte nennen immer die Handlung und ihre Auswirkung. Beispielsweise lautet die Signaturmeldung nicht nur „Code 1“, sondern: „Signatur des Stable-Kanals stimmt nicht. Das Update wurde verworfen, dein System bleibt unverändert.“ Dadurch lässt sich zwischen einem verschobenen Download, einer Netzwerkstörung und einem Sicherheitsabbruch unterscheiden.

## Verbindung zur technischen Vertrauenskette

Die Oberfläche liest ausschließlich Statusdaten aus `/var/lib/vortexos/update/`. Sie besitzt keinen direkten Schreibzugriff auf Systempartitionen und keine Möglichkeit, eine fehlende Signatur zu übergehen. Die technische Vertrauenskette bleibt in [`SECURITY_MODEL.md`](SECURITY_MODEL.md) maßgeblich.
