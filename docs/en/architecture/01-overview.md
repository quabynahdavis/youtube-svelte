# Architecture overview

High-level architecture of the YouTube Redesign frontend: app shell, router, stores, data catalog, component hierarchy, and pages.

## 1. App shell (`src/App.svelte`)

The app shell assembles the chrome and mounts the router-driven pages plus overlays:

```svelte
<TopBar />
<div class="shell-body">
  <Sidebar />
  <main class="content">
    <Router>
      <Route path="/" component={Home} />
      <Route path="/shorts" component={Shorts} />
      <Route path="/subscriptions" component={Subscriptions} />
      <Route path="/subscriptions/*" component={Subscriptions} />
      <Route path="/collections" component={Collections} />
      <Route path="/channel/:slug" component={ChannelPage} />
    </Router>
  </main>
</div>

{#if app.notifsOpen}  <NotifsPanel />  {/if}
{#if app.shareOpen}   <ShareModal />   {/if}
{#if app.personalizeOpen} <PersonalizeModal /> {/if}
```

Layout primitives:

- `.shell` — column flex, `100dvh`, `overflow-x: hidden`
- `.shell-body` — row flex containing `Sidebar` + `main.content`
- `.content` — `max-width: var(--yt-content-max)` (1300px), centered, vertical scroll, padded with token spacing
- Overlays mount conditionally from store flags (`app.notifsOpen`, `app.shareOpen`, `app.personalizeOpen`) and render outside the routed content flow

Note: despite a stale comment in `App.svelte` ("uses svelte-routing"), routing is handled by the custom runes router in `src/lib/router/`.

## 2. Router (`src/lib/router/`)

A minimal Svelte 5 runes router replaced `svelte-routing@2.13.0` (Svelte 4-only; its `export let` / `$$props` / `$$restProps` API cannot compile in runes mode).

Files:

| File | Responsibility |
|------|----------------|
| `index.ts` | Public surface: re-exports `Router`, `Route`, `link`, and types (`RouterContext`, `RouterProps`, `Params`) |
| `Router.svelte` | Context provider. Holds `currentPath` (`$state`), registered `routes` (`$state`), derives `activeRoute` (`$derived.by`), exposes `navigate(to)`, `registerRoute(id, path)`, `unregisterRoute(id)`; listens to `popstate` |
| `Route.svelte` | Consumer. Registers itself with the router via `$effect`, derives `active` / `params`, renders `<svelte:component this={component} {params} />` when matched |
| `link.ts` | Click action (`use:link`) replacement for svelte-routing's `link`. Pushes `href` into `history` and dispatches `popstate`; modifier/middle clicks fall through to default browser behavior |
| `context.ts` | `ROUTER` symbol + shared `RouterContext` / `RouteEntry` / `Params` types |

Path matching supports exact segments, `:param` params, and a trailing `*` wildcard (used for `/subscriptions/*`).

## 3. Stores (`src/lib/stores.svelte.ts` + `src/lib/stores.ts`)

Svelte 5 requires `$state` runes to compile inside a `.svelte.ts` module, so the implementation lives in `src/lib/stores.svelte.ts`; `src/lib/stores.ts` re-exports everything (`export * from './stores.svelte'`) as the stable import path (`import { app } from '../stores'`).

The `AppStore` class exposes a singleton `app` with these state slices:

| Slice | Fields | Purpose |
|-------|--------|---------|
| Navigation | `activePage: Page`, `sidebarExpanded: boolean` | Current page; sidebar drawer ↔ rail toggle |
| Top bar / feeds | `searchQuery`, `homeChip`, `shortsChip`, `icmyDismissed` | Live search, per-page chips, ICYM shelf dismissal |
| Subscriptions | `subsTab`, `subsKind`, `subsSort`, `subsView`, `collSort`, `collView` | Subs/Collections tab, kind, sort, view mode (timeline/list, grid/list) |
| Channel page | `activeChannel: Channel \| null`, `channelTab: ChannelTab` | Opened channel and its tab |
| Overlays / portals | `notifsOpen`, `shareOpen`, `personalizeOpen`, `contextMenu: ContextMenuState \| null` | Modal flags and context-menu portal state |
| Personalization / hygiene | `personalize {mine, active, excluded, touched}`, `hidden`, `hiddenChannels`, `subscribed` | Personalized-feed sets, hidden videos/channels, subscription map |

Types: `Page`, `SubsTab`, `SubsKind`, `SubsSort`, `SubsView`, `CollSort`, `CollView`, `ChannelTab`, `ContextMenuState`, `Personalize`.

Key methods: `navigateTo(page)`, `openChannel(slug)`, `goToSubs(tab)`, `toggleSidebar()`, tag add/remove helpers (`removeOwnTag`, `toggleKeptTag`, `addKeptTag`, `addExcludedTag`, `removeExcludedTag`), `toggleSubscribed(slug)`, `isSubscribed(slug)`, `openContextMenu(video, x, y)`, `closeContextMenu()`, `runContextAction(action)`.

Defaults (`DEFAULT_TAG_POOL`, `DEFAULT_ACTIVE_TAGS`, `DEFAULT_EXCLUDED`) mirror the Personalized Feed mock.

## 4. Data catalog (`src/lib/data/`)

Typed mock data — the single source of truth for content shown in the demo.

### `catalog.ts`

