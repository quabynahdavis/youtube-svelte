# YouTube Redesign — English documentation (root)

English-language docs for the YouTube Redesign project. This folder is the `en` language root; every file here is written in English.

## Project scope

A from-scratch **Svelte 5 (runes) + Vite + TypeScript** re-implementation of a redesigned YouTube UI concept. The design reference lives in `YouTube Redesign (Community)/` (Figma PNGs + SVG, read-only).

Covered surfaces:

- **Home** — "In Case You Missed" snap shelf + full filter-pipeline grid with empty state
- **Shorts** — vertical shorts feed with chip filtering
- **Subscriptions** — timeline/list view + Collections tab
- **Collections** — "Plays In" rows (Gaming / Design & Code / Tech)
- **Channel pages** — per-channel home tab
- **Overlays** — Share modal, Notifications panel, Personalized-feed modal, ContextMenu portal

Styled with plain CSS design tokens (`src/lib/tokens.css`, `--yt-*` vars) and the **Figtree** variable font. **No Tailwind.**

## Tech stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Svelte 5 (runes mode) | `svelte@^5.57.2` |
| Build tool | Vite | `vite@^8.3.4`, `@sveltejs/vite-plugin-svelte@^7.3.1` |
| Language | TypeScript | `typescript@~6.0.3`, `@tsconfig/svelte@^5.0.8` |
| Type checking | svelte-check + tsc | `pnpm check` must pass with **0 errors** |
| Styling | Plain CSS + design tokens | `src/lib/tokens.css`, `--yt-*` vars; Figtree via `@fontsource-variable/figtree@^5.3.0` |
| Icons | `lucide-svelte@^1.0.1`, `phosphor-svelte@^3.1.1` | Inline SVG set in v1; `public/assets/icons/` grid slices reserved for v2 |
| Package manager | pnpm (corepack) | Pinned via `packageManager` field: `pnpm@12.15.0` |
| Routing | Custom Svelte 5 runes router | `src/lib/router/` (replaces `svelte-routing@2.13.0`, which is Svelte 4-only) |
| State | Svelte 5 runes `$state` | `src/lib/stores.svelte.ts`, re-exported via `src/lib/stores.ts` |
| Data | Typed mock catalog | `src/lib/data/catalog.ts` + `notifications.ts` |

File manager note: the app was migrated **from npm to pnpm** (`pnpm import`). The npm lockfile is gone — do **not** reintroduce `package-lock.json`.

## Setup commands

