SHELL := /bin/sh
ROOT := $(CURDIR)
OTA := $(ROOT)/ota
DESTDIR ?= $(ROOT)/out/rootfs
OTA_PUBLIC_KEY ?= $(OTA)/keys/vortex-release-ed25519.pub

.PHONY: help lint test install-rootfs clean

help:
	@printf '%s\n' 'VortexOS OTA targets:'
	@printf '%s\n' '  make lint                 Prüft Shell-Syntax.'
	@printf '%s\n' '  make test                 Führt die lokalen OTA-Sicherheitstests aus.'
	@printf '%s\n' '  make install-rootfs       Installiert den OTA-Client in out/rootfs (benötigt OTA_PUBLIC_KEY).'
	@printf '%s\n' '  make install-rootfs DESTDIR=/pfad/zum/rootfs OTA_PUBLIC_KEY=/pfad/zum/release.pub'

lint:
	@sh -n $(OTA)/bin/vortex-update
	@sh -n $(OTA)/bin/apply-ota
	@sh -n $(OTA)/release/make-release.sh
	@sh -n $(OTA)/tests/test-vortex-update.sh
	@node --check $(OTA)/ui/update-center-preview.js
	@node --check $(ROOT)/system-hub/ui/system-hub-preview.js
	@printf '%s\n' 'Shell- und UI-Syntax: OK'

test: lint
	@VORTEX_UPDATE_CLIENT=$(OTA)/bin/vortex-update sh $(OTA)/tests/test-vortex-update.sh

install-rootfs:
	@test -r $(OTA_PUBLIC_KEY) || { printf '%s\n' 'Fehler: OTA_PUBLIC_KEY fehlt. Nur der öffentliche Ed25519-Schlüssel darf ins Rootfs.' >&2; exit 2; }
	@openssl pkey -pubin -in $(OTA_PUBLIC_KEY) -noout >/dev/null 2>&1 || { printf '%s\n' 'Fehler: OTA_PUBLIC_KEY ist kein gültiger öffentlicher Schlüssel.' >&2; exit 2; }
	@install -D -m 0644 $(OTA_PUBLIC_KEY) $(DESTDIR)/usr/share/vortexos/keys/vortex-release-ed25519.pub
	@install -D -m 0755 $(OTA)/bin/vortex-update $(DESTDIR)/usr/libexec/vortexos/vortex-update
	@install -D -m 0755 $(OTA)/bin/apply-ota $(DESTDIR)/usr/libexec/vortexos/apply-ota
	@install -D -m 0644 $(OTA)/config/ota.conf $(DESTDIR)/etc/vortexos/ota.conf
	@install -D -m 0644 $(OTA)/systemd/vortex-update.service $(DESTDIR)/etc/systemd/system/vortex-update.service
	@install -D -m 0644 $(OTA)/systemd/vortex-update.timer $(DESTDIR)/etc/systemd/system/vortex-update.timer
	@mkdir -p $(DESTDIR)/etc/systemd/system/timers.target.wants
	@ln -sfn ../vortex-update.timer $(DESTDIR)/etc/systemd/system/timers.target.wants/vortex-update.timer
	@printf '%s\n' 'OTA-Client in $(DESTDIR) installiert.'

clean:
	@rm -rf $(ROOT)/out
