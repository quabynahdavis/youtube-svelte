/*
  youtube-redesign — app store (Svelte 5 runes)
  =============================================
  Runes ($state) only compile inside `.svelte(ts)` modules, so the
  implementation lives here; `src/lib/stores.ts` re-exports it as the
  stable import path (`import { app } from '../stores'`).

  State hub for the shell: pages, toolbars, top-level search, the
  context-menu portal, personalize sets, hidden items, subscribe map
  and overlay flags. TopBar/ChipRow/Cards/ContextMenus are wired here —
  later steps only need to consume (and extend) it.
*/

import { getChannel, type Channel, type Video } from './data/catalog';

/** Router-less page ids. `subscriptions` hosts both Subs/Collections tabs. */
export type Page = 'home' | 'shorts' | 'subscriptions' | 'collections' | 'channel' | 'rewind';
export type SubsTab = 'subs' | 'collections';
export type SubsKind = 'all' | 'videos' | 'posts' | 'live' | 'shorts';
export type SubsSort = 'newest' | 'oldest';
export type SubsView = 'timeline' | 'list';
export type CollSort = 'relevance' | 'newest' | 'az';
export type CollView = 'grid' | 'list';
export type ChannelTab = 'home' | 'videos' | 'shorts' | 'posts' | 'playlists' | 'channels' | 'about';

export interface ContextMenuState {
  video: Video;
  x: number;
  y: number;
}

export interface DialogAction {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
}

export interface Personalize {
  /** "Your Tags" pool (white chips) — editable, removable one-offs. */
  mine: string[];
  /** Kept tags (maroon chips, ✓) — feed builders once touched. */
  active: string[];
  /** "Excluded Content" entries. */
  excluded: string[];
  /** True after the user has edited the sets — gates feed filtering. */
  touched: boolean;
}

/** Modal defaults per Personalized Feed.png. */
export const DEFAULT_TAG_POOL = [
  'Subscriptions', 'Posts', 'Music', 'Tech', 'Design', 'Live', 'Playlists',
  'Cats', 'UI/UX Design', 'Electronics', 'Art', 'Tech news', 'Lofi beats',
  'UI/UX Redesign',
] as const;

export const DEFAULT_ACTIVE_TAGS = ['Video Games', 'Apple', 'Linux'] as const;

export const DEFAULT_EXCLUDED = ['Skibidi', 'brainrot', 'rizz', 'Shorts', 'Fortnite'] as const;

export class AppStore {
  /* ------- navigation ------- */
  activePage = $state<Page>('home');

  /** Sidebar expanded (239px drawer ↔ 72px rail), toggled from the TopBar. */
  sidebarExpanded = $state(true);

  /* ------- top bar / feeds ------- */
  /** Live search input from TopBar; qualifies title + channel name. */
  searchQuery = $state('');

  /** Per-page active chips (fed into ChipRow via bind). */
  homeChip = $state<string>('All');
  shortsChip = $state<string>('All');

  /** "In Case You Missed" shelf visibility on Home + Channel pages. */
  icmyDismissed = $state(false);

  /* ------- subscriptions page ------- */
  subsTab = $state<SubsTab>('subs');
  subsKind = $state<SubsKind>('all');
  subsSort = $state<SubsSort>('newest');
  subsView = $state<SubsView>('timeline');
  collSort = $state<CollSort>('relevance');
  collView = $state<CollView>('grid');

  /* ------- channel page ------- */
  activeChannel = $state<Channel | null>(null);
  channelTab = $state<ChannelTab>('home');

  /* ------- overlays & portals ------- */
  notifsOpen = $state(false);
  shareOpen = $state(false);
  personalizeOpen = $state(false);
  /** "More options" dropdown for the video player. */
  videoOptionsOpen = $state(false);
  /** Video quality selector dropdown. */
  qualityOptionsOpen = $state(false);
  chatOpen = $state(false);

  /* ------- dialog ------- */
  dialogOpen = $state(false);
  dialogTitle = $state('');
  dialogBadge = $state<string | undefined>(undefined);
  dialogActions = $state<DialogAction[]>([]);
  /** Settings panel overlay. */
  settingsOpen = $state(false);
  /** Portal for the shared ContextMenu component (card ⋮ menus). */
  contextMenu = $state<ContextMenuState | null>(null);
  /** Position last used to open the video-options dropdown. */
  videoOptionsPos = $state<{ x: number; y: number } | null>(null);
  /** Position + current quality last used to open the quality dropdown. */
  qualityOptionsPos = $state<{ x: number; y: number; currentQuality: string } | null>(null);

  /* ------- backdrop / icon grid picker ------- */
  /** Full-screen black scrim; shared by the icon grid demo and other overlays. */
  backdropOpen = $state(false);
  /** Icon/emoji/avatar picker panel; mounts on top of the backdrop. */
  iconGridOpen = $state(false);
  /** Last id picked via IconGrid (drives the selected-tile highlight). */
  selectedIconId = $state<string | null>(null);

  /* ------- feed personalization / hygiene ------- */
  personalize = $state<Personalize>({
    mine: [...DEFAULT_TAG_POOL],
    active: [...DEFAULT_ACTIVE_TAGS],
    excluded: [...DEFAULT_EXCLUDED],
    touched: false,
  });

  /** Video slugs hidden via "Not interested". */
  hidden = $state<string[]>([]);
  /** Channel slugs hidden via "Don't recommend channel". */
  hiddenChannels = $state<string[]>([]);

