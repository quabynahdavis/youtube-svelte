<script lang="ts">
  /*
    Sidebar — sticky rail under TopBar. Expanded 239px / collapsed 72px.
    Groups per mock: Home/Explore/Shorts/TV Mode ‖ History/Watch Later/
    Liked ‖ Playlists ▾ ‖ Collections ▾ ‖ Subscriptions ▾.
    Active pill = #272727 radius-10 with a red icon. No-ops stay honest
    (aria-disabled). Subscriptions group lists the subscribed channels
    from the catalog collections.
    Uses svelte-routing for navigation.
  */
  import Avatar from './Avatar.svelte';
  import Icon from './Icon.svelte';
  import { link } from 'svelte-routing';
  import { app, type SubsTab } from '../stores';
  import { getChannel, SUBSCRIBED_CHANNEL_SLUGS } from '../data/catalog';

  interface Item {
    label: string;
    icon: string;
    href?: string;
    disabled?: boolean;
  }
  interface Group {
    items: Item[];
    collapsible?: {
      key: string;
      subTab?: SubsTab;
    };
  }

  const groups: Group[] = [
    {
      items: [
        { label: 'Home', icon: 'home', href: '/' },
        { label: 'Explore', icon: 'explore', disabled: true },
        { label: 'Shorts', icon: 'shorts', href: '/shorts' },
        { label: 'TV Mode', icon: 'tv', disabled: true },
      ],
    },
    {
      items: [
        { label: 'History', icon: 'history', disabled: true },
        { label: 'Watch Later', icon: 'clock', disabled: true },
        { label: 'Liked Videos', icon: 'thumb-up', disabled: true },
      ],
    },
    { items: [{ label: 'Playlists', icon: 'playlists' }], collapsible: { key: 'playlists' } },
    { items: [{ label: 'Collections', icon: 'collections' }], collapsible: { key: 'collections', subTab: 'collections' } },
    { items: [{ label: 'Subscriptions', icon: 'subs' }], collapsible: { key: 'subscriptions', subTab: 'subs' } },
  ];

  let open = $state<Record<string, boolean>>({
    playlists: false,
    collections: false,
    subscriptions: false,
  });

  const isActive = (item: Item, group: Group): boolean => {
    if (group.collapsible) {
      if (group.collapsible.key === 'playlists') return false;
      if (group.collapsible.subTab === 'collections') {
        return app.activePage === 'collections' || (app.activePage === 'subscriptions' && app.subsTab === 'collections');
      }
      if (group.collapsible.subTab === 'subs') {
        return app.activePage === 'subscriptions' && app.subsTab === 'subs';
      }
      return false;
    }
    return item.href !== undefined && app.activePage === item.href.slice(1) || (item.href === '/' && app.activePage === 'home');
  };

  const onGroupClick = (group: Group): void => {
    const key = group.collapsible?.key;
    if (!key) return;
    if (group.collapsible?.subTab) {
      app.goToSubs(group.collapsible.subTab);
      open[key] = true;
    } else {
      open[key] = !open[key];
    }
  };

  const subscribedChannels = $derived(
    SUBSCRIBED_CHANNEL_SLUGS.map(getChannel).filter((c): c is NonNullable<typeof c> => !!c),
  );
</script>

