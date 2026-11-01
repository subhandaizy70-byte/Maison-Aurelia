import React, { useState, useEffect } from 'react';
import { Product, CartItem } from './types/fashion';
import { PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CollectionGrid } from './components/CollectionGrid';
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
import { MaisonStylistBot, consultAlice } from './components/MaisonStylistBot';

export default function App() {
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

  // Cumulative client checkout patronage addition
  const [completedCheckoutSpend, setCompletedCheckoutSpend] = useState<number>(0);

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

  // Wishlist operations
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleExploreCollection = () => {
    const el = document.getElementById('collections');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewLookbook = () => {
    const el = document.getElementById('lookbook');
    el?.scrollIntoView({ behavior: 'smooth' });
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
      
      {/* Top Header */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSalonBooking={() => setIsSalonModalOpen(true)}
        onOpenOrderStatus={() => handleOpenOrderStatus()}
        onOpenMarketComparator={() => setIsMarketComparatorModalOpen(true)}
        onOpenAliceBot={() => consultAlice(undefined, true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Campaign Hero */}
        <Hero
          onExploreCollection={handleExploreCollection}
          onViewLookbook={handleViewLookbook}
          onOpenSalonBooking={() => setIsSalonModalOpen(true)}
        />

        {/* LUXE Interior & Wardrobe Design Philosophy */}
        <LuxeDesignSection
          onExploreCollection={handleExploreCollection}
          onOpenSalonBooking={() => setIsSalonModalOpen(true)}
        />

        {/* Featured Collection & Filtering */}
        <CollectionGrid
          onSelectProduct={(product) => setSelectedProduct(product)}
          onQuickAdd={handleQuickAdd}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
        />

        {/* Runway & Editorial Lookbook */}
        <LookbookSection
          onSelectProduct={(product) => setSelectedProduct(product)}
          onOpenSalonBooking={() => setIsSalonModalOpen(true)}
        />

        {/* The Parisian Savoir-Faire & Craft */}
        <AtelierStory
          onOpenSalonBooking={() => setIsSalonModalOpen(true)}
        />

        {/* Global Luxury Price & Multi-House Valuation Comparator */}
        <MarketComparator
          isStandaloneSection={true}
        />

        {/* Maison Elite Loyalty & Cumulative Patronage Program */}
        <MaisonEliteSection
          onOpenOrderStatus={(orderId) => handleOpenOrderStatus(orderId)}
          onOpenSalonBooking={() => setIsSalonModalOpen(true)}
          externalSpend={completedCheckoutSpend}
        />

        {/* Global Salons & Appointments */}
        <SalonsSection
          onOpenSalonBooking={() => setIsSalonModalOpen(true)}
        />
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
        onOrderCompleted={(order) => {
          setCompletedCheckoutSpend((prev) => prev + order.amount);
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

      {/* Alice · Private AI Concierge & Stylist Bot */}
      <MaisonStylistBot
        onOpenSalonBooking={() => setIsSalonModalOpen(true)}
        onOpenOrderStatus={() => handleOpenOrderStatus()}
      />

    </div>
  );
}
