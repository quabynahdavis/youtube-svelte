<script lang="ts">
  /*
    Route — registers itself with the Router and, when its `path` matches the
    current URL, renders its `component` passing the matched `params`.
  */
  import { getContext, onDestroy } from 'svelte';
  import { ROUTER, type RouterContext } from './context';

  interface Props {
    path: string;
    component: any;
  }

  let { path: routePath, component }: Props = $props();
  const router = getContext<RouterContext>(ROUTER);

  const active = $derived(
    router.activeRoute !== null && router.activeRoute.path === routePath
  );

  const params = $derived(router.activeRoute?.params ?? {});

  // `id` is the route path (unique per route definition); registered
  // reactively so the Router can match against the current path.
  $effect(() => {
    router.registerRoute(routePath, routePath);
    return () => router.unregisterRoute(routePath);
  });
</script>

{#if active}
  <svelte:component this={component} {params} />
{/if}
