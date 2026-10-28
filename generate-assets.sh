#!/usr/bin/env bash
#
# generate-assets.sh — Generate missing placeholder image assets for the
# YouTube Redesign (Svelte 5) project so every asset reference in
# src/lib/data/catalog.ts resolves to an existing file.
#
# Design tokens (src/lib/tokens.css):
#   --yt-page:     #0f0f0f  (app bg)
#   --yt-surface:  #181818
#   --yt-card:     #1f1f1f  (cards, menu bg)
#   --yt-raised:   #212121  (img fallbacks / post cards)
#   --yt-accent:   #ff0033  (red — icons, active)
#   --yt-text:     #f1f1f3  (primary text -> rendered as white #ffffff)
#   --yt-radius-xl: 16px    (thumbs, cards)
#   --yt-radius-pill: 9999px
#
# Requires: ImageMagick 7 (`magick`). Liberation Sans Bold for text.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS="$ROOT/public/assets"
AVATARS="$ASSETS/avatars"
BANNERS="$ASSETS/banners"
SHORTS="$ASSETS/shorts"
THUMBS="$ASSETS/thumbs"

FONT="/usr/share/fonts/liberation/LiberationSans-Bold.ttf"
if [ ! -f "$FONT" ]; then
  echo "ERROR: font not found at $FONT" >&2
  exit 1
fi

MAGICK="${MAGICK:-magick}"
if ! command -v "$MAGICK" >/dev/null 2>&1; then
  echo "ERROR: ImageMagick '$MAGICK' not found on PATH" >&2
  exit 1
fi

# Design-token colours.
YT_CARD="#1f1f1f"   # cards / avatar square background
YT_RAISED="#212121" # img fallbacks / thumb & short background
YT_SURFACE="#181818"
YT_ACCENT="#ff0033"
TEXT="#ffffff"      # centred white text (--yt-text #f1f1f3 ≈ white)

mkdir -p "$AVATARS" "$BANNERS" "$SHORTS" "$THUMBS"

TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

