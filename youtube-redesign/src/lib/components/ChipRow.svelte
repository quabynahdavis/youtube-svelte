<script lang="ts">
  /*
    ChipRow — Home filter chips, mockup order from catalog.CHIPS
    ("All" = default active white pill). TODO(next step):
      - arrow overflow affordances at the edges (› in the mockups)
      - "New Creators" special accent-icon chip treatment
      - keyboard scrolling / overflow menu
  */
  import { CHIPS } from '../data/catalog';
  import { app } from '../stores';
</script>

<div class="chip-row">
  {#each CHIPS as chip}
    <button class="chip" class:active={chip === app.activeChip} onclick={() => (app.activeChip = chip)}>
      {chip}
    </button>
  {/each}
</div>

<style>
  .chip-row {
    display: flex;
    gap: var(--yt-space-2);
    overflow-x: auto;
    scrollbar-width: none;
    padding-block: var(--yt-space-2);
  }
  .chip-row::-webkit-scrollbar {
    display: none;
  }
  .chip {
    flex: 0 0 auto;
    height: 32px;
    padding-inline: var(--yt-space-3);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-chip-bg);
    color: var(--yt-text);
    font-size: var(--yt-fs-sm);
    font-weight: var(--yt-weight-medium);
  }
  .chip:hover {
    background: var(--yt-chip-hover);
  }
  .chip.active {
    background: var(--yt-chip-active-bg);
    color: var(--yt-chip-active-fg);
    font-weight: var(--yt-weight-bold);
  }
</style>
