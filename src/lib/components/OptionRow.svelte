<script lang="ts">
  /*
    OptionRow — a single settings option row used by SettingsPanel.
    Each row renders: icon + label (+ optional sub line) + a control:
    - 'toggle'  → on/off switch (mauve accent when on)
    - 'select'  → current-value chip with a chevron (cycles options on click)
    Clicking anywhere on the row activates the control.
  */
  import Icon from './Icon.svelte';

  interface Props {
    icon: string;
    label: string;
    sub?: string;
    type?: 'toggle' | 'select';
    checked?: boolean;
    value?: string;
    options?: string[];
    onToggle?: (checked: boolean) => void;
    onSelect?: (value: string) => void;
  }

  let {
    icon,
    label,
    sub,
    type = 'toggle',
    checked = false,
    value,
    options,
    onToggle,
    onSelect,
  }: Props = $props();

  function handleRowAction(): void {
    type === 'select' ? onSelect?.(nextOption()) : onToggle?.(!checked);
  }

  function nextOption(): string {
    if (!options || options.length === 0) return value ?? '';
    const current = value ?? options[0] ?? '';
    const idx = options.indexOf(current);
    return options[(idx + 1) % options.length];
  }

  function handleControlClick(e: MouseEvent, kind: 'toggle' | 'select'): void {
    e.stopPropagation();
    kind === 'select' ? onSelect?.(nextOption()) : onToggle?.(!checked);
  }

  function handleToggleKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle?.(!checked);
    }
  }
</script>

<div
  class="option-row"
  class:select={type === 'select'}
  role="none"
  onclick={handleRowAction}
>
  <div class="icon"><Icon name={icon} size={17} /></div>
  <div class="body">
    <p class="title">{label}</p>
    {#if sub}<p class="sub">{sub}</p>{/if}
  </div>
  {#if type === 'toggle'}
    <button
      class="toggle"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onclick={(e) => handleControlClick(e, 'toggle')}
      onkeydown={handleToggleKey}
    >
      <span class="track"></span>
      <span class="thumb" class:on={checked}></span>
    </button>
  {:else}
    <button
      class="select-btn"
      aria-label={`${label}, ${value ?? options?.[0] ?? ''}`}
      onclick={(e) => handleControlClick(e, 'select')}
    >
      <span class="chip">{value ?? (options?.[0] ?? '')}</span>
      <Icon name="chevron-down" size={13} class="chevron" />
    </button>
  {/if}
</div>

<style>
  .option-row {
    display: flex;
    align-items: center;
    gap: var(--yt-space-3);
    padding: var(--yt-space-2) var(--yt-space-3);
    border-radius: var(--yt-radius-md);
    background: #fff;
    border: 1px solid var(--yt-panel-border);
    color: var(--yt-panel-text);
    text-align: left;
    cursor: pointer;
    width: 100%;
  }
  .option-row:hover {
    background: var(--yt-panel-row-hover);
    border-color: var(--yt-panel-accent);
  }
  .option-row.select {
    padding-right: var(--yt-space-4);
  }
  .icon {
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    color: var(--yt-panel-accent-dark);
  }
  .body {
    flex: 1;
    min-width: 0;
  }
  .title {
    margin: 0;
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-medium);
    color: var(--yt-panel-text);
    line-height: var(--yt-line-tight);
  }
  .sub {
    margin: 2px 0 0 0;
    font-size: var(--yt-fs-xs);
    color: var(--yt-panel-text-soft);
    line-height: var(--yt-line-tight);
  }
  .toggle {
    position: relative;
    width: 44px;
    height: 24px;
    border-radius: 999px;
    background: var(--yt-panel-toggle-bg);
    border: 1px solid var(--yt-panel-border);
    cursor: pointer;
    padding: 0;
    flex: 0 0 auto;
  }
  .toggle .track {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--yt-panel-toggle-bg);
  }
  .toggle .thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    transition: transform 0.18s ease, background 0.18s ease;
  }
  .toggle .thumb.on {
    transform: translateX(20px);
    background: var(--yt-panel-accent-dark);
  }
  .toggle[aria-checked="true"] .track {
    background: var(--yt-panel-accent);
  }
  .select-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-panel-row-hover);
    color: var(--yt-panel-text);
    font-size: var(--yt-fs-xs);
    font-weight: var(--yt-weight-medium);
    border: 1px solid var(--yt-panel-border);
    cursor: pointer;
    flex: 0 0 auto;
  }
  .select-btn:hover {
    background: var(--yt-panel-accent);
    color: #fff;
    border-color: var(--yt-panel-accent);
  }
  .chip {
    color: inherit;
  }
</style>
