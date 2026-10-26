/*
  youtube-redesign — mock catalog
  ===============================
  Typed mock dataset for the whole redesign demo. Later steps build
  components/pages directly from `CHANNELS` and `VIDEOS`; asset paths
  follow the conventions below (files land in `public/assets/`, filled
  by a parallel agent — keep referencing the exact paths):

    Thumb   (video):  /assets/thumbs/<video-slug>.png
    Thumb   (short):  /assets/shorts/<slug>.png
    Avatar:           /assets/avatars/<channel-slug>.png
    Banner:           /assets/banners/juxtoppassed.png
    Brand logo:       /assets/logo.png
    Icons:            /assets/icons/<icon-name>.png   (white on transparency)

  All durations are kept at the mockup value `12:07` for fidelity —
  chips/tag values come only from the taxonomy seen in the mockups.
*/

/* ----------------------------- Types ----------------------------- */

export type VideoType = 'video' | 'short';

/** Which built-in collection a video can surface in ("Plays In" rows). */
export type PlaysIn = 'Gaming' | 'Design & Code' | 'Tech';

export interface Channel {
  slug: string; //                 kebab-case id, mirrors avatar filename
  name: string; //                 display name
  verified: boolean;
  subs: number; //                 raw subscriber count (format for display)
  avatar: string; //               `/assets/avatars/<slug>.png`
  banner?: string; //              `/assets/banners/<slug>.png` (channel pages)
}

export interface Video {
  slug: string; //                 mirrors thumb filename (no extension)
  title: string;
  channel: string; //              channel slug
  views: number; //                raw view count (format for display)
  age: string; //                  e.g. "4 months ago"
  tags: string[]; //               subset of the chip taxonomy below
  duration: string; //             "mm:ss" as on the mockup badge
  thumb: string; //                video → /assets/thumbs/…, short → /assets/shorts/…
  type: VideoType;
  playsIn?: PlaysIn;
}

/* ----------------------------- Assets ---------------------------- */

export const BRAND_LOGO = '/assets/logo.png';

/** `/assets/icons/<name>.png` — white glyphs on transparency. */
export const iconUrl = (name: string): string => `/assets/icons/${name}.png`;

/* ----------------------------- Chip taxonomy --------------------- */

/** Filter chips row on Home, in mockup order ("All" is the default active pill). */
export const CHIPS = [
  'All',
  'Subscriptions',
  'Posts',
  'Music',
  'Tech',
  'Design',
  'Live',
  'Playlists',
  'Cats',
  'Electronics',
  'New Creators',
  'Art',
  'Tech News',
  'Lofi beats',
  'UI/UX Design',
  'UI/UX Redesign',
  'Video Games',
  'Apple',
  'Linux',
] as const;

/** Collections ("Plays In") rows seen in the mockups. */
export const COLLECTIONS = ['Gaming', 'Design & Code', 'Tech'] as const satisfies readonly PlaysIn[];

/* ----------------------------- Channels -------------------------- */

