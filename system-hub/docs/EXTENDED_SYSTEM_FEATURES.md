# Erweiterte VortexOS-Systemfunktionen

## Überblick

Die Erweiterung bündelt weitere alltägliche Funktionen in einer klaren Systemzentrale. Jede Ansicht ist zunächst lokal und nicht-destruktiv. Sie zeigt den geplanten Bedienfluss, ohne heimlich Standortdaten zu übertragen, Dateien zu löschen oder Hardware dauerhaft zu verändern.

| Systembereich | Nutzerfunktion | Sichere Vorschauaktion | Spätere Anbindung |
|---|---|---|---|
| Benachrichtigungszentrale | Priorisierte Mitteilungen ansehen und als gelesen markieren | Lokale Karten ein- oder ausblenden | VortexOS-Benachrichtigungsdienst |
| Energie & Leistung | Balance-, Ausdauer- und Boost-Modus wählen | Status und geschätzte Auswirkung aktualisieren | Energie-, Wärme- und Leistungsdienst |
| Speicher & Dateien | Speicher nach Medien, Apps und Downloads verstehen | Kategorieansicht und Bereinigungsvormerkung | Dateidienst mit Papierkorb und Rechteprüfung |
| Guard & Privatsphäre | Kamera-, Mikrofon- und Zwischenablagezugriffe nachvollziehen | Lokalen Schutzhinweis bestätigen | Berechtigungs- und Datenschutzdienst |
| Vortex Find | Gerät klingeln lassen oder letzte sichere Verbindung sehen | Sichtbare lokale Ring-Vormerkung | Opt-in-Gerätesuche mit Konto- und Standortfreigabe |
| Schnellaktionen | Taschenlampe, Kamera, Fokus und Screenshot erreichen | Nicht-destruktive Statusrückmeldung | Verifizierte Systemaktionen |

## Zustands- und Sicherheitsmodell

Jede Funktion verwendet sichtbar einen von drei Zuständen: **lokale Vorschau**, **bereit zur Systemanbindung** oder **Bestätigung erforderlich**. Besonders sensible Bereiche sind absichtlich eingeschränkt. Vortex Find benötigt später eine ausdrückliche Anmeldung und Gerätezustimmung; die Dateibereinigung wird erst nach Auswahl, Speicherübersicht und eindeutiger Bestätigung tätig; Guard kann Berechtigungen darstellen, darf sie aber nur über den jeweiligen Systemdialog ändern.

> Komfort darf keine versteckte Systemwirkung haben. Jede dauerhafte Änderung bleibt sichtbar, erklärbar und bestätigungspflichtig.

Die Erweiterung bleibt unabhängig vom OTA-Client. Eine Updatekarte kann den sicheren Updatebereich öffnen, hat jedoch keinerlei Berechtigung, Signaturen zu prüfen, Pakete zu installieren oder einen Neustart auszulösen.
