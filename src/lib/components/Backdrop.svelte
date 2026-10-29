<script lang="ts">
  /*
    Backdrop — reusable full-screen black scrim/overlay (Figma Frame 37777).
    Pure black (#000000) with configurable alpha; default opacity 0.5.
    Clicking the scrim closes; Escape closes. Reports via onClose().
  */
  interface Props {
    open?: boolean;
    onClose?: () => void;
    opacity?: number;
  }

  let { open = false, onClose, opacity = 0.5 }: Props = $props();

  const handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') onClose?.();
  };

  $effect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });
</script>

{#if open}
  <div
    class="backdrop"
    role="presentation"
    aria-hidden="true"
    onclick={onClose}
    style="background: rgba(0, 0, 0, {opacity});"
  ></div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--yt-z-modal);
    cursor: pointer;
  }
</style>
