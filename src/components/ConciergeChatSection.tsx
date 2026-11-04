import React, { useState, useEffect, useRef } from 'react';
import { useAuth, VIRTUAL_VIP_UID } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { BoutiqueStylist, ConciergeMessage, Product } from '../types/fashion';
import { BOUTIQUE_STYLISTS, CONCIERGE_PRESETS } from '../data/conciergeStylists';
import { PRODUCTS } from '../data/products';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  Crown, 
  Clock, 
  MapPin, 
  CheckCheck, 
  Trash2, 
  Tag, 
  X, 
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Calendar,
  Layers,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConciergeChatSectionProps {
  onOpenSalonBooking?: () => void;
  onOpenAuthModal?: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const ConciergeChatSection: React.FC<ConciergeChatSectionProps> = ({
  onOpenSalonBooking,
  onOpenAuthModal,
  onSelectProduct,
}) => {
  const { user, profile, signInAsVIPGuest } = useAuth();
  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedStylist, setSelectedStylist] = useState<BoutiqueStylist>(BOUTIQUE_STYLISTS[0]);
  const [isTyping, setIsStylistTyping] = useState(false);
  const [attachedProduct, setAttachedProduct] = useState<Product | null>(null);
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Real-time Firestore subscription to /users/{userId}/conciergeMessages
  useEffect(() => {
    if (!user) {
      setMessages([]);
      setIsLoadingMessages(false);
      return;
    }

    const clientName = profile?.displayName || 'Distinguished Patron';
    const tier = profile?.clientTier || 'Couture Elite';
    const defaultWelcome: ConciergeMessage = {
      id: 'welcome-init',
      userId: user.uid,
      sender: 'stylist',
      stylistName: 'Éléonore de Rochechouart',
      stylistRole: 'Head Couture Stylist · 14 Place Vendôme',
      stylistAvatar: '/assets/images/couture_salon_gown.jpg',
      text: `Enchantée, ${clientName}. As a valued ${tier} patron of Maison Aurelia, you hold a private direct line to our Parisian styling bureau. How may I assist your sartorial selections for upcoming galas, alpine winter escapes, or private salon fittings today?`,
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    // If virtual VIP guest session, use local messages
    if (user.uid === VIRTUAL_VIP_UID) {
      const localChat = localStorage.getItem('maison_concierge_chat_' + user.uid);
      if (localChat) {
        try {
          const parsed = JSON.parse(localChat);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            setIsLoadingMessages(false);
            return;
          }
        } catch (_e) {}
      }
      setMessages([defaultWelcome]);
      setIsLoadingMessages(false);
      return;
    }

    setIsLoadingMessages(true);
    const messagesRef = collection(db, 'users', user.uid, 'conciergeMessages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          seedInitialWelcomeMessage(user.uid);
          setMessages([defaultWelcome]);
        } else {
          const list: ConciergeMessage[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              userId: user.uid,
              sender: data.sender || 'system',
              stylistName: data.stylistName,
              stylistRole: data.stylistRole,
              stylistAvatar: data.stylistAvatar,
              text: data.text || '',
              referencedProduct: data.referencedProduct,
              timestamp: data.timestamp || new Date().toISOString(),
              isRead: data.isRead ?? true,
            });
          });
          setMessages(list);
        }
        setIsLoadingMessages(false);
      },
      (error) => {
        console.warn('Real-time concierge listener error:', error);
        setMessages([defaultWelcome]);
        setIsLoadingMessages(false);
      }
    );

    return () => unsubscribe();
  }, [user, profile]);

  // Seed default welcome message from Éléonore de Rochechouart
  const seedInitialWelcomeMessage = async (userId: string) => {
    try {
      const messagesRef = collection(db, 'users', userId, 'conciergeMessages');
      const clientName = profile?.displayName || 'Distinguished Patron';
      const tier = profile?.clientTier || 'Couture Elite';

      await addDoc(messagesRef, {
        userId,
        sender: 'stylist',
        stylistName: 'Éléonore de Rochechouart',
        stylistRole: 'Head Couture Stylist · 14 Place Vendôme',
        stylistAvatar: '/assets/images/couture_salon_gown.jpg',
        text: `Enchantée, ${clientName}. As a valued ${tier} patron of Maison Aurelia, you hold a private direct line to our Parisian styling bureau. How may I assist your sartorial selections for upcoming galas, alpine winter escapes, or private salon fittings today?`,
        timestamp: new Date().toISOString(),
        isRead: true,
      });
    } catch (e) {
      console.warn('Could not seed welcome message:', e);
      setIsLoadingMessages(false);
    }
  };

  // Generate realistic haute couture stylist advice response
  const generateStylistResponse = (
    userText: string,
    stylist: BoutiqueStylist,
    productRef?: Product | null
  ): string => {
    const textLower = userText.toLowerCase();

    if (textLower.includes('gala') || textLower.includes('evening') || textLower.includes('gown')) {
      return `For an evening gala, I recommend our Sculptural Silk Evening Gown or the Balenciaga Liquid Blue Jersey Gown. The fluid drape catches chandelier reflections exquisitely. Accompany it with discreet 24k gold ear pendants and the Christian Dior Rose des Vents Extrait flacon dabbed at the collarbones. Would you like me to reserve FR 36 or 38 for a private salon fitting?`;
    }

    if (textLower.includes('ski') || textLower.includes('alpine') || textLower.includes('courchevel') || textLower.includes('winter')) {
      return `For Courchevel and high-altitude alpine retreats, the Louis Vuitton Graphic Signature Ski Jacket (Ref: 1AKX5Z) pairs impeccably with our double-faced cashmere trousers. Its technical bi-stretch membrane shields against alpine winds while the shearling trim brings effortless warmth to fireside gatherings at Chalet Bellecôte.`;
    }

    if (textLower.includes('balenciaga') || textLower.includes('coat') || textLower.includes('jacket')) {
      return `The Balenciaga Haute Couture Cocoon Opera Coat is an extraordinary architectural statement. Crafted with double-faced virgin wool and sculpted rounded shoulders, it creates an arresting silhouette over both tailored tuxedo capes and evening trousers. We can schedule a private fitting at 14 Place Vendôme to adjust the sleeve length to your exact proportions.`;
    }

    if (textLower.includes('fragrance') || textLower.includes('perfume') || textLower.includes('scent') || textLower.includes('extrait')) {
      return `Our Place Vendôme Grand Extrait combines Centifolia rose absolutes from Grasse with wild Cambodian agarwood and genuine suspended 24k gold leaf. It possesses an aristocratic 14-hour longevity with a magnetic sillage. May I dispatch a complimentary gilded silk blotter to your Parisian address?`;
    }

    if (textLower.includes('fitting') || textLower.includes('appointment') || textLower.includes('salon') || textLower.includes('book')) {
      return `It would be our honor to welcome you to our private salon suite at 14 Place Vendôme or Palazzo Montenapoleone. We provide private champagne service and full access to our seasonal runway archive. You can click 'Reserve Salon Fitting' below or let me know your preferred afternoon.`;
    }

    if (productRef) {
      return `The ${productRef.name} is one of our most distinguished creations (€${productRef.price.toLocaleString()} EUR). Crafted in ${productRef.origin} from ${productRef.fabric}, its ${productRef.silhouette} cut offers exceptional presence. I would style this with neutral Tuscan leather pieces and minimalist jewelry. Shall I place this piece on private hold under your client account?`;
    }

    return `Thank you for sharing your styling inquiry with our ${stylist.salon} bureau. At Maison Aurelia, every silhouette is customized to your posture and cadence. I have noted this in your client archive and recommend scheduling a fitting session or reviewing our latest Runway Archive. Is there a specific occasion or colorway you have in mind?`;
  };

  // Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !user) return;

    const currentText = inputText.trim();
    const currentAttachedProduct = attachedProduct;
    
    setInputText('');
    setAttachedProduct(null);

    // 1. Construct user message and optimistically display it immediately
    const userMsgData: ConciergeMessage = {
      id: 'msg-' + Date.now(),
      userId: user.uid,
      sender: 'member',
      text: currentText,
      timestamp: new Date().toISOString(),
      isRead: true,
      referencedProduct: currentAttachedProduct ? {
        id: currentAttachedProduct.id,
        name: currentAttachedProduct.name,
        price: currentAttachedProduct.price,
        image: currentAttachedProduct.image,
        category: currentAttachedProduct.categoryLabel || currentAttachedProduct.category,
      } : undefined
    };

    setMessages((prev) => {
      const next = [...prev, userMsgData];
      if (user.uid === VIRTUAL_VIP_UID) {
        localStorage.setItem('maison_concierge_chat_' + user.uid, JSON.stringify(next));
      }
      return next;
    });

    // Sync to Firestore if authenticated user
    if (user.uid !== VIRTUAL_VIP_UID) {
      try {
        const messagesRef = collection(db, 'users', user.uid, 'conciergeMessages');
        await addDoc(messagesRef, userMsgData);
      } catch (err) {
        console.warn('Could not sync user message to firestore:', err);
      }
    }

    // 2. Trigger Stylist Typing indicator
    setIsStylistTyping(true);

    // Simulate thoughtful stylist drafting response
    setTimeout(async () => {
      const stylistReply = generateStylistResponse(currentText, selectedStylist, currentAttachedProduct);
      const stylistMsgData: ConciergeMessage = {
        id: 'reply-' + Date.now(),
        userId: user.uid,
        sender: 'stylist',
        stylistName: selectedStylist.name,
        stylistRole: `${selectedStylist.role} · ${selectedStylist.salon}`,
        stylistAvatar: selectedStylist.avatar,
        text: stylistReply,
        timestamp: new Date().toISOString(),
        isRead: true,
      };

      setMessages((prev) => {
        const next = [...prev, stylistMsgData];
        if (user.uid === VIRTUAL_VIP_UID) {
          localStorage.setItem('maison_concierge_chat_' + user.uid, JSON.stringify(next));
        }
        return next;
      });

      if (user.uid !== VIRTUAL_VIP_UID) {
        try {
          const messagesRef = collection(db, 'users', user.uid, 'conciergeMessages');
          await addDoc(messagesRef, stylistMsgData);
        } catch (err) {
          console.warn('Could not sync stylist reply to firestore:', err);
        }
      }

      setIsStylistTyping(false);
    }, 1400);
  };

  // Clear chat history
  const handleClearHistory = async () => {
    if (!user) return;
    const clientName = profile?.displayName || 'Distinguished Patron';
    const tier = profile?.clientTier || 'Couture Elite';
    const welcomeMsg: ConciergeMessage = {
      id: 'welcome-' + Date.now(),
      userId: user.uid,
      sender: 'stylist',
      stylistName: 'Éléonore de Rochechouart',
      stylistRole: 'Head Couture Stylist · 14 Place Vendôme',
      stylistAvatar: '/assets/images/couture_salon_gown.jpg',
      text: `Enchantée, ${clientName}. As a valued ${tier} patron of Maison Aurelia, you hold a private direct line to our Parisian styling bureau. How may I assist your sartorial selections for upcoming galas, alpine winter escapes, or private salon fittings today?`,
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    setMessages([welcomeMsg]);

    if (user.uid === VIRTUAL_VIP_UID) {
      localStorage.setItem('maison_concierge_chat_' + user.uid, JSON.stringify([welcomeMsg]));
      return;
    }

    try {
      const messagesRef = collection(db, 'users', user.uid, 'conciergeMessages');
      const snap = await getDocs(messagesRef);
      const batch = writeBatch(db);
      snap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      await seedInitialWelcomeMessage(user.uid);
    } catch (e) {
      console.warn('Error clearing chat history in Firestore:', e);
    }
  };

  // Quick preset click
  const handleApplyPreset = (preset: typeof CONCIERGE_PRESETS[0]) => {
    const target = BOUTIQUE_STYLISTS.find((s) => s.id === preset.targetStylistId) || BOUTIQUE_STYLISTS[0];
    setSelectedStylist(target);
    setInputText(preset.query);
    inputRef.current?.focus();
  };

  // Unauthenticated VIP preview card
  if (!user) {
    return (
      <div className="p-8 sm:p-12 bg-[#FAF9F5] dark:bg-[#181614] border border-[#DDD6C8] dark:border-[#2C2926] shadow-sm text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#181715] dark:bg-[#FAF8F3] text-[#FAF8F3] dark:text-[#181715] flex items-center justify-center mx-auto border border-[#8C7853] shadow-md">
            <Crown className="w-8 h-8 text-[#C5B492]" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] font-semibold block">
              Private Sartorial Desk · 14 Place Vendôme
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
              Haute Concierge & Stylist Line
            </h3>
            <p className="text-xs text-[#706B63] dark:text-[#A7A096] font-light leading-relaxed">
              Real-time one-on-one communication with Maison Aurelia boutique stylists for red-carpet gala ensembles, Courchevel alpine layering, and bespoke master tailor adjustments.
            </p>
          </div>

          {/* Stylist Avatars Preview */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {BOUTIQUE_STYLISTS.map((s) => (
              <div key={s.id} className="flex items-center gap-2 p-2 bg-[#F2EDE2] dark:bg-[#221F1C] border border-[#DDD6C8] dark:border-[#35312C] text-left">
                <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover border border-[#8C7853]" />
                <div className="hidden sm:block">
                  <span className="text-[10px] font-semibold text-[#181715] dark:text-[#FAF8F3] block leading-tight">
                    {s.name}
                  </span>
                  <span className="text-[9px] text-[#8C7853] dark:text-[#C5B492]">
                    {s.salon.split(',')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenAuthModal}
              className="w-full sm:w-auto px-6 py-3 bg-[#181715] text-[#FAF8F3] dark:bg-[#FAF8F3] dark:text-[#181715] hover:bg-[#33302B] dark:hover:bg-white text-xs uppercase tracking-widest font-sans-luxury font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <User className="w-4 h-4 text-[#8C7853]" />
              <span>Sign In to Access Stylist Desk</span>
            </button>

            <button
              onClick={signInAsVIPGuest}
              className="w-full sm:w-auto px-6 py-3 bg-[#8C7853] hover:bg-[#786644] text-white text-xs uppercase tracking-widest font-sans-luxury font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Instant VIP Guest Pass</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-[#878177] pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Zero-Trust Communication · Place Vendôme Server Authorization</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] dark:bg-[#171513] border border-[#DDD6C8] dark:border-[#2C2926] shadow-sm flex flex-col overflow-hidden">
      
      {/* Top Header Bar: Stylist Status & Client Details */}
      <div className="p-4 sm:p-5 border-b border-[#E8E2D5] dark:border-[#2B2724] bg-[#F4F1EA] dark:bg-[#1E1C19] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Active Stylist Selector & Status */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={selectedStylist.avatar}
              alt={selectedStylist.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#8C7853] shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#1E1C19] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-serif-luxury font-bold text-[#181715] dark:text-[#FAF8F3] tracking-wide">
                {selectedStylist.name}
              </span>
              <span className="px-2 py-0.5 text-[9px] uppercase font-mono tracking-wider bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-600/20 rounded">
                Available Online
              </span>
            </div>
            <p className="text-[11px] text-[#706B63] dark:text-[#A7A096]">
              {selectedStylist.role} · <span className="text-[#8C7853] font-medium">{selectedStylist.salon}</span>
            </p>
          </div>
        </div>

        {/* Stylist Switcher Pill & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-[#706B63] dark:text-[#9F998F] font-sans-luxury hidden lg:inline">
            Direct Line:
          </span>
          <div className="flex items-center gap-1 bg-[#FAF9F5] dark:bg-[#141311] p-1 border border-[#DDD6C8] dark:border-[#2F2B26]">
            {BOUTIQUE_STYLISTS.map((stylist) => (
              <button
                key={stylist.id}
                onClick={() => setSelectedStylist(stylist)}
                className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-sans-luxury transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedStylist.id === stylist.id
                    ? 'bg-[#181715] text-[#FAF8F3] dark:bg-[#FAF8F3] dark:text-[#181715] font-semibold'
                    : 'text-[#605B54] dark:text-[#A7A096] hover:text-[#181715] dark:hover:text-white'
                }`}
                title={stylist.bio}
              >
                <span>{stylist.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {onOpenSalonBooking && (
            <button
              onClick={onOpenSalonBooking}
              className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-sans-luxury bg-[#8C7853] hover:bg-[#786644] text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" />
              <span>Book Salon Fitting</span>
            </button>
          )}

          <button
            onClick={handleClearHistory}
            className="p-1.5 text-[#878177] hover:text-rose-600 transition-colors cursor-pointer"
            title="Reset Stylist Conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Suggested Inquiries Presets Bar */}
      <div className="px-4 py-2 bg-[#EFECE4] dark:bg-[#1A1816] border-b border-[#E0D9CB] dark:border-[#282522] overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[10px] uppercase tracking-wider text-[#8C7853] font-semibold shrink-0 font-sans-luxury flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#8C7853]" />
          <span>Quick Styling Consult:</span>
        </span>
        {CONCIERGE_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleApplyPreset(preset)}
            className="shrink-0 px-2.5 py-1 text-[10px] bg-[#FAF9F5] dark:bg-[#221F1C] hover:bg-white dark:hover:bg-[#2A2622] text-[#403B35] dark:text-[#D5CFC5] border border-[#DDD6C8] dark:border-[#35312C] rounded-sm transition-colors cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Real-time Messages Feed */}
      <div className="h-[380px] sm:h-[440px] overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#FAF9F5] to-[#F5F1E8] dark:from-[#171513] dark:to-[#121110]">
        
        {isLoadingMessages ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#8C7853] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs uppercase tracking-widest text-[#8C7853] font-sans-luxury">
              Connecting to 14 Place Vendôme Stylist Desk...
            </span>
          </div>
        ) : (
          <>
            {/* Security Notice */}
            <div className="text-center py-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ECE7DC] dark:bg-[#201D1A] text-[#706B63] dark:text-[#A7A096] text-[10px] font-mono uppercase tracking-wider border border-[#DDD6C8] dark:border-[#2C2926]">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Private Encrypted Atelier Channel · {profile?.clientTier || 'Elite'} Privilege</span>
              </span>
            </div>

            {messages.map((msg) => {
              const isMember = msg.sender === 'member';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isMember ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Stylist Avatar */}
                  {!isMember && (
                    <img
                      src={msg.stylistAvatar || selectedStylist.avatar}
                      alt={msg.stylistName || 'Stylist'}
                      className="w-8 h-8 rounded-full object-cover border border-[#8C7853] shrink-0 mt-1 shadow-sm"
                    />
                  )}

                  <div className={`max-w-md sm:max-w-lg space-y-1.5 ${isMember ? 'items-end' : 'items-start'}`}>
                    
                    {/* Header: Name and Time */}
                    <div className={`flex items-center gap-2 text-[10px] text-[#706B63] dark:text-[#A7A096] ${isMember ? 'justify-end' : 'justify-start'}`}>
                      <span className="font-semibold text-[#181715] dark:text-[#FAF8F3]">
                        {isMember ? `${profile?.displayName || 'You'} (${profile?.clientTier || 'Elite'})` : msg.stylistName || selectedStylist.name}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-[9px]">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`p-3.5 sm:p-4 text-xs leading-relaxed shadow-sm ${
                        isMember
                          ? 'bg-[#181715] text-[#FAF8F3] dark:bg-[#FAF8F3] dark:text-[#181715] rounded-tl-lg rounded-tr-lg rounded-bl-lg'
                          : 'bg-[#FAF9F5] dark:bg-[#201D1A] text-[#181715] dark:text-[#FAF8F3] border border-[#DDD6C8] dark:border-[#332F2A] rounded-tl-lg rounded-tr-lg rounded-br-lg'
                      }`}
                    >
                      {/* Attached Product Card if referenced */}
                      {msg.referencedProduct && (
                        <div 
                          onClick={() => {
                            const found = PRODUCTS.find((p) => p.id === msg.referencedProduct?.id);
                            if (found && onSelectProduct) onSelectProduct(found);
                          }}
                          className={`mb-2.5 p-2 flex items-center gap-2.5 border cursor-pointer transition-colors ${
                            isMember
                              ? 'bg-black/30 border-white/20 hover:bg-black/50 text-[#FAF8F3]'
                              : 'bg-[#F2EDE2] dark:bg-[#181614] border-[#8C7853]/40 hover:border-[#8C7853] text-[#181715] dark:text-[#FAF8F3]'
                          }`}
                        >
                          <img
                            src={msg.referencedProduct.image}
                            alt={msg.referencedProduct.name}
                            className="w-10 h-10 object-cover border border-[#8C7853]/30 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] uppercase tracking-wider font-mono opacity-80 block truncate">
                              Referenced Archive Piece · {msg.referencedProduct.category}
                            </span>
                            <span className="text-xs font-serif-luxury font-bold block truncate">
                              {msg.referencedProduct.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-semibold shrink-0">
                            €{msg.referencedProduct.price.toLocaleString()}
                          </span>
                        </div>
                      )}

                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>

                    {/* Delivery checkmark */}
                    <div className={`flex items-center gap-1 text-[9px] text-[#8C7853] ${isMember ? 'justify-end' : 'justify-start'}`}>
                      <CheckCheck className="w-3 h-3" />
                      <span>{isMember ? 'Delivered to Place Vendôme Atelier' : 'Signed by Curator'}</span>
                    </div>

                  </div>

                  {/* Member Avatar */}
                  {isMember && (
                    <div className="w-8 h-8 rounded-full bg-[#8C7853] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-sm">
                      {profile?.displayName?.charAt(0) || 'M'}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Stylist is typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-3">
                <img
                  src={selectedStylist.avatar}
                  alt={selectedStylist.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#8C7853] shrink-0"
                />
                <div className="p-3 bg-[#FAF9F5] dark:bg-[#201D1A] border border-[#DDD6C8] dark:border-[#332F2A] rounded-lg shadow-sm flex items-center gap-2 text-xs text-[#706B63] dark:text-[#A7A096]">
                  <span className="italic">{selectedStylist.name} is curating sartorial response</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#8C7853] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-[#8C7853] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-[#8C7853] rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}

      </div>

      {/* Product Tag Attachment Bar (if an archive garment is selected) */}
      {attachedProduct && (
        <div className="px-4 py-2 bg-[#F2EDE2] dark:bg-[#1E1C19] border-t border-[#E0D9CB] dark:border-[#282522] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={attachedProduct.image} alt={attachedProduct.name} className="w-7 h-7 object-cover border border-[#8C7853]" />
            <div className="text-xs">
              <span className="text-[9px] uppercase tracking-wider text-[#8C7853] font-mono block">Attaching to inquiry:</span>
              <span className="font-semibold text-[#181715] dark:text-[#FAF8F3]">{attachedProduct.name} (€{attachedProduct.price.toLocaleString()})</span>
            </div>
          </div>
          <button
            onClick={() => setAttachedProduct(null)}
            className="p-1 text-[#878177] hover:text-[#181715] dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Composer */}
      <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-[#FAF9F5] dark:bg-[#1A1816] border-t border-[#E2DDD3] dark:border-[#282522] flex items-center gap-2">
        
        {/* Attach Product Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProductPickerOpen(!isProductPickerOpen)}
            className={`p-2.5 border transition-colors cursor-pointer flex items-center gap-1 text-xs ${
              attachedProduct || isProductPickerOpen
                ? 'bg-[#8C7853] text-white border-[#8C7853]'
                : 'bg-[#F2EDE2] dark:bg-[#221F1C] border-[#DDD6C8] dark:border-[#35312C] text-[#605B54] dark:text-[#A7A096] hover:text-[#181715]'
            }`}
            title="Attach an archive garment for styling feedback"
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] uppercase font-sans-luxury tracking-wider">Garment</span>
          </button>

          {/* Product Attachment Dropdown */}
          {isProductPickerOpen && (
            <div className="absolute bottom-12 left-0 w-72 sm:w-80 max-h-64 overflow-y-auto bg-[#FAF9F5] dark:bg-[#181614] border border-[#8C7853] shadow-2xl p-2 z-40 space-y-1">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#E2DDD3] dark:border-[#2C2824] px-1">
                <span className="text-[10px] uppercase font-sans-luxury tracking-wider text-[#8C7853] font-semibold">
                  Select Archive Piece
                </span>
                <button onClick={() => setIsProductPickerOpen(false)} className="text-[#878177]">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {PRODUCTS.slice(0, 10).map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setAttachedProduct(prod);
                    setIsProductPickerOpen(false);
                    inputRef.current?.focus();
                  }}
                  className="p-1.5 hover:bg-[#F2EDE2] dark:hover:bg-[#221F1C] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <img src={prod.image} alt={prod.name} className="w-8 h-8 object-cover border border-[#8C7853]/40" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold text-[#181715] dark:text-[#FAF8F3] block truncate">
                      {prod.name}
                    </span>
                    <span className="text-[9px] font-mono text-[#8C7853]">
                      €{prod.price.toLocaleString()} EUR
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${selectedStylist.name.split(' ')[0]} at ${selectedStylist.salon.split(',')[0]}...`}
          className="flex-1 px-4 py-2.5 text-xs bg-white dark:bg-[#121110] text-[#181715] dark:text-[#FAF8F3] border border-[#DDD6C8] dark:border-[#332F2A] focus:outline-none focus:border-[#8C7853] placeholder-[#878177]"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="px-4 py-2.5 bg-[#181715] text-[#FAF8F3] hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white text-xs uppercase tracking-widest font-sans-luxury font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>

      </form>

    </div>
  );
};
