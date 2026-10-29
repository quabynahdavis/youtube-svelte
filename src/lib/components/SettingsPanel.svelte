<script lang="ts">
  /*
    SettingsPanel — light-themed settings/options panel (Figma Frame 37771.png).
    Light-gray panel (#E6D5D8), near-black text (#150228), mauve/purple accents
    (#C9A6BA, #A86C94), left vertical accent bar, list of option rows, bottom
    footer toolbar. Mounted conditionally from App when app.settingsOpen is true.

    Props:
      open    (boolean) — whether the panel is open
      onClose () => void — called when the user closes the panel
  */
  import Icon from './Icon.svelte';
  import OptionRow from './OptionRow.svelte';
  import { app } from '../stores';

  let { open = false, onClose }: { open?: boolean; onClose?: () => void } = $props();

  function handleClose(): void {
    onClose?.();
  }

  interface SettingRow {
    id: string;
    icon: string;
    label: string;
    sub?: string;
    type: 'toggle' | 'select';
    checked?: boolean;
    value?: string;
    options?: string[];
  }

  const ROWS: SettingRow[] = [
    { id: 'theme', icon: 'sun', label: 'Theme', sub: 'Dark / Light', type: 'select', value: 'Light', options: ['Light', 'Dark'] },
    { id: 'notifications', icon: 'bell', label: 'Notifications', type: 'toggle', checked: true },
    { id: 'autoplay', icon: 'play', label: 'Autoplay', type: 'toggle', checked: true },
    { id: 'playback-speed', icon: 'playback-speed', label: 'Playback speed', type: 'select', value: '1×', options: ['0.25×', '0.5×', '0.75×', '1×', '1.25×', '1.5×', '2×'] },
    { id: 'captions', icon: 'subtitles', label: 'Captions', type: 'toggle', checked: false },
    { id: 'privacy', icon: 'users', label: 'Privacy', sub: 'Who can see your activity', type: 'select', value: 'Public', options: ['Public', 'Unlisted', 'Private'] },
  ];

  // v1 demo state — toggles/selects live locally until wired to a settings model
  const toggles = $state<Record<string, boolean>>({
    notifications: true,
    autoplay: true,
    captions: false,
  });
  const selects = $state<Record<string, string>>({
    theme: 'Light',
    'playback-speed': '1×',
    privacy: 'Public',
  });

  function onToggle(id: string, checked: boolean): void {
    toggles[id] = checked;
  }

  function onSelect(id: string, value: string): void {
    selects[id] = value;
  }
</script>

<div
  class="scrim"
  role="presentation"
  aria-hidden={!open}
  onclick={handleClose}
  onkeydown={(e) => e.key === 'Escape' && handleClose()}
>
  <div
    class="settings-panel"
    role="dialog"
    aria-modal="true"
    aria-label="Settings"
    aria-hidden={!open}
    tabindex="-1"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.key === 'Escape' && handleClose()}
  >
    <!-- Header -->
    <header class="panel-head">
      <h2>Settings</h2>
      <button class="close" aria-label="Close settings" onclick={handleClose}>✕</button>
    </header>

    <!-- Option rows -->
    <ul class="rows">
      {#each ROWS as row (row.id)}
        <OptionRow
          icon={row.icon}
          label={row.label}
          sub={row.sub ?? undefined}
          type={row.type}
          checked={toggles[row.id]}
          value={selects[row.id]}
          options={row.options}
          onToggle={(checked) => onToggle(row.id, checked)}
          onSelect={(value) => onSelect(row.id, value)}
        />
      {/each}
    </ul>

    <!-- Footer toolbar -->
    <footer class="panel-foot">
      <button class="done" onclick={handleClose}>Done</button>
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
    background: var(--yt-panel-scrim);
    padding: var(--yt-space-4);
    overflow-y: auto;
  }
  .settings-panel {
    width: min(664px, 92vw);
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--yt-panel-border);
    border-radius: var(--yt-radius-lg);
    background: var(--yt-panel-bg);
    color: var(--yt-panel-text);
    box-shadow: var(--yt-shadow-modal);
    position: relative;
  }
  /* Left vertical accent bar */
  .settings-panel::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 5px;
    border-radius: var(--yt-radius-sm) 0 0 var(--yt-radius-sm);
    background: var(--yt-panel-accent-dark);
  }
  .panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--yt-space-4) var(--yt-space-5);
    border-bottom: 1px solid var(--yt-panel-border);
  }
  .panel-head h2 {
    margin: 0;
    font-size: var(--yt-fs-xl);
    font-weight: var(--yt-weight-bold);
    letter-spacing: -0.3px;
  }
  .close {
    width: 32px;
    height: 32px;
    border-radius: var(--yt-radius-pill);
    background: none;
    border: 1px solid var(--yt-panel-border);
    color: var(--yt-panel-text);
    cursor: pointer;
    line-height: 1;
  }
  .close:hover {
    background: var(--yt-panel-row-hover);
  }
  .rows {
    list-style: none;
    margin: 0;
    padding: var(--yt-space-3);
    display: grid;
    gap: var(--yt-space-2);
  }
  .panel-foot {
    border-top: 1px solid var(--yt-panel-border);
    padding: var(--yt-space-3) var(--yt-space-5);
    display: flex;
    justify-content: flex-end;
    gap: var(--yt-space-3);
  }
  .done {
    display: inline-flex;
    align-items: center;
    padding: var(--yt-space-1) var(--yt-space-5);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-panel-accent-dark);
    color: #fff;
    border: none;
    font-size: var(--yt-fs-sm);
    font-weight: var(--yt-weight-semibold);
    cursor: pointer;
  }
  .done:hover {
    background: var(--yt-panel-accent);
  }
</style>
