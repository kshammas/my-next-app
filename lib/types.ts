export type TransactionKind = 'earned' | 'redeemed' | 'adjustment';

export type Transaction = {
  id: string;
  title: string;
  points: number;
  date: string;
  kind: TransactionKind;
};

export type Session = {
  id: string;
  name: string;
  jamiaId: string;
  campus: string;
  points: number;
  claimed: string[];
  registered: string[];
  readNotifications: string[];
  transactions: Transaction[];
};

export type ScheduleEvent = {
  id: string;
  title: string;
  category: string;
  venue: string;
  start: string;
  end: string;
  speaker?: string;
  registered: boolean;
};

export type ScheduleDay = {
  id: string;
  label: string;
  date: string;
  events: ScheduleEvent[];
};

export type Program = {
  id: string;
  title: string;
  venue: string;
  start: string;
  day: string;
};

export type ResultRow = {
  rank: number;
  name: string;
  score: number;
  detail?: string;
};

export type Results = {
  groups: ResultRow[];
  individuals: ResultRow[];
};

export type StreamItem = {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  live: boolean;
  viewers?: string;
};

export type Venue = {
  id: string;
  name: string;
  label: string;
  x: number;
  y: number;
  note: string;
};

export type StoreItem = {
  id: string;
  name: string;
  cost: number;
  emoji: string;
  tag?: string;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type PointActivity = {
  id: string;
  title: string;
  reward: number;
  description: string;
  claimed: boolean;
};

export type Dashboard = {
  earned: number;
  redeemed: number;
  nextEvent?: { title: string; time: string; venue: string };
};
