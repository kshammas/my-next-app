import type {
  AppNotification,
  Dashboard,
  PointActivity,
  Results,
  ScheduleDay,
  Session,
  StoreItem,
  Venue,
} from './types';

export const demoTransactions: Session['transactions'] = [];

export const demoSession: Session = {
  id: 'demo-participant',
  name: 'Midlaj Thonikkadavan',
  jamiaId: '2025JM122',
  campus: 'Baithullzza',
  points: 0,
  claimed: [],
  registered: ['p-2'],
  readNotifications: [],
  transactions: demoTransactions,
};

export const demoDashboard: Dashboard = {
  earned: 0,
  redeemed: 0,
  nextEvent: { title: 'Expert Talk 02', time: '10:30 AM', venue: 'Main Hall' },
};

export const demoSchedule: ScheduleDay[] = [
  {
    id: 'day-1',
    label: 'Day 1',
    date: 'Fri, 20 Nov',
    events: [
      { id: 'p-1', title: 'Inauguration & Recitation', category: 'Ceremony', venue: 'Main Ground', start: '09:00', end: '10:00', registered: false },
      { id: 'p-2', title: 'Expert Talk 01', category: 'Talk', venue: 'Main Hall', start: '10:30', end: '11:30', speaker: 'Sh. Abdul Fathah K A', registered: true },
      { id: 'p-3', title: 'Quran Competition', category: 'Competition', venue: 'Seminar Hall', start: '14:00', end: '16:00', registered: false },
      { id: 'p-4', title: 'Urse Ajmer', category: 'Spiritual', venue: 'Courtyard', start: '16:30', end: '18:00', registered: false },
    ],
  },
  {
    id: 'day-2',
    label: 'Day 2',
    date: 'Sat, 21 Nov',
    events: [
      { id: 'p-5', title: 'Koomu Talks', category: 'Talk', venue: 'Main Hall', start: '10:00', end: '11:00', registered: false },
      { id: 'p-6', title: 'Glocal VR Experience', category: 'Expo', venue: 'Expo Block', start: '11:30', end: '13:00', registered: false },
      { id: 'p-7', title: 'Naat Competition', category: 'Competition', venue: 'Seminar Hall', start: '15:00', end: '17:00', registered: false },
      { id: 'p-8', title: 'Cultural Night', category: 'Cultural', venue: 'Main Ground', start: '19:00', end: '21:00', registered: false },
    ],
  },
  {
    id: 'day-3',
    label: 'Day 3',
    date: 'Sun, 22 Nov',
    events: [
      { id: 'p-9', title: 'Expert Covos (01)', category: 'Talk', venue: 'Main Hall', start: '10:00', end: '11:30', registered: false },
      { id: 'p-10', title: 'Quiz Finale', category: 'Competition', venue: 'Seminar Hall', start: '13:00', end: '14:30', registered: false },
      { id: 'p-11', title: 'Expo Walk', category: 'Expo', venue: 'Expo Block', start: '15:00', end: '17:00', registered: false },
      { id: 'p-12', title: 'Valedictory', category: 'Ceremony', venue: 'Main Ground', start: '18:00', end: '19:30', registered: false },
    ],
  },
];

export const demoResults: Results = {
  groups: [
    { rank: 1, name: 'Manzil House', score: 480, detail: '12 events' },
    { rank: 2, name: 'Noor House', score: 425, detail: '11 events' },
    { rank: 3, name: 'Hikma House', score: 390, detail: '10 events' },
    { rank: 4, name: 'Sunnah House', score: 310, detail: '9 events' },
    { rank: 5, name: 'Rihla House', score: 275, detail: '8 events' },
  ],
  individuals: [
    { rank: 1, name: 'Ahammed Rifas', score: 195, detail: 'Jamia 2021JM044' },
    { rank: 2, name: 'Fathima Noora', score: 182, detail: 'Jamia 2022JM118' },
    { rank: 3, name: 'Anas Kabeer', score: 168, detail: 'Jamia 2020JM010' },
    { rank: 4, name: 'Yusuf Ameen', score: 151, detail: 'Jamia 2023JM007' },
    { rank: 5, name: 'Amina Shahida', score: 140, detail: 'Jamia 2021JM092' },
  ],
};

export const demoVenues: Venue[] = [
  { id: 'v-1', name: 'Main Ground', label: 'A', x: 48, y: 68, note: 'Inauguration · Cultural Night' },
  { id: 'v-2', name: 'Main Hall', label: 'B', x: 30, y: 42, note: 'Expert talks' },
  { id: 'v-3', name: 'Seminar Hall', label: 'C', x: 70, y: 30, note: 'Competitions' },
  { id: 'v-4', name: 'Expo Block', label: 'D', x: 72, y: 62, note: 'Glocal VR & stalls' },
  { id: 'v-5', name: 'Courtyard', label: 'E', x: 22, y: 70, note: 'Spiritual sessions' },
];

export const demoStore: StoreItem[] = [
  { id: 's-1', name: 'Rendezvous Tee', cost: 80, emoji: '👕', tag: 'Popular' },
  { id: 's-2', name: 'Glocal Cap', cost: 60, emoji: '🧢' },
  { id: 's-3', name: 'Sticker Pack', cost: 25, emoji: '✨' },
  { id: 's-4', name: 'Refreshment', cost: 30, emoji: '🥤' },
];

export const demoNotifications: AppNotification[] = [
  { id: 'n-1', title: 'Expert Talk 02 starts soon', body: 'Main Hall · 10:30 AM. Add it to your program.', time: '5 min ago', read: false },
  { id: 'n-2', title: '+20 GP credited', body: 'You earned points for Koomu Talks.', time: '2 hr ago', read: false },
  { id: 'n-3', title: 'Your QR is ready', body: 'Redeem your Glocal Points at the store.', time: 'Yesterday', read: true },
];

export const demoActivities: PointActivity[] = [
  {
    id: 'welcome-reward',
    title: 'Welcome Reward',
    reward: 10,
    when: '19 Nov, 2:00 pm',
    description: 'Welcome to Rendezvous! Claim your welcome Glocal Points and start exploring!',
    claimed: false,
  },
  {
    id: 'expert-convos',
    title: 'Expert Convos',
    reward: 30,
    when: '19 Nov, 5:00 pm',
    description: 'Attend the expert conversation and scan the booth QR to claim your coins.',
    claimed: false,
  },
  {
    id: 'prochat',
    title: 'ProChat',
    reward: 20,
    when: '19 Nov, 9:00 pm',
    description: 'Join ProChat, scan your participant card at the venue and collect your reward.',
    claimed: false,
  },
  {
    id: 'buy-a-book',
    title: 'Buy a Book',
    reward: 15,
    when: 'Anytime',
    description: 'Pick up a book from the fest stall and scan the counter QR to earn coins.',
    claimed: false,
  },
  {
    id: 'visit-expo',
    title: 'Visit Expo',
    reward: 50,
    when: 'Anytime',
    description: 'Walk through the expo stalls and scan at the exit desk.',
    claimed: false,
  },
];