export const CHANNELS: Channel[] = [
  // — content channels —
  { slug: 'juxtoppassed',           name: 'Juxtoppassed',            verified: true,  subs: 612_000,    avatar: '/assets/avatars/juxtoppassed.png',           banner: '/assets/banners/juxtoppassed.png' },
  { slug: 'lofi-girl',              name: 'Lofi Girl',               verified: true,  subs: 14_000_000, avatar: '/assets/avatars/lofi-girl.png' },
  { slug: 'wvw',                    name: 'WWV',                     verified: true,  subs: 3_800_000,  avatar: '/assets/avatars/wvw.png' },
  { slug: 'the-critical-drinker',   name: 'The Critical Drinker',    verified: true,  subs: 1_020_000,  avatar: '/assets/avatars/the-critical-drinker.png' },
  { slug: 'brandonshepherd',        name: 'Brandon Shepherd',        verified: false, subs: 210_000,    avatar: '/assets/avatars/brandonshepherd.png' },
  { slug: 'preppy-kitchen',         name: 'Preppy Kitchen',          verified: true,  subs: 4_600_000,  avatar: '/assets/avatars/preppy-kitchen.png' },
  { slug: 'the-game-theorists',     name: 'The Game Theorists',      verified: true,  subs: 21_000_000, avatar: '/assets/avatars/the-game-theorists.png' },
  { slug: 'dailydoseofinternetcats', name: 'DailyDoseOfInternetCats', verified: true,  subs: 2_990_000,  avatar: '/assets/avatars/dailydoseofinternetcats.png' },
  { slug: 'fireship',               name: 'Fireship',                verified: true,  subs: 4_200_000,  avatar: '/assets/avatars/fireship.png' },
  { slug: 'theprimetime',           name: 'ThePrimeTime',            verified: true,  subs: 412_000,    avatar: '/assets/avatars/theprimetime.png' },
  { slug: 'ninjashyper',            name: 'Ninja',                   verified: true,  subs: 5_600_000,  avatar: '/assets/avatars/ninjashyper.png' },
  { slug: 'eve-online',             name: 'EVE Online',              verified: true,  subs: 330_000,    avatar: '/assets/avatars/eve-online.png' },
  { slug: 'cyberpunk-game',         name: 'Cyberpunk Game',          verified: true,  subs: 1_900_000,  avatar: '/assets/avatars/cyberpunk-game.png' },
  { slug: 'fortnite',               name: 'Fortnite',                verified: true,  subs: 14_000_000, avatar: '/assets/avatars/fortnite.png' },
  { slug: 'gamespot',               name: 'GameSpot',                verified: true,  subs: 5_700_000,  avatar: '/assets/avatars/gamespot.png' },
  { slug: 'playstation',            name: 'PlayStation',             verified: true,  subs: 16_700_000, avatar: '/assets/avatars/playstation.png' },
  { slug: 'bog',                    name: 'bog',                     verified: false, subs: 99_000,     avatar: '/assets/avatars/bog.png' },
  { slug: 'vsauce',                 name: 'Vsauce',                  verified: true,  subs: 25_000_000, avatar: '/assets/avatars/vsauce.png' },
  { slug: 'the-report-of-the-week', name: 'TheReportOfTheWeek',      verified: true,  subs: 950_000,    avatar: '/assets/avatars/the-report-of-the-week.png' },
  { slug: 'daniel-kraff',           name: 'Daniel Kraff',            verified: false, subs: 76_000,     avatar: '/assets/avatars/daniel-kraff.png' },
  { slug: 'man-carrying-thing',     name: 'Man Carrying Thing',      verified: true,  subs: 640_000,    avatar: '/assets/avatars/man-carrying-thing.png' },
  { slug: 'screen-junkies',         name: 'Screen Junkies',          verified: true,  subs: 7_300_000,  avatar: '/assets/avatars/screen-junkies.png' },
  { slug: 'ok',                     name: 'ok',                      verified: false, subs: 12_000,     avatar: '/assets/avatars/ok.png' },
  // — fake accounts shown in the share sheet —
  { slug: 'youtube-enjoyer',          name: 'YouTube Enjoyer',          verified: false, subs: 3, avatar: '/assets/avatars/youtube-enjoyer.png' },
  { slug: 'happy-youtube-enjoyer',    name: 'Happy YouTube Enjoyer',    verified: false, subs: 8, avatar: '/assets/avatars/happy-youtube-enjoyer.png' },
  { slug: 'evil-youtube-enjoyer',     name: 'Evil YouTube Enjoyer',     verified: false, subs: 1, avatar: '/assets/avatars/evil-youtube-enjoyer.png' },
  { slug: 'indifferent-youtube-enjoyer', name: 'Indifferent YouTube Enjoyer', verified: false, subs: 0, avatar: '/assets/avatars/indifferent-youtube-enjoyer.png' },
];

/* ----------------------------- Videos ---------------------------- */

