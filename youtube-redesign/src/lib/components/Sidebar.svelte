<script lang="ts">
  /*
    Sidebar — stub (scaffold shell). TODO(next step) per Home.png / Sidebar.png:
      - real icons from /assets/icons/<icon-name>.png (white on transparency)
      - channel-list "Subscriptions" section fed from CHANNELS
      - Explorer items (Explore, TV Mode, History, Watch Later, Liked Videos,
        Playlists) with their panes / collapse chevrons
      - collapsed 72px rail vs 240px drawer is already wired to the store
  */
  import { app, type Page } from '../stores';

  interface NavItem {
    label: string;
    page?: Page; //     omitted → placeholder, still TODO
  }
  interface NavSection {
    items: NavItem[];
    divider?: boolean;
  }

  const SECTIONS: NavSection[] = [
    {
      items: [
        { label: 'Home', page: 'home' },
        { label: 'Explore' },
        { label: 'Shorts', page: 'shorts' },
        { label: 'TV Mode' },
      ],
    },
    {
      divider: true,
      items: [{ label: 'History' }, { label: 'Watch Later' }, { label: 'Liked Videos' }],
    },
    {
      divider: true,
      items: [
        { label: 'Playlists' },
        { label: 'Collections', page: 'collections' },
        { label: 'Subscriptions', page: 'subscriptions' },
      ],
    },
  ];

  const isActive = (item: NavItem): boolean => item.page === app.activePage;
</script>

<nav class="sidebar" class:collapsed={!app.sidebarExpanded} aria-label="Sidebar">
  {#each SECTIONS as section}
    {#if section.divider}
      <hr class="divider" />
    {/if}
    <ul>
      {#each section.items as item}
        <li>
          <button
            class="item"
            class:active={isActive(item)}
            disabled={!item.page}
            onclick={item.page ? () => app.navigateTo(item.page!) : undefined}
          >
            <span class="bullet" class:accent={isActive(item)}></span>
            <span class="label">{item.label}</span>
          </button>
        </li>
      {/each}
    </ul>
  {/each}
</nav>

<style>
  .sidebar {
    width: 240px;
    padding: var(--yt-space-3) var(--yt-space-3) var(--yt-space-3) 0;
    transition: width 0.15s ease;
  }
  .sidebar.collapsed {
    width: 72px;
    padding-inline: var(--yt-space-2);
  }
  hr.divider {
    margin: var(--yt-space-3) 0;
    border: 0;
    border-top: 1px solid var(--yt-border);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--yt-space-1);
  }
  .item {
    display: flex;
    align-items: center;
    gap: var(--yt-space-4);
    width: 100%;
    padding: 10px var(--yt-space-4);
    border-radius: var(--yt-radius-md);
    color: var(--yt-text-soft);
    background: none;
    cursor: pointer;
    text-align: left;
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-medium);
  }
  .item:hover:not(:disabled) {
    background: var(--yt-card);
    color: var(--yt-text);
  }
  .item.active {
    background: var(--yt-card);
    color: var(--yt-text);
    font-weight: var(--yt-weight-bold);
  }
  .item:disabled {
    cursor: not-allowed;
    color: var(--yt-text-dim);
  }
  .bullet {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
    border-radius: var(--yt-radius-xs);
    background: var(--yt-elevated);
  }
  .bullet.accent {
    background: var(--yt-accent);
  }
  .collapsed .label {
    display: none;
  }
</style>
