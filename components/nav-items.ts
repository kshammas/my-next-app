import { Home, ResultsNav, User } from '@/components/icons';

export const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/results', label: 'Results', mobileLabel: 'results', icon: ResultsNav },
  { href: '/profile', label: 'Profile', icon: User },
] as const;
