<script lang="ts">
  /*
    ButtonRow — footer action button row for Dialog.
    Renders a grid of action buttons (primary / secondary / danger variants).
    Intended as a sub-component of Dialog; kept in its own file so it can be
    reused and type-checked independently.
  */
  import Icon from './Icon.svelte';

  export interface DialogAction {
    label: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'danger';
    onClick?: () => void;
  }

  interface Props {
    actions: DialogAction[];
    onAction: (action: DialogAction) => void;
  }

  let { actions, onAction }: Props = $props();
</script>

<div class="button-row">
  {#each actions as action}
    <button
      class="btn {action.variant ?? 'secondary'}"
      onclick={() => {
        onAction(action);
        action.onClick?.();
      }}
    >
      {#if action.icon}
        <span class="btn-icon"><Icon name={action.icon} size={18} /></span>
      {/if}
      <span class="btn-label">{action.label}</span>
    </button>
  {/each}
</div>

<style>
  .button-row {
    display: flex;
    gap: var(--yt-space-3);
    justify-content: flex-end;
    flex-wrap: wrap;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--yt-space-2);
    padding: 9px var(--yt-space-6);
    border: 1px solid transparent;
    border-radius: var(--yt-radius-pill);
    cursor: pointer;
    font: inherit;
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-medium);
  }
  .btn:active {
    transform: translateY(1px);
  }
  .btn-icon {
    color: var(--yt-text-soft);
  }
  .btn-secondary {
    background: var(--yt-dialog-inner);
    color: var(--yt-dialog-text);
  }
  .btn-secondary:hover {
    background: #2a2d4c;
  }
  .btn-primary {
    background: var(--yt-dialog-accent);
    color: #ffffff;
  }
  .btn-primary:hover {
    background: #6b77ef;
  }
  .btn-danger {
    background: var(--yt-accent);
    color: #ffffff;
  }
  .btn-danger:hover {
    background: #ff1a44;
  }
</style>
