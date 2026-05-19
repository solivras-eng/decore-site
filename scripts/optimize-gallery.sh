#!/usr/bin/env bash
# Generate responsive JPEG variants (-640, -1280) without overwriting originals.
# Requires macOS sips. Run from decore-site root: ./scripts/optimize-gallery.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GALLERY="$ROOT/assets/gallery"
QUALITY=82

resize_long_edge() {
  local src="$1"
  local dest="$2"
  local max="$3"
  local w h long

  w=$(sips -g pixelWidth "$src" 2>/dev/null | awk '/pixelWidth/ {print $2}')
  h=$(sips -g pixelHeight "$src" 2>/dev/null | awk '/pixelHeight/ {print $2}')
  if [[ -z "$w" || -z "$h" ]]; then
    echo "  skip (unreadable): $src"
    return 1
  fi

  if (( w >= h )); then long=$w; else long=$h; fi
  if (( long <= max )); then
    cp -f "$src" "$dest"
  elif (( w >= h )); then
    sips -s format jpeg -s formatOptions "$QUALITY" --resampleWidth "$max" "$src" --out "$dest" >/dev/null
  else
    sips -s format jpeg -s formatOptions "$QUALITY" --resampleHeight "$max" "$src" --out "$dest" >/dev/null
  fi
}

is_variant() {
  local base="$1"
  [[ "$base" == *-640.jpg ]] || [[ "$base" == *-640.JPG ]] || \
  [[ "$base" == *-1280.jpg ]] || [[ "$base" == *-1280.JPG ]] || \
  [[ "$base" == *-640.jpeg ]] || [[ "$base" == *-1280.jpeg ]]
}

count=0
skipped=0

while IFS= read -r src; do
  base=$(basename "$src")
  if is_variant "$base"; then
    continue
  fi

  dir=$(dirname "$src")
  ext="${base##*.}"
  stem="${base%.*}"
  dest1280="$dir/${stem}-1280.${ext}"
  dest640="$dir/${stem}-640.${ext}"

  if [[ -f "$dest1280" && -f "$dest640" ]]; then
    skipped=$((skipped + 1))
    continue
  fi

  echo "→ $src"
  if [[ ! -f "$dest1280" ]]; then
    resize_long_edge "$src" "$dest1280" 1280
  fi
  if [[ ! -f "$dest640" ]]; then
    resize_long_edge "$src" "$dest640" 640
  fi
  count=$((count + 1))
done < <(find "$GALLERY" -type f \( -iname '*.jpg' -o -iname '*.jpeg' \))

echo ""
echo "Done. Processed $count source(s); skipped $skipped already complete."
