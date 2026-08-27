# VortexOS Motion System

## Prinzip

VortexOS bewegt sich wie ein **ruhiger Energiefluss**: sichtbar genug, um das System lebendig wirken zu lassen, aber nie hektisch oder ablenkend. Das animierte Neon-Obsidian-Hintergrundbild ist kein Video und benötigt keine externen Dateien. Es entsteht aus GPU-freundlichen Farbverläufen, langsam driftenden Lichtfeldern und einer sehr dezenten Sternenschicht.

| Ebene | Bewegung | Dauer | Wirkung |
|---|---|---:|---|
| Ambient-Hintergrund | Drei großflächige Lichtfelder driften gegeneinander | 18–28 Sekunden | Lebendige Tiefe ohne Aufmerksamkeit zu fordern |
| Lichtgitter | Zarte Linien verschieben sich langsam | 16 Sekunden | Technischer, hochwertiger VortexOS-Charakter |
| Karten | Weiches Einblenden mit minimalem Aufstieg | 420–620 Millisekunden | Klarer Einstieg in die Informationshierarchie |
| Primäraktion | Leichter Glanzimpuls und präzise Druckrückmeldung | 1,8 Sekunden / 160 Millisekunden | Erkennbare, wertige Handlung |
| Vertrauensindikatoren | Behutsames Leuchten | 2,8 Sekunden | Status bleibt sichtbar, ohne zu blinken |

## Gemeinsame Bewegungsregeln

Alle Systemansichten verwenden dieselben Bewegungsvariablen und Klassen aus `ota/ui/vortex-motion.css`. Die Hintergrundebene sitzt hinter den Inhalten, nimmt keine Eingaben an und wird über `transform` sowie `opacity` animiert. Dadurch bleibt die eigentliche Oberfläche ruhig und bedienbar.

> Bewegungen erklären Zustand und Hierarchie. Sie sind keine Dekoration um der Dekoration willen.

Die Dauer folgt drei Stufen: **schnell** für direkte Berührung (160–220 ms), **normal** für Oberflächenwechsel (360–620 ms) und **ambient** für den Hintergrund (mindestens 16 Sekunden). Größere Bewegungen nutzen `cubic-bezier(.22, .8, .22, 1)`, damit sie weich beschleunigen und sanft auslaufen.

## Zugänglichkeit und Energie

Bei aktivierter Betriebssystemeinstellung `prefers-reduced-motion: reduce` werden alle Positions-, Skalierungs- und Lichtanimationen angehalten. Inhalte bleiben vollständig sichtbar. Das Hintergrundbild wird zu einer statischen, kontrastreichen Neon-Obsidian-Komposition. Die Zeitwerte und die begrenzte Anzahl großflächiger Elemente vermeiden bewusst aggressive oder dauerhaft schnelle Effekte.
