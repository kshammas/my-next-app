import { Home, ResultsNav, ResultsNavFilled, User, UserFilled } from '@/components/icons';

export const navItems = [
  { href: '/home', label: 'Home', icon: Home, activeIcon: Home },
  {
    href: '/results',
    label: 'Results',
    mobileLabel: 'results',
    icon: ResultsNav,
    activeIcon: ResultsNavFilled,
  },
  { href: '/profile', label: 'Profile', icon: User, activeIcon: UserFilled },
] as const;
