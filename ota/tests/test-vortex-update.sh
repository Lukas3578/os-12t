#!/bin/sh
set -eu

ROOT="$(mktemp -d)"
PASS=0
FAIL=0
cleanup() { rm -rf "$ROOT"; }
trap cleanup EXIT INT TERM

pass() { PASS=$((PASS + 1)); printf 'ok - %s\n' "$1"; }
fail() { FAIL=$((FAIL + 1)); printf 'not ok - %s\n' "$1" >&2; }
expect_failure() {
  label="$1"
  shift
  if "$@" >"$ROOT/last.out" 2>"$ROOT/last.err"; then
    fail "$label"
  else
    pass "$label"
  fi
}

mkdir -p "$ROOT/cache" "$ROOT/state" "$ROOT/keys" "$ROOT/fixtures"
printf 'vortexos OTA integration-test payload\n' > "$ROOT/fixtures/vortexos-plato-0.2.0.ota"

openssl genpkey -algorithm ED25519 -out "$ROOT/keys/release-private.pem" >/dev/null 2>&1
openssl pkey -in "$ROOT/keys/release-private.pem" -pubout -out "$ROOT/keys/release-public.pem" >/dev/null 2>&1
PAYLOAD_SHA="$(sha256sum "$ROOT/fixtures/vortexos-plato-0.2.0.ota" | awk '{print $1}')"
PAYLOAD_SIZE="$(wc -c < "$ROOT/fixtures/vortexos-plato-0.2.0.ota" | tr -d ' ')"

write_manifest() {
  device="$1"
  payload_url="$2"
  version="${3:-0.2.0}"
  cat > "$ROOT/fixtures/stable.json" <<EOF
{
  "schema": 1,
  "version": "$version",
  "device": "$device",
  "min_version": "0.1.0",
  "payload_url": "$payload_url",
  "size_bytes": $PAYLOAD_SIZE,
  "sha256": "$PAYLOAD_SHA",
  "notes_url": "https://github.com/Lukas3578/os-12t/releases/tag/v$version"
}
EOF
  openssl pkeyutl -sign -inkey "$ROOT/keys/release-private.pem" -rawin -in "$ROOT/fixtures/stable.json" -out "$ROOT/fixtures/stable.json.sig"
}

write_manifest 'plato' 'https://github.com/Lukas3578/os-12t/releases/download/v0.2.0/vortexos-plato-0.2.0.ota'

cat > "$ROOT/mock-fetch" <<'EOF'
#!/bin/sh
set -eu
out=''
url=''
while [ "$#" -gt 0 ]; do
  case "$1" in
    --output) out="$2"; shift 2 ;;
    https://*) url="$1"; shift ;;
    *) shift ;;
  esac
done
[ -n "$out" ] && [ -n "$url" ]
case "$url" in
  *stable.json.sig) cp "$VORTEX_TEST_FIXTURES/stable.json.sig" "$out" ;;
  *stable.json) cp "$VORTEX_TEST_FIXTURES/stable.json" "$out" ;;
  *vortexos-plato-0.2.0.ota) cp "$VORTEX_TEST_FIXTURES/vortexos-plato-0.2.0.ota" "$out" ;;
  *) exit 97 ;;
esac
EOF
chmod 700 "$ROOT/mock-fetch"

cat > "$ROOT/ota.conf" <<EOF
REPOSITORY="Lukas3578/os-12t"
CHANNEL="stable"
CHANNEL_URL="https://raw.githubusercontent.com/Lukas3578/os-12t/main/ota/channels/stable.json"
DEVICE="plato"
CURRENT_VERSION="0.1.0"
POLL_INTERVAL_HOURS="12"
MAX_ASSET_BYTES="2147483648"
AUTO_DOWNLOAD="1"
REQUIRE_INTERACTIVE_CONFIRMATION="1"
AUTO_DOWNLOAD_WIFI_ONLY="1"
BATTERY_MIN_PERCENT="50"
BATTERY_CAPACITY_PATH="$ROOT/battery-capacity"
BATTERY_STATUS_PATH="$ROOT/battery-status"
NETWORK_TYPE_PATH="$ROOT/network-type"
EOF

printf 'cellular\n' > "$ROOT/network-type"
printf '75\n' > "$ROOT/battery-capacity"
printf 'Discharging\n' > "$ROOT/battery-status"

if [ -n "${VORTEX_UPDATE_CLIENT:-}" ]; then
  CLIENT="$VORTEX_UPDATE_CLIENT"
else
  CLIENT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)/bin/vortex-update"
fi

