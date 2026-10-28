# Setup — install, dev, build, check, preview

## Prerequisites

- [pnpm](https://pnpm.io) — managed via [corepack](https://nodejs.org/api/corepack.html); the version is pinned by the `packageManager` field in `package.json`:

```json
"packageManager": "pnpm@12.15.0"
```

Corepack resolves `pnpm` automatically on modern Node. If `pnpm` is not on your PATH, enable corepack first:

```sh
corepack enable
pnpm --version   # 12.15.0
```

## Install

```sh
pnpm install
```

This installs dev dependencies (`svelte`, `@sveltejs/vite-plugin-svelte`, `typescript`, `svelte-check`, `vite`, …) and dependencies (`@fontsource-variable/figtree`, `lucide-svelte`, `phosphor-svelte`, and the legacy `svelte-routing` entry, which is no longer used at runtime).

> **npm → pnpm migration:** the project was migrated from npm to pnpm (`pnpm import`). The npm lockfile is gone — **do not** reintroduce `package-lock.json`. Only `pnpm-lock.yaml` is maintained.

## Scripts

All scripts run from the repo root:

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Start the Vite dev server with HMR |
| `build` | `vite build` | Production build; output to `dist/` |
| `preview` | `vite preview` | Serve the production build locally (for testing the built output) |
| `check` | `svelte-check --tsconfig ./tsconfig.app.json && tsc -p tsconfig.node.json` | Type-check Svelte app + node TS; **must pass with 0 errors** |

### `pnpm dev`

Starts the dev server:

```sh
pnpm dev
```

Vite picks a default port (usually 5173). If that port is occupied, pass a free port explicitly:

```sh
pnpm dev -- --port 5175
```

> Port selection note: Vite will try the default port first and fall back to the next free one automatically; use `-- --port <n>` (the leading `--` forwards args to Vite) when you need a deterministic port, e.g. when sharing a preview link or avoiding collisions with other local services.

### `pnpm build`

```sh
pnpm build
```

Produces a production build in `dist/`. Run `pnpm check` before building to ensure the type check passes cleanly.

### `pnpm preview`

```sh
pnpm preview
```

Serves the contents of `dist/` locally so you can verify the production build. Requires `pnpm build` first.

### `pnpm check`

```sh
pnpm check
```

Runs `svelte-check` against `tsconfig.app.json` and `tsc` against `tsconfig.node.json`. Both must pass with **0 errors** (this is the project's definition of a clean type-check; CI/gates rely on it).

## Verification checklist

- [ ] `pnpm install` completes without errors
- [ ] `pnpm dev` starts and the app loads at `http://localhost:<port>/`
- [ ] `pnpm check` passes with 0 errors
- [ ] `pnpm build` succeeds and emits `dist/`
- [ ] `pnpm preview` serves the built app
