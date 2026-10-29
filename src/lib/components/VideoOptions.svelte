<script lang="ts">
  /*
    VideoOptions — viewport-clamped "More options" dropdown for the video player.
    Mirrors ContextMenu's clamping / outside-click / Esc / scroll behaviour with a
    fixed item list (sleep-timer, subtitles, playback-speed, …).
  */
  import Icon from './Icon.svelte';

  interface MenuItem {
    id: string;
    label: string;
    icon?: string;
  }

  interface Props {
    x: number;
    y: number;
    onPick?: (id: string) => void;
    onDismiss?: () => void;
  }

  let { x, y, onPick, onDismiss }: Props = $props();

  const ITEMS: MenuItem[] = [
    { id: 'sleep-timer', label: 'Sleep timer', icon: 'sleep-timer' },
    { id: 'subtitles', label: 'Subtitles', icon: 'subtitles' },
    { id: 'playback-speed', label: 'Playback speed', icon: 'playback-speed' },
    { id: 'audio-channel', label: 'Audio Channel', icon: 'audio-channel' },
    { id: 'annotations', label: 'Annotations', icon: 'annotations' },
    { id: 'sticky-scroll', label: 'Sticky on scroll', icon: 'sticky-scroll' },
    { id: 'stable-volume', label: 'Stable volume', icon: 'stable-volume' },
    { id: 'ambient-mode', label: 'Ambient mode', icon: 'ambient-mode' },
    { id: 'stereo', label: 'Stereo', icon: 'stereo' },
  ];

  let menuEl = $state<HTMLElement>();

  const width = 240;
  const rowHeight = 44;
  const pad = 8;

  const left = $derived.by(() => {
    const maxX = (typeof window !== 'undefined' ? window.innerWidth : 1280) - width - 8;
    return Math.max(8, Math.min(x, maxX));
  });
  const top = $derived.by(() => {
    const est = ITEMS.length * rowHeight + pad;
    const maxY = (typeof window !== 'undefined' ? window.innerHeight : 800) - est - 12;
    return Math.max(8, Math.min(y, maxY));
  });

  const isOutside = (target: EventTarget | null): boolean => {
    if (!(target instanceof Element)) return true;
    if (menuEl?.contains(target)) return false;
    return true;
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
  class="video-options-menu"
  bind:this={menuEl}
  style:left="{left}px"
  style:top="{top}px"
  role="menu"
>
  {#each ITEMS as item (item.id)}
    <li>
      <button role="menuitem" onclick={() => onPick?.(item.id)}>
        {#if item.icon}
          <span class="glyph"><Icon name={item.icon} size={18} /></span>
        {/if}
        {item.label}
      </button>
    </li>
  {/each}
</menu>

<style>
  .video-options-menu {
    position: fixed;
    z-index: var(--yt-z-context);
    width: 240px;
    margin: 0;
    padding: var(--yt-space-1);
    list-style: none;
    border: 1px solid var(--yt-menu-border);
    border-radius: var(--yt-radius-lg);
    background: var(--yt-card);
    box-shadow: var(--yt-shadow-modal);
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
    border: none;
    cursor: pointer;
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