Requires [pnpm](https://pnpm.io) (managed via corepack; pinned by the `packageManager` field).

```sh
pnpm install        # install dependencies (corepack shim resolves pnpm@12.15.0)
pnpm dev            # vite dev server — pick a free port, e.g. pnpm dev -- --port 5175
pnpm build          # production build to dist/
pnpm preview        # serve the production build locally
pnpm check          # svelte-check + tsc — must pass with 0 errors
```

## Source map (`src/`)

```
src/
  App.svelte            # app shell: TopBar + Sidebar + Router-driven pages + overlays
  lib/
    tokens.css          # design tokens (--yt-*): colors, radii, spacing, type, shadows, z-index
    stores.svelte.ts    # runes app store ($state AppStore singleton: `app`)
    stores.ts           # re-export surface for stores.svelte.ts
    types.ts            # shared types (MenuItem)
    router/             # custom Svelte 5 runes router
      index.ts          # public surface: Router, Route, link (+ types)
      Router.svelte     # provider: path matching, activeRoute, navigate, context
      Route.svelte      # registers route, renders matching component with params
      link.ts           # click action replacement for svelte-routing's link
      context.ts        # ROUTER symbol + RouterContext type
    data/               # mock data layer
      catalog.ts        # CHANNELS, VIDEOS, CHIPS, COLLECTIONS + helpers (formatCount, matchesChip, getChannel, …)
      notifications.ts  # NOTIFICATIONS mock feed
    components/         # UI primitives & composites
      TopBar.svelte     # live search, bell, theme ring
      Sidebar.svelte    # collapsible groups (239px drawer ↔ 72px rail), red active icons
      ChipRow.svelte    # chip filter variants
      VideoCard.svelte  # video card with hover kebab + fallback thumb
      ShortsCard.svelte # shorts card with fallback thumb
      ContextMenu.svelte# portal-backed card ⋮ menu
      NotifsPanel.svelte# notifications overlay
      ShareModal.svelte # share overlay
      PersonalizeModal.svelte # personalized-feed overlay
      Icon.svelte       # inline-SVG icon primitive
      Avatar.svelte     # avatar with asset onerror fallback
    pages/              # route pages
      Home.svelte
      Shorts.svelte
      Subscriptions.svelte
      Collections.svelte
      ChannelPage.svelte
  assets/               # (none — static assets live under public/assets/)
```

`public/assets/` — thumbs / shorts / avatars / banners / icons (populated by the asset agent; see `docs/en/assets/01-inventory.md`).

## Routing overview

A minimal Svelte 5 runes router (`src/lib/router/`) replaced `svelte-routing@2.13.0` (Svelte 4-only, incompatible with runes mode). It provides `Router`, `Route`, and a `link` action via Svelte context.

Routes defined in `src/App.svelte`:

| Path | Page |
|------|------|
| `/` | Home |
| `/shorts` | Shorts |
| `/subscriptions` | Subscriptions (timeline) |
| `/subscriptions/*` | Subscriptions (Collections tab) |
| `/collections` | Collections |
| `/channel/:slug` | ChannelPage |

Page navigation is also driven by the runes store (`app.activePage`, `app.openChannel(slug)`, `app.goToSubs(tab)`) — the store is the source of truth for shell UI state; the router owns the URL.

## State overview

`src/lib/stores.svelte.ts` exports an `AppStore` class and a singleton `app` (re-exported via `src/lib/stores.ts`). Svelte 5 requires `$state` runes to live in a `.svelte.ts` module.

Key slices:

- **Navigation** — `activePage` (`home` \| `shorts` \| `subscriptions` \| `collections` \| `channel`), `sidebarExpanded`
- **Top bar / feeds** — `searchQuery` (live search qualifying title + channel name), `homeChip`, `shortsChip`, `icmyDismissed`
- **Subscriptions** — `subsTab` (`subs` \| `collections`), `subsKind`, `subsSort`, `subsView` (`timeline` \| `list`), `collSort`, `collView`
- **Channel page** — `activeChannel` (`Channel \| null`), `channelTab`
- **Overlays & portals** — `notifsOpen`, `shareOpen`, `personalizeOpen`, `contextMenu` (portal state for `ContextMenu`)
- **Personalization / hygiene** — `personalize` (`mine`, `active`, `excluded`, `touched`), `hidden` (video slugs), `hiddenChannels`, `subscribed` (slug → boolean, defaults `true`)

Methods: `navigateTo(page)`, `openChannel(slug)`, `goToSubs(tab)`, `toggleSidebar()`, tag add/remove helpers, `toggleSubscribed(slug)`, context-menu open/close/run.

## Data overview

`src/lib/data/catalog.ts` is the typed mock dataset (single source of truth for numbers where mockups differ — the Home artboard wins).

Exports:

- `CHANNELS: Channel[]` — ~26 channels (slug, name, verified, subs, avatar, optional banner), incl. four fake "YouTube Enjoyer" accounts shown in the share sheet
- `VIDEOS: Video[]` — videos + 2 cat shorts (`type: 'video' \| 'short'`) with slug, title, channel, views, age, tags, duration, thumb, optional `playsIn`
- `CHIPS` / `SHORTS_CHIPS` — filter chip lists (Home / Shorts variants)
- `COLLECTIONS` — `['Gaming', 'Design & Code', 'Tech']` ("Plays In" rows)
- `COLLECTION_GROUPS` / `SUBSCRIBED_CHANNEL_SLUGS` — Subscriptions ▸ Collections tab groups
- `BRAND_LOGO = '/assets/logo.png'`, `SHARE_URL`, `iconUrl(name)`
- Helpers: `formatCount(n)`, `matchesChip(video, chip)`, `isExcludedBy(video, entries)`, `spreadVideos(videos, min)`, `getChannel(slug)`, `getVideos()`, `getShorts()`, `getChannelVideos(slug)`, `getChannelSetVideos(slugs)`, `getCollectionVideos(collection)`

`src/lib/data/notifications.ts` exports `NOTIFICATIONS: Notification[]` (5-item mock feed: upload/shared types).

## Asset notes

`public/assets/` directories: `thumbs`, `shorts`, `avatars`, `banners`, `icons`.

- **thumbs** — 10 PNGs populated (8 from Figma references + 2 alias PNGs). Many catalog-referenced thumbs are missing; `VideoCard`/`ShortsCard` degrade gracefully via `onerror` fallbacks.
- **shorts** — empty (0 files); shorts fall back to styled placeholders.
- **avatars** — empty (0 files); `Avatar` falls back to initials styling on `onerror`.
- **banners** — empty (0 files); banner slots degrade gracefully.
- **icons** — 135 grid-sliced PNGs (`icon-rXX-cYY.png` + `_index.png` / `_index_view.png`), reserved for v2; v1 uses inline SVGs via `Icon.svelte`.
- **logo.png** — present at `public/assets/logo.png`; sourced from the Figma references in `YouTube Redesign (Community)/` (added in commit `assets: add logo.png and thumbnail aliases from Figma references`).
- `BRAND_LOGO = '/assets/logo.png'` in `catalog.ts`.

See `docs/en/assets/01-inventory.md` for the full inventory.

## Git conventions

- Conventional commits: `feat(…)`, `fix(…)`, `chore(…)`, `docs(…)`, `refactor(…)` scopes.
- **No AI co-authors** — do not add `Co-authored-by:` trailers. All authorship stays credited to the user.
- Make chronological, atomic commits after every feat, fix, chore, or docs update; group only related files under one commit message.
