import React, { useState, useEffect } from 'react';
import { Product, CartItem } from './types/fashion';
import { PRODUCTS } from './data/products';
import { Header, NavigationPage } from './components/Header';
import { Hero } from './components/Hero';
import { ExhibitionIntroPage } from './components/ExhibitionIntroPage';
import { WomenSection } from './components/WomenSection';
import { MenSection } from './components/MenSection';
import { CollectionGrid } from './components/CollectionGrid';
import { FragranceSection } from './components/FragranceSection';
import { LookbookSection } from './components/LookbookSection';
import { AtelierStory } from './components/AtelierStory';
import { LuxeDesignSection } from './components/LuxeDesignSection';
import { MarketComparator } from './components/MarketComparator';
import { SalonsSection } from './components/SalonsSection';
import { MaisonEliteSection } from './components/MaisonEliteSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SalonBookingModal } from './components/SalonBookingModal';
import { OrderStatusModal } from './components/OrderStatusModal';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MaisonStylistBot, consultAlice } from './components/MaisonStylistBot';
import { SoundscapeSection } from './components/SoundscapeSection';

function AppContent() {
  const { savedCards, profile, recordPaymentOrder } = useAuth();

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('maison_theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('maison_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('maison_theme', 'light');
    }
  }, [isDarkMode]);

  // Shopping Bag state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // The Sculptural Hourglass Coat
      selectedSize: 'FR 36 (US 4)',
      quantity: 1,
      monogram: 'G.D.'
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(['bag-vendome-caramel', 'dress-silk-slip-champagne']);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Active product inspection modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Salon Booking modal
  const [isSalonModalOpen, setIsSalonModalOpen] = useState(false);

  // Order Status Lookup modal
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('MA-CMD-849201');

  // Market Comparator Modal
  const [isMarketComparatorModalOpen, setIsMarketComparatorModalOpen] = useState(false);

  // Auth / Dior-style Client Account Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Cumulative client checkout patronage addition (initialized to €4,200 from recent LV Alpine jacket commission)
  const [completedCheckoutSpend, setCompletedCheckoutSpend] = useState<number>(4200);

  // Cart operations
  const handleAddToCart = (product: Product, size: string, monogram?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
          monogram: monogram || next[existingIndex].monogram
        };
        return next;
      } else {
        return [...prev, { product, selectedSize: size, quantity: 1, monogram }];
      }
    });
    setIsCartOpen(true);
  };

  const handleQuickAdd = (product: Product) => {
    const defaultSize = product.sizes[0] || 'Standard';
    handleAddToCart(product, defaultSize);
  };

  const handleUpdateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string, size: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Active exhibition page / pavilion routing for visitors
  const [activePage, setActivePage] = useState<NavigationPage>('exhibition');

  const handleNavigatePage = (page: NavigationPage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wishlist operations
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleExploreCollection = () => {
    handleNavigatePage('women');
  };

  const handleExploreWomen = () => {
    handleNavigatePage('women');
  };

  const handleExploreMen = () => {
    handleNavigatePage('men');
  };

  const handleViewLookbook = () => {
    handleNavigatePage('lookbook');
  };

  const handleOpenOrderStatus = (orderId?: string) => {
    if (orderId) {
      setTrackingOrderId(orderId);
    }
    setIsOrderStatusOpen(true);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#161513] dark:bg-[#141311] dark:text-[#FAF8F3] transition-colors duration-200 flex flex-col font-sans-luxury">
      
      {/* Top Header with multi-page navigation props */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        activePage={activePage}
        onNavigatePage={handleNavigatePage}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSalonBooking={() => setIsSalonModalOpen(true)}
        onOpenOrderStatus={() => handleOpenOrderStatus()}
        onOpenMarketComparator={() => setIsMarketComparatorModalOpen(true)}
        onOpenAliceBot={() => consultAlice(undefined, true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Exhibition Pavilion Switcher Bar (Instant Access for Tomorrow's Exhibition Guests) */}
      <div className="bg-[#F0ECE1] dark:bg-[#1A1816] border-b border-[#E2DDD3] dark:border-[#2C2926] py-2 px-4 sm:px-6 sticky top-25 z-30 shadow-xs">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-[#8C7853] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#8C7853] dark:text-[#C5B492] font-semibold whitespace-nowrap">
              Exhibition Pavilion Directory:
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => handleNavigatePage('exhibition')}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                activePage === 'exhibition'
                  ? 'bg-[#181715] text-[#FAF9F5] border-[#181715] dark:bg-[#FAF9F5] dark:text-[#181715] dark:border-[#FAF9F5] font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-[#25221F] text-[#4F4B45] dark:text-[#C5BFB5] border-[#DCD5C9] dark:border-[#38332E] hover:border-[#8C7853]'
              }`}
            >
              🏛️ Exhibition & Privileges
            </button>

            <button
              onClick={() => handleNavigatePage('women')}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                activePage === 'women'
                  ? 'bg-[#181715] text-[#FAF9F5] border-[#181715] dark:bg-[#FAF9F5] dark:text-[#181715] dark:border-[#FAF9F5] font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-[#25221F] text-[#4F4B45] dark:text-[#C5BFB5] border-[#DCD5C9] dark:border-[#38332E] hover:border-[#8C7853]'
              }`}
            >
              👗 Femme (42)
            </button>

            <button
              onClick={() => handleNavigatePage('men')}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                activePage === 'men'
                  ? 'bg-[#181715] text-[#FAF9F5] border-[#181715] dark:bg-[#FAF9F5] dark:text-[#181715] dark:border-[#FAF9F5] font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-[#25221F] text-[#4F4B45] dark:text-[#C5BFB5] border-[#DCD5C9] dark:border-[#38332E] hover:border-[#8C7853]'
              }`}
            >
              👔 Homme (33)
            </button>

            <button
              onClick={() => handleNavigatePage('lookbook')}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                activePage === 'lookbook'
                  ? 'bg-[#181715] text-[#FAF9F5] border-[#181715] dark:bg-[#FAF9F5] dark:text-[#181715] dark:border-[#FAF9F5] font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-[#25221F] text-[#4F4B45] dark:text-[#C5BFB5] border-[#DCD5C9] dark:border-[#38332E] hover:border-[#8C7853]'
              }`}
            >
              📖 Lookbook
            </button>

            <button
              onClick={() => handleNavigatePage('parfumerie')}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                activePage === 'parfumerie'
                  ? 'bg-[#181715] text-[#FAF9F5] border-[#181715] dark:bg-[#FAF9F5] dark:text-[#181715] dark:border-[#FAF9F5] font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-[#25221F] text-[#4F4B45] dark:text-[#C5BFB5] border-[#DCD5C9] dark:border-[#38332E] hover:border-[#8C7853]'
              }`}
            >
              💎 Parfumerie
            </button>

            <button
              onClick={() => handleNavigatePage('elite')}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                activePage === 'elite'
                  ? 'bg-[#181715] text-[#FAF9F5] border-[#181715] dark:bg-[#FAF9F5] dark:text-[#181715] dark:border-[#FAF9F5] font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-[#25221F] text-[#4F4B45] dark:text-[#C5BFB5] border-[#DCD5C9] dark:border-[#38332E] hover:border-[#8C7853]'
              }`}
            >
              👑 Maison Elite
            </button>

            <button
              onClick={() => handleNavigatePage('salons')}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                activePage === 'salons'
                  ? 'bg-[#181715] text-[#FAF9F5] border-[#181715] dark:bg-[#FAF9F5] dark:text-[#181715] dark:border-[#FAF9F5] font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-[#25221F] text-[#4F4B45] dark:text-[#C5BFB5] border-[#DCD5C9] dark:border-[#38332E] hover:border-[#8C7853]'
              }`}
            >
              🏛️ Salons
            </button>

            <button
              onClick={() => handleNavigatePage('market-index')}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                activePage === 'market-index'
                  ? 'bg-[#181715] text-[#FAF9F5] border-[#181715] dark:bg-[#FAF9F5] dark:text-[#181715] dark:border-[#FAF9F5] font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-[#25221F] text-[#4F4B45] dark:text-[#C5BFB5] border-[#DCD5C9] dark:border-[#38332E] hover:border-[#8C7853]'
              }`}
            >
              📊 Market Index
            </button>

            <button
              onClick={() => handleNavigatePage('all')}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                activePage === 'all'
                  ? 'bg-[#8C7853] text-[#FAF9F5] border-[#8C7853] font-semibold shadow-xs'
                  : 'bg-[#8C7853]/10 text-[#8C7853] dark:text-[#D4AF37] border-[#8C7853]/30 hover:border-[#8C7853]'
              }`}
            >
              📜 Continuous Runway (All)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Sections according to Active Page */}
      <main className="flex-1">
        
        {/* 1. EXHIBITION INTRO & PRIVILEGES PAGE */}
        {activePage === 'exhibition' && (
          <ExhibitionIntroPage
            onNavigatePage={handleNavigatePage}
            onOpenSalonBooking={() => setIsSalonModalOpen(true)}
            onOpenAliceBot={() => consultAlice(undefined, true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* 2. UNIVERS FEMME DEDICATED PAGE */}
        {activePage === 'women' && (
          <div className="py-4">
            <WomenSection
              onSelectProduct={(product) => setSelectedProduct(product)}
              onQuickAdd={handleQuickAdd}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
            />
          </div>
        )}

        {/* 3. UNIVERS HOMME DEDICATED PAGE */}
        {activePage === 'men' && (
          <div className="py-4">
            <MenSection
              onSelectProduct={(product) => setSelectedProduct(product)}
              onQuickAdd={handleQuickAdd}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
            />
          </div>
        )}

        {/* 4. RUNWAY & EDITORIAL LOOKBOOK */}
        {activePage === 'lookbook' && (
          <div className="py-4">
            <LookbookSection
              onSelectProduct={(product) => setSelectedProduct(product)}
              onOpenSalonBooking={() => setIsSalonModalOpen(true)}
            />
          </div>
        )}

        {/* 5. HAUTE PARFUMERIE & OLFACTORY ATELIER */}
        {activePage === 'parfumerie' && (
          <div className="py-4">
            <FragranceSection
              onSelectProduct={(product) => setSelectedProduct(product)}
              onOpenSalonBooking={() => setIsSalonModalOpen(true)}
            />
          </div>
        )}

        {/* 6. MAISON ELITE PATRONAGE & CLIENT PRIVILEGES */}
        {activePage === 'elite' && (
          <div className="py-4">
            <MaisonEliteSection
              onOpenOrderStatus={(orderId) => handleOpenOrderStatus(orderId)}
              onOpenSalonBooking={() => setIsSalonModalOpen(true)}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onSelectProduct={(product) => setSelectedProduct(product)}
              externalSpend={completedCheckoutSpend}
              completedCheckoutSpend={completedCheckoutSpend}
              onUpdateCheckoutSpend={(newAmount) => setCompletedCheckoutSpend(newAmount)}
            />
          </div>
        )}

        {/* 6.5 DEDICATED SOUNDSCAPE TAB (SALON MUSIQUE) */}
        {activePage === 'soundscape' && (
          <SoundscapeSection
            onNavigatePage={(page) => handleNavigatePage(page)}
            onOpenSalonBooking={() => setIsSalonModalOpen(true)}
          />
        )}

        {/* 7. GLOBAL SALONS PRIVÉS */}
        {activePage === 'salons' && (
          <div className="py-4">
            <SalonsSection
              onOpenSalonBooking={() => setIsSalonModalOpen(true)}
            />
          </div>
        )}

        {/* 8. MARKET COMPARATOR & GLOBAL LUXURY INDEX */}
        {activePage === 'market-index' && (
          <div className="py-8">
            <MarketComparator
              isStandaloneSection={true}
            />
          </div>
        )}

        {/* 9. CONTINUOUS RUNWAY SHOWCASE (ALL SECTIONS) */}
        {activePage === 'all' && (
          <>
            {/* Campaign Hero */}
            <Hero
              onExploreCollection={handleExploreCollection}
              onExploreWomen={handleExploreWomen}
              onExploreMen={handleExploreMen}
              onViewLookbook={handleViewLookbook}
              onOpenSalonBooking={() => setIsSalonModalOpen(true)}
            />

            {/* LUXE Interior & Wardrobe Design Philosophy */}
            <LuxeDesignSection
              onExploreCollection={handleExploreCollection}
              onOpenSalonBooking={() => setIsSalonModalOpen(true)}
            />

            {/* Global Collections Anchor */}
            <div id="collections" className="scroll-mt-18" />

            {/* Univers Femme */}
            <WomenSection
              onSelectProduct={(product) => setSelectedProduct(product)}
              onQuickAdd={handleQuickAdd}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
            />

            {/* Univers Homme */}
            <MenSection
              onSelectProduct={(product) => setSelectedProduct(product)}
              onQuickAdd={handleQuickAdd}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
            />

            {/* Haute Parfumerie */}
            <FragranceSection
              onSelectProduct={(product) => setSelectedProduct(product)}
              onOpenSalonBooking={() => setIsSalonModalOpen(true)}
            />

            {/* Runway & Editorial Lookbook */}
            <LookbookSection
              onSelectProduct={(product) => setSelectedProduct(product)}
              onOpenSalonBooking={() => setIsSalonModalOpen(true)}
            />

            {/* Parisian Savoir-Faire */}
            <AtelierStory
              onOpenSalonBooking={() => setIsSalonModalOpen(true)}
            />

            {/* Global Luxury Price Comparator */}
            <MarketComparator
              isStandaloneSection={true}
            />

            {/* Maison Elite */}
            <MaisonEliteSection
              onOpenOrderStatus={(orderId) => handleOpenOrderStatus(orderId)}
              onOpenSalonBooking={() => setIsSalonModalOpen(true)}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onSelectProduct={(product) => setSelectedProduct(product)}
              externalSpend={completedCheckoutSpend}
              completedCheckoutSpend={completedCheckoutSpend}
              onUpdateCheckoutSpend={(newAmount) => setCompletedCheckoutSpend(newAmount)}
            />

            {/* Salons Privés */}
            <SalonsSection
              onOpenSalonBooking={() => setIsSalonModalOpen(true)}
            />
          </>
        )}
      </main>

      {/* Haute Couture Footer */}
      <Footer
        onOpenSalonBooking={() => setIsSalonModalOpen(true)}
        onOpenOrderStatus={() => handleOpenOrderStatus()}
        onOpenMarketComparator={() => setIsMarketComparatorModalOpen(true)}
      />

      {/* Interactive Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onTrackOrder={(id) => handleOpenOrderStatus(id)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOrderCompleted={async (order) => {
          setCompletedCheckoutSpend((prev) => prev + order.amount);
          try {
            const defaultCard = savedCards.find((c) => c.isDefault) || savedCards[0];
            await recordPaymentOrder({
              orderId: order.id,
              customerEmail: profile?.email || 'client.vendome@maisonaurelia.co',
              customerName: profile?.displayName || 'Client Privé',
              totalAmount: order.amount,
              currency: 'EUR',
              paymentStatus: 'Settled / Confirmed',
              paymentMethod: defaultCard ? `${defaultCard.cardBrand} (•••• ${defaultCard.last4})` : 'Carte Noire Concierge',
              paymentReference: `PAY-TX-${order.id}`,
              cardBrand: defaultCard?.cardBrand || 'Carte Noire Centurion',
              cardLast4: defaultCard?.last4 || '8820',
              itemCount: order.items.length,
              items: order.items.join(', '),
              shippingAddress: '14 Place Vendôme, 75001 Paris, France',
            });
          } catch (err) {
            console.warn('Payment order record synchronized with local session:', err);
          }
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        onRemoveWishlist={handleToggleWishlist}
        onSelectProduct={(product) => setSelectedProduct(product)}
        onQuickAdd={handleQuickAdd}
      />

      <SalonBookingModal
        isOpen={isSalonModalOpen}
        onClose={() => setIsSalonModalOpen(false)}
      />

      <OrderStatusModal
        isOpen={isOrderStatusOpen}
        onClose={() => setIsOrderStatusOpen(false)}
        prefillOrderId={trackingOrderId}
        onOpenMarketComparator={() => {
          setIsOrderStatusOpen(false);
          setIsMarketComparatorModalOpen(true);
        }}
      />

      <MarketComparator
        isOpen={isMarketComparatorModalOpen}
        onClose={() => setIsMarketComparatorModalOpen(false)}
      />

      {/* Dior-Inspired Client Account & Payment Methods Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onTrackOrder={(orderId) => handleOpenOrderStatus(orderId)}
      />

      {/* Alice · Private AI Concierge & Stylist Bot */}
      <MaisonStylistBot
        onOpenSalonBooking={() => setIsSalonModalOpen(true)}
        onOpenOrderStatus={() => handleOpenOrderStatus()}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
