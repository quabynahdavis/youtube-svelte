<script lang="ts">
  /*
    Minimal Svelte 5 runes router.

    Provides `Router` context (path, activeRoute, navigate, registerRoute,
    unregisterRoute) and renders the active route's component via `<slot>`.
    Replaces svelte-routing, which is Svelte 4-only and incompatible with
    runes mode (`export let` / `$$props` / `$$restProps`).
  */
  import { getContext, setContext, onMount, type Snippet } from 'svelte';
  import { ROUTER, type Params, type RouterContext } from './context';

  interface Props {
    children: Snippet;
  }

  interface RouteEntry {
    id: string;
    path: string;
  }

  /* --- path matching (exact, :param, trailing *) --- */
  function matchRouteSegments(
    pathname: string,
    routePath: string
  ): Params | null {
    const routeParts = routePath.split('/');
    const pathParts = pathname.split('/');

    let wildcard = false;
    if (routeParts[routeParts.length - 1] === '*') {
      wildcard = true;
      routeParts.pop();
    }

    if (wildcard) {
      if (routeParts.length > pathParts.length) return null;
      const params: Params = {};
      for (let i = 0; i < routeParts.length; i++) {
        const rp = routeParts[i];
        const pp = pathParts[i];
        if (rp === '' && pp === '') continue;
        if (rp.startsWith(':')) params[rp.slice(1)] = pp;
        else if (rp !== pp) return null;
      }
      return params;
    }

    if (routeParts.length !== pathParts.length) return null;
    const params: Params = {};
    for (let i = 0; i < routeParts.length; i++) {
      const rp = routeParts[i];
      const pp = pathParts[i];
      if (rp === '' && pp === '') continue;
      if (rp.startsWith(':')) params[rp.slice(1)] = pp;
      else if (rp !== pp) return null;
    }
    return params;
  }

  /* --- state --- */
  let currentPath = $state(window.location.pathname);
  const routes = $state<RouteEntry[]>([]);

  const activeRoute = $derived.by((): { path: string; params: Params } | null => {
    for (const r of routes) {
      const params = matchRouteSegments(currentPath, r.path);
      if (params !== null) return { path: r.path, params };
    }
    return null;
  });

  function navigate(to: string): void {
    if (to === currentPath) return;
    history.pushState(null, '', to);
    currentPath = to;
  }

  function registerRoute(id: string, path: string): void {
    routes.push({ id, path });
  }

  function unregisterRoute(id: string): void {
    const i = routes.findIndex((r) => r.id === id);
    if (i >= 0) routes.splice(i, 1);
  }

  onMount(() => {
    const onPop = (): void => {
      currentPath = window.location.pathname;
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  });

  const ctx: RouterContext = {
    get path(): string {
      return currentPath;
    },
    get activeRoute() {
      return activeRoute;
    },
    navigate,
    registerRoute,
    unregisterRoute,
  };

  setContext(ROUTER, ctx);

  let { children }: Props = $props();
</script>

{@render children()}
