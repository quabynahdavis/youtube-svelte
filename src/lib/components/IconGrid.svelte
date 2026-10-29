<script lang="ts">
  /*
    IconGrid — multi-color item grid picker (Figma Frame 37778).
    Dark surface panel with a grid of colored square tiles; each tile is a
    selectable button. The selected tile (selectedId) gets an accent border.
    Props: items [{id, color, label?}], onSelect(id), selectedId.
  */
  import { app } from '../stores';

  interface IconItem {
    id: string;
    color: string;
    label?: string;
  }

  let {
    items = [],
    onSelect,
    selectedId = null,
  }: {
    items?: readonly IconItem[];
    onSelect?: (id: string) => void;
    selectedId?: string | null;
  } = $props();

  function handleSelect(id: string): void {
    onSelect?.(id);
  }
</script>

<div
  class="icon-grid"
  role="dialog"
  aria-modal="true"
  aria-label="Pick an icon"
  tabindex="-1"
>
  <header class="grid-head">
    <h2>Pick an icon</h2>
    <button
      class="close"
      aria-label="Close picker"
      title="Close picker"
      onclick={() => {
        app.closeIconGrid();
        app.closeBackdrop();
      }}
    >
      ✕
    </button>
  </header>

  <div class="tiles" role="grid">
    {#each items as item (item.id)}
      <button
        type="button"
        class="tile"
        class:selected={selectedId === item.id}
        role="gridcell"
        aria-label={item.label ?? item.id}
        aria-selected={selectedId === item.id}
        onclick={() => handleSelect(item.id)}
      >
        <span class="swatch" style="background-color: {item.color};" aria-hidden="true"></span>
        {#if item.label}
          <span class="label">{item.label}</span>
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .icon-grid {
    position: fixed;
    bottom: var(--yt-space-4);
    left: 50%;
    transform: translateX(-50%);
    z-index: var(--yt-z-modal);
    width: min(560px, 92vw);
    max-height: 70vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--yt-space-4);
    padding: var(--yt-space-6);
    border: 1px solid var(--yt-border);
    border-radius: var(--yt-radius-lg);
    background: var(--yt-surface);
    box-shadow: var(--yt-shadow-panel);
    color: var(--yt-text);
  }
  .grid-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .grid-head h2 {
    margin: 0;
    font-size: var(--yt-fs-xl);
    font-weight: var(--yt-weight-semibold);
  }
  .close {
    width: 32px;
    height: 32px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-card);
    border: 1px solid var(--yt-border);
    color: var(--yt-text);
    cursor: pointer;
    line-height: 1;
    display: grid;
    place-items: center;
  }
  .close:hover {
    background: var(--yt-hover);
  }
  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: var(--yt-space-3);
  }
  .tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--yt-space-1);
    height: 80px;
    padding-top: var(--yt-space-2);
    border-radius: var(--yt-radius-lg);
    border: 2px solid transparent;
    background: var(--yt-card);
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-xs);
    font-weight: var(--yt-weight-medium);
    cursor: pointer;
    transition: transform 0.1s ease, border-color 0.2s ease, background 0.2s ease;
  }
  .tile:hover {
    background: var(--yt-hover);
    transform: translateY(-2px);
  }
  .tile.selected {
    border-color: var(--yt-accent);
    background: var(--yt-accent-soft);
    color: var(--yt-text);
  }
  .tile:focus-visible {
    outline: 2px solid var(--yt-accent);
    outline-offset: 2px;
  }
  .swatch {
    width: 34px;
    height: 34px;
    border-radius: var(--yt-radius-md);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    line-height: var(--yt-line-tight);
  }
</style>