- `VideoType = 'video' \| 'short'`, `PlaysIn = 'Gaming' \| 'Design \& Code' \| 'Tech'`
- `Channel { slug, name, verified, subs, avatar, banner? }` — `CHANNELS: Channel[]` (~26 channels incl. four fake "YouTube Enjoyer" accounts used in the share sheet)
- `Video { slug, title, channel, views, age, tags, duration, thumb, type, playsIn? }` — `VIDEOS: Video[]` (videos + 2 cat shorts)
- `CHIPS` / `SHORTS_CHIPS` — Home and Shorts filter chip lists (mockup order; `"All"` is the white active pill)
- `COLLECTIONS` — `['Gaming', 'Design & Code', 'Tech']`
- `COLLECTION_GROUPS` / `SUBSCRIBED_CHANNEL_SLUGS` — Subscriptions ▸ Collections tab channel groups
- `BRAND_LOGO = '/assets/logo.png'`, `SHARE_URL`, `iconUrl(name)` (`/assets/icons/<name>.png`, reserved for v2)
- Helpers: `formatCount(n)`, `matchesChip(video, chip)`, `isExcludedBy(video, entries, opts)`, `spreadVideos(videos, min)`, `getChannel(slug)`, `getVideos()`, `getShorts()`, `getChannelVideos(slug)`, `getChannelSetVideos(slugs)`, `getCollectionVideos(collection)`

Asset path contract (owned by the asset agent; never copy files directly into the catalog):

- Thumb (video): `/assets/thumbs/<video-slug>.png`
- Thumb (short): `/assets/shorts/<slug>.png`
- Avatar: `/assets/avatars/<channel-slug>.png`
- Banner: `/assets/banners/juxtoppassed-banner.png`
- Brand logo: `/assets/logo.png`
- Icons (unused v1): `/assets/icons/<icon-name>.png`

Missing assets degrade gracefully via `onerror` fallbacks in `Avatar`, `VideoCard`, and `ShortsCard`.

### `notifications.ts`

- `NotificationType = 'upload' \| 'shared'`, `Notification { id, type, channelSlug, title?, videoThumb?, age }`
- `NOTIFICATIONS: Notification[]` — 5-item mock feed consumed by `NotifsPanel`

## 5. Component hierarchy (`src/lib/components/`)

```
App.svelte (shell)
├── TopBar.svelte            # live search, bell, theme ring
├── Sidebar.svelte           # collapsible groups (239px ↔ 72px), red active icons
│   └── (nav entries → app.goToSubs / app.openChannel)
├── main.content (Router pages)
│   ├── Home.svelte
│   ├── Shorts.svelte
│   ├── Subscriptions.svelte
│   ├── Collections.svelte
│   └── ChannelPage.svelte
├── NotifsPanel.svelte       # notifications overlay (app.notifsOpen)
├── ShareModal.svelte        # share overlay (app.shareOpen)
├── PersonalizeModal.svelte  # personalized-feed overlay (app.personalizeOpen)
└── ContextMenu.svelte       # portal-backed card ⋮ menu (app.contextMenu)
```

Shared primitives used across pages and overlays:

- `Icon.svelte` — inline-SVG icon set (lucide-svelte / phosphor-svelte); v1 uses no PNG icon assets
- `Avatar.svelte` — asset-backed avatar with `onerror` initials fallback
- `ChipRow.svelte` — chip filter row variants
- `VideoCard.svelte` — video card with hover kebab (`…` menu → ContextMenu) + thumb `onerror` fallback
- `ShortsCard.svelte` — shorts card with hover kebab + thumb fallback

## 6. Pages (`src/lib/pages/`)

| Page | Route | Description |
|------|-------|-------------|
| `Home.svelte` | `/` | "In Case You Missed" snap shelf (4.5 cards, hover chevron, dismiss) + chip-filtered video grid with empty state |
| `Shorts.svelte` | `/shorts` | Shorts feed with `SHORTS_CHIPS` filtering |
| `Subscriptions.svelte` | `/subscriptions` (+ `/*`) | Timeline/list view; hosts the Collections tab (`subsTab = 'collections'`) |
| `Collections.svelte` | `/collections` | "Plays In" rows: Gaming / Design & Code / Tech with collection gradients |
| `ChannelPage.svelte` | `/channel/:slug` | Per-channel page; opens via `app.openChannel(slug)` |

All pages consume `app` (the runes store) for navigation/UI state and `catalog.ts` (`getVideos`, `getChannelVideos`, `getCollectionVideos`, `matchesChip`, `formatCount`, …) for data.

## 7. Styling (`src/lib/tokens.css`)

Single source of truth for design tokens, ground-truthed against the Figma mocks:

- Canvas/surfaces: page `#0f0f0f`, surface `#181818`, card `#1f1f1f`, chips/pills `#272727` (hover `#3d3d3d`)
- Text: `#f1f1f3` primary, `#aaaaaa` secondary, `#717171` tertiary
- Accent: `#ff0033` red (icons, active), `#e70b3c` crimson (toggles, Copy Link)
- Radii: 6–20px + `9999px` pill; spacing on a 4px base; `max-width: 1300px` content
- Typography: Figtree variable font, weights 400–900, sizes `xs`–`4xl`
- Shadows / z-index layers (topbar 100 → context menu 400)
- Collection gradients (Gaming / Design & Code / Tech)

Plain CSS only (`--yt-*` variables on `:root`, `color-scheme: dark`); **no Tailwind**.