run_client() {
  VORTEX_UPDATE_CONFIG="$ROOT/ota.conf" \
  VORTEX_UPDATE_STATE_DIR="$ROOT/state" \
  VORTEX_UPDATE_CACHE_DIR="$ROOT/cache" \
  VORTEX_UPDATE_PUBKEY="$ROOT/keys/release-public.pem" \
  VORTEX_FETCH="$ROOT/mock-fetch" \
  VORTEX_TEST_FIXTURES="$ROOT/fixtures" \
  "$CLIENT" "$@"
}

if run_client check > "$ROOT/check.out" 2> "$ROOT/check.err" && grep -q 'Update verfügbar: VortexOS 0.2.0' "$ROOT/check.out"; then
  pass 'signiertes plato-Manifest wird erkannt'
else
  fail 'signiertes plato-Manifest wird erkannt'
fi

if run_client auto > "$ROOT/deferred-network.out" 2> "$ROOT/deferred-network.err" && \
  grep -q '"state": "deferred"' "$ROOT/state/status.json" && \
  ! test -e "$ROOT/cache/vortexos-plato-0.2.0.ota"; then
  pass 'Automatischer Download wartet auf vertrauenswürdiges WLAN'
else
  fail 'Automatischer Download wartet auf vertrauenswürdiges WLAN'
fi

printf 'wifi\n' > "$ROOT/network-type"
printf '25\n' > "$ROOT/battery-capacity"
if run_client auto > "$ROOT/deferred-battery.out" 2> "$ROOT/deferred-battery.err" && \
  grep -q 'mindestens 50 % Akku' "$ROOT/state/status.json" && \
  ! test -e "$ROOT/cache/vortexos-plato-0.2.0.ota"; then
  pass 'Automatischer Download wartet auf ausreichenden Akkustand'
else
  fail 'Automatischer Download wartet auf ausreichenden Akkustand'
fi

printf '75\n' > "$ROOT/battery-capacity"
if run_client auto > "$ROOT/stage.out" 2> "$ROOT/stage.err" && \
  grep -q 'Installation wartet auf Bestätigung' "$ROOT/stage.out" && \
  test -f "$ROOT/cache/vortexos-plato-0.2.0.ota" && \
  grep -q '"state": "prepared"' "$ROOT/state/pending.json" && \
  run_client status-json | grep -q '"state": "prepared"'; then
  pass 'Automatischer Download prüft und bereitet das Paket vor'
else
  fail 'Automatischer Download prüft und bereitet das Paket vor'
fi

expect_failure 'Ohne Bestätigung darf kein Installer aufgerufen werden' run_client install

if run_client confirm > "$ROOT/confirm.out" 2> "$ROOT/confirm.err" && \
  grep -q 'Bestätigt: VortexOS 0.2.0' "$ROOT/confirm.out" && \
  ! grep -q '"confirmed_at": ""' "$ROOT/state/pending.json" && \
  run_client status-json | grep -q '"state": "confirmed"'; then
  pass 'Installation verlangt und speichert Nutzerbestätigung'
else
  fail 'Installation verlangt und speichert Nutzerbestätigung'
fi

expect_failure 'Ohne gerätespezifischen Installer bleiben Partitionen unverändert' run_client install

printf 'Manipulation' >> "$ROOT/fixtures/stable.json.sig"
expect_failure 'Manipulierte Kanal-Signatur wird verworfen' run_client check

write_manifest 'ruby' 'https://github.com/Lukas3578/os-12t/releases/download/v0.2.0/vortexos-plato-0.2.0.ota'
expect_failure 'Manifest für anderes Gerät wird verworfen' run_client check

write_manifest 'plato' 'https://github.com/Lukas3578/os-12t/releases/download/v0.2.0/vortexos-plato-0.2.0.zip'
expect_failure 'Nicht zugelassener Release-Pfad wird verworfen' run_client check

write_manifest 'plato' 'https://github.com/Lukas3578/os-12t/releases/download/v0.1.0/vortexos-plato-0.1.0.ota' '0.1.0'
if run_client check > "$ROOT/current.out" 2> "$ROOT/current.err" && \
  grep -q 'auf dem neuesten Stand' "$ROOT/current.out" && \
  run_client status-json | grep -q '"state": "current"'; then
  pass 'Aktuelle Version wird als normaler Systemzustand behandelt'
else
  fail 'Aktuelle Version wird als normaler Systemzustand behandelt'
fi

printf '# Ergebnis: %s erfolgreich, %s fehlgeschlagen\n' "$PASS" "$FAIL"
test "$FAIL" -eq 0
