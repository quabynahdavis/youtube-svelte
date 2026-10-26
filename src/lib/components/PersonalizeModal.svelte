<script lang="ts">
  /*
    PersonalizeModal — "Personalized Feed" dialog (per Personalized Feed.png).
    - "Your Tags": search input that filters visible chips (default pool = CHIPS minus 'All')
      pills have ✕ to remove → app.removeOwnTag; Enter adds new tag chip to active set
      → app.addKeptTag
    - "Selected/kept" chips: active tags displayed as maroon pills with crimson text;
      each shows a ✓ circle on the left and a ✕ button (app.toggleKeptTag) to remove
    - "Excluded Content": search input with chips Skibidi, brainrot, rizz, Shorts
      (shorts glyph) and Fortnite (F glyph) with ✕ → app.removeExcludedTag; Enter adds new
      excluded tag → app.addExcludedTag
    - Apply button closes modal; touched flag gates feed filtering
    - Use existing design tokens (--yt-*) and Icon component for glyphs
    - Close on scrim/backdrop, ✕ button, Esc key
  */
  import { app } from '../stores';
  import { CHIPS, DEFAULT_EXCLUDED } from '../data/catalog';
  import Icon from './Icon.svelte';

  // ---------- state ----------
  let tagSearch = '';
  let excludedSearch = '';

  // ---------- helpers ----------
  // Compute filtered tags for the two sections
  const filteredTags = $derived(
    CHIPS.filter(chip => chip !== 'All' && chip.toLowerCase().includes(tagSearch.toLowerCase()))
  );
  const filteredExcluded = $derived(
    DEFAULT_EXCLUDED.filter(chip => chip.toLowerCase().includes(excludedSearch.toLowerCase()))
  );

  // Enter handling for tag search boxes
  function handleTagEnter(e: KeyboardEvent) {
    if (e.key === 'Enter' && tagSearch.trim()) {
      const newTag = tagSearch.trim();
      app.addKeptTag(newTag);
      tagSearch = '';
    }
  }
  function handleExcludedEnter(e: KeyboardEvent) {
    if (e.key === 'Enter' && excludedSearch.trim()) {
      const newTag = excludedSearch.trim();
      app.addExcludedTag(newTag);
      excludedSearch = '';
    }
  }

  // Actions wired to the store
  function removeOwnTag(tag: string) {
    app.removeOwnTag(tag);
  }
  function addKeptTag(tag: string) {
    app.addKeptTag(tag);
  }
  function toggleKeptTag(tag: string) {
    app.toggleKeptTag(tag);
  }
  function removeExcludedTag(tag: string) {
    app.removeExcludedTag(tag);
  }
  function addExcludedTag(tag: string) {
    app.addExcludedTag(tag);
  }
</script>

