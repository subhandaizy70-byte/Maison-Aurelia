import React from 'react';
import { ShoppingBag, Heart, Volume2, VolumeX, Sparkles, Moon, Sun, Truck, TrendingDown, User, Crown } from 'lucide-react';
import { atelierAudio } from '../utils/audio';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSalonBooking: () => void;
  onOpenOrderStatus: () => void;
  onOpenMarketComparator: () => void;
  onOpenAliceBot?: () => void;
  onOpenAuthModal: () => void;
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
  onOpenAliceBot,
  onOpenAuthModal,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);
  const { user, profile } = useAuth();

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
        <button
          onClick={onOpenAuthModal}
          className="hover:text-[#C5B492] text-[#E0D5BE] transition-colors cursor-pointer flex items-center gap-1 font-semibold"
        >
          <Crown className="w-3 h-3 text-[#C5B492]" />
          <span>{user ? `Client: ${profile?.displayName?.split(' ')[0] || 'VIP'} (${profile?.clientTier || 'Elite'})` : 'Sign In / Espace Client Privé'}</span>
        </button>
        <span aria-hidden="true" className="opacity-40 hidden sm:inline">·</span>
        <a
          href="#maison-elite"
          className="hover:text-[#C5B492] text-[#E0D5BE] transition-colors cursor-pointer hidden sm:flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-[#C5B492]" />
          <span>Maison Elite</span>
        </a>
        <span aria-hidden="true" className="opacity-40 hidden sm:inline">·</span>
        <button
          onClick={onOpenOrderStatus}
          className="underline hover:text-white transition-colors cursor-pointer flex items-center gap-1"
        >
          <Truck className="w-3 h-3 text-[#8C7853]" />
          <span>Track Order</span>
        </button>
        <span aria-hidden="true" className="opacity-40">·</span>
        <button
          onClick={onOpenAliceBot}
          className="hover:text-[#D4AF37] text-[#E0D5BE] transition-colors cursor-pointer flex items-center gap-1.5"
          title="Consult Madame Alice · Place Vendôme Stylist"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span>Alice · Private Stylist</span>
        </button>
      </div>

      {/* Top Bar Contract: Zone 1 (Brand with Short Logo) — Zone 2 (Nav Links) — Zone 3 (Utilities) */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-18 flex items-center justify-between gap-6">
        
        {/* Zone 1: Wordmark with new Maison Aurelia Short Logo */}
        <a
          href="/"
          className="flex items-center gap-2.5 hover:opacity-85 transition-opacity shrink-0"
          title="Maison Aurelia · 14 Place Vendôme Paris"
        >
          <img
            src="/assets/images/maison_aurelia_short_logo.jpg"
            alt="Maison Aurelia Paris"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#C5B492]/80 object-cover shadow-sm"
          />
          <span className="text-xl sm:text-2xl lg:text-[25px] tracking-[0.22em] uppercase font-serif-luxury text-[#181715] dark:text-[#F3F0E6] whitespace-nowrap">
            Maison Aurelia
          </span>
        </a>

        {/* Zone 2: Navigation Links with distinct Femme and Homme sections */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-[12px] lg:text-[13px] tracking-[0.16em] uppercase font-sans-luxury text-[#605B54] dark:text-[#A7A096]">
          <a
            href="#collection-women"
            className="hover:text-[#181715] dark:hover:text-[#F3F0E6] text-[#8C7853] dark:text-[#C5B492] font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <span>Femme (Women)</span>
          </a>
          <a
            href="#collection-men"
            className="hover:text-[#181715] dark:hover:text-[#F3F0E6] text-[#8C7853] dark:text-[#C5B492] font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <span>Homme (Men)</span>
          </a>
          <a
            href="#lookbook"
            className="hover:text-[#181715] dark:hover:text-[#F3F0E6] transition-colors whitespace-nowrap shrink-0"
          >
            Lookbook
          </a>
          <a
            href="#parfumerie"
            className="hover:text-[#181715] dark:hover:text-[#F3F0E6] transition-colors whitespace-nowrap shrink-0"
          >
            Parfumerie
          </a>
          <a
            href="#maison-elite"
            className="hover:text-[#181715] dark:hover:text-[#F3F0E6] transition-colors whitespace-nowrap shrink-0"
          >
            Maison Elite
          </a>
          <button
            onClick={onOpenMarketComparator}
            className="hover:text-[#181715] dark:hover:text-[#F3F0E6] transition-colors whitespace-nowrap shrink-0 uppercase cursor-pointer"
          >
            Market Index
          </button>
        </nav>

        {/* Zone 3: Actions, Account & Bag */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          
          {/* Dior-style Client Account / Login Trigger */}
          <button
            onClick={onOpenAuthModal}
            title={user ? 'Mon Compte Client & Historique de Paiement' : 'Sign In / Register Account'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] uppercase tracking-wider font-sans-luxury border border-[#C8C2B7] dark:border-[#38332E] hover:border-[#8C7853] text-[#181715] dark:text-[#FAF8F3] transition-colors rounded cursor-pointer bg-[#FAF9F5]/70 dark:bg-[#181614]/70"
          >
            <User className="w-3.5 h-3.5 text-[#8C7853]" />
            <span className="hidden sm:inline">
              {user ? (profile?.displayName?.split(' ')[0] || 'Compte') : 'Sign In'}
            </span>
          </button>
          
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

          {/* Alice · AI Concierge Trigger */}
          <button
            onClick={onOpenAliceBot}
            title="Consult Alice · Private Client Advisor"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] tracking-[0.14em] uppercase font-sans-luxury text-[#8C7853] dark:text-[#C5B492] hover:text-[#181715] dark:hover:text-[#FAF8F3] bg-[#8C7853]/10 dark:bg-[#8C7853]/15 border border-[#8C7853]/30 hover:border-[#8C7853] transition-colors rounded cursor-pointer whitespace-nowrap"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Sparkles className="w-3 h-3 text-[#8C7853]" />
            <span className="hidden sm:inline font-medium">Alice</span>
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
