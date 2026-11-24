import type { ComponentType, SVGProps } from 'react';
import {
  IoAddOutline,
  IoAlertCircleOutline,
  IoArrowBackOutline,
  IoArrowDownOutline,
  IoArrowUpOutline,
  IoBagCheckOutline,
  IoBagHandleOutline,
  IoBarChartOutline,
  IoBeakerOutline,
  IoCafeOutline,
  IoCalendarClearOutline,
  IoCalendarOutline,
  IoCallOutline,
  IoCashOutline,
  IoChatbubbleOutline,
  IoCheckmarkDoneOutline,
  IoCheckmarkOutline,
  IoChevronBackOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoClipboardOutline,
  IoCloseOutline,
  IoDownloadOutline,
  IoFastFoodOutline,
  IoGiftOutline,
  IoHelpBuoyOutline,
  IoLocationOutline,
  IoLogOutOutline,
  IoMailOutline,
  IoMegaphoneOutline,
  IoNavigateOutline,
  IoNotificationsOutline,
  IoOptionsOutline,
  IoPersonCircleOutline,
  IoPersonOutline,
  IoPencilOutline,
  IoPlayOutline,
  IoQrCodeOutline,
  IoRadioOutline,
  IoRefreshOutline,
  IoReloadOutline,
  IoRemoveOutline,
  IoScanOutline,
  IoSearchOutline,
  IoShieldCheckmarkOutline,
  IoSparklesOutline,
  IoTicketOutline,
  IoTimeOutline,
  IoTrashOutline,
  IoTrophyOutline,
  IoVolumeHighOutline,
  IoWalletOutline,
} from 'react-icons/io5';

type IonicIcon = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number | string; title?: string }
>;

export type AppIcon = ComponentType<IconProps>;

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
};

function adapt(Icon: IonicIcon, displayName: string) {
  function AdaptedIcon({ size = 24, strokeWidth, ...props }: IconProps) {
    const dimension = typeof size === 'number' ? `${size}px` : size;

    return (
      <Icon
        size={dimension}
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

export const AlertCircle = adapt(IoAlertCircleOutline, 'AlertCircle');
export const ArrowDownLeft = adapt(IoArrowDownOutline, 'ArrowDownLeft');
export const ArrowLeft = adapt(IoArrowBackOutline, 'ArrowLeft');
export const ArrowUpRight = adapt(IoArrowUpOutline, 'ArrowUpRight');
export const Bell = adapt(IoNotificationsOutline, 'Bell');
export const CalendarCheck2 = adapt(IoCalendarOutline, 'CalendarCheck2');
export const CalendarDays = adapt(IoCalendarClearOutline, 'CalendarDays');
export const Check = adapt(IoCheckmarkOutline, 'Check');
export const CheckCheck = adapt(IoCheckmarkDoneOutline, 'CheckCheck');
export const ChevronDown = adapt(IoChevronDownOutline, 'ChevronDown');
export const ChevronLeft = adapt(IoChevronBackOutline, 'ChevronLeft');
export const ChevronRight = adapt(IoChevronForwardOutline, 'ChevronRight');
export const CircleAlert = adapt(IoAlertCircleOutline, 'CircleAlert');
export const ClipboardList = adapt(IoClipboardOutline, 'ClipboardList');
export const Clock3 = adapt(IoTimeOutline, 'Clock3');
export const Coffee = adapt(IoCafeOutline, 'Coffee');
export const Coins = adapt(IoCashOutline, 'Coins');
export const Cookie = adapt(IoFastFoodOutline, 'Cookie');
export const CupSoda = adapt(IoBeakerOutline, 'CupSoda');
export const Download = adapt(IoDownloadOutline, 'Download');
export const Gift = adapt(IoGiftOutline, 'Gift');
// Flaticon "home" #1946488 — outlined house, tinted through currentColor with a CSS mask.
// This keeps the nav's active/inactive colours working without a second SVG pipeline.
export const Home: AppIcon = function HomeIcon({ size = 24, className, style }: IconProps) {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        width: dimension,
        height: dimension,
        backgroundColor: 'currentColor',
        WebkitMaskImage: 'url(/icons/home-flaticon.png)',
        maskImage: 'url(/icons/home-flaticon.png)',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        ...style,
      }}
    />
  );
};
export const LifeBuoy = adapt(IoHelpBuoyOutline, 'LifeBuoy');
export const LogOut = adapt(IoLogOutOutline, 'LogOut');
export const Mail = adapt(IoMailOutline, 'Mail');
export const MapPin = adapt(IoLocationOutline, 'MapPin');
export const Megaphone = adapt(IoMegaphoneOutline, 'Megaphone');
export const MessageCircle = adapt(IoChatbubbleOutline, 'MessageCircle');
export const Minus = adapt(IoRemoveOutline, 'Minus');
export const Navigation = adapt(IoNavigateOutline, 'Navigation');
export const PackageCheck = adapt(IoBagCheckOutline, 'PackageCheck');
export const PencilLine = adapt(IoPencilOutline, 'PencilLine');
export const Phone = adapt(IoCallOutline, 'Phone');
export const Play = adapt(IoPlayOutline, 'Play');
export const Plus = adapt(IoAddOutline, 'Plus');
export const QrCode = adapt(IoQrCodeOutline, 'QrCode');
export const Radio = adapt(IoRadioOutline, 'Radio');
export const RefreshCw = adapt(IoRefreshOutline, 'RefreshCw');
export const ResultsNav = adapt(IoBarChartOutline, 'ResultsNav');
export const RotateCcw = adapt(IoReloadOutline, 'RotateCcw');
export const ScanLine = adapt(IoScanOutline, 'ScanLine');
export const Search = adapt(IoSearchOutline, 'Search');
export const ShieldCheck = adapt(IoShieldCheckmarkOutline, 'ShieldCheck');
export const ShoppingBag = adapt(IoBagHandleOutline, 'ShoppingBag');
export const SlidersHorizontal = adapt(IoOptionsOutline, 'SlidersHorizontal');
export const Sparkles = adapt(IoSparklesOutline, 'Sparkles');
export const Ticket = adapt(IoTicketOutline, 'Ticket');
export const Trash2 = adapt(IoTrashOutline, 'Trash2');
export const Trophy = adapt(IoTrophyOutline, 'Trophy');
export const User = adapt(IoPersonOutline, 'User');
export const UserRound = adapt(IoPersonCircleOutline, 'UserRound');
export const Volume2 = adapt(IoVolumeHighOutline, 'Volume2');
export const Wallet = adapt(IoWalletOutline, 'Wallet');
export const X = adapt(IoCloseOutline, 'X');
