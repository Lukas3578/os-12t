# Freigabeschlüssel

`vortex-release-ed25519.pub` wird erst vor dem ersten echten Systembuild in dieses Verzeichnis übernommen. Die Datei muss den PEM-kodierten **öffentlichen** Ed25519-Schlüssel der offiziellen VortexOS-Release-Stelle enthalten.

Der dazugehörige private Schlüssel darf niemals in diesem Repository, einem GitHub-Release, einem Systemabbild, einer App oder einer CI-Ausgabe abgelegt werden. Er bleibt offline auf einem vertrauenswürdigen Freigabe-Rechner. Die automatisierten Tests erzeugen eigene kurzlebige Schlüssel und verwenden diesen Ordner nicht.

Die Installation des Systemabbilds kopiert ausschließlich den öffentlichen Schlüssel nach `/usr/share/vortexos/keys/vortex-release-ed25519.pub`.
