# YouTube Redesign — changelog (English)

Project and documentation revision history, summarized from `git log`. Entries are newest first. Non-merge, non-autosave commits are listed; autosave checkpoints (`chore(autosave)`) are omitted for readability.

## 2026-10-27

### `assets: add logo.png and thumbnail aliases from Figma references`
Added `public/assets/logo.png` (sourced from the Figma references in `YouTube Redesign (Community)/`) and thumbnail alias PNGs in `public/assets/thumbs/` (`discord-ui-cozier.png`, `how-websites-learned-to-fit-everywhere.png`) so the mock catalog's asset paths resolve.

### `fix(build): replace svelte-routing with Svelte 5 runes router`
Replaced `svelte-routing@2.13.0` (Svelte 4-only, incompatible with runes mode) with the custom Svelte 5 runes router at `src/lib/router/` (`Router.svelte`, `Route.svelte`, `link.ts`, `context.ts`, `index.ts`). Routes now defined in `src/App.svelte`: `/`, `/shorts`, `/subscriptions`, `/subscriptions/*`, `/collections`, `/channel/:slug`.

### `fix: resolve remaining bugs so pnpm check passes cleanly`
Final type-check cleanup so `pnpm check` (svelte-check + tsc) passes with 0 errors.

### `fix(components): eliminate pnpm check warnings in NotifsPanel and PersonalizeModal`
Resolved remaining check warnings in the Notifications and Personalized-feed overlays.

### `fix(components): share modal timeout cleanup, logo onerror fallback, platform icons; shorts fallback thumb style`
ShareModal timeout cleanup, logo `onerror` fallback, platform icon handling, and shorts fallback thumb styling.

### `refactor(icons): switch to phosphor-svelte icons`
Icon set migrated to `phosphor-svelte@^3.1.1` (v1 still renders inline SVGs via `Icon.svelte`; `public/assets/icons/` grid slices remain unused/reserved for v2).

## 2026-10-26

### `fix(layout): eliminate horizontal overflow and stabilize sidebar on resize`
Fixed horizontal overflow and stabilized the collapsible sidebar (239px drawer ↔ 72px rail) on window resize.

### `feat(assets): add cropped thumbnails, avatars, banners, icons, shorts to public/assets`
Populated `public/assets/`: 10 cropped thumbnails, 135 grid-sliced icons (`icon-rXX-cYY.png` + `_index.png` / `_index_view.png`). Avatar, banner, and shorts directories remained empty (components degrade gracefully via `onerror` fallbacks).

### `feat(overlay): complete ContextMenu, ShareModal, NotifsPanel, PersonalizeModal`
Completed the four overlay/portal components: `ContextMenu` (card ⋮ menu portal), `ShareModal`, `NotifsPanel` (notifications overlay), and `PersonalizeModal` (personalized-feed overlay).

### `feat(ui): Home — ICYM snap shelf (4.5 cards, hover chevron, dismiss) + full filter pipeline grid with empty state`
Home page: "In Case You Missed" snap shelf and the full chip-filtered video grid with empty state.

### `feat(ui): ChipRow variants, VideoCard/ShortsCard with hover kebab + fallback thumbs, reusable ContextMenu portal`
Added `ChipRow` chip variants, `VideoCard`/`ShortsCard` with hover kebab menus and graceful thumb fallbacks, and the reusable `ContextMenu` portal.

### `feat(ui): TopBar (live search, bell, theme ring) and Sidebar (collapsible groups, red active icons)`
Added `TopBar` (live search input, notifications bell, theme ring) and `Sidebar` (collapsible groups, red active icons).

### `feat(ui): shared Icon (inline-SVG set, no png assets in v1) and Avatar (asset fallback) primitives`
Added `Icon.svelte` (inline-SVG icon primitive; no PNG assets in v1) and `Avatar.svelte` (asset-backed avatar with `onerror` initials fallback).

### `feat(data): mock-grounded tokens, catalog expansion, and store v2`
Design tokens ground-truthed against the Figma mocks; `src/lib/data/catalog.ts` expanded (CHANNELS, VIDEOS, CHIPS, COLLECTIONS + helpers); runes `AppStore` v2 (`src/lib/stores.svelte.ts`, re-exported via `stores.ts`).

### `chore(deps): migrate npm to pnpm`
Migrated the package manager from npm to pnpm (`pnpm import`); `package-lock.json` removed, `packageManager` field pins `pnpm@12.15.0` via corepack.

## Earlier (scaffolding)

- `chore(app): force svelte 5 runes mode app-wide` — enabled Svelte 5 runes mode across the app.
- `chore(app): move svelte app to repo root` — relocated the Svelte app into the repository root.
- `feat(ui): app shell with runes store, dark tokens, and component/page stubs` — initial app shell (`src/App.svelte`), dark design tokens, and component/page stubs.
- `feat(data): design tokens and mock catalog (channels, videos, shorts, chip taxonomy)` — `src/lib/tokens.css` and the initial mock catalog.
- `chore(deps): install dependencies and add @fontsource-variable/figtree` — dependency install; Figtree variable font added.
- `chore(app): scaffold svelte 5 + vite + typescript app (create-vite svelte-ts)` — initial project scaffold (Svelte 5 + Vite + TypeScript).
- `docs(design): add Figma-exported redesign mockup assets` — design reference assets added to `YouTube Redesign (Community)/`.
- `chore(repo): initialize repository with root .gitignore` — repository initialized.
