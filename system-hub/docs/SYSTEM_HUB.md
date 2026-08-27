# VortexOS System Hub

## Zweck

Das System Hub ist die zentrale, schnelle Übersicht von VortexOS. Es fasst die Funktionen zusammen, die man im Alltag ohne mehrere Menüs benötigt: Verbindung, Energie, Fokus, Datenschutz, Speicher, Gerätedienste und die sichere Updatebereitschaft. Die Oberfläche ist als berührbare Designstudie umgesetzt; ihre späteren Systemdienste erhalten klar getrennte Schnittstellen statt direktem Zugriff aus der Benutzeroberfläche.

## Funktionsbereiche

| Bereich | Sichtbare Funktion | Spätere Systemanbindung |
|---|---|---|
| Verbindung | WLAN, Bluetooth, mobile Daten und Flugmodus schnell ein- oder ausschalten | Netzwerk- und Funkdienst mit Berechtigungsprüfung |
| Fokus | „Flow“, „Ruhe“ und „Nacht“ verändern Benachrichtigungsruhe und Erscheinung | Profil- und Benachrichtigungsdienst |
| Energie | Akkuladung, Ladezustand und Energiesparmodus | Energie- und Akkudienst |
| Gerätezustand | Speicherübersicht, Datenschutzstatus und Sicherheitsprüfung | System-Health- und Berechtigungsdienst |
| Aktualisierung | Vorbereitetes signiertes Update, Version und Installationsstatus | `vortex-update status-json` über eine schmale System-API |
| Schnellaktionen | Taschenlampe, Screenshot, Nicht stören und Mediensteuerung | Jeweils freigegebene, systemnahe Aktionen |

## Interaktionsregeln

Die wichtigsten Steuerungen reagieren sofort und zeigen ihren Zustand klar über Farbe, Icon, Text und eine kurze Systemmeldung. Ein einzelnes Tippen schaltet eine harmlose Schnellfunktion ein oder aus. Aktionen mit dauerhafter Wirkung, insbesondere ein Update-Neustart, bleiben in der eigenen Updateansicht und verlangen eine sichtbare Bestätigung.

> Das System Hub darf Status anzeigen und berechtigte Schnellaktionen anfordern. Es darf weder Update-Signaturen umgehen noch direkt Systempartitionen verändern.

## Aktualisierungsverknüpfung

Die Updatekarte des Hubs verweist auf die bereits vorhandene VortexOS-Updateansicht. Sie stellt zwei entscheidende Fakten heraus: Ein Paket ist nur dann „bereit“, wenn der OTA-Client seine Signatur und SHA-256-Prüfsumme bestätigt hat; ein Neustart wird nicht durch das Hub, sondern erst nach der Updatebestätigung vorbereitet.