# Wrap a title into lines of at most $2 chars (newline separated).
wrap() {
  local t="$1" max="$2" w line="" out=""
  # shellcheck disable=SC2206
  local words=( $t )
  for w in "${words[@]}"; do
    if [ -z "$line" ]; then
      line="$w"
    elif [ $(( ${#line} + 1 + ${#w} )) -le "$max" ]; then
      line="$line $w"
    else
      out="${out}${line}"$'\n'
      line="$w"
    fi
  done
  out="${out}${line}"
  printf '%s' "${out#$'\n'}"
}

# Rounded-corner rectangle with centred white text.
#   rect <W> <H> <bg> <radius> <title> <out>
# Transparent rounded corners (alpha mask) so the page background shows.
rect() {
  local W="$1" H="$2" BG="$3" RAD="$4" TITLE="$5" OUT="$6"
  local len=${#TITLE}
  local ps=64
  if [ "$len" -gt 34 ]; then ps=52; fi
  if [ "$len" -gt 44 ]; then ps=44; fi

  local wrapped
  if [ "$len" -gt 44 ]; then wrapped="$(wrap "$TITLE" 40)"; else wrapped="$TITLE"; fi

  local MASK="$TMPDIR/mask.png"
  "$MAGICK" -size "${W}x${H}" xc:black -fill white \
    -draw "roundrectangle 0,0 $((W - 1)),$((H - 1)) ${RAD},${RAD}" \
    "$MASK"
  "$MAGICK" -size "${W}x${H}" -colorspace sRGB xc:"$BG" "$MASK" \
    -compose CopyOpacity -composite \
    -font "$FONT" -pointsize "$ps" -fill "$TEXT" -gravity center \
    -annotate +0+0 "$wrapped" \
    "$OUT"
}

# Circular avatar on a card background with centred white initials.
#   avatar <slug> <initials> <accent-colour> <out>
avatar() {
  local SLUG="$1" INITIALS="$2" ACCENT="$3" OUT="$4"
  local ps
  local len=${#INITIALS}
  if [ "$len" -le 2 ]; then ps=110; elif [ "$len" -le 3 ]; then ps=70; else ps=52; fi

  "$MAGICK" -size 200x200 -colorspace sRGB xc:"$YT_CARD" \
    -fill "$ACCENT" -draw "circle 100,100 100,15" \
    -font "$FONT" -pointsize "$ps" -fill "$TEXT" -gravity center \
    -annotate +0+0 "$INITIALS" \
    "$OUT"
}

# ---------------------------------------------------------------------------
# 1. AVATARS (29 channels) — 200x200, #1f1f1f bg, accent centre circle,
#    white centred initials.
# ---------------------------------------------------------------------------
echo "==> Generating 29 avatars ..."

avatar juxtoppassed           J  "#ff0033"   "$AVATARS/juxtoppassed.png"
avatar lofi-girl              LG "#e55454"   "$AVATARS/lofi-girl.png"
avatar wvw                    W  "#4dabf7"   "$AVATARS/wvw.png"
avatar the-critical-drinker   TCD "#6c5ce7"  "$AVATARS/the-critical-drinker.png"
avatar brandonshepherd        BS "#e84393"   "$AVATARS/brandonshepherd.png"
avatar preppy-kitchen         PK "#e67e22"   "$AVATARS/preppy-kitchen.png"
avatar the-game-theorists     TGT "#7f6bff"  "$AVATARS/the-game-theorists.png"
avatar dailydoseofinternetcats DDI "#00b894" "$AVATARS/dailydoseofinternetcats.png"
avatar fireship               F  "#ff0033"   "$AVATARS/fireship.png"
avatar theprimetime           TP "#e17055"   "$AVATARS/theprimetime.png"
avatar ninjashyper            N  "#00cec9"   "$AVATARS/ninjashyper.png"
avatar eve-online             EO "#4834d4"   "$AVATARS/eve-online.png"
avatar howtobasic             HB "#d63031"   "$AVATARS/howtobasic.png"
avatar coding-with-ai         CWA "#0984e3"  "$AVATARS/coding-with-ai.png"
avatar cyberpunk-game         CG "#8e44ad"   "$AVATARS/cyberpunk-game.png"
avatar fortnite               FT "#f39c12"   "$AVATARS/fortnite.png"
avatar gamespot               GS "#ff5252"   "$AVATARS/gamespot.png"
avatar playstation            PS "#00b894"   "$AVATARS/playstation.png"
avatar bog                    B  "#636e72"   "$AVATARS/bog.png"
avatar vsauce                 V  "#e67e22"   "$AVATARS/vsauce.png"
avatar the-report-of-the-week TROW "#6c5ce7" "$AVATARS/the-report-of-the-week.png"
avatar daniel-kraff           DK "#e17055"   "$AVATARS/daniel-kraff.png"
avatar man-carrying-thing     MCT "#0984e3"  "$AVATARS/man-carrying-thing.png"
avatar screen-junkies         SJ "#e84393"   "$AVATARS/screen-junkies.png"
avatar ok                     O  "#636e72"   "$AVATARS/ok.png"
avatar youtube-enjoyer        YE "#e17055"   "$AVATARS/youtube-enjoyer.png"
avatar happy-youtube-enjoyer  HYE "#00b894"  "$AVATARS/happy-youtube-enjoyer.png"
avatar evil-youtube-enjoyer   EYE "#d63031"  "$AVATARS/evil-youtube-enjoyer.png"
avatar indifferent-youtube-enjoyer IYE "#636e72" "$AVATARS/indifferent-youtube-enjoyer.png"

# ---------------------------------------------------------------------------
# 2. BANNER (1) — 2560x240 linear gradient #ff0033 -> #181818, white text.
# ---------------------------------------------------------------------------
echo "==> Generating banner ..."

"$MAGICK" -size 2560x240 -define gradient:direction=East \
  "gradient:$YT_ACCENT-$YT_SURFACE" \
  -font "$FONT" -pointsize 110 -fill "$TEXT" -gravity center \
  -annotate +0+0 "Juxtoppassed" \
  "$BANNERS/juxtoppassed-banner.png"

# ---------------------------------------------------------------------------
# 3. SHORTS (2) — 720x1280 (9:16), #212121, radius 16, white title.
# ---------------------------------------------------------------------------
echo "==> Generating 2 shorts ..."

rect 720 1280 "$YT_RAISED" 16 "Put this cat in jail"            "$SHORTS/put-this-cat-in-jail.png"
rect 720 1280 "$YT_RAISED" 16 "Pizza Crust Really wants M..."    "$SHORTS/pizza-crust-really-wants-me.png"

# ---------------------------------------------------------------------------
# 4. MISSING THUMBS (18) — 1280x720 (16:9), #212121, radius 16, white title.
# ---------------------------------------------------------------------------
echo "==> Generating 18 thumbs ..."

rect 1280 720 "$YT_RAISED" 16 "The IMPOSSIBLE Laptop Fan..."    "$THUMBS/impossible-laptop-fan.png"
rect 1280 720 "$YT_RAISED" 16 "Game Theory: I Fixed Zelda's BROKEN Timeline!" "$THUMBS/game-theory-fixed-zelda-timeline.png"
rect 1280 720 "$YT_RAISED" 16 "First-Person Camera Creator Makes Islands Available Now" "$THUMBS/first-person-camera-islands-available-now.png"
rect 1280 720 "$YT_RAISED" 16 "I Turned Famous Logos into Emojis" "$THUMBS/turned-famous-logos-into-emojis.png"
rect 1280 720 "$YT_RAISED" 16 "Thomas Bergersen - A Christmas Carol (Trailer)" "$THUMBS/thomas-bergersen-a-christmas-carol.png"
rect 1280 720 "$YT_RAISED" 16 "The Best And Worst Of 2024"      "$THUMBS/the-best-and-worst-of-2024.png"
rect 1280 720 "$YT_RAISED" 16 "The Every UI/UX Website Explained" "$THUMBS/the-every-ui-ux-website-explained.png"
rect 1280 720 "$YT_RAISED" 16 "Josh Hutcherson Whistle"         "$THUMBS/josh-hutcherson-whistle.png"
rect 1280 720 "$YT_RAISED" 16 "Classic Gingerbread Cookies Recipe" "$THUMBS/classic-gingerbread-cookies-recipe.png"
rect 1280 720 "$YT_RAISED" 16 "GINBREAD COOKIES | gingerbread man recipe" "$THUMBS/gingerbread-man-recipe.png"
rect 1280 720 "$YT_RAISED" 16 "The WORST Movie Villains of the Year" "$THUMBS/the-worst-movie-villains-of-the-year.png"
rect 1280 720 "$YT_RAISED" 16 "How Many Ways Can You Count to Infinity?" "$THUMBS/how-many-ways-can-you-count-to-infinity.png"
rect 1280 720 "$YT_RAISED" 16 "React in 100 Seconds"            "$THUMBS/react-in-100-seconds.png"
rect 1280 720 "$YT_RAISED" 16 "I Built the Ultimate Gaming Setup" "$THUMBS/i-built-the-ultimate-gaming-setup.png"
rect 1280 720 "$YT_RAISED" 16 "Update 2.3 | Official Overview"  "$THUMBS/cyberpunk-update-2-3-overview.png"
rect 1280 720 "$YT_RAISED" 16 "The Best Games of 2024 — Top 10" "$THUMBS/the-best-games-of-2024-top-10.png"

echo "==> Done."
