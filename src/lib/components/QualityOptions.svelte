<script lang="ts">
  /*
    QualityOptions — viewport-clamped video quality dropdown.
    Mirrors ContextMenu's clamping / outside-click / Esc / scroll behaviour.
    The item matching `currentQuality` is highlighted with the accent colour.
  */
  import Icon from './Icon.svelte';

  type Quality = '2160p' | '1080p' | '720p' | '480p' | '360p' | '240p' | '144p' | 'Auto';

  const QUALITIES: Quality[] = [
    '2160p',
    '1080p',
    '720p',
    '480p',
    '360p',
    '240p',
    '144p',
    'Auto',
  ];

  interface Props {
    x: number;
    y: number;
    currentQuality: Quality;
    onPick?: (quality: Quality) => void;
    onDismiss?: () => void;
  }

  let { x, y, currentQuality, onPick, onDismiss }: Props = $props();

  let menuEl = $state<HTMLElement>();

  const width = 176;
  const rowHeight = 40;
  const pad = 8;

  const left = $derived.by(() => {
    const maxX = (typeof window !== 'undefined' ? window.innerWidth : 1280) - width - 8;
    return Math.max(8, Math.min(x, maxX));
  });
  const top = $derived.by(() => {
    const est = QUALITIES.length * rowHeight + pad + 28; // + header
    const maxY = (typeof window !== 'undefined' ? window.innerHeight : 800) - est - 12;
    return Math.max(8, Math.min(y, maxY));
  });

  const isOutside = (target: EventTarget | null): boolean => {
    if (!(target instanceof Element)) return true;
    return !menuEl?.contains(target);
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

<svelte:window
  onpointerdown={handleOutside}
  onkeydown={(e) => e.key === 'Escape' && onDismiss?.()}
/>

<menu
  class="quality-options-menu"
  bind:this={menuEl}
  style:left="{left}px"
  style:top="{top}px"
  role="menu"
>
  <div class="menu-header">Video Quality</div>
  {#each QUALITIES as q (q)}
    <button
      role="menuitem"
      class:active={q === currentQuality}
      onclick={() => onPick?.(q)}
    >
      <span class="label">{q}</span>
      {#if q === currentQuality}
        <span class="tick"><Icon name="check" size={14} /></span>
      {/if}
    </button>
  {/each}
</menu>

<style>
  .quality-options-menu {
    position: fixed;
    z-index: var(--yt-z-context);
    width: 176px;
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--yt-menu-border);
    border-radius: var(--yt-radius-lg);
    background: var(--yt-card);
    box-shadow: var(--yt-shadow-modal);
    display: flex;
    flex-direction: column;
  }
  .menu-header {
    padding: var(--yt-space-2) var(--yt-space-3);
    font-size: var(--yt-fs-sm);
    font-weight: var(--yt-weight-semibold);
    color: var(--yt-text-soft);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid var(--yt-menu-border);
    margin-bottom: var(--yt-space-1);
  }
  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 9px var(--yt-space-3);
    border-radius: var(--yt-radius-sm);
    background: none;
    color: var(--yt-text);
    text-align: left;
    font-size: var(--yt-fs-md);
    border: none;
    cursor: pointer;
    gap: var(--yt-space-3);
  }
  button:hover {
    background: var(--yt-elevated);
  }
  button.active {
    color: var(--yt-accent);
    background: var(--yt-accent-soft);
  }
  .tick {
    color: var(--yt-accent);
  }
</style>
