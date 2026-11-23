'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  demoActivities,
  demoNotifications,
  demoSession,
} from './demo-data';
import type {
  AppNotification,
  CartItem,
  PointActivity,
  Program,
  Session,
} from './types';

type ProfilePatch = Partial<Pick<Session, 'name' | 'jamiaId' | 'campus'>>;

type PrototypeValue = {
  guestMode: boolean;
  session: Session;
  activities: PointActivity[];
  notifications: AppNotification[];
  programs: Program[];
  cart: CartItem[];
  setGuestMode: (guest: boolean) => void;
  claimActivity: (id: string) => { ok: boolean; points: number; message: string };
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  checkout: () => { ok: boolean; message: string; orderId?: string };
  toggleProgram: (event: Program) => void;
  removeProgram: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  updateProfile: (patch: ProfilePatch) => void;
  resetPrototype: () => void;
};

const PrototypeContext = createContext<PrototypeValue | null>(null);

const initialPrograms: Program[] = [
  {
    id: 'p-2',
    title: 'Expert Talk 01',
    venue: 'Main Hall',
    start: '10:30 AM',
    day: 'Thu 19',
  },
];

function freshSession(): Session {
  return {
    ...demoSession,
    claimed: [],
    registered: ['p-2'],
    readNotifications: [],
    transactions: [],
    points: 0,
  };
}

function freshActivities(): PointActivity[] {
  return demoActivities.map((activity) => ({ ...activity, claimed: false }));
}

function freshNotifications(): AppNotification[] {
  return demoNotifications.map((item) => ({ ...item, read: false }));
}

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [guestMode, setGuestMode] = useState(false);
  const [session, setSession] = useState<Session>(freshSession);
  const [activities, setActivities] = useState<PointActivity[]>(freshActivities);
  const [notifications, setNotifications] = useState<AppNotification[]>(freshNotifications);
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [cart, setCart] = useState<CartItem[]>([]);

  const claimActivity = useCallback((id: string) => {
    const activity = activities.find((item) => item.id === id);
    if (!activity || activity.claimed) {
      return { ok: false, points: session.points, message: 'This reward was already claimed.' };
    }

    const points = session.points + activity.reward;
    setActivities((previous) =>
      previous.map((item) => (item.id === id ? { ...item, claimed: true } : item)),
    );
    setSession((previous) => ({
      ...previous,
      points: previous.points + activity.reward,
      claimed: [...previous.claimed, id],
      transactions: [
        {
          id: `claim-${id}`,
          title: activity.title,
          points: activity.reward,
          date: 'Just now',
          kind: 'earned',
        },
        ...previous.transactions,
      ],
    }));

    return {
      ok: true,
      points,
      message: `+${activity.reward} Glocal Coins added to your wallet.`,
    };
  }, [activities, session.points]);

  const addToCart = useCallback((item: CartItem) => {
    setCart((previous) =>
      previous.some((entry) => entry.id === item.id)
        ? previous.map((entry) =>
            entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
          )
        : [...previous, { ...item, quantity: 1 }],
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const checkout = useCallback(() => {
    const total = cart.reduce((sum, item) => sum + item.cost * item.quantity, 0);
    if (cart.length === 0) {
      return { ok: false, message: 'Your cart is empty.' };
    }
    if (session.points < total) {
      return {
        ok: false,
        message: `You need ${total - session.points} more Glocal Coins for this order.`,
      };
    }

    const orderId = `GR${String(Date.now()).slice(-6)}`;
    setSession((previous) => ({
      ...previous,
      points: previous.points - total,
      transactions: [
        {
          id: orderId,
          title: `Store order ${orderId}`,
          points: -total,
          date: 'Just now',
          kind: 'redeemed',
        },
        ...previous.transactions,
      ],
    }));
    setCart([]);

    return { ok: true, message: 'Order placed. Show this at the counter.', orderId };
  }, [cart, session.points]);

  const toggleProgram = useCallback((event: Program) => {
    setPrograms((previous) => {
      const exists = previous.some((item) => item.id === event.id);
      return exists ? previous.filter((item) => item.id !== event.id) : [...previous, event];
    });
    setSession((previous) => ({
      ...previous,
      registered: previous.registered.includes(event.id)
        ? previous.registered.filter((id) => id !== event.id)
        : [...previous.registered, event.id],
    }));
  }, []);

  const removeProgram = useCallback((id: string) => {
    setPrograms((previous) => previous.filter((item) => item.id !== id));
    setSession((previous) => ({
      ...previous,
      registered: previous.registered.filter((registered) => registered !== id),
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((previous) =>
      previous.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
    setSession((previous) => ({
      ...previous,
      readNotifications: [...new Set([...previous.readNotifications, id])],
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((previous) => previous.map((item) => ({ ...item, read: true })));
    setSession((previous) => ({
      ...previous,
      readNotifications: [...new Set([...previous.readNotifications, ...demoNotifications.map((item) => item.id)])],
    }));
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const updateProfile = useCallback((patch: ProfilePatch) => {
    setSession((previous) => ({ ...previous, ...patch }));
  }, []);

  const resetPrototype = useCallback(() => {
    setGuestMode(false);
    setSession(freshSession());
    setActivities(freshActivities());
    setNotifications(freshNotifications());
    setPrograms(initialPrograms);
    setCart([]);
  }, []);

  const value = useMemo<PrototypeValue>(
    () => ({
      guestMode,
      session,
      activities,
      notifications,
      programs,
      cart,
      setGuestMode,
      claimActivity,
      addToCart,
      removeFromCart,
      clearCart,
      checkout,
      toggleProgram,
      removeProgram,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      updateProfile,
      resetPrototype,
    }),
    [
      guestMode,
      session,
      activities,
      notifications,
      programs,
      cart,
      claimActivity,
      addToCart,
      removeFromCart,
      clearCart,
      checkout,
      toggleProgram,
      removeProgram,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      updateProfile,
      resetPrototype,
    ],
  );

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function usePrototype(): PrototypeValue {
  const value = useContext(PrototypeContext);
  if (!value) {
    throw new Error('usePrototype must be used inside PrototypeProvider');
  }
  return value;
}
