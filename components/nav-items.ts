import { Home, Trophy, User } from '@/components/icons';

export const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/results', label: 'Results', mobileLabel: 'results', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
] as const;
