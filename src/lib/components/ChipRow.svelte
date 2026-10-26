<script lang="ts">
  /*
    ChipRow — leading personalize button + scrollable white-pill row +
    trailing scroll chevron. `active` is two-way bound by the page
    (app.homeChip / app.shortsChip). Chips definitions come from the
    page (CHIPS / SHORTS_CHIPS).
  */
  import Icon from './Icon.svelte';
  import { app } from '../stores';

  interface Props {
    chips: readonly string[];
    active?: string;
  }

  let { chips, active = $bindable('All') }: Props = $props();

  let scroller = $state<HTMLElement>();

  const scrollRight = (): void => {
    scroller?.scrollBy({ left: 320, behavior: 'smooth' });
  };
</script>

<div class="chip-row">
  <button
    class="filters"
    aria-label="Personalize feed"
    title="Personalize feed"
    onclick={() => (app.personalizeOpen = true)}
  >
    <Icon name="sliders" size={17} />
  </button>

  <div class="scroll" bind:this={scroller}>
    {#each chips as chip (chip)}
      <button class="chip" class:active={chip === active} onclick={() => (active = chip)}>
        {#if chip === 'New Creators'}
          <span class="sparkle"><Icon name="sparkle" size={11} /></span>
        {/if}
        {chip}
      </button>
    {/each}
  </div>

  <button class="next" aria-label="Scroll chips" title="More chips" onclick={scrollRight}>
    <Icon name="chevron-right" size={18} />
  </button>
</div>

<style>
  .chip-row {
    display: flex;
    align-items: center;
    gap: var(--yt-space-2);
    padding-block: var(--yt-space-2) var(--yt-space-3);
  }
  .filters,
  .next {
    flex: none;
    display: grid;
    place-items: center;
    width: 36px;
    height: 32px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    color: var(--yt-text);
  }
  .filters:hover {
    background: var(--yt-hover);
  }
  .next {
    background: transparent;
    color: var(--yt-text-soft);
  }
  .next:hover {
    background: var(--yt-card);
  }

  .scroll {
    display: flex;
    gap: var(--yt-space-2);
    overflow-x: auto;
    scrollbar-width: none;
    scroll-snap-type: x proximity;
  }
  .scroll::-webkit-scrollbar {
    display: none;
  }
  .chip {
    flex: none;
    scroll-snap-align: start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
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
    font-weight: var(--yt-weight-semibold);
  }
  .sparkle {
    display: grid;
    place-items: center;
    color: var(--yt-accent);
  }
</style>
