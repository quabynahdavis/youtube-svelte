#!/usr/bin/env python3
"""
extract-icons.py — Slice Figma Icons-2.png (2080x2368 sprite sheet) into
individual icon PNGs under public/assets/icons/ and write index.json manifest.

Grid detection (verified via threshold-10 band analysis):
  - 11 columns x 12 rows = 132 icon cells
  - Column dark-core bands (x): [88-167],[266-341],[444-517],[622-689],[794-869],
    [970-1045],[1146-1221],[1322-1397],[1498-1573],[1674-1749],[1849-1927]
  - Row dark-core bands (y): [89-163],[267-339],[444-516],[616-695],[795-867],
    [973-1042],[1152-1213],[1330-1389],[1498-1569],[1678-1748],[1850-1923],[2026-2104]
  - Cell boundaries are placed at gutter midpoints; frame inner-edges (40/2076,
    40/2364) serve as the outer gutters so edge cells aren't over-wide/tall.
  - Each cell is cropped then trimmed to its non-transparent bounding box.
"""
import os, sys, json
from PIL import Image

SRC = "/home/davisville/Projects/redesign/youtube/YouTube Redesign (Community)/Icons-2.png"
OUT = "/home/davisville/Projects/redesign/youtube/public/assets/icons"

# Verified threshold-10 dark-core bands.
COL_BANDS = [(88,167),(266,341),(444,517),(622,689),(794,869),
             (970,1045),(1146,1221),(1322,1397),(1498,1573),(1674,1749),(1849,1927)]
ROW_BANDS = [(89,163),(267,339),(444,516),(616,695),(795,867),(973,1042),
             (1152,1213),(1330,1389),(1498,1569),(1678,1748),(1850,1923),(2026,2104)]

# Frame inner-edges (from threshold-0 full-border analysis).
FRAME_L, FRAME_R = 40, 2076
FRAME_T, FRAME_B = 40, 2364

def boundaries(bands, outer_lo, outer_hi):
    n = len(bands)
    b = [(outer_lo + bands[0][0]) // 2]
    for i in range(n - 1):
        b.append((bands[i][1] + bands[i + 1][0]) // 2)
    b.append((bands[-1][1] + outer_hi) // 2)
    return b  # length n+1

XB = boundaries(COL_BANDS, FRAME_L, FRAME_R)
YB = boundaries(ROW_BANDS, FRAME_T, FRAME_B)

NCOLS = len(COL_BANDS)
NROWS = len(ROW_BANDS)
print(f"Grid: {NCOLS} cols x {NROWS} rows = {NCOLS*NROWS} cells")
print(f"X bounds: {XB}")
print(f"Y bounds: {YB}")

os.makedirs(OUT, exist_ok=True)

# Remove previous ad-hoc extraction + stale index.
for f in os.listdir(OUT):
    if f.startswith("icon-r") and f.endswith(".png"):
        os.remove(os.path.join(OUT, f))
for f in ("_index.png", "_index_view.png", "index.json"):
    p = os.path.join(OUT, f)
    if os.path.exists(p):
        os.remove(p)

img = Image.open(SRC).convert("RGBA")

manifest = []
total = 0
extracted = 0
skipped = []

for r in range(NROWS):
    y0, y1 = YB[r], YB[r+1]
    for c in range(NCOLS):
        x0, x1 = XB[c], XB[c+1]
        total += 1
        name = f"icon-r{r:02d}-c{c:02d}"
        out_path = os.path.join(OUT, f"{name}.png")
        cell = img.crop((x0, y0, x1, y1))
        # Trim to non-transparent bounding box.
        alpha = cell.getchannel("A")
        bbox = alpha.getbbox()  # (left, upper, right, lower) or None if fully transparent
        if bbox is None:
            skipped.append((name, "empty"))
            continue
        l, t, rgt, btm = bbox
        trimmed = cell.crop((l, t, rgt, btm))
        trimmed.save(out_path, format="PNG")
        extracted += 1
        w, h = trimmed.size
        manifest.append({
            "name": name,
            "path": f"/assets/icons/{name}.png",
            "row": r,
            "col": c,
            "source": "Icons-2.png",
            "gridCell": [x0, y0, x1, y1],
            "size": f"{w}x{h}",
        })

manifest_path = os.path.join(OUT, "index.json")
with open(manifest_path, "w") as f:
    json.dump(manifest, f, indent=2)

print(f"\nScanned {total} cells, extracted {extracted} icons, skipped {len(skipped)}")
if skipped:
    print("Skipped:", skipped)
print(f"Manifest: {manifest_path}")
print(f"Icons dir: {OUT}")
