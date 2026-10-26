<script lang="ts">
  /*
    ContextMenu — reusable portal-style menu: card ⋮ menus (App) AND
    small toolbar dropdowns (Subscriptions page). Fixed at {x, y},
    clamped into the viewport, closed by outside click / Esc / scroll.
  */
  import Icon from './Icon.svelte';

  export interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    /** full-width divider rendered above the item */
    divider?: boolean;
  }

  interface Props {
    x: number;
    y: number;
    items: MenuItem[];
    onPick?: (id: string) => void;
    onDismiss?: () => void;
  }

  let { x, y, items, onPick, onDismiss }: Props = $props();

  let menuEl = $state<HTMLElement>();

  const width = 220;
  const rowHeight = 40;
  const pad = 8;

  const left = $derived.by(() => {
    const maxX = (typeof window !== 'undefined' ? window.innerWidth : 1280) - width - 8;
    return Math.max(8, Math.min(x, maxX));
  });
  const top = $derived.by(() => {
    const est = items.length * rowHeight + pad;
    const maxY = (typeof window !== 'undefined' ? window.innerHeight : 800) - est - 12;
    return Math.max(8, Math.min(y, maxY));
  });

  const isOutside = (target: EventTarget | null): boolean => {
    if (!(target instanceof Element)) return true;
    if (menuEl?.contains(target)) return false;
    return !target.closest('[data-context-scope]');
  };

  const handleOutside = (e: PointerEvent): void => {
    if (isOutside(e.target)) onDismiss?.();
  };

  $effect(() => {
    const close = () => onDismiss?.();
    document.addEventListener('scroll', close, { capture: true, passive: true });
    return () => document.removeEventListener('scroll', close, { capture: true });
  });
</script>

<svelte:window onpointerdown={handleOutside} onkeydown={(e) => e.key === 'Escape' && onDismiss?.()} />

<menu class="context-menu" bind:this={menuEl} style:left="{left}px" style:top="{top}px" role="menu">
  {#each items as item (item.id)}
    {#if item.divider}
      <hr />
    {/if}
    <li>
      <button role="menuitem" onclick={() => { onPick?.(item.id); }}>
        {#if item.icon}
          <span class="glyph"><Icon name={item.icon} size={18} /></span>
        {/if}
        {item.label}
      </button>
    </li>
  {/each}
</menu>

<style>
  .context-menu {
    position: fixed;
    z-index: var(--yt-z-context);
    width: 220px;
    margin: 0;
    padding: var(--yt-space-1);
    list-style: none;
    border: 1px solid var(--yt-menu-border);
    border-radius: var(--yt-radius-lg);
    background: var(--yt-card);
    box-shadow: var(--yt-shadow-modal);
  }
  hr {
    margin: var(--yt-space-1) var(--yt-space-2);
    border: 0;
    border-top: 1px solid var(--yt-border);
  }
  li button {
    display: flex;
    align-items: center;
    gap: var(--yt-space-3);
    width: 100%;
    padding: 10px var(--yt-space-3);
    border-radius: var(--yt-radius-sm);
    background: none;
    color: var(--yt-text);
    text-align: left;
    font-size: var(--yt-fs-md);
    line-height: var(--yt-line-normal);
  }
  li button:hover {
    background: var(--yt-elevated);
  }
  .glyph {
    display: grid;
    place-items: center;
    width: 20px;
    color: var(--yt-text-soft);
  }
</style>

<script lang="ts" context="module">
  /**
   * Card context-menu items for VideoCard / ShortsCard.
   * Used by App (via app.runContextAction) which handles:
   * - share → opens ShareModal
   * - not-interested → hides video
   * - dont-recommend → hides channel
   * - add-to-queue / watch-later / add-to-playlist / report → no-ops (v1)
   */
  export const CARD_MENU_ITEMS: MenuItem[] = [
    { id: 'add-to-queue', label: 'Add to queue', icon: 'queue' },
    { id: 'watch-later', label: 'Watch later', icon: 'bookmark' },
    { id: 'add-to-playlist', label: 'Add to playlist', icon: 'plus' },
    { id: 'share', label: 'Share', icon: 'share' },
    { id: 'divider-1', label: '', divider: true },
    { id: 'not-interested', label: 'Not interested', icon: 'minus-circle' },
    { id: 'dont-recommend', label: 'Don\'t recommend channel', icon: 'ban' },
    { id: 'report', label: 'Report', icon: 'flag' },
  ];
</script>