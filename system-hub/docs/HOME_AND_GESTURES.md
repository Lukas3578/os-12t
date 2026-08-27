# VortexOS Home & Gestures

## Ziel

Der Homescreen soll sich schnell, persönlich und kontrollierbar anfühlen. Nutzerinnen und Nutzer können die sichtbare Dichte, das Dock, die aktive Hintergrundbewegung und die wichtigsten Gesten selbst wählen. Änderungen werden unmittelbar in der Vorschau angezeigt und lokal gespeichert.

## Homescreen-Anpassung

| Einstellung | Optionen | Wirkung |
|---|---|---|
| App-Raster | 4 oder 5 Spalten | Ändert Dichte und Größe der App-Symbole auf dem Homescreen |
| Dock | 3 oder 5 Verknüpfungen | Hält die wichtigsten Apps dauerhaft am unteren Rand sichtbar |
| Hintergrundbewegung | An oder reduziert | Steuert die ruhigen Neon-Obsidian-Lichtfelder unabhängig von der globalen Barrierefreiheitseinstellung |
| Widget-Bereich | Glance, Fokus, Updates | Bestimmt die vorderste Informationskarte auf dem Homescreen |
| App-Anordnung | Bearbeitungsmodus durch langes Drücken | Bereitet spätere Drag-and-drop-Sortierung vor |

## Standardgesten

| Geste | Standardaktion | Anpassbar |
|---|---|---|
| Von oben nach unten wischen | Vortex Control Center | Ja |
| Von unten nach oben wischen | App-Übersicht | Ja |
| Nach links/rechts wischen | Homescreen-Seite wechseln | Ja |
| Doppeltippen auf freien Bereich | Sperrbildschirm | Ja |
| Lange auf freien Bereich drücken | Homescreen bearbeiten | Nein; dient als sicherer Zugang zur Anpassung |

Für anpassbare Gesten stehen nur eindeutige, lokale Systemaktionen bereit: **Control Center**, **App-Übersicht**, **Benachrichtigungen**, **Taschenlampe**, **Fokusmodus** oder **Keine Aktion**. Jede Geste erhält in der Vorschau eine klare Statusmeldung. Gefährliche oder irreversible Aktionen gehören bewusst nicht in die Gestenbelegung.

> Die Vorschau bildet Gesten mit Zeiger- und Berührungsereignissen ab. Die spätere native Implementierung muss dieselben Gesten über den VortexOS-Eingabedienst verarbeiten und darf nicht auf Browser-Logik vertrauen.
