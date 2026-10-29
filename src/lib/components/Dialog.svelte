<script lang="ts">
  /*
    Dialog — reusable dark-blue themed modal (Figma Frame 37764, 708×652).
    - #292D62 panel bg, #1A1C31 inner elements, #5965EB bright-blue accents,
      #DDDFE9 light-gray text, #CA5056 orange accent badge
    - Viewport-clamped fixed positioning (re-clamps on resize)
    - Closes on scrim click, ✕ button, Escape, or onClose()
    - Footer action button row via ButtonRow sub-component
    - Optional accent badge beside the title
  */
  import { type Snippet } from 'svelte';
  import { app, type DialogAction } from '../stores';
  import ButtonRow from './ButtonRow.svelte';

  interface Props {
    open: boolean;
    title: string;
    onClose?: () => void;
    actions?: DialogAction[];
    badge?: string;
    children?: Snippet;
  }

  let { open, title, onClose, actions = [], badge, children }: Props = $props();

  const panelWidth = 708;
  const panelHeight = 652;
  const pad = 16;

  /** Bump this on resize so the derived position re-clamps to the viewport. */
  let resizeKey = $state(0);

  $effect(() => {
    const onResize = () => {
      resizeKey = (resizeKey + 1) | 0;
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  });

  const left = $derived.by(() => {
    void resizeKey;
    if (typeof window === 'undefined') return 0;
    const maxX = window.innerWidth - panelWidth - pad * 2;
    return Math.max(pad, Math.min((window.innerWidth - panelWidth) / 2, maxX));
  });
  const top = $derived.by(() => {
    void resizeKey;
    if (typeof window === 'undefined') return 0;
    const maxY = window.innerHeight - panelHeight - pad * 2;
    return Math.max(pad, Math.min((window.innerHeight - panelHeight) / 2, maxY));
  });

  function handleScrimClick(): void {
    onClose?.();
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') onClose?.();
  }

  function handleAction(action: DialogAction): void {
    action.onClick?.();
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if open}
  <div
    class="scrim"
    role="presentation"
    onclick={(e) => {
      // Only close when clicking the backdrop itself, not the dialog panel.
      if (e.target === e.currentTarget) handleScrimClick();
    }}
    onkeydown={handleKeyDown}
  >
    <div
      class="dialog"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabindex="-1"
      style:left="{left}px"
      style:top="{top}px"
    >
      <header class="dialog-head">
        <div class="head-start">
          {#if badge}
            <span class="badge">{badge}</span>
          {/if}
        </div>
        <h2 class="title">{title}</h2>
        <button class="close" aria-label="Close dialog" onclick={() => onClose?.()}>✕</button>
      </header>

      <div class="dialog-body">
        {@render children?.()}
      </div>

      {#if actions.length > 0}
        <footer class="dialog-foot">
          <ButtonRow {actions} onAction={handleAction} />
        </footer>
      {/if}
    </div>
  </div>
{/if}

<style>
  .scrim {
    position: fixed;
    inset: 0;
    z-index: var(--yt-z-modal);
    display: grid;
    place-items: center;
    background: var(--yt-overlay);
    backdrop-filter: blur(4px);
  }
  .dialog {
    position: fixed;
    z-index: var(--yt-z-modal);
    width: min(708px, 92vw);
    max-height: min(652px, 92vh);
    min-width: 280px;
    border: 1px solid var(--yt-border-strong);
    border-radius: var(--yt-radius-xl);
    background: var(--yt-dialog-bg);
    box-shadow: var(--yt-shadow-modal);
    color: var(--yt-dialog-text);
    font-family: var(--yt-font);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: var(--yt-space-1);
    padding: 2px var(--yt-space-3);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-dialog-badge);
    color: #ffffff;
    font-size: var(--yt-fs-xs);
    font-weight: var(--yt-weight-bold);
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }
  .dialog-head {
    display: flex;
    align-items: center;
    gap: var(--yt-space-4);
    padding: var(--yt-space-6);
    flex-shrink: 0;
  }
  .head-start {
    display: flex;
    align-items: center;
    gap: var(--yt-space-3);
    flex-shrink: 0;
  }
  .title {
    margin: 0;
    flex: 1;
    font-size: var(--yt-fs-2xl);
    font-weight: var(--yt-weight-black);
    color: var(--yt-dialog-text);
    letter-spacing: -0.02em;
    text-align: center;
  }
  .close {
    width: 36px;
    height: 36px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-dialog-inner);
    border: none;
    color: var(--yt-dialog-text);
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .close:hover {
    background: #3a3d66;
  }
  .close:active {
    transform: translateY(1px);
  }
  .dialog-body {
    background: var(--yt-dialog-inner);
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: var(--yt-space-6);
    border-top: 1px solid var(--yt-border);
    border-bottom: 1px solid var(--yt-border);
  }
  .dialog-body::-webkit-scrollbar {
    width: 8px;
  }
  .dialog-body::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--yt-radius-pill);
  }
  .dialog-foot {
    display: flex;
    justify-content: flex-end;
    gap: var(--yt-space-3);
    padding: var(--yt-space-4) var(--yt-space-6) var(--yt-space-6);
    border-top: 1px solid var(--yt-border);
    background: var(--yt-dialog-bg);
    flex-shrink: 0;
  }
</style>