<nav class="sidebar" class:collapsed={!app.sidebarExpanded} aria-label="Sidebar">
  {#each groups as group, gi}
    {#if gi > 0}<hr class="divider" />{/if}
    <ul class="group">
      {#each group.items as item}
        <li>
          {#snippet row()}
            <Icon
              name={item.icon}
              class="item-icon {isActive(item, group) ? 'red' : ''}"
            />
            <span class="label">{item.label}</span>
            {#if group.collapsible}
              <span class="chevron" class:down={open[group.collapsible.key]}>
                <Icon name="chevron-down" size={14} />
              </span>
            {/if}
          {/snippet}

          {#if item.disabled}
            <button
              class="item"
              aria-disabled="true"
              title="Not wired yet"
              disabled
            >
              {@render row()}
            </button>
          {:else if group.collapsible}
            <button
              class="item"
              class:active={isActive(item, group)}
              onclick={() => onGroupClick(group)}
              aria-expanded={group.collapsible ? !!open[group.collapsible.key] : undefined}
            >
              {@render row()}
            </button>
          {:else if item.href}
            <a use:link href={item.href} class="item" class:active={isActive(item, group)}>
              {@render row()}
            </a>
          {/if}
        </li>
      {/each}
    </ul>

    {#if group.collapsible && open[group.collapsible.key] && app.sidebarExpanded}
      {#if group.collapsible.key === 'playlists'}
        <p class="group-body">No playlists yet</p>
      {:else if group.collapsible.key === 'collections'}
        <ul class="group-body group">
          <li>
            <a use:link href="/collections" class="item sub" class:active={app.activePage === 'collections' || (app.activePage === 'subscriptions' && app.subsTab === 'collections')}>
              <Icon name="collections" size={16} />
              <span class="label">All collections</span>
            </a>
          </li>
        </ul>
      {:else if group.collapsible.key === 'subscriptions'}
        <ul class="group-body group">
          {#each subscribedChannels as channel (channel.slug)}
            <li>
              <a use:link href={`/channel/${channel.slug}`} class="item sub" class:active={app.activePage === 'channel' && app.activeChannel?.slug === channel.slug}>
                <Avatar src={channel.avatar} name={channel.name} size={20} />
                <span class="label">{channel.name}</span>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    {/if}
  {/each}
</nav>

<style>
  .sidebar {
    position: sticky;
    top: var(--yt-topbar-h);
    align-self: flex-start;
    height: calc(100dvh - var(--yt-topbar-h));
    width: var(--yt-sidebar-expanded);
    padding: var(--yt-space-3) var(--yt-space-3) var(--yt-space-6) 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: none;
    background: var(--yt-page);
    transition: width 0.18s ease;
  }
  .sidebar::-webkit-scrollbar {
    display: none;
  }
  .sidebar.collapsed {
    width: var(--yt-sidebar-collapsed);
    padding-inline: var(--yt-space-2);
  }

  /*
    Narrow-baseline guard: when the viewport can't fit the expanded rail
    alongside a readable feed, pin the sidebar to its collapsed 72px rail
    regardless of the app.sidebarExpanded flag. This prevents the sticky
    sidebar from covering the feed and stops horizontal overflow.
  */
  @media (max-width: 768px) {
    .sidebar:not(.collapsed) {
      width: var(--yt-sidebar-collapsed);
      padding-inline: var(--yt-space-2);
    }
    .sidebar:not(.collapsed) .label,
    .sidebar:not(.collapsed) .chevron,
    .sidebar:not(.collapsed) .group-body,
    .sidebar:not(.collapsed) .divider {
      display: none;
    }
    .sidebar:not(.collapsed) .item {
      justify-content: center;
      gap: 0;
      padding: 11px 0;
    }
  }
  .group {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 2px;
  }
  .divider {
    margin: var(--yt-space-3) 0;
    border: 0;
    border-top: 1px solid var(--yt-border);
  }

  .item {
    display: flex;
    align-items: center;
    gap: var(--yt-space-4);
    width: 100%;
    padding: 9px var(--yt-space-4);
    border-radius: var(--yt-radius-md);
    color: var(--yt-text);
    background: none;
    text-align: left;
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-medium);
    line-height: var(--yt-line-normal);
    white-space: nowrap;
    text-decoration: none;
  }
  .item:hover:not(:disabled) {
    background: var(--yt-card);
  }
  .item.active {
    background: var(--yt-elevated);
  }
  .item:disabled {
    color: var(--yt-text-dim);
    cursor: not-allowed;
  }
  .item :global(.item-icon.red),
  .item.active :global(.item-icon) {
    color: var(--yt-accent);
  }
  .sub {
    gap: var(--yt-space-3);
    padding-block: 7px;
    font-weight: var(--yt-weight-regular);
  }

  .label {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chevron {
    margin-left: auto;
    color: var(--yt-text-soft);
    transition: transform 0.15s ease;
  }
  .chevron.down {
    transform: rotate(180deg);
  }
  .group-body {
    margin: 2px 0 0;
    padding: 2px 0 6px;
    color: var(--yt-text-dim);
    font-size: var(--yt-fs-sm);
  }
  ul.group-body {
    padding-block: 0 6px;
  }

  .collapsed .label,
  .collapsed .chevron,
  .collapsed .group-body,
  .collapsed .divider {
    display: none;
  }
  .collapsed .item {
    justify-content: center;
    gap: 0;
    padding: 11px 0;
  }
</style>