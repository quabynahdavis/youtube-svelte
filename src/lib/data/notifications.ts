/*
  Notifications mock data
*/
export type NotificationType = 'upload' | 'shared';

export interface Notification {
  id: string;
  type: NotificationType;
  channelSlug: string;
  title?: string;
  videoThumb?: string;
  age: string;
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'upload',
    channelSlug: 'juxtoppassed',
    title: 'I Redesigned the ENTIRE YouTube UI from Scratch',
    videoThumb: '/assets/thumbs/redesigned-youtube-ui-from-scratch.png',
    age: '20 min ago',
  },
  {
    id: 'notif-2',
    type: 'shared',
    channelSlug: 'youtube-enjoyer',
    title: 'Put this cat in jail',
    videoThumb: '/assets/shorts/put-this-cat-in-jail.png',
    age: '1 hour ago',
  },
  {
    id: 'notif-3',
    type: 'upload',
    channelSlug: 'lofi-girl',
    title: 'christmas lofi radio 🎄 cozy beats to get festive to',
    videoThumb: '/assets/thumbs/christmas-lofi-radio.png',
    age: '3 hours ago',
  },
  {
    id: 'notif-4',
    type: 'shared',
    channelSlug: 'happy-youtube-enjoyer',
    title: 'How a cat works',
    videoThumb: '/assets/thumbs/how-a-cat-works.png',
    age: '5 hours ago',
  },
  {
    id: 'notif-5',
    type: 'upload',
    channelSlug: 'the-game-theorists',
    title: "Game Theory: I Fixed Zelda's BROKEN Timeline!",
    videoThumb: '/assets/thumbs/game-theory-fixed-zelda-timeline.png',
    age: '8 hours ago',
  },
];