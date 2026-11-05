import React from 'react';
import { ShoppingBag, Heart, Volume2, VolumeX, Sparkles, Moon, Sun, Truck, User, Crown, Music2 } from 'lucide-react';
import { atelierAudio, luxuryAudio } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import { LuxeLogo } from './LuxeLogo';

export type NavigationPage = 'exhibition' | 'women' | 'men' | 'parfumerie' | 'lookbook' | 'elite' | 'soundscape' | 'salons' | 'market-index' | 'all';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  activePage?: NavigationPage;
  onNavigatePage?: (page: NavigationPage) => void;
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
  activePage = 'exhibition',
  onNavigatePage,
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
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(luxuryAudio.getIsPlaying());
  const { user, profile } = useAuth();

  React.useEffect(() => {
    const unsub = luxuryAudio.subscribe((playing) => {
      setIsPlayingAudio(playing);
    });
    return () => unsub();
  }, []);

  const handleToggleAudio = () => {
    luxuryAudio.toggle();
  };

  const handleNavClick = (e: React.MouseEvent, page: NavigationPage) => {
    e.preventDefault();
    if (onNavigatePage) {
      onNavigatePage(page);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 dark:bg-[#141311]/95 backdrop-blur-md border-b border-[#E8E4DC] dark:border-[#272421] transition-colors duration-200">
      {/* Editorial Announcement Bar */}
      <div className="bg-[#1C1B19] text-[#EAE6DE] dark:bg-[#0C0B0A] py-1.5 px-4 text-center text-[11px] tracking-[0.2em] uppercase font-sans-luxury flex items-center justify-center gap-3">
        <button
          onClick={(e) => handleNavClick(e, 'exhibition')}
          className="hover:text-[#C5B492] text-[#EAE6DE] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-[#C5B492]" />
          <span className="font-semibold text-[#D4AF37]">Exhibition MMXXVI · Welcome & Privileges</span>
        </button>
        <span aria-hidden="true" className="opacity-40">·</span>
        <button
          onClick={onOpenAuthModal}
          className="hover:text-[#C5B492] text-[#E0D5BE] transition-colors cursor-pointer flex items-center gap-1 font-semibold"
        >
          <Crown className="w-3 h-3 text-[#C5B492]" />
          <span>{user ? `Client: ${profile?.displayName?.split(' ')[0] || 'VIP'} (${profile?.clientTier || 'Elite'})` : 'Sign In / Espace Client'}</span>
        </button>
        <span aria-hidden="true" className="opacity-40 hidden sm:inline">·</span>
        <button
          onClick={(e) => handleNavClick(e, 'elite')}
          className="hover:text-[#C5B492] text-[#E0D5BE] transition-colors cursor-pointer hidden sm:flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-[#C5B492]" />
          <span>Maison Elite</span>
        </button>
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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-18 flex items-center justify-between gap-4">
        
        {/* Zone 1: Wordmark with new LUXE LAYOUT Emblem Logo */}
        <button
          onClick={(e) => handleNavClick(e, 'exhibition')}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0 text-left cursor-pointer"
          title="LUXE LAYOUT · 14 Place Vendôme Paris"
        >
          <LuxeLogo size="md" variant="horizontal" showSubtitle={false} />
        </button>

        {/* Zone 2: Navigation Links for multi-page exhibition */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-4.5 text-[11px] xl:text-[12px] tracking-[0.16em] uppercase font-sans-luxury">
          <button
            onClick={(e) => handleNavClick(e, 'exhibition')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 py-1 px-1.5 border-b-2 ${
              activePage === 'exhibition'
                ? 'border-[#8C7853] text-[#8C7853] dark:text-[#C5B492] font-semibold'
                : 'border-transparent text-[#605B54] dark:text-[#A7A096] hover:text-[#181715] dark:hover:text-[#F3F0E6]'
            }`}
          >
            <span>Exhibition & Privileges</span>
          </button>
          
          <button
            onClick={(e) => handleNavClick(e, 'women')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 py-1 px-1.5 border-b-2 ${
              activePage === 'women'
                ? 'border-[#8C7853] text-[#8C7853] dark:text-[#C5B492] font-semibold'
                : 'border-transparent text-[#605B54] dark:text-[#A7A096] hover:text-[#181715] dark:hover:text-[#F3F0E6]'
            }`}
          >
            <span>Femme (Women)</span>
          </button>

          <button
            onClick={(e) => handleNavClick(e, 'men')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 py-1 px-1.5 border-b-2 ${
              activePage === 'men'
                ? 'border-[#8C7853] text-[#8C7853] dark:text-[#C5B492] font-semibold'
                : 'border-transparent text-[#605B54] dark:text-[#A7A096] hover:text-[#181715] dark:hover:text-[#F3F0E6]'
            }`}
          >
            <span>Homme (Men)</span>
          </button>

          <button
            onClick={(e) => handleNavClick(e, 'lookbook')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 px-1.5 border-b-2 ${
              activePage === 'lookbook'
                ? 'border-[#8C7853] text-[#8C7853] dark:text-[#C5B492] font-semibold'
                : 'border-transparent text-[#605B54] dark:text-[#A7A096] hover:text-[#181715] dark:hover:text-[#F3F0E6]'
            }`}
          >
            Lookbook
          </button>

          <button
            onClick={(e) => handleNavClick(e, 'parfumerie')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 px-1.5 border-b-2 ${
              activePage === 'parfumerie'
                ? 'border-[#8C7853] text-[#8C7853] dark:text-[#C5B492] font-semibold'
                : 'border-transparent text-[#605B54] dark:text-[#A7A096] hover:text-[#181715] dark:hover:text-[#F3F0E6]'
            }`}
          >
            Parfumerie
          </button>

          <button
            onClick={(e) => handleNavClick(e, 'elite')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 px-1.5 border-b-2 ${
              activePage === 'elite'
                ? 'border-[#8C7853] text-[#8C7853] dark:text-[#C5B492] font-semibold'
                : 'border-transparent text-[#605B54] dark:text-[#A7A096] hover:text-[#181715] dark:hover:text-[#F3F0E6]'
            }`}
          >
            Luxe Elite
          </button>

          {/* Dedicated Music Tab (Salon Musique) */}
          <button
            onClick={(e) => handleNavClick(e, 'soundscape')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 py-1 px-2 rounded-xs border-b-2 ${
              activePage === 'soundscape'
                ? 'border-[#8C7853] bg-[#8C7853]/10 text-[#8C7853] dark:text-[#D4AF37] font-semibold'
                : 'border-transparent text-[#605B54] dark:text-[#A7A096] hover:text-[#181715] dark:hover:text-[#F3F0E6]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-[#8C7853]" />
            <span>Salon Musique</span>
          </button>

          <button
            onClick={(e) => handleNavClick(e, 'market-index')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer uppercase py-1 px-1.5 border-b-2 ${
              activePage === 'market-index'
                ? 'border-[#8C7853] text-[#8C7853] dark:text-[#C5B492] font-semibold'
                : 'border-transparent text-[#605B54] dark:text-[#A7A096] hover:text-[#181715] dark:hover:text-[#F3F0E6]'
            }`}
          >
            Market Index
          </button>

          <button
            onClick={(e) => handleNavClick(e, 'all')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 px-1.5 border-b-2 ${
              activePage === 'all'
                ? 'border-[#8C7853] text-[#8C7853] dark:text-[#C5B492] font-semibold'
                : 'border-transparent text-[#8C7853]/80 hover:text-[#181715] dark:hover:text-[#F3F0E6]'
            }`}
          >
            Continuous
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
          
          {/* Salon Musique Audio Tab Quick Link */}
          <button
            onClick={(e) => handleNavClick(e, 'soundscape')}
            title="Open Salon Musique tab (Dedicated acoustic sanctuary)"
            className={`flex items-center gap-1.5 px-2 py-1 text-[11px] uppercase tracking-[0.12em] transition-colors rounded ${
              activePage === 'soundscape'
                ? 'bg-[#8C7853]/20 text-[#8C7853] dark:text-[#D4AF37] font-semibold'
                : 'text-[#706B63] dark:text-[#9F998F] hover:text-[#181715] dark:hover:text-[#F3F0E6] hover:bg-[#EFECE5] dark:hover:bg-[#201D1A]'
            }`}
            aria-label="Open Salon Musique tab"
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#8C7853] animate-pulse" />
                <span className="hidden xl:inline text-[#8C7853]">Musique</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60" />
                <span className="hidden xl:inline">Musique</span>
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
