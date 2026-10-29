#!/usr/bin/env bash
#
# extract-icons.sh — Slice the Figma Icons-2.png sprite sheet into individual
# icon PNGs under public/assets/icons/ and write an index.json manifest.
#
# Source: YouTube Redesign (Community)/Icons-2.png  (2080x2368 PaletteAlpha)
# Grid:   ~4px border frame + 11 columns x 12 rows of icon cells
#         Cell pitch ~176px, icons centered with ~98px gutters between cells.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="/home/davisville/Projects/redesign/youtube/YouTube Redesign (Community)/Icons-2.png"
OUT="$ROOT/public/assets/icons"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

MAGICK="${MAGICK:-magick}"
command -v "$MAGICK" >/dev/null 2>&1 || { echo "ERROR: ImageMagick 'magick' not found" >&2; exit 1; }

mkdir -p "$OUT"

# ---- remove the previous ad-hoc extraction (position-only names, no manifest) ----
echo "==> Removing previous ad-hoc icon extraction ..."
rm -f "$OUT"/icon-r*-c*.png "$OUT"/_index.png "$OUT"/_index_view.png

# ---- grid cell boundaries (computed from ink-band gutter midpoints, frame-inset) ----
# Columns: 11 cells. Boundaries at x = left-inset, then midpoints of empty gutters,
# then right-inset. Frame is ~4px at x=0..3 and x=2076..2079.
COL_BOUNDS=(4 216 392 569 741 919 1095 1271 1447 1623 1798 2076)
# Rows: 12 cells. Frame ~4px at y=0..3 and y=2364..2367.
ROW_BOUNDS=(4 215 391 566 745 920 1097 1271 1443 1623 1799 1974 2364)

NCOLS=$(( ${#COL_BOUNDS[@]} - 1 ))
NROWS=$(( ${#ROW_BOUNDS[@]} - 1 ))
echo "==> Grid: ${NCOLS} columns x ${NROWS} rows = $(( NCOLS * NROWS )) cells"

MANIFEST="$TMP/manifest.json"
echo "[" > "$MANIFEST"
FIRST=1
TOTAL=0
EXTRACTED=0

for ((r=0; r<NROWS; r++)); do
  y0=${ROW_BOUNDS[r]};   y1=${ROW_BOUNDS[r+1]}
  for ((c=0; c<NCOLS; c++)); do
    x0=${COL_BOUNDS[c]}; x1=${COL_BOUNDS[c+1]}
    w=$(( x1 - x0 )); h=$(( y1 - y0 ))
    TOTAL=$(( TOTAL + 1 ))
    name="icon-r$(printf '%02d' $r)-c$(printf '%02d' $c)"
    out="$OUT/$name.png"
    crop="$TMP/${name}_crop.png"
    # Crop the cell, then trim to the non-transparent icon bounding box.
    "$MAGICK" "$SRC" -crop "${w}x${h}+${x0}+${y0}" +repage "$crop" 2>/dev/null
    "$MAGICK" "$crop" -trim +repage "$out" 2>/dev/null
    # Verify the result is a real, non-empty PNG.
    if identify -quiet "$out" >/dev/null 2>&1; then
      dims=$(identify -quiet -format "%wx%h" "$out" 2>/dev/null)
      # Skip cells that trimmed to nothing (smaller than 8px in either dim = empty/noise).
      tw=$(echo "$dims" | cut -dx -f1); th=$(echo "$dims" | cut -dx -f2)
      if [ "$tw" -ge 8 ] && [ "$th" -ge 8 ]; then
        EXTRACTED=$(( EXTRACTED + 1 ))
        if [ "$FIRST" -eq 1 ]; then FIRST=0; else echo "," >> "$MANIFEST"; fi
        printf '  { "name": "%s", "path": "/assets/icons/%s.png", "row": %d, "col": %d, "source": "Icons-2.png", "gridCell": [ %d, %d, %d, %d ], "size": "%s" }' \
          "$name" "$name" "$r" "$c" "$x0" "$y0" "$x1" "$y1" "$dims" >> "$MANIFEST"
      else
        echo "    (skip empty) $name -> $dims"
        rm -f "$out"
      fi
    else
      echo "    (invalid) $name"
      rm -f "$out"
    fi
  done
done

echo "" >> "$MANIFEST"
echo "]" >> "$MANIFEST"

cp "$MANIFEST" "$OUT/index.json"
echo "==> Done. Scanned $TOTAL cells, extracted $EXTRACTED icons to $OUT"
echo "==> Manifest written to $OUT/index.json"
