<script lang="ts">
  /*
    PersonalizeModal — "Personalized Feed" dialog, per Personalized Feed.png.
    TODO(next step):
      - toggle rows for feed chips (Cats, Lofi beats, UI/UX Design, …) with
        switch styling (on = accent, off = elevated)
      - Apply → close (already wired), persist selection to the store
  */
  import { app } from '../stores';
  import { CHIPS } from '../data/catalog';

  const PREFERENCES = CHIPS.filter((chip) => chip !== 'All');
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
    <header class="modal-head">
      <h2>Your personalized feed</h2>
      <button
        class="close"
        aria-label="Close personalization"
        onclick={() => (app.personalizeOpen = false)}
      >
        ✕
      </button>
    </header>

    <p class="hint">Pick the topics you want to see more of.</p>

    <ul class="prefs">
      {#each PREFERENCES as pref}
        <li class="pref">
          <span class="name">{pref}</span>
          <span class="switch" class:on={app.personalize.active.includes(pref)}></span>
        </li>
      {/each}
    </ul>

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
    padding: var(--yt-space-6);
    border: 1px solid var(--yt-border);
    border-radius: var(--yt-radius-xl);
    background: var(--yt-surface);
    box-shadow: var(--yt-shadow-modal);
  }
  .modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
  .hint {
    margin: var(--yt-space-2) 0 var(--yt-space-4);
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-md);
  }
  .prefs {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--yt-space-2);
    max-height: 46vh;
    overflow-y: auto;
  }
  .pref {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--yt-space-3);
    padding: var(--yt-space-3) var(--yt-space-4);
    border-radius: var(--yt-radius-md);
    background: var(--yt-card);
    font-weight: var(--yt-weight-semibold);
  }
  .switch {
    width: 36px;
    height: 20px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    position: relative;
    flex: 0 0 auto;
  }
  .switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-text-dim);
    transition: left 0.15s ease;
  }
  .switch.on {
    background: var(--yt-accent);
  }
  .switch.on::after {
    left: 18px;
    background: #fff;
  }
  .modal-foot {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--yt-space-5);
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
