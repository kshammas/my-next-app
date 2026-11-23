import type { ComponentType, SVGProps } from 'react';
import {
  AdjustmentsHorizontalIcon,
  ArrowDownLeftIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowRightEndOnRectangleIcon,
  ArrowUpRightIcon,
  ArrowUturnLeftIcon,
  BeakerIcon,
  BellIcon,
  CakeIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleStackIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  GiftIcon,
  HomeIcon,
  LifebuoyIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MegaphoneIcon,
  MinusIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  PhoneIcon,
  PlayIcon,
  PlusIcon,
  QrCodeIcon,
  RadioIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  SparklesIcon,
  SpeakerWaveIcon,
  TicketIcon,
  TrashIcon,
  TrophyIcon,
  UserCircleIcon,
  UserIcon,
  WalletIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type HeroIconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { title?: string; titleId?: string }
>;

export type AppIcon = ComponentType<IconProps>;

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
};

function adapt(Icon: HeroIconComponent, displayName: string) {
  function AdaptedIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
    const dimension = typeof size === 'number' ? `${size}px` : size;

    return (
      <Icon
        width={dimension}
        height={dimension}
        strokeWidth={strokeWidth}
        aria-hidden="true"
        {...props}
      />
    );
  }

  AdaptedIcon.displayName = displayName;
  return AdaptedIcon;
}

export const AlertCircle = adapt(ExclamationCircleIcon, 'AlertCircle');
export const ArrowDownLeft = adapt(ArrowDownLeftIcon, 'ArrowDownLeft');
export const ArrowLeft = adapt(ArrowLeftIcon, 'ArrowLeft');
export const ArrowUpRight = adapt(ArrowUpRightIcon, 'ArrowUpRight');
export const Bell = adapt(BellIcon, 'Bell');
export const CalendarCheck2 = adapt(CalendarIcon, 'CalendarCheck2');
export const CalendarDays = adapt(CalendarDaysIcon, 'CalendarDays');
export const Check = adapt(CheckIcon, 'Check');
export const CheckCheck = adapt(CheckIcon, 'CheckCheck');
export const ChevronDown = adapt(ChevronDownIcon, 'ChevronDown');
export const ChevronLeft = adapt(ChevronLeftIcon, 'ChevronLeft');
export const ChevronRight = adapt(ChevronRightIcon, 'ChevronRight');
export const CircleAlert = adapt(ExclamationCircleIcon, 'CircleAlert');
export const ClipboardList = adapt(ClipboardDocumentListIcon, 'ClipboardList');
export const Clock3 = adapt(ClockIcon, 'Clock3');
export const Coffee = adapt(BeakerIcon, 'Coffee');
export const Coins = adapt(CircleStackIcon, 'Coins');
export const Cookie = adapt(CakeIcon, 'Cookie');
export const CupSoda = adapt(BeakerIcon, 'CupSoda');
export const Download = adapt(ArrowDownTrayIcon, 'Download');
export const Gift = adapt(GiftIcon, 'Gift');
export const Home = adapt(HomeIcon, 'Home');
export const LifeBuoy = adapt(LifebuoyIcon, 'LifeBuoy');
export const LogOut = adapt(ArrowRightEndOnRectangleIcon, 'LogOut');
export const Mail = adapt(EnvelopeIcon, 'Mail');
export const MapPin = adapt(MapPinIcon, 'MapPin');
export const Megaphone = adapt(MegaphoneIcon, 'Megaphone');
export const MessageCircle = adapt(ChatBubbleLeftRightIcon, 'MessageCircle');
export const Minus = adapt(MinusIcon, 'Minus');
export const Navigation = adapt(PaperAirplaneIcon, 'Navigation');
export const PackageCheck = adapt(CheckCircleIcon, 'PackageCheck');
export const PencilLine = adapt(PencilSquareIcon, 'PencilLine');
export const Phone = adapt(PhoneIcon, 'Phone');
export const Play = adapt(PlayIcon, 'Play');
export const Plus = adapt(PlusIcon, 'Plus');
export const QrCode = adapt(QrCodeIcon, 'QrCode');
export const Radio = adapt(RadioIcon, 'Radio');
export const RefreshCw = adapt(ArrowPathIcon, 'RefreshCw');
export const ResultsNav = adapt(ChartBarIcon, 'ResultsNav');
export const RotateCcw = adapt(ArrowUturnLeftIcon, 'RotateCcw');
export const ScanLine = adapt(QrCodeIcon, 'ScanLine');
export const Search = adapt(MagnifyingGlassIcon, 'Search');
export const ShieldCheck = adapt(ShieldCheckIcon, 'ShieldCheck');
export const ShoppingBag = adapt(ShoppingBagIcon, 'ShoppingBag');
export const SlidersHorizontal = adapt(AdjustmentsHorizontalIcon, 'SlidersHorizontal');
export const Sparkles = adapt(SparklesIcon, 'Sparkles');
export const Ticket = adapt(TicketIcon, 'Ticket');
export const Trash2 = adapt(TrashIcon, 'Trash2');
export const Trophy = adapt(TrophyIcon, 'Trophy');
export const User = adapt(UserIcon, 'User');
export const UserRound = adapt(UserCircleIcon, 'UserRound');
export const Volume2 = adapt(SpeakerWaveIcon, 'Volume2');
export const Wallet = adapt(WalletIcon, 'Wallet');
export const X = adapt(XMarkIcon, 'X');
