#!/bin/sh
# Creates a signed VortexOS stable channel manifest for a GitHub release asset.
set -eu

usage() {
  cat <<'EOF'
Verwendung: make-release.sh <Version> <OTA-Paket> <Ausgabeordner>

Erforderliche Umgebungsvariablen:
  VORTEX_RELEASE_PRIVATE_KEY  Pfad zum privaten Ed25519-Freigabeschlüssel
  MIN_VERSION                 Älteste zugelassene installierte VortexOS-Version

Optional:
  VORTEX_REPOSITORY           Standard: Lukas3578/os-12t
EOF
}

[ "$#" -eq 3 ] || { usage >&2; exit 64; }
VERSION="$1"
PAYLOAD="$2"
OUTPUT_DIR="$3"
REPOSITORY="${VORTEX_REPOSITORY:-Lukas3578/os-12t}"
PRIVATE_KEY="${VORTEX_RELEASE_PRIVATE_KEY:?VORTEX_RELEASE_PRIVATE_KEY fehlt}"
MIN_VERSION="${MIN_VERSION:?MIN_VERSION fehlt}"

valid_version() { printf '%s\n' "$1" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$'; }
valid_version "$VERSION" || { echo 'Ungültige Version' >&2; exit 65; }
valid_version "$MIN_VERSION" || { echo 'Ungültige Mindestversion' >&2; exit 65; }
[ -r "$PRIVATE_KEY" ] || { echo 'Privater Schlüssel nicht lesbar' >&2; exit 66; }
[ -r "$PAYLOAD" ] || { echo 'OTA-Paket nicht lesbar' >&2; exit 66; }

EXPECTED_NAME="vortexos-plato-$VERSION.ota"
[ "$(basename "$PAYLOAD")" = "$EXPECTED_NAME" ] || {
  printf '%s\n' "OTA-Paket muss '$EXPECTED_NAME' heißen" >&2
  exit 65
}

mkdir -p "$OUTPUT_DIR"
SIZE="$(wc -c < "$PAYLOAD" | tr -d ' ')"
SHA256="$(sha256sum "$PAYLOAD" | awk '{print $1}')"
MANIFEST="$OUTPUT_DIR/stable.json"
SIGNATURE="$OUTPUT_DIR/stable.json.sig"

cat > "$MANIFEST" <<EOF
{
  "schema": 1,
  "version": "$VERSION",
  "device": "plato",
  "min_version": "$MIN_VERSION",
  "payload_url": "https://github.com/$REPOSITORY/releases/download/v$VERSION/$EXPECTED_NAME",
  "size_bytes": $SIZE,
  "sha256": "$SHA256",
  "notes_url": "https://github.com/$REPOSITORY/releases/tag/v$VERSION"
}
EOF

openssl pkeyutl -sign -inkey "$PRIVATE_KEY" -rawin -in "$MANIFEST" -out "$SIGNATURE"
printf '%s\n' "Manifest:  $MANIFEST"
printf '%s\n' "Signatur:  $SIGNATURE"
printf '%s\n' "Paket:     $EXPECTED_NAME ($SIZE Byte)"
printf '%s\n' "SHA-256:   $SHA256"