<div class="scrim" role="presentation" onclick={() => (app.personalizeOpen = false)}>
  <div
    class="personalize-modal"
    role="dialog"
    aria-modal="true"
    aria-label="Personalize feed"
    tabindex="-1"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.key === 'Escape' && (app.personalizeOpen = false)}
  >
    <!-- Header -->
    <header class="modal-head">
      <h2>Your personalized feed</h2>
      <button class="close" aria-label="Close personalization" onclick={() => (app.personalizeOpen = false)}>✕</button>
    </header>

    <!-- Main content -->
    <main class="modal-body">
      <!-- Section: Your Tags -->
      <section class="section" id="your-tags">
        <h3>Your Tags</h3>
        <input
          placeholder="Search for tags…"
          bind:value={tagSearch}
          onkeyup={handleTagEnter}
          class="search-input"
        />
        <div class="chips">
          {#each filteredTags as tag}
            <button
              class="chip"
              onclick={() => removeOwnTag(tag)}
              aria-label={"Remove " + tag}
            >
              {tag}
              <Icon name="close" size={12} class="remove-icon" />
            </button>
          {/each}
        </div>
      </section>

      <!-- Section: Selected / kept -->
      <section class="section" id="kept">
        <h3>Selected / kept</h3>
        <div class="kept-chips">
          {#each $app.personalize.active as tag}
            <div class="kept-chip pill">
              ✓ {tag}
              <button
                class="remove-kept"
                onclick={() => toggleKeptTag(tag)}
                aria-label={"Remove " + tag}
              >✕</button>
            </div>
          {/each}
        </div>
      </section>

      <!-- Section: Excluded Content -->
      <section class="section" id="excluded">
        <h3>Excluded Content</h3>
        <input
          placeholder="Search…"
          bind:value={excludedSearch}
          onkeyup={handleExcludedEnter}
          class="search-input"
        />
        <div class="chips excluded">
          {#each DEFAULT_EXCLUDED as tag}
            <button
              class="chip"
              onclick={() => removeExcludedTag(tag)}
              aria-label={"Remove " + tag}
            >
              {tag}
              <Icon name="close" size={12} class="remove-icon" />
            </button>
          {/each}
        </div>
      </section>
    </main>

    <!-- Footer: Apply -->
    <footer class="modal-foot">
      <button class="apply" onclick={() => (app.personalizeOpen = false)}>Apply</button>
    </footer>
  </div>
</div>

<style>
  .scrim {
    position: fixed;
    inset: 0;
    z-index: var(--yt-z-modal);
    display: grid;
    place-items: center;
    background: var(--yt-overlay);
  }
  .personalize-modal {
    width: min(640px, 92vw);
    max-width: 640px;
    padding: var(--yt-space-6);
    border: 1px solid var(--yt-border);
    border-radius: var(--yt-radius-xl);
    background: var(--yt-surface);
    box-shadow: var(--yt-shadow-modal);
    position: relative;
  }
  .modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--yt-space-4);
  }
  h2 {
    margin: 0;
    font-size: var(--yt-fs-2xl);
    font-weight: var(--yt-weight-black);
  }
  .close {
    width: 32px;
    height: 32px;
    border-radius: var(--yt-radius-pill);
    background: none;
    color: var(--yt-text-soft);
  }
  .close:hover {
    background: var(--yt-elevated);
  }
  .modal-body {
    display: flex;
    flex-direction: column;
    gap: var(--yt-space-4);
  }
  .section {
    margin-bottom: var(--yt-space-4);
  }
  h3 {
    margin: 0 0 var(--yt-space-2);
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-semibold);
    color: var(--yt-text);
  }
  .search-input {
    width: 100%;
    height: 40px;
    padding-inline: var(--yt-space-4);
    border-radius: var(--yt-radius-md);
    border: 1px solid var(--yt-border);
    background: var(--yt-card);
    color: var(--yt-text);
    font: inherit;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--yt-space-3);
    margin-top: var(--yt-space-1);
  }
  .chip {
    display: flex;
    align-items: center;
    gap: var(--yt-space-2);
    padding: var(--yt-space-1) var(--yt-space-2);
    border-radius: var(--yt-radius-md);
    background: var(--yt-chip-bg);
    color: var(--yt-text);
    font-size: var(--yt-fs-sm);
    cursor: pointer;
  }
  .chip:hover {
    background: var(--yt-hover);
  }
  .remove-icon {
    width: 12px;
    height: 12px;
    stroke: var(--yt-text-dim);
  }
  .kept-chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--yt-space-3);
    max-height: 200px;
    overflow-y: auto;
  }
  .kept-chip {
    display: flex;
    align-items: center;
    gap: var(--yt-space-2);
    padding: var(--yt-space-2) var(--yt-space-3);
    border-radius: var(--yt-radius-md);
    background: var(--yt-tag-selected);          /* maroon */
    color: var(--yt-crimson);                    /* crimson text */
    font-weight: var(--yt-weight-semibold);
  }
  .kept-chip .remove-kept {
    background: none;
    border: none;
    color: var(--yt-text-dim);
    cursor: pointer;
    font-size: 14px;
    padding: var(--yt-space-1);
  }
  .kept-chip .remove-kept:hover {
    color: var(--yt-text);
  }
  .excluded-chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--yt-space-3);
    margin-top: var(--yt-space-1);
  }
  .excluded-chip {
    display: flex;
    align-items: center;
    gap: var(--yt-space-2);
    padding: var(--yt-space-1) var(--yt-space-2);
    border-radius: var(--yt-radius-md);
    background: var(--yt-chip-bg);
    color: var(--yt-text);
    font-size: var(--yt-fs-sm);
    cursor: pointer;
  }
  .excluded-chip:hover {
    background: var(--yt-hover);
  }
  .modal-foot {
    margin-top: var(--yt-space-6);
    text-align: flex-end;
  }
  .apply {
    padding: 10px var(--yt-space-6);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-accent);
    color: var(--yt-on-accent);
    font-weight: var(--yt-weight-bold);
  }
  .apply:hover {
    background: var(--yt-accent-bright);
  }
</style>