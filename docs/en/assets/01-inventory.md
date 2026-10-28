# Asset inventory

Inventory of `public/assets/` — what is populated, what is missing, fallback behavior, and the logo source.

## Directory summary

`public/assets/` contains five directories owned by the asset agent. Component code in `src/lib/data/catalog.ts` defines the path contract; assets are **never** copied directly into `src/lib/data/`.

| Directory | Populated | Files | Notes |
|-----------|-----------|-------|-------|
| `thumbs/` | ✅ Yes | 10 PNGs | 8 Figma-sourced thumbnails + 2 alias PNGs |
| `shorts/` | ❌ No | 0 | Shorts fall back to styled placeholders |
| `avatars/` | ❌ No | 0 | `Avatar` falls back to initials on `onerror` |
| `banners/` | ❌ No | 0 | Banner slots degrade gracefully |
| `icons/` | ✅ Yes | 135 | Grid-sliced PNGs, reserved for v2 (unused in v1) |

## thumbs/ — video thumbnails (10 files)

Populated from Figma references in `YouTube Redesign (Community)/`.

Present files:

- `blurring-quirky-ways.png`
- `blurring-things-in-quirky-ways.png`
- `christmas-lofi-radio.png`
- `discord-ui-cozier.png` (alias)
- `entire-youtube-ui-from-scratch.png`
- `everything-about-color.png`
- `how-a-cat-works.png`
- `how-websites-learned-to-fit-everywhere.png` (alias)
- `redesigned-discord-ui-cozier.png`
- `redesigned-youtube-ui-from-scratch.png`

The two alias PNGs (`discord-ui-cozier.png`, `how-websites-learned-to-fit-everywhere.png`) were added so the catalog's short asset names resolve (`BRAND_LOGO` and thumb aliases commit `f579f9d`).

Many catalog-referenced thumbnails are **not** present (e.g. `impossible-laptop-fan.png`, `game-theory-fixed-zelda-timeline.png`, `the-best-and-worst-of-2024.png`, `react-in-100-seconds.png`, and others). `VideoCard` and `ShortsCard` handle missing images with an `onerror` fallback to a styled placeholder, so the UI degrades gracefully.

## shorts/ — Shorts thumbnails (0 files)

Empty. The catalog references `/assets/shorts/put-this-cat-in-jail.png` and `/assets/shorts/pizza-crust-really-wants-me.png` for the two cat shorts, but no Shorts assets have been populated. `ShortsCard` falls back to a styled placeholder on `onerror`.

## avatars/ — channel avatars (0 files)

Empty. The catalog references ~26 avatar paths (`/assets/avatars/<channel-slug>.png`, e.g. `juxtoppassed.png`, `lofi-girl.png`, `ninjashyper.png`, …) plus four "YouTube Enjoyer" account avatars. None are present. `Avatar.svelte` renders the channel initials as a fallback when the image fails to load (`onerror`), so channel cards and comments degrade gracefully.

## banners/ — channel banners (0 files)

Empty. The catalog references `/assets/banners/juxtoppassed-banner.png` for the Juxtoppassed channel banner. No banner assets have been populated; banner slots degrade gracefully (empty/omitted).

## icons/ — icon PNG grid (135 files)

Populated with grid-sliced icon PNGs:

- `icon-r00-c00.png` … `icon-r12-c00.png` (row/column grid slices)
- `_index.png`
- `_index_view.png`

These are **reserved for v2**. In v1, icons are rendered inline as SVGs via `Icon.svelte` (lucide-svelte / phosphor-svelte), so no PNG icon assets are consumed by the current UI.

## logo.png — brand logo

**Present:** `public/assets/logo.png`

- Source: Figma references in `YouTube Redesign (Community)/`
- Added in commit `assets: add logo.png and thumbnail aliases from Figma references`
- Referenced in code as `BRAND_LOGO = '/assets/logo.png'` in `src/lib/data/catalog.ts`
- `TopBar`/`Sidebar` render the brand logo; if it fails to load, the logo slot falls back to text styling per the component's `onerror` handler.

## Fallback behavior

Components that reference potentially-missing assets degrade gracefully:

- `Avatar.svelte` — `onerror` → renders channel initials
- `VideoCard.svelte` — `onerror` on thumb → styled placeholder
- `ShortsCard.svelte` — `onerror` on thumb → styled placeholder
- Logo slot — `onerror` → text fallback

Do not block rendering on missing assets; the mock catalog is designed so the demo is functional with thumbnails, avatars, banners, and shorts absent.

## Adding assets

Assets are populated by the asset agent into `public/assets/`. If you need a new asset:

1. Place the file under the correct `public/assets/<directory>/` following the catalog's path contract (see `catalog.ts` comments).
2. Do **not** edit `catalog.ts` asset paths unless the underlying data model changes.
3. Commit the new binary assets conventionally (e.g. `feat(assets): …`).
