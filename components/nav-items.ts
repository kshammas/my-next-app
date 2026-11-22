import { Home, Trophy, User } from 'lucide-react';

export const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/results', label: 'Results', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
] as const;
