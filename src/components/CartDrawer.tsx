import React, { useState, useEffect } from 'react';
import { CartItem } from '../types/fashion';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Gift, 
  CreditCard, 
  Lock, 
  Truck, 
  Crown, 
  User as UserIcon,
  Sparkles
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearCart: () => void;
  onTrackOrder?: (orderId: string) => void;
  onOrderCompleted?: (order: { id: string; amount: number; items: string[] }) => void;
  onOpenAuthModal?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onTrackOrder,
  onOrderCompleted,
  onOpenAuthModal,
}) => {
  const { 
    user, 
    profile, 
    savedCards, 
    signInWithGoogle, 
    signInAsVIPGuest, 
    createFullAccessAccount, 
    recordPaymentOrder 
  } = useAuth();

  const [includeGiftWrap, setIncludeGiftWrap] = useState(true);
  const [giftNote, setGiftNote] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Shipping form state
  const [recipientName, setRecipientName] = useState('Distinguished Patron');
  const [addressLine, setAddressLine] = useState('14 Place Vendôme');
  const [city, setCity] = useState('Paris');
  const [postalCode, setPostalCode] = useState('75001');
  const [country, setCountry] = useState('France');

  // Auto-fill from authenticated user profile
  useEffect(() => {
    if (profile) {
      if (profile.displayName) setRecipientName(profile.displayName);
      if (profile.billingAddress) {
        setAddressLine(profile.billingAddress);
      }
    }
    if (savedCards.length > 0) {
      const defaultCard = savedCards.find((c) => c.isDefault) || savedCards[0];
      setSelectedCardId(defaultCard.id);
    }
  }, [profile, savedCards]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    setIsAuthorizing(true);
    const id = `MA-CMD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(id);

    const activeCard = savedCards.find((c) => c.id === selectedCardId) || savedCards[0];
    const itemsSummary = items.map((i) => `${i.product.name} (${i.selectedSize})`).join(', ');

    try {
      await recordPaymentOrder({
        orderId: id,
        customerEmail: user.email || 'client.vendome@maisonaurelia.co',
        customerName: recipientName,
        totalAmount: subtotal,
        currency: 'EUR',
        paymentStatus: 'Settled / Confirmed',
        paymentMethod: activeCard 
          ? `${activeCard.cardBrand} (•••• ${activeCard.last4})` 
          : 'Carte Noire Concierge Terminal · Place Vendôme',
        paymentReference: `DIOR-TX-${id}`,
        cardBrand: activeCard?.cardBrand || 'Carte Noire Dior / Centurion',
        cardLast4: activeCard?.last4 || '8826',
        itemCount: items.length,
        items: itemsSummary,
        shippingAddress: `${addressLine}, ${postalCode} ${city}, ${country}`
      });
    } catch (err) {
      console.warn('Order recorded in local ledger session:', err);
    }

    setOrderConfirmed(true);
    setIsAuthorizing(false);

    if (onOrderCompleted) {
      onOrderCompleted({
        id,
        amount: subtotal,
        items: items.map((i) => `${i.product.name} (${i.selectedSize})`),
      });
    }
  };

  const handleFinish = () => {
    onClearCart();
    setOrderConfirmed(false);
    setIsCheckingOut(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
      
      {/* Drawer Panel */}
      <div
        className="w-full max-w-xl bg-[#FAF9F5] dark:bg-[#151311] h-full shadow-2xl flex flex-col justify-between border-l border-[#E2DDD3] dark:border-[#282522] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E8E4DC] dark:border-[#272421] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#8C7853]" />
            <h3 className="text-sm uppercase tracking-[0.2em] font-sans-luxury font-medium text-[#181715] dark:text-[#FAF8F3]">
              {isCheckingOut ? 'Curated Checkout' : 'Your Shopping Bag'}
            </h3>
            <span className="text-xs font-mono tabular-nums text-[#878177]">
              ({items.reduce((s, i) => s + i.quantity, 0)})
            </span>
          </div>

          <button
            onClick={() => {
              if (orderConfirmed) handleFinish();
              else onClose();
            }}
            className="p-1.5 text-[#706B63] hover:text-[#181715] dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close bag drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {orderConfirmed ? (
            /* Order Receipt View */
            <div className="py-8 text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#8C7853]/15 text-[#8C7853] flex items-center justify-center border border-[#C5B492]">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492]">
                  Acquisition Confirmed
                </span>
                <h4 className="text-2xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] pt-1">
                  Order Registered with Place Vendôme
                </h4>
                {profile && (
                  <p className="text-xs text-[#8C7853] dark:text-[#C5B492] font-sans-luxury mt-1">
                    Client: {profile.clientTitle || 'Patron'} {profile.displayName} ({profile.clientNumber})
                  </p>
                )}
              </div>

              {/* Order Receipt Card */}
              <div className="p-5 bg-[#F2EFE8] dark:bg-[#1B1917] border border-[#E0DBD0] dark:border-[#2C2926] text-left text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#D5CFC5] dark:border-[#38332E] pb-2">
                  <span className="text-[#878177] uppercase tracking-wider text-[10px]">Order Reference</span>
                  <span className="font-mono font-medium tracking-widest text-[#181715] dark:text-[#FAF8F3]">{orderId}</span>
                </div>

                <div className="flex items-center justify-between border-b border-[#D5CFC5] dark:border-[#38332E] pb-2">
                  <span className="text-[#878177] uppercase tracking-wider text-[10px]">Client Recipient</span>
                  <span className="font-medium text-[#181715] dark:text-[#FAF8F3]">{recipientName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-[#D5CFC5] dark:border-[#38332E] pb-2">
                  <span className="text-[#878177] uppercase tracking-wider text-[10px]">Delivery Destination</span>
                  <span className="text-right text-[#181715] dark:text-[#FAF8F3]">{addressLine}, {city}</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#D5CFC5] dark:border-[#38332E] pt-2">
                  <span className="text-[#878177]">Total Settled</span>
                  <span className="font-mono text-base font-medium text-[#181715] dark:text-[#FAF8F3]">
                    €{subtotal.toLocaleString()} EUR
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#706B63] dark:text-[#9F998F] max-w-sm mx-auto leading-relaxed">
                Your archival garments are being inspected, wrapped in acid-free silk paper, and secured in our embossed cedar-lined box.
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (onTrackOrder) {
                      onTrackOrder(orderId);
                      handleFinish();
                    } else {
                      handleFinish();
                    }
                  }}
                  className="w-full py-3.5 bg-[#8C7853] text-white hover:bg-[#786644] text-xs uppercase tracking-[0.2em] font-sans-luxury font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track This Consignment Live</span>
                </button>

                <button
                  onClick={handleFinish}
                  className="w-full py-3 bg-[#181715] text-[#FAF9F5] hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white text-xs uppercase tracking-[0.2em] font-sans-luxury cursor-pointer"
                >
                  Return to Maison Aurelia
                </button>
              </div>
            </div>
          ) : isCheckingOut ? (
            /* ========================================================= */
            /* CHECKOUT FLOW: GUEST MUST SIGN IN TO COMPLETE PURCHASE   */
            /* ========================================================= */
            !user ? (
              <div className="py-6 px-4 text-center space-y-6 animate-fade-in bg-white dark:bg-[#1A1816] border border-[#C5B492] p-6 shadow-md">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#8C7853]/15 text-[#8C7853] flex items-center justify-center border border-[#C5B492]">
                  <Lock className="w-6 h-6 text-[#8C7853]" />
                </div>
                
                <div>
                  <span className="text-[10px] uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] block">
                    Place Vendôme Client Protocol
                  </span>
                  <h4 className="text-xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] pt-1">
                    Client Account Required to Complete Purchase
                  </h4>
                  <p className="text-xs text-[#706B63] dark:text-[#9F998F] max-w-md mx-auto pt-2 leading-relaxed font-light">
                    You may freely browse and examine all clothes, shoes, bags, and perfumes without an account. To complete your acquisition and register your serialized provenance certificate, please sign in or create an account.
                  </p>
                </div>

                <div className="space-y-3 max-w-sm mx-auto">
                  {/* Google Sign In 1-Click */}
                  <button
                    type="button"
                    onClick={async () => {
                      await signInWithGoogle();
                    }}
                    className="w-full py-3 px-4 bg-white dark:bg-[#25221F] hover:bg-slate-50 dark:hover:bg-[#2F2B26] border border-[#D5CFC5] dark:border-[#3E3933] text-xs font-sans-luxury text-[#181715] dark:text-[#FAF8F3] font-medium flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Standard Sign In / Create Account Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenAuthModal) onOpenAuthModal();
                    }}
                    className="w-full py-3 px-4 bg-[#181715] text-[#FAF9F5] hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white text-xs uppercase tracking-[0.2em] font-sans-luxury font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Create Account / Sign In</span>
                    <ArrowRight className="w-4 h-4 text-[#8C7853]" />
                  </button>

                  {/* 1-Click Unrestricted Master Account */}
                  <button
                    type="button"
                    onClick={async () => {
                      await createFullAccessAccount();
                    }}
                    className="w-full py-2.5 px-3 border border-amber-500 bg-amber-500/15 hover:bg-amber-500/25 text-[#9E6F10] dark:text-[#F3D794] text-xs uppercase tracking-wider font-sans-luxury font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>★ 1-Click Unrestricted Master Account</span>
                  </button>

                  {/* 1-Click VIP Guest Pass */}
                  <button
                    type="button"
                    onClick={async () => {
                      await signInAsVIPGuest();
                    }}
                    className="w-full py-2 px-3 border border-[#D5CFC5] dark:border-[#38332E] hover:border-[#8C7853] text-[#787268] dark:text-[#A7A096] text-[11px] uppercase tracking-wider font-sans-luxury flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#8C7853]" />
                    <span>VIP Client Pass (Madame de Rochechouart)</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-[#706B63] dark:text-[#9F998F]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8C7853]" />
                  <span>256-Bit SSL Encrypted Vault · Bank-Grade Tokenization (Dior Standard)</span>
                </div>
              </div>
            ) : (
              /* Authenticated User Checkout Form */
              <form onSubmit={handleCheckoutSubmit} className="space-y-5 animate-fade-in text-xs">
                
                {/* Authenticated Client Identification Banner */}
                <div className="p-3.5 bg-gradient-to-r from-[#F4EFE6] to-[#EAE3D2] dark:from-[#1E1C19] dark:to-[#171513] border border-[#C5B492] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-sans-luxury text-[#8C7853] dark:text-[#C5B492] block font-semibold">
                      Authenticated Patron
                    </span>
                    <span className="font-serif-luxury text-sm font-semibold text-[#181715] dark:text-[#FAF8F3]">
                      {profile?.displayName || user.displayName || 'Patron'}
                    </span>
                    <span className="text-[10px] font-mono text-[#706B63] dark:text-[#A7A096] ml-2">
                      ({profile?.clientNumber || 'AU-4402'})
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] uppercase font-mono font-bold bg-[#8C7853] text-white rounded">
                    {profile?.hasUnrestrictedAccess ? '★ Unrestricted' : profile?.clientTier || 'Couture Elite'}
                  </span>
                </div>

                <div className="p-3 bg-[#F2EDE2] dark:bg-[#1E1C19] border border-[#E0D9CB] dark:border-[#302C28] flex items-center justify-between">
                  <span className="text-[#8C7853] dark:text-[#C5B492] uppercase tracking-wider text-[11px] font-sans-luxury">
                    Order Summary ({items.length} Silhouettes)
                  </span>
                  <span className="font-mono text-sm font-medium text-[#181715] dark:text-[#FAF8F3]">
                    €{subtotal.toLocaleString()} EUR
                  </span>
                </div>

                <div>
                  <h4 className="text-[11px] uppercase tracking-[0.18em] font-sans-luxury text-[#181715] dark:text-[#FAF8F3] font-semibold mb-3">
                    1. Shipping & White-Glove Delivery
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase text-[#706B63] dark:text-[#9F998F] mb-1">
                        Recipient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full px-3 py-2 bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-[#706B63] dark:text-[#9F998F] mb-1">
                        Street Address & Apartment *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="w-full px-3 py-2 bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase text-[#706B63] dark:text-[#9F998F] mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2 bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#706B63] dark:text-[#9F998F] mb-1">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full px-3 py-2 bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#706B63] dark:text-[#9F998F] mb-1">
                          Country *
                        </label>
                        <input
                          type="text"
                          required
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-3 py-2 bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] uppercase tracking-[0.18em] font-sans-luxury text-[#181715] dark:text-[#FAF8F3] font-semibold mb-3">
                    2. Payment Method
                  </h4>

                  <div className="p-4 border border-[#D5CFC5] dark:border-[#38332E] bg-[#F8F5EE] dark:bg-[#1A1816] space-y-3">
                    <div className="flex items-center justify-between text-[#8C7853] dark:text-[#C5B492]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <CreditCard className="w-4 h-4" />
                        <span>Encrypted Dior-Grade Vault</span>
                      </span>
                      <Lock className="w-3.5 h-3.5" />
                    </div>

                    {/* Saved Cards Selection if available */}
                    {savedCards.length > 0 && (
                      <div className="space-y-2 pb-2 border-b border-[#E0D9CB] dark:border-[#2E2A26]">
                        <span className="block text-[10px] uppercase tracking-wider text-[#706B63] dark:text-[#A7A096]">
                          Saved Place Vendôme Cards
                        </span>
                        {savedCards.map((card) => (
                          <label 
                            key={card.id}
                            className={`p-2.5 border flex items-center justify-between cursor-pointer transition-colors ${
                              selectedCardId === card.id
                                ? 'border-[#8C7853] bg-[#8C7853]/10 dark:bg-[#8C7853]/20'
                                : 'border-[#D5CFC5] dark:border-[#38332E]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="selectedCard"
                                checked={selectedCardId === card.id}
                                onChange={() => setSelectedCardId(card.id)}
                                className="accent-[#8C7853]"
                              />
                              <div>
                                <span className="font-semibold text-xs text-[#181715] dark:text-[#FAF8F3] block">
                                  {card.cardBrand}
                                </span>
                                <span className="font-mono text-[10px] text-[#706B63] dark:text-[#A7A096]">
                                  •••• •••• •••• {card.last4} · Exp: {card.expiry}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-[#8C7853] uppercase font-bold">
                              {card.isDefault ? 'Default' : 'Verified'}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] uppercase text-[#706B63] dark:text-[#9F998F] mb-1">
                        Card Number / Token
                      </label>
                      <input
                        type="text"
                        defaultValue="•••• •••• •••• 1947"
                        className="w-full px-3 py-2 font-mono bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <div>
                        <label className="block text-[10px] uppercase text-[#706B63] dark:text-[#9F998F] mb-1 font-sans">
                          Expires
                        </label>
                        <input
                          type="text"
                          defaultValue="12/28"
                          className="w-full px-3 py-2 bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#706B63] dark:text-[#9F998F] mb-1 font-sans">
                          Security Code (CVV)
                        </label>
                        <input
                          type="text"
                          defaultValue="894"
                          className="w-full px-3 py-2 bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="px-4 py-2.5 text-xs uppercase tracking-wider text-[#706B63] hover:text-[#181715] cursor-pointer"
                  >
                    Back to Bag
                  </button>

                  <button
                    type="submit"
                    disabled={isAuthorizing}
                    className="flex-1 py-3.5 bg-[#181715] text-[#FAF9F5] hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white text-xs uppercase tracking-[0.2em] font-sans-luxury font-medium transition-colors cursor-pointer shadow-md"
                  >
                    <span>{isAuthorizing ? 'Registering Acquisition...' : `Authorize Settlement · €${subtotal.toLocaleString()} EUR`}</span>
                  </button>
                </div>

              </form>
            )
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="py-24 text-center space-y-4">
              <ShoppingBag className="w-10 h-10 mx-auto text-[#8C7853]/60 stroke-1" />
              <div>
                <p className="font-serif-luxury text-xl text-[#181715] dark:text-[#FAF8F3]">
                  Your shopping bag is currently unoccupied.
                </p>
                <p className="text-xs text-[#706B63] dark:text-[#9F998F] pt-1">
                  Browse clothes, shoes, bags, and perfumes freely. Select pieces crafted in Place Vendôme.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#181715] text-[#FAF9F5] dark:bg-white dark:text-[#181715] text-xs uppercase tracking-[0.16em] hover:opacity-90 cursor-pointer shadow"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            /* Items List */
            <div className="space-y-5 divide-y divide-[#EDE9E1] dark:divide-[#272421]">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="pt-5 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-28 sm:w-24 sm:h-32 bg-[#EBE7DF] dark:bg-[#201D1A] shrink-0 overflow-hidden border border-[#D5CFC5] dark:border-[#38332E]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover ${
                        item.product.category === 'shoes' || item.product.category === 'bags'
                          ? 'object-center'
                          : 'object-[center_15%]'
                      }`}
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#8C7853] dark:text-[#C5B492] block">
                            {item.product.categoryLabel}
                          </span>
                          <h4 className="text-sm font-serif-luxury text-[#181715] dark:text-[#FAF8F3] leading-snug">
                            {item.product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                          className="p-1 text-[#878177] hover:text-rose-700 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#706B63] dark:text-[#9F998F] pt-1 flex items-center gap-2">
                        <span>Size: {item.selectedSize}</span>
                        {item.monogram && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#8C7853]">Monogram: {item.monogram}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#D5CFC5] dark:border-[#38332E]">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                          className="p-1 text-[#605B54] dark:text-[#A7A096] hover:bg-[#EAE4D7] dark:hover:bg-[#221F1C] cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono tabular-nums text-[#181715] dark:text-[#FAF8F3]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                          className="p-1 text-[#605B54] dark:text-[#A7A096] hover:bg-[#EAE4D7] dark:hover:bg-[#221F1C] cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono tabular-nums text-sm font-medium text-[#181715] dark:text-[#FAF8F3]">
                        €{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Complimentary Archival Gift Box Option */}
              <div className="pt-5 space-y-3">
                <div className="p-3 bg-[#F3EFE7] dark:bg-[#1D1B18] border border-[#E0DBD0] dark:border-[#2C2926] text-xs">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeGiftWrap}
                      onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                      className="mt-0.5 accent-[#8C7853]"
                    />
                    <div>
                      <span className="font-medium text-[#181715] dark:text-[#FAF8F3] flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-sans-luxury">
                        <Gift className="w-3.5 h-3.5 text-[#8C7853]" />
                        <span>Maison Aurelia Signature Archival Packaging (Complimentary)</span>
                      </span>
                      <p className="text-[11px] text-[#706B63] dark:text-[#9F998F] pt-0.5">
                        Each garment is delivered in our hand-crafted charcoal linen box tied with raw silk ribbon and accompanied by an archival cedar hanger.
                      </p>
                    </div>
                  </label>

                  {includeGiftWrap && (
                    <div className="mt-3 pt-2 border-t border-[#E0D9CB] dark:border-[#2B2723]">
                      <label className="block text-[10px] uppercase text-[#706B63] dark:text-[#9F998F] mb-1">
                        Calligraphy Card Inscription (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="E.g. With enduring affection on your milestone."
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white/70 dark:bg-black/30 border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer / Subtotal & Primary Checkout CTA */}
        {!orderConfirmed && !isCheckingOut && items.length > 0 && (
          <div className="p-6 border-t border-[#E8E4DC] dark:border-[#272421] bg-[#F7F4EC] dark:bg-[#181614] space-y-4">
            
            {/* Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#706B63] dark:text-[#9F998F]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-[#181715] dark:text-[#FAF8F3]">
                  €{subtotal.toLocaleString()} EUR
                </span>
              </div>

              <div className="flex items-center justify-between text-[#706B63] dark:text-[#9F998F]">
                <span>Worldwide Insured Courier</span>
                <span className="text-[#8C7853] uppercase tracking-wider text-[10px]">Complimentary</span>
              </div>

              <div className="flex items-center justify-between text-[#706B63] dark:text-[#9F998F]">
                <span>Carbon-Compensated Delivery</span>
                <span className="text-[#8C7853] uppercase tracking-wider text-[10px]">Included</span>
              </div>

              <div className="pt-2 border-t border-[#E4DFD5] dark:border-[#2B2723] flex items-baseline justify-between text-base">
                <span className="font-serif-luxury font-medium text-[#181715] dark:text-[#FAF8F3]">
                  Estimated Total
                </span>
                <span className="font-mono font-medium tabular-nums text-[#181715] dark:text-[#FAF8F3]">
                  €{subtotal.toLocaleString()} EUR
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-4 bg-[#181715] text-[#FAF9F5] hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white text-xs uppercase tracking-[0.2em] font-sans-luxury font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Proceed to Bespoke Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Guidance for guest customers */}
            {!user ? (
              <div className="text-center text-[10px] text-[#8C7853] dark:text-[#C5B492] font-sans-luxury">
                <span>Browse freely without signing in · Account required at checkout to complete acquisition</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#706B63] dark:text-[#9F998F]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C7853]" />
                <span>Complimentary 30-day salon returns & authentication dossier</span>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
