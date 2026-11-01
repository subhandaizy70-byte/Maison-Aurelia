import React from 'react';
import { ShoppingBag, Heart, Volume2, VolumeX, Sparkles, Moon, Sun, Truck, TrendingDown } from 'lucide-react';
import { atelierAudio } from '../utils/audio';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSalonBooking: () => void;
  onOpenOrderStatus: () => void;
  onOpenMarketComparator: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSalonBooking,
  onOpenOrderStatus,
  onOpenMarketComparator,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  const handleToggleAudio = () => {
    const active = atelierAudio.toggle();
    setIsPlayingAudio(active);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 dark:bg-[#141311]/95 backdrop-blur-md border-b border-[#E8E4DC] dark:border-[#272421] transition-colors duration-200">
      {/* Editorial Announcement Bar */}
      <div className="bg-[#1C1B19] text-[#EAE6DE] dark:bg-[#0C0B0A] py-1.5 px-4 text-center text-[11px] tracking-[0.2em] uppercase font-sans-luxury flex items-center justify-center gap-3">
        <span>Place Vendôme Salon · Autumn / Winter MMXXVI Archive</span>
        <span aria-hidden="true" className="opacity-40">·</span>
        <a
          href="#maison-elite"
          className="hover:text-[#C5B492] text-[#E0D5BE] transition-colors cursor-pointer hidden sm:flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-[#C5B492]" />
          <span>Maison Elite Privileges</span>
        </a>
        <span aria-hidden="true" className="opacity-40 hidden sm:inline">·</span>
        <button
          onClick={onOpenOrderStatus}
          className="underline hover:text-white transition-colors cursor-pointer flex items-center gap-1"
        >
          <Truck className="w-3 h-3 text-[#8C7853]" />
          <span>Track Order & Shipment</span>
        </button>
        <span aria-hidden="true" className="opacity-40">·</span>
        <button
          onClick={onOpenMarketComparator}
          className="hover:text-white transition-colors cursor-pointer hidden md:inline"
        >
          Luxury Price Index
        </button>
      </div>

      {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (4-5 Nav Links) — Zone 3 (Primary Action & Utilities) */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-2xl lg:text-[26px] tracking-[0.22em] uppercase font-serif-luxury text-[#181715] dark:text-[#F3F0E6] whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
        >
          Maison Aurelia
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[13px] tracking-[0.16em] uppercase font-sans-luxury text-[#605B54] dark:text-[#A7A096]">
          <a
            href="#collections"
            className="hover:text-[#181715] dark:hover:text-[#F3F0E6] transition-colors whitespace-nowrap shrink-0"
          >
            Collections
          </a>
          <a
            href="#lookbook"
            className="hover:text-[#181715] dark:hover:text-[#F3F0E6] transition-colors whitespace-nowrap shrink-0"
          >
            Lookbook
          </a>
          <a
            href="#maison-elite"
            className="hover:text-[#181715] dark:hover:text-[#F3F0E6] text-[#8C7853] dark:text-[#C5B492] font-medium transition-colors whitespace-nowrap shrink-0"
          >
            Maison Elite
          </a>
          <a
            href="#savoir-faire"
            className="hover:text-[#181715] dark:hover:text-[#F3F0E6] transition-colors whitespace-nowrap shrink-0"
          >
            Savoir-Faire
          </a>
          <button
            onClick={onOpenOrderStatus}
            className="hover:text-[#181715] dark:hover:text-[#F3F0E6] transition-colors whitespace-nowrap shrink-0 uppercase cursor-pointer"
          >
            Order Status
          </button>
          <button
            onClick={onOpenMarketComparator}
            className="hover:text-[#181715] dark:hover:text-[#F3F0E6] transition-colors whitespace-nowrap shrink-0 uppercase cursor-pointer"
          >
            Market Index
          </button>
        </nav>

        {/* Zone 3: Actions & Bag */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          
          {/* Subtle Atelier Ambiance Sound Toggle */}
          <button
            onClick={handleToggleAudio}
            title={isPlayingAudio ? 'Mute Atelier Rain & Cello Ambiance' : 'Play Atelier Place Vendôme Ambiance'}
            className="flex items-center gap-1.5 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-[#706B63] dark:text-[#9F998F] hover:text-[#181715] dark:hover:text-[#F3F0E6] transition-colors rounded hover:bg-[#EFECE5] dark:hover:bg-[#201D1A]"
            aria-label="Toggle ambient atelier soundscape"
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#8C7853]" />
                <span className="hidden xl:inline text-[#8C7853]">Ambiance</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60" />
                <span className="hidden xl:inline">Sound</span>
              </>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light Salon' : 'Switch to Nocturne Room'}
            className="p-2 text-[#706B63] dark:text-[#9F998F] hover:text-[#181715] dark:hover:text-[#F3F0E6] transition-colors rounded hover:bg-[#EFECE5] dark:hover:bg-[#201D1A]"
            aria-label="Toggle light or dark theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Order Status Quick Icon on Mobile/Desktop */}
          <button
            onClick={onOpenOrderStatus}
            title="Consignment & Order Status"
            className="p-2 text-[#706B63] dark:text-[#9F998F] hover:text-[#181715] dark:hover:text-[#F3F0E6] transition-colors rounded hover:bg-[#EFECE5] dark:hover:bg-[#201D1A]"
            aria-label="Track order status"
          >
            <Truck className="w-4 h-4" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="p-2 text-[#706B63] dark:text-[#9F998F] hover:text-[#181715] dark:hover:text-[#F3F0E6] transition-colors relative rounded hover:bg-[#EFECE5] dark:hover:bg-[#201D1A]"
            aria-label="View curated wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8C7853] text-[#FAF9F5] text-[9px] font-sans-luxury flex items-center justify-center font-semibold">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Reserve Appointment CTA */}
          <button
            onClick={onOpenSalonBooking}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase font-sans-luxury text-[#181715] dark:text-[#F3F0E6] border border-[#C8C2B7] dark:border-[#403B35] hover:border-[#181715] dark:hover:border-[#FAF9F5] transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3 h-3 text-[#8C7853]" />
            <span>Salon Privé</span>
          </button>

          {/* Shopping Bag Button (Zone 3 Primary Action) */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium tracking-[0.12em] uppercase bg-[#181715] text-[#FAF9F5] hover:bg-[#33302B] dark:bg-[#F3F0E6] dark:text-[#181715] dark:hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag</span>
            <span className="text-[11px] font-mono tabular-nums opacity-90">({cartCount})</span>
          </button>
        </div>

      </div>
    </header>
  );
};
