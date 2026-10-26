# YouTube Redesign — dark-theme playground

A from-scratch Svelte 5 (runes) + Vite + TypeScript re-implementation of the
redesigned YouTube UI concept in [`YouTube Redesign (Community)/`](./YouTube%20Redesign%20(Community)).
Home, Shorts, Subscriptions (timeline/list), Collections, channel pages and the
Share / Notifications / Personalized-feed overlays, styled with plain CSS design
tokens (`src/lib/tokens.css`) and Figtree — no Tailwind.

## Setup

Requires [pnpm](https://pnpm.io) (managed via corepack; pinned by the
`packageManager` field).

```sh
pnpm install
pnpm dev        # vite dev server (pick a free port, e.g. pnpm dev -- --port 5175)
pnpm build      # production build to dist/
pnpm check      # svelte-check + tsc — must pass with 0 errors
pnpm preview    # serve the production build
```

> pnpm was migrated from npm (`pnpm import`); the npm lockfile is gone — do not
> reintroduce `package-lock.json`.

## Project map

```
src/
  lib/
    tokens.css           design tokens (--yt-* ...): colors, radii, spacing, type, shadows
    stores.svelte.ts     runes app store ($state) — stores.ts re-exports it
    data/catalog.ts      typed mock catalog: CHANNELS, VIDEOS, CHIPS, COLLECTIONS + helpers
    components/          TopBar, Sidebar, ChipRow, VideoCard, ShortsCard, ContextMenu,
                         NotifsPanel, ShareModal, PersonalizeModal, Icon, Avatar
    pages/               Home, Shorts, Subscriptions (hosts the Collections tab), ChannelPage
  assets/
public/assets/           thumbs / shorts / avatars / banners / icons (filled by the asset agent)
```

Media for the mockups lives in `YouTube Redesign (Community)/` (design
reference, read-only). Design previews: `/tmp/opencode/yt_previews/`.