export const VIDEOS: Video[] = [
  // In Case You Missed — Juxtoppassed shelf
  { slug: 'how-websites-learned-to-fit-everywhere', title: 'How Websites Learned to Fit Everywhere',  channel: 'juxtoppassed', views: 150_000, age: '4 months ago',  tags: ['Design', 'UI/UX Redesign'],          duration: '12:07', thumb: '/assets/thumbs/how-websites-learned-to-fit-everywhere.png', type: 'video', playsIn: 'Design & Code' },
  { slug: 'redesigned-discord-ui-cozier',           title: 'I Redesigned Discord UI just to make it Cozier', channel: 'juxtoppassed', views: 433_000, age: '1 month ago', tags: ['Design', 'UI/UX Design'],            duration: '12:07', thumb: '/assets/thumbs/redesigned-discord-ui-cozier.png',           type: 'video', playsIn: 'Design & Code' },
  { slug: 'everything-about-color',                 title: 'everything about color (literally)',      channel: 'juxtoppassed', views: 319_000, age: '3 months ago',  tags: ['Art', 'Design'],                     duration: '12:07', thumb: '/assets/thumbs/everything-about-color.png',                 type: 'video', playsIn: 'Design & Code' },
  { slug: 'blurring-things-in-quirky-ways',         title: 'I tried blurring things in Quirky ways',  channel: 'juxtoppassed', views: 304_000, age: '5 months ago',  tags: ['Design', 'Art'],                     duration: '12:07', thumb: '/assets/thumbs/blurring-things-in-quirky-ways.png',         type: 'video', playsIn: 'Design & Code' },

  // Home grid
  { slug: 'redesigned-youtube-ui-from-scratch',     title: 'I Redesigned the ENTIRE YouTube UI from Scratch', channel: 'juxtoppassed', views: 520_000, age: '1 day ago', tags: ['UI/UX Design', 'UI/UX Redesign', 'Tech'], duration: '12:07', thumb: '/assets/thumbs/redesigned-youtube-ui-from-scratch.png', type: 'video', playsIn: 'Design & Code' },
  { slug: 'christmas-lofi-radio',                   title: 'christmas lofi radio 🎄cozy beats to get festive to', channel: 'lofi-girl', views: 120_000, age: '1 day ago', tags: ['Lofi beats', 'Music'],               duration: '12:07', thumb: '/assets/thumbs/christmas-lofi-radio.png',                   type: 'video' },
  { slug: 'how-a-cat-works',                        title: 'How a cat works',                     channel: 'wvw',          views: 4_000_000, age: '11 months ago', tags: ['Cats'],                            duration: '12:07', thumb: '/assets/thumbs/how-a-cat-works.png',                        type: 'video' },
  { slug: 'impossible-laptop-fan',                  title: 'The IMPOSSIBLE Laptop Fan...',        channel: 'juxtoppassed', views: 991_000, age: '2 months ago',  tags: ['Electronics', 'Tech'],               duration: '12:07', thumb: '/assets/thumbs/impossible-laptop-fan.png',                  type: 'video', playsIn: 'Tech' },
  { slug: 'game-theory-fixed-zelda-timeline',       title: "Game Theory: I Fixed Zelda's BROKEN Timeline!", channel: 'the-game-theorists', views: 2_300_000, age: '3 weeks ago', tags: ['Video Games'],                 duration: '12:07', thumb: '/assets/thumbs/game-theory-fixed-zelda-timeline.png',       type: 'video', playsIn: 'Gaming' },
  { slug: 'first-person-camera-islands-available-now', title: 'First-Person Camera Creator Makes Islands Available Now', channel: 'eve-online', views: 260_000, age: '6 days ago', tags: ['Video Games'],                 duration: '12:07', thumb: '/assets/thumbs/first-person-camera-islands-available-now.png', type: 'video', playsIn: 'Gaming' },
  { slug: 'turned-famous-logos-into-emojis',        title: 'I Turned Famous Logos into Emojis',    channel: 'juxtoppassed', views: 388_000, age: '2 months ago',  tags: ['Art', 'Design'],                     duration: '12:07', thumb: '/assets/thumbs/turned-famous-logos-into-emojis.png',        type: 'video', playsIn: 'Design & Code' },
  { slug: 'thomas-bergersen-a-christmas-carol',     title: 'Thomas Bergersen - A Christmas Carol (Trailer)', channel: 'bog', views: 47_000,  age: '1 week ago',   tags: ['Music'],                             duration: '12:07', thumb: '/assets/thumbs/thomas-bergersen-a-christmas-carol.png',     type: 'video' },
  { slug: 'the-best-and-worst-of-2024',             title: 'The Best And Worst Of 2024',          channel: 'the-report-of-the-week', views: 340_000, age: '2 months ago', tags: ['Tech News'],                    duration: '12:07', thumb: '/assets/thumbs/the-best-and-worst-of-2024.png',             type: 'video', playsIn: 'Tech' },
  { slug: 'the-every-ui-ux-website-explained',      title: 'The Every UI/UX Website Explained',   channel: 'theprimetime', views: 190_000, age: '9 days ago',    tags: ['UI/UX', 'Tech', 'Linux'],            duration: '12:07', thumb: '/assets/thumbs/the-every-ui-ux-website-explained.png',      type: 'video', playsIn: 'Tech' },
  { slug: 'josh-hutcherson-whistle',                title: 'Josh Hutcherson Whistle',             channel: 'ok',           views: 8_900_000, age: '6 months ago', tags: ['Posts'],                           duration: '12:07', thumb: '/assets/thumbs/josh-hutcherson-whistle.png',                type: 'video' },
  { slug: 'classic-gingerbread-cookies-recipe',     title: 'Classic Gingerbread Cookies Recipe',  channel: 'preppy-kitchen', views: 1_300_000, age: '3 weeks ago', tags: [],                                duration: '12:07', thumb: '/assets/thumbs/classic-gingerbread-cookies-recipe.png',     type: 'video' },
  { slug: 'gingerbread-man-recipe',                 title: 'GINBREAD COOKIES | gingerbread man recipe', channel: 'preppy-kitchen', views: 620_000, age: '1 month ago', tags: [],                             duration: '12:07', thumb: '/assets/thumbs/gingerbread-man-recipe.png',                 type: 'video' },

  // Cat shorts
  { slug: 'put-this-cat-in-jail',                   title: 'Put this cat in jail',                channel: 'dailydoseofinternetcats', views: 12_400_000, age: '1 month ago', tags: ['Cats'],                          duration: '12:07', thumb: '/assets/shorts/put-this-cat-in-jail.png',                   type: 'short' },
  { slug: 'pizza-crust-really-wants-me',            title: 'Pizza Crust Really wants M...',       channel: 'dailydoseofinternetcats', views: 5_600_000,  age: '2 months ago', tags: ['Cats'],                         duration: '12:07', thumb: '/assets/shorts/pizza-crust-really-wants-me.png',            type: 'short' },

  // Extra grid filler so every catalog channel has content
  { slug: 'the-worst-movie-villains-of-the-year',   title: 'The WORST Movie Villains of the Year', channel: 'the-critical-drinker', views: 890_000, age: '2 weeks ago', tags: [],                                 duration: '12:07', thumb: '/assets/thumbs/the-worst-movie-villains-of-the-year.png',   type: 'video' },
  { slug: 'how-many-ways-can-you-count-to-infinity', title: 'How Many Ways Can You Count to Infinity?', channel: 'vsauce', views: 2_100_000, age: '8 months ago', tags: [],                              duration: '12:07', thumb: '/assets/thumbs/how-many-ways-can-you-count-to-infinity.png', type: 'video' },
  { slug: 'react-in-100-seconds',                   title: 'React in 100 Seconds',                channel: 'fireship',     views: 1_100_000, age: '3 weeks ago',  tags: ['Tech'],                              duration: '12:07', thumb: '/assets/thumbs/react-in-100-seconds.png',                   type: 'video', playsIn: 'Tech' },
  { slug: 'i-built-the-ultimate-gaming-setup',      title: 'I Built the Ultimate Gaming Setup',   channel: 'ninjashyper',  views: 760_000, age: '5 days ago',    tags: ['Electronics', 'Video Games'],        duration: '12:07', thumb: '/assets/thumbs/i-built-the-ultimate-gaming-setup.png',      type: 'video', playsIn: 'Gaming' },
  { slug: 'cyberpunk-update-2-3-overview',          title: 'Update 2.3 | Official Overview',      channel: 'cyberpunk-game', views: 2_400_000, age: '1 week ago', tags: ['Video Games'],                       duration: '12:07', thumb: '/assets/thumbs/cyberpunk-update-2-3-overview.png',          type: 'video', playsIn: 'Gaming' },
  { slug: 'the-best-games-of-2024-top-10',          title: 'The Best Games of 2024 — Top 10',     channel: 'gamespot',     views: 540_000, age: '1 month ago',   tags: ['Video Games'],                       duration: '12:07', thumb: '/assets/thumbs/the-best-games-of-2024-top-10.png',          type: 'video', playsIn: 'Gaming' },
];

/* ----------------------------- Lookups --------------------------- */

/** Channel by slug — `undefined` possible on bad input; cast at call sites. */
export const getChannel = (slug: string): Channel | undefined =>
  CHANNELS.find((c) => c.slug === slug);

/** All video-type entries, mockup grid order. */
export const getVideos = (): Video[] => VIDEOS.filter((v) => v.type === 'video');

/** All shorts, in mockup order. */
export const getShorts = (): Video[] => VIDEOS.filter((v) => v.type === 'short');

/** Videos of one channel, newest-first as in the mockups. */
export const getChannelVideos = (slug: string): Video[] =>
  VIDEOS.filter((v) => v.channel === slug);

/** Videos carrying a given chip tag; the "All" chip returns everything. */
export const getVideosByChip = (chip: string): Video[] =>
  chip === 'All' ? getVideos() : VIDEOS.filter((v) => v.tags.includes(chip));

/** Channel videos that surface inside a collection ("Plays In") row. */
export const getCollectionVideos = (collection: PlaysIn): Video[] =>
  VIDEOS.filter((v) => v.playsIn === collection);