  /** Slug → subscribed state; defaults true per the mockups. */
  subscribed = $state<Record<string, boolean>>({});

  /* ----------------------------- navigation ------------------------ */

  navigateTo(page: Page): void {
    this.activePage = page;
    if (page !== 'channel') this.activeChannel = null;
  }

  openChannel(slug: string): void {
    this.activeChannel = getChannel(slug) ?? null;
    this.channelTab = 'home';
    this.activePage = 'channel';
  }

  /** Sidebar Subscriptions/Collections rows land on the same page component. */
  goToSubs(tab: SubsTab): void {
    this.subsTab = tab;
    this.activePage = 'subscriptions';
  }

  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }

  /* ----------------------------- personalize ----------------------- */

  removeOwnTag(tag: string): void {
    this.personalize.mine = this.personalize.mine.filter((t) => t !== tag);
    this.personalize.touched = true;
  }

  toggleKeptTag(tag: string): void {
    this.personalize.active = this.personalize.active.includes(tag)
      ? this.personalize.active.filter((t) => t !== tag)
      : [...this.personalize.active, tag];
    this.personalize.touched = true;
  }

  /** Enter in a "Your Tags" search: adds/keeps as a maroon (kept) tag. */
  addKeptTag(tag: string): void {
    const value = tag.trim();
    if (!value) return;
    if (!this.personalize.mine.includes(value)) {
      this.personalize.mine = [...this.personalize.mine, value];
    }
    if (!this.personalize.active.includes(value)) {
      this.personalize.active = [...this.personalize.active, value];
    }
    this.personalize.touched = true;
  }

  addExcludedTag(tag: string): void {
    const value = tag.trim();
    if (value && !this.personalize.excluded.includes(value)) {
      this.personalize.excluded = [...this.personalize.excluded, value];
    }
    this.personalize.touched = true;
  }

  removeExcludedTag(tag: string): void {
    this.personalize.excluded = this.personalize.excluded.filter((t) => t !== tag);
    this.personalize.touched = true;
  }

  /* ----------------------------- subscriptions -------------------- */

  isSubscribed(slug: string): boolean {
    return this.subscribed[slug] ?? true;
  }

  toggleSubscribed(slug: string): void {
    this.subscribed[slug] = !this.isSubscribed(slug);
  }

  /* ----------------------------- context menu --------------------- */

  openContextMenu(video: Video, x: number, y: number): void {
    this.contextMenu = { video, x, y };
  }

  closeContextMenu(): void {
    this.contextMenu = null;
  }

  /* ----------------------------- live chat -------------------------- */

  openChat(): void {
    this.chatOpen = true;
  }

  closeChat(): void {
    this.chatOpen = false;
  }

  /* ----------------------------- dialog ----------------------------- */

  openDialog(title: string, actions?: DialogAction[], badge?: string): void {
    this.dialogTitle = title;
    this.dialogActions = actions ?? [];
    this.dialogBadge = badge;
    this.dialogOpen = true;
  }

  closeDialog(): void {
    this.dialogOpen = false;
    this.dialogTitle = '';
    this.dialogBadge = undefined;
    this.dialogActions = [];
  }

  /* ----------------------------- settings panel --------------------- */

  openSettings(): void {
    this.settingsOpen = true;
  }

  closeSettings(): void {
    this.settingsOpen = false;
  }

  /** Handle a card context-menu pick; menu closes whatever the action. */
  runContextAction(action: string): void {
    const menu = this.contextMenu;
    this.contextMenu = null;
    if (!menu) return;
    const video = menu.video;
    if (action === 'share') {
      this.shareOpen = true;
    } else if (action === 'not-interested') {
      this.hidden = [...new Set([...this.hidden, video.slug])];
    } else if (action === 'dont-recommend') {
      this.hiddenChannels = [...new Set([...this.hiddenChannels, video.channel])];
    }
    // add-to-queue / watch-later / add-to-playlist / report → no-ops (v1)
  }

  /* ----------------------------- video options --------------------- */

  openVideoOptions(x: number, y: number): void {
    this.videoOptionsOpen = true;
    this.videoOptionsPos = { x, y };
  }

  closeVideoOptions(): void {
    this.videoOptionsOpen = false;
    this.videoOptionsPos = null;
  }

  /* ----------------------------- quality options ------------------- */

  openQualityOptions(x: number, y: number, currentQuality: string): void {
    this.qualityOptionsOpen = true;
    this.qualityOptionsPos = { x, y, currentQuality };
  }

  closeQualityOptions(): void {
    this.qualityOptionsOpen = false;
    this.qualityOptionsPos = null;
  }

  /* ----------------------------- backdrop / icon grid ----------------- */

  openBackdrop(): void {
    this.backdropOpen = true;
  }

  closeBackdrop(): void {
    this.backdropOpen = false;
  }

  /** Open the picker panel together with its black backdrop. */
  openIconGrid(): void {
    this.backdropOpen = true;
    this.iconGridOpen = true;
  }

  /** Close the picker panel and its backdrop. */
  closeIconGrid(): void {
    this.iconGridOpen = false;
    this.backdropOpen = false;
  }

  selectIcon(id: string): void {
    this.selectedIconId = id;
  }
}

/** App singleton — import from `../stores` anywhere. */
export const app = new AppStore();
