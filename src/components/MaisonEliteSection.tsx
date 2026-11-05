import React, { useState } from 'react';
import { ELITE_TIERS, INITIAL_PATRON_PURCHASES, INITIAL_PRIVATE_EVENTS, UPCOMING_CAPSULES } from '../data/maisonEliteData';
import { PatronPurchase, PrivateEvent, EliteTierLevel, Product } from '../types/fashion';
import { useAuth } from '../context/AuthContext';
import { ConciergeChatSection } from './ConciergeChatSection';
import { LoyaltyPointsProgram } from './LoyaltyPointsProgram';
import { 
  Crown, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  UserCheck, 
  Plus, 
  Check, 
  Truck, 
  Package, 
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Fingerprint,
  X,
  MessageSquare,
  Coins,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MaisonEliteSectionProps {
  onOpenOrderStatus?: (orderId: string) => void;
  onOpenSalonBooking?: () => void;
  onOpenAuthModal?: () => void;
  onSelectProduct?: (product: Product) => void;
  externalSpend?: number;
  completedCheckoutSpend?: number;
  onUpdateCheckoutSpend?: (amount: number) => void;
}

export type DynamicLoyaltyTierBadge = 'Silver' | 'Gold' | 'Platinum' | 'Couture Elite';

export const MaisonEliteSection: React.FC<MaisonEliteSectionProps> = ({
  onOpenOrderStatus,
  onOpenSalonBooking,
  onOpenAuthModal,
  onSelectProduct,
  externalSpend = 0,
  completedCheckoutSpend,
  onUpdateCheckoutSpend,
}) => {
  const { user, profile } = useAuth();
  const [purchases, setPurchases] = useState<PatronPurchase[]>(INITIAL_PATRON_PURCHASES);
  const [events, setEvents] = useState<PrivateEvent[]>(INITIAL_PRIVATE_EVENTS);
  const [activeTab, setActiveTab] = useState<'loyalty-points' | 'timeline' | 'benefits' | 'events' | 'capsules' | 'ledger' | 'concierge-chat'>('loyalty-points');
  const [rsvpNotice, setRsvpNotice] = useState<string | null>(null);
  const [allocationNotice, setAllocationNotice] = useState<string | null>(null);
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);

  // Determine effective completed checkout spend
  const currentCheckoutSpend = completedCheckoutSpend !== undefined ? completedCheckoutSpend : externalSpend;

  // Calculate dynamic loyalty tier based on current completedCheckoutSpend total
  let dynamicTier: DynamicLoyaltyTierBadge = 'Silver';
  let dynamicFrenchTitle = 'Cercle d’Argent · Le Premier Rang';
  let dynamicMinSpend = 0;
  let dynamicNextTier: DynamicLoyaltyTierBadge | null = 'Gold';
  let dynamicNextSpend: number | null = 3000;
  let dynamicBadgeGradient = 'from-zinc-200 via-slate-100 to-zinc-300';
  let dynamicBadgeBg = 'bg-gradient-to-br from-[#262523] via-[#33302B] to-[#1A1816]';
  let dynamicBorderColor = 'border-zinc-400 dark:border-zinc-500';
  let dynamicTextColor = 'text-[#DCD6C9]';
  let dynamicGlow = 'shadow-md';
  let dynamicPerkHighlight = '24-Hour Digital Atelier Desk & Complimentary Insured Courier Dispatch';
  let dynamicEarlyAccessHours = 24;

  if (profile?.hasUnrestrictedAccess || profile?.clientTier === 'Couture Elite' || currentCheckoutSpend >= 15000) {
    dynamicTier = 'Couture Elite';
    dynamicFrenchTitle = profile?.hasUnrestrictedAccess 
      ? 'Cercle Haute Couture · Grand Patron & Atelier Director (100% Unrestricted)'
      : 'Cercle Haute Couture · Grand Patron Archival';
    dynamicMinSpend = 15000;
    dynamicNextTier = null;
    dynamicNextSpend = null;
    dynamicBadgeGradient = 'from-amber-300 via-yellow-100 to-amber-500';
    dynamicBadgeBg = 'bg-gradient-to-br from-[#1A1610] via-[#2A2012] to-[#0E0C09]';
    dynamicBorderColor = 'border-[#D4AF37] dark:border-[#F3D794]';
    dynamicTextColor = 'text-[#F3D794]';
    dynamicGlow = 'shadow-[0_0_30px_rgba(212,175,55,0.4)]';
    dynamicPerkHighlight = 'Unrestricted Global Runway Allocations, 14 Place Vendôme Private Suites & Dedicated Stylist Desk';
    dynamicEarlyAccessHours = 72;
  } else if (currentCheckoutSpend >= 8000) {
    dynamicTier = 'Platinum';
    dynamicFrenchTitle = 'Cercle Platine d’Exception';
    dynamicMinSpend = 8000;
    dynamicNextTier = 'Couture Elite';
    dynamicNextSpend = 15000;
    dynamicBadgeGradient = 'from-slate-100 via-indigo-100 to-cyan-200';
    dynamicBadgeBg = 'bg-gradient-to-br from-[#1C1F28] via-[#262D3D] to-[#12151D]';
    dynamicBorderColor = 'border-slate-300 dark:border-indigo-300';
    dynamicTextColor = 'text-[#E2E8F0]';
    dynamicGlow = 'shadow-[0_0_25px_rgba(199,210,254,0.35)]';
    dynamicPerkHighlight = '60-Hour Priority Runway Pre-Order & Dedicated Sartorial Specialist Liaison';
    dynamicEarlyAccessHours = 60;
  } else if (currentCheckoutSpend >= 3000) {
    dynamicTier = 'Gold';
    dynamicFrenchTitle = 'Cercle d’Or des Curateurs';
    dynamicMinSpend = 3000;
    dynamicNextTier = 'Platinum';
    dynamicNextSpend = 8000;
    dynamicBadgeGradient = 'from-amber-200 via-yellow-100 to-amber-400';
    dynamicBadgeBg = 'bg-gradient-to-br from-[#292218] via-[#3D301E] to-[#1C1710]';
    dynamicBorderColor = 'border-[#C5A059] dark:border-[#E5C378]';
    dynamicTextColor = 'text-[#F5DC9C]';
    dynamicGlow = 'shadow-[0_0_25px_rgba(218,165,32,0.35)]';
    dynamicPerkHighlight = '48-Hour Early Access to Haute Capsules & Private Salon Fitting Gala Invitations';
    dynamicEarlyAccessHours = 48;
  }

  const dynamicNextGap = dynamicNextSpend ? Math.max(0, dynamicNextSpend - currentCheckoutSpend) : 0;
  const dynamicProgress = dynamicNextSpend
    ? Math.min(100, Math.round(((currentCheckoutSpend - dynamicMinSpend) / (dynamicNextSpend - dynamicMinSpend)) * 100))
    : 100;

  // Calculate cumulative ledger spend
  const baseSpend = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalSpend = baseSpend + currentCheckoutSpend;

  // Determine active tier for legacy ledger
  let activeTier: EliteTierLevel = 'argent';
  if (totalSpend >= 15000) activeTier = 'nocturne';
  else if (totalSpend >= 5000) activeTier = 'or';

  const currentTierData = ELITE_TIERS.find((t) => t.id === activeTier) || ELITE_TIERS[1];
  const nextTierData = activeTier === 'argent' ? ELITE_TIERS[1] : activeTier === 'or' ? ELITE_TIERS[2] : null;

  const nextTierGap = nextTierData ? Math.max(0, nextTierData.minSpend - totalSpend) : 0;
  const progressPercent = nextTierData
    ? Math.min(100, Math.round(((totalSpend - currentTierData.minSpend) / (nextTierData.minSpend - currentTierData.minSpend)) * 100))
    : 100;

  // Handle Event RSVP
  const handleToggleRsvp = (eventId: string, newStatus: 'attending' | 'declined') => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, rsvpStatus: newStatus } : ev))
    );
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setRsvpNotice(
        newStatus === 'attending'
          ? `Your attendance at "${event.title}" is confirmed. Place Vendôme concierge has reserved your suite.`
          : `Your regrets have been recorded for "${event.title}".`
      );
      setTimeout(() => setRsvpNotice(null), 3500);
    }
  };

  // Adjust checkout spend test helper
  const handleAdjustCheckoutSpend = (newAmount: number) => {
    if (onUpdateCheckoutSpend) {
      onUpdateCheckoutSpend(newAmount);
    }
    setAllocationNotice(`Loyalty Tier recalibrated: Completed Checkout Spend updated to €${newAmount.toLocaleString()} EUR.`);
    setTimeout(() => setAllocationNotice(null), 3500);
  };

  // Simulate spending increment
  const handleSimulatePurchase = () => {
    const newOrder: PatronPurchase = {
      orderId: `MA-CMD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      amount: 4200,
      items: [
        'Louis Vuitton Graphic Signature Ski Jacket (Ref: 1AKX5Z · FR 36 / Courchevel Capsule)'
      ],
      status: 'In Transit',
      itemThumbnails: [
        '/assets/images/lv_ski_jacket_studio.jpg'
      ],
      trackingNumber: `FR-PV-${Math.floor(100000 + Math.random() * 900000)}-EXP`,
      destinationCity: 'Paris · Place Vendôme Salon',
      vaultNotes: 'Express secure delivery via specialized armored courier. Biometric seal verified.'
    };
    setPurchases([newOrder, ...purchases]);
    if (onUpdateCheckoutSpend) {
      onUpdateCheckoutSpend(currentCheckoutSpend + 4200);
    }
    setAllocationNotice(`Checkout order of €4,200 settled! Your dynamic loyalty tier badge has refreshed.`);
    setTimeout(() => setAllocationNotice(null), 3500);
  };

  const handleRequestAllocation = (capsuleTitle: string) => {
    setAllocationNotice(`Pre-emptive allocation docket dispatched for "${capsuleTitle}". Your dedicated curator will contact you within 2 hours.`);
    setTimeout(() => setAllocationNotice(null), 4000);
  };

  return (
    <section id="maison-elite" className="py-20 lg:py-28 bg-[#F6F3EB] dark:bg-[#121110] border-t border-[#E5E0D5] dark:border-[#262421] transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E0D9CB] dark:border-[#2B2724] gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-2">
              <Crown className="w-3.5 h-3.5 text-[#8C7853]" />
              <span>Private Client Privilege Ledger</span>
              <span aria-hidden="true">·</span>
              <span>Place Vendôme Registry</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
              LUXE LAYOUT · Elite Patronage
            </h2>
          </div>

          <p className="text-sm text-[#706B63] dark:text-[#9F998F] max-w-md font-light leading-relaxed">
            Honoring our most devoted connoisseurs with pre-emptive runway allocations, private salon fitting galas, and bespoke master tailor access based on cumulative patronage and completed checkout spend.
          </p>
        </div>

        {/* Client Tier Dashboard Card with Dynamic Loyalty Tier Badge */}
        <div className="mt-8 p-6 sm:p-8 bg-[#FAF9F5] dark:bg-[#181614] border border-[#DDD6C8] dark:border-[#2C2926] shadow-sm">
          
          {/* Top Authenticated Client Bar with Dynamic Tier Badge Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#E8E2D5] dark:border-[#2C2824] gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#181715] dark:bg-[#FAF8F3] text-[#FAF8F3] dark:text-[#181715] flex items-center justify-center font-serif-luxury font-bold text-sm border border-[#8C7853]">
                {profile?.displayName
                  ? profile.displayName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'GD'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs uppercase tracking-wider font-sans-luxury font-semibold text-[#181715] dark:text-[#FAF8F3]">
                    {profile?.displayName || 'Lady Geneviève Dupont'}
                  </span>
                  <span className="px-2 py-0.5 bg-[#8C7853]/15 text-[#8C7853] text-[10px] font-mono uppercase tracking-wider">
                    {profile?.clientNumber || 'Client #4402'}
                  </span>
                  {/* Dynamic Loyalty Tier Pill */}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-sm border ${dynamicBorderColor} ${dynamicBadgeBg} ${dynamicTextColor} ${dynamicGlow}`}>
                    <Crown className="w-3 h-3 text-[#D4AF37]" />
                    <span>{profile?.clientTier || dynamicTier} Tier</span>
                  </span>
                </div>
                <div className="text-[11px] text-[#706B63] dark:text-[#9F998F] flex items-center gap-3 mt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Fingerprint className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{profile?.vipIdentificationStatus || 'Authenticated Client · Place Vendôme Salon Privé'}</span>
                  </div>
                  {onOpenAuthModal && (
                    <button
                      onClick={onOpenAuthModal}
                      className="text-[10px] uppercase tracking-wider font-sans-luxury text-[#8C7853] dark:text-[#C5B492] hover:underline font-semibold cursor-pointer"
                    >
                      Update Identification
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#706B63] dark:text-[#9F998F] block font-sans-luxury">
                  Curator Liaison:
                </span>
                <button
                  onClick={() => setActiveTab('concierge-chat')}
                  className="text-xs font-serif-luxury text-[#181715] dark:text-[#FAF8F3] font-medium hover:text-[#8C7853] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Éléonore de Rochechouart (Direct Line · Chat Online)</span>
                </button>
              </div>
            </div>
          </div>

          {/* DYNAMIC LOYALTY TIER BADGE HERO PANEL */}
          <div className="mb-8 p-6 bg-[#F3EFE7] dark:bg-[#1D1B18] border border-[#DDD6C8] dark:border-[#332F2A] relative overflow-hidden">
            {/* Ambient luxury metallic glow backdrop */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#D4AF37]/10 via-[#8C7853]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              
              {/* Dynamic Physical-Style Heraldic Loyalty Tier Badge */}
              <div className="lg:col-span-5 flex items-center gap-4">
                {/* Physical Medallion */}
                <div className={`w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg p-[2px] bg-gradient-to-br ${dynamicBadgeGradient} ${dynamicGlow} transition-all duration-500 flex items-center justify-center shadow-lg group cursor-pointer`}
                  onClick={() => setIsTierModalOpen(true)}
                  title="Click to view full tier privileges dossier"
                >
                  <div className={`w-full h-full rounded-md ${dynamicBadgeBg} flex flex-col items-center justify-center p-2 text-center border border-black/30 dark:border-white/10 relative overflow-hidden`}>
                    {/* Animated shine line */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <Crown className={`w-6 h-6 sm:w-7 sm:h-7 mb-1 ${dynamicTextColor}`} />
                    <span className="font-serif-luxury font-bold text-xs sm:text-sm tracking-widest uppercase text-white">
                      {dynamicTier}
                    </span>
                    <span className="text-[8px] font-sans-luxury tracking-wider uppercase opacity-80 text-[#FAF8F3]">
                      Maison Elite
                    </span>
                    <span className="text-[7px] font-mono opacity-60 text-[#C5B492] mt-0.5">
                      Place Vendôme
                    </span>
                  </div>
                </div>

                {/* Tier Title & Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7853] dark:text-[#C5B492] font-semibold">
                      Dynamic Loyalty Status
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] leading-none">
                    {dynamicTier} Tier
                  </h3>
                  <p className="text-xs italic font-serif-luxury text-[#787268] dark:text-[#A7A096]">
                    {dynamicFrenchTitle}
                  </p>
                  <div className="pt-1 flex items-baseline gap-2">
                    <span className="text-xl font-mono tabular-nums font-bold text-[#181715] dark:text-[#FAF8F3]">
                      €{currentCheckoutSpend.toLocaleString()} EUR
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#706B63] dark:text-[#9F998F]">
                      Current Checkout Spend
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle: Progress to Next Dynamic Tier */}
              <div className="lg:col-span-4 p-4 bg-[#FAF9F5] dark:bg-[#151412] border border-[#E0D9CB] dark:border-[#2B2724] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase tracking-wider font-sans-luxury text-[#706B63] dark:text-[#9F998F] font-medium">
                    {dynamicNextTier ? `Next Ascension: ${dynamicNextTier} Tier` : 'Pinnacle Standing Attained'}
                  </span>
                  <span className="font-mono text-xs text-[#8C7853] font-bold">
                    {dynamicProgress}%
                  </span>
                </div>

                {/* Dynamic Progress Bar */}
                <div className="w-full h-2.5 bg-[#E2DDCF] dark:bg-[#2C2926] rounded-full overflow-hidden p-[1px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dynamicProgress}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full bg-gradient-to-r ${dynamicBadgeGradient}`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#706B63] dark:text-[#9F998F]">
                  {dynamicNextTier ? (
                    <>
                      <span>Needed: <strong className="font-mono text-[#181715] dark:text-[#FAF8F3]">€{dynamicNextGap.toLocaleString()} EUR</strong></span>
                      <span>Target: €{dynamicNextSpend?.toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      ✦ You have unlocked the highest archival privileges of Place Vendôme.
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-[#706B63] dark:text-[#A7A096] leading-tight pt-1 border-t border-[#EAE4D7] dark:border-[#262421]">
                  ✦ <strong>Active Privilege:</strong> {dynamicPerkHighlight}
                </p>
              </div>

              {/* Right: Interactive Dynamic Spend Controls */}
              <div className="lg:col-span-3 space-y-2 border-t lg:border-t-0 lg:border-l border-[#DDD6C8] dark:border-[#2C2926] lg:pl-5">
                <span className="text-[10px] uppercase tracking-wider font-sans-luxury text-[#8C7853] dark:text-[#C5B492] font-semibold block">
                  Simulate Checkout Spend
                </span>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleAdjustCheckoutSpend(3500)}
                    className={`py-1.5 px-2 text-[10px] uppercase tracking-wider font-sans-luxury border transition-all cursor-pointer ${
                      dynamicTier === 'Gold' 
                        ? 'bg-[#8C7853] text-white border-[#8C7853] font-bold shadow-xs' 
                        : 'border-[#CEC7B9] dark:border-[#38332E] hover:border-[#8C7853] text-[#181715] dark:text-[#FAF8F3]'
                    }`}
                  >
                    Set Gold (€3.5k)
                  </button>

                  <button
                    onClick={() => handleAdjustCheckoutSpend(8500)}
                    className={`py-1.5 px-2 text-[10px] uppercase tracking-wider font-sans-luxury border transition-all cursor-pointer ${
                      dynamicTier === 'Platinum' 
                        ? 'bg-[#4338CA] text-white border-[#4338CA] font-bold shadow-xs' 
                        : 'border-[#CEC7B9] dark:border-[#38332E] hover:border-[#8C7853] text-[#181715] dark:text-[#FAF8F3]'
                    }`}
                  >
                    Set Platinum (€8.5k)
                  </button>

                  <button
                    onClick={() => handleAdjustCheckoutSpend(16500)}
                    className={`py-1.5 px-2 text-[10px] uppercase tracking-wider font-sans-luxury border transition-all cursor-pointer ${
                      dynamicTier === 'Couture Elite' 
                        ? 'bg-[#181715] text-[#D4AF37] border-[#D4AF37] font-bold shadow-xs' 
                        : 'border-[#CEC7B9] dark:border-[#38332E] hover:border-[#8C7853] text-[#181715] dark:text-[#FAF8F3]'
                    }`}
                  >
                    Set Elite (€16.5k)
                  </button>

                  <button
                    onClick={() => handleAdjustCheckoutSpend(0)}
                    className="py-1.5 px-2 text-[10px] uppercase tracking-wider font-sans-luxury border border-[#CEC7B9] dark:border-[#38332E] hover:border-red-500 text-[#706B63] dark:text-[#A7A096] transition-all cursor-pointer"
                  >
                    Reset (€0)
                  </button>
                </div>

                <button
                  onClick={() => handleAdjustCheckoutSpend(currentCheckoutSpend + 2500)}
                  className="w-full py-2 px-3 text-[10px] uppercase tracking-wider font-sans-luxury bg-[#181715] text-[#FAF9F5] hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-medium"
                >
                  <Plus className="w-3 h-3 text-[#8C7853]" />
                  <span>Add Checkout (+€2,500)</span>
                </button>
              </div>

            </div>
          </div>

          {/* Legacy Ledger Overview & Privilege Hotline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            
            {/* Left: Overall Ledger Standing */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492]">
                <span>Total Settled Acquisitions & Commissions</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono tabular-nums font-bold text-[#181715] dark:text-[#FAF8F3]">
                  €{totalSpend.toLocaleString()} EUR
                </span>
                <span className="text-xs uppercase tracking-wider text-[#706B63] dark:text-[#9F998F]">
                  Cumulative Patronage
                </span>
              </div>

              <p className="text-xs text-[#605B54] dark:text-[#A7A096] font-light leading-relaxed">
                Enjoy {dynamicEarlyAccessHours}-hour pre-release runway privileges, complimentary bespoke monogramming, and private salon appointments.
              </p>
            </div>

            {/* Middle: Fast Simulation Button */}
            <div className="lg:col-span-4 p-4 bg-[#F4F1EA] dark:bg-[#1E1C19] border border-[#E2DDD3] dark:border-[#302C28] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-sans-luxury text-[#706B63] dark:text-[#A7A096] block">
                  Simulate New Haute Order
                </span>
                <span className="text-xs font-semibold text-[#181715] dark:text-[#FAF8F3]">
                  LV Ski Jacket 1AKX5Z (+€4,200)
                </span>
              </div>
              <button
                onClick={handleSimulatePurchase}
                className="py-1.5 px-3 text-[11px] uppercase tracking-wider font-sans-luxury bg-[#8C7853] hover:bg-[#786644] text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Simulate</span>
              </button>
            </div>

            {/* Right: Curator Hotline */}
            <div className="lg:col-span-3 flex flex-col justify-center space-y-2 border-t lg:border-t-0 lg:border-l border-[#E2DDD3] dark:border-[#2C2926] lg:pl-6">
              <button
                onClick={onOpenSalonBooking}
                className="w-full py-2.5 px-3 text-[11px] uppercase tracking-wider font-sans-luxury bg-[#181715] text-[#FAF9F5] hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8C7853]" />
                <span>Private Curator Suite</span>
              </button>
            </div>

          </div>

        </div>

        {/* Global Notices */}
        {rsvpNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{rsvpNotice}</span>
          </motion.div>
        )}

        {allocationNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3.5 bg-[#FAF9F5] dark:bg-[#1A1816] border border-[#8C7853] text-[#181715] dark:text-[#FAF8F3] text-xs flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#8C7853] shrink-0" />
            <span>{allocationNotice}</span>
          </motion.div>
        )}

        {/* Segmented Sub-Navigation Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-[#E0D9CB] dark:border-[#2B2724] pb-4">
          <button
            onClick={() => setActiveTab('loyalty-points')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans-luxury transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'loyalty-points'
                ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] font-semibold shadow-sm border border-[#D4AF37]'
                : 'bg-[#EDE8DE] text-[#605B54] hover:bg-[#E2DDCF] dark:bg-[#1E1C19] dark:text-[#A7A096]'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Loyalty Points & VVIP Ascension</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans-luxury transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] font-semibold shadow-sm'
                : 'bg-[#EDE8DE] text-[#605B54] hover:bg-[#E2DDCF] dark:bg-[#1E1C19] dark:text-[#A7A096]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#8C7853]" />
            <span>Recent Purchases Timeline ({purchases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('benefits')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans-luxury transition-all cursor-pointer ${
              activeTab === 'benefits'
                ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] font-semibold'
                : 'bg-[#EDE8DE] text-[#605B54] hover:bg-[#E2DDCF] dark:bg-[#1E1C19] dark:text-[#A7A096]'
            }`}
          >
            Personalized Tier Benefits
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans-luxury transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'events'
                ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] font-semibold'
                : 'bg-[#EDE8DE] text-[#605B54] hover:bg-[#E2DDCF] dark:bg-[#1E1C19] dark:text-[#A7A096]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#8C7853]" />
            <span>Private Salon Invitations ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('capsules')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans-luxury transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'capsules'
                ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] font-semibold'
                : 'bg-[#EDE8DE] text-[#605B54] hover:bg-[#E2DDCF] dark:bg-[#1E1C19] dark:text-[#A7A096]'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-[#8C7853]" />
            <span>Early Access Capsules</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans-luxury transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] font-semibold'
                : 'bg-[#EDE8DE] text-[#605B54] hover:bg-[#E2DDCF] dark:bg-[#1E1C19] dark:text-[#A7A096]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#8C7853]" />
            <span>Archival Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('concierge-chat')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans-luxury transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'concierge-chat'
                ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] font-semibold shadow-sm'
                : 'bg-[#EDE8DE] text-[#605B54] hover:bg-[#E2DDCF] dark:bg-[#1E1C19] dark:text-[#A7A096]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#8C7853]" />
            <span>Salon Concierge Chat</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB: LOYALTY POINTS PROGRAM & VVIP STATUS PROGRESSION */}
        {/* ============================================================== */}
        {activeTab === 'loyalty-points' && (
          <div className="mt-8">
            <LoyaltyPointsProgram
              purchases={purchases}
              currentSpend={currentCheckoutSpend}
              onSimulatePurchase={handleSimulatePurchase}
              onAdjustSpend={handleAdjustCheckoutSpend}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: SUMMARIZED RECENT PURCHASES TIMELINE FOR LOGGED-IN CLIENT */}
        {/* ============================================================== */}
        {activeTab === 'timeline' && (
          <div className="mt-8 space-y-6 animate-fade-in">
            {/* Timeline Header Summary Banner */}
            <div className="p-4 sm:p-5 bg-[#FAF9F5] dark:bg-[#181614] border border-[#DDD6C8] dark:border-[#2C2926] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
                  Patron Acquisition Chronology
                </h4>
                <p className="text-xs text-[#706B63] dark:text-[#9F998F] font-light">
                  A verifiable chronological record of your commissions, haute couture garments, and insured deliveries.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-center sm:text-right">
                  <span className="text-[10px] uppercase text-[#878177] block">Total Settled</span>
                  <span className="font-semibold text-sm text-[#181715] dark:text-[#FAF8F3]">
                    €{totalSpend.toLocaleString()} EUR
                  </span>
                </div>
                <div className="w-[1px] h-8 bg-[#DDD6C8] dark:bg-[#2C2926]" />
                <div className="text-center sm:text-right">
                  <span className="text-[10px] uppercase text-[#878177] block">Acquisitions</span>
                  <span className="font-semibold text-sm text-[#8C7853]">
                    {purchases.length} Commissions
                  </span>
                </div>
              </div>
            </div>

            {/* Vertical Chronological Timeline */}
            <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[#8C7853] before:via-[#C5B492] before:to-[#E0D9CB] dark:before:to-[#2B2724]">
              {purchases.map((purchase, idx) => {
                const isInTransit = purchase.status === 'In Transit';
                const isDelivered = purchase.status === 'Delivered';

                return (
                  <div key={purchase.orderId} className="relative group">
                    {/* Glowing Timeline Node Indicator */}
                    <div className={`absolute -left-6 sm:-left-10 top-3 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                      isInTransit 
                        ? 'border-[#8C7853] bg-amber-500 shadow-md ring-4 ring-amber-500/20' 
                        : 'border-[#8C7853] bg-[#FAF9F5] dark:bg-[#181614]'
                    }`}>
                      {isInTransit ? (
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                      ) : (
                        <Check className="w-3 h-3 text-[#8C7853]" />
                      )}
                    </div>

                    {/* Timeline Card */}
                    <div className="p-5 sm:p-6 bg-[#FAF9F5] dark:bg-[#181614] border border-[#DDD6C8] dark:border-[#2C2926] shadow-sm hover:border-[#8C7853] transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E8E2D5] dark:border-[#282522]">
                        
                        {/* Order Date & Docket */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-semibold text-[#8C7853]">
                              {purchase.orderId}
                            </span>
                            <span aria-hidden="true" className="opacity-30">·</span>
                            <span className="text-xs uppercase tracking-wider font-mono text-[#706B63] dark:text-[#9F998F]">
                              {purchase.date}
                            </span>
                          </div>
                          <div className="text-xs text-[#57534D] dark:text-[#A7A096]">
                            {purchase.destinationCity || 'Place Vendôme Certified Dispatch'}
                          </div>
                        </div>

                        {/* Status Badge & Settled Amount */}
                        <div className="flex flex-wrap items-center sm:flex-col sm:items-end gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-sans-luxury uppercase tracking-wider font-medium border ${
                            isInTransit
                              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                              : isDelivered
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                              : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                          }`}>
                            {isInTransit && <Truck className="w-3.5 h-3.5 animate-pulse" />}
                            {isDelivered && <CheckCircle2 className="w-3.5 h-3.5" />}
                            <span>{purchase.status}</span>
                          </span>

                          <span className="font-mono text-sm font-semibold text-[#181715] dark:text-[#FAF8F3]">
                            €{purchase.amount.toLocaleString()} EUR
                          </span>
                        </div>
                      </div>

                      {/* Itemized Pieces with Thumbnails */}
                      <div className="pt-4 space-y-3">
                        <div className="text-[10px] uppercase tracking-wider font-sans-luxury text-[#878177]">
                          Acquired Haute Silhouettes ({purchase.items.length})
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {purchase.items.map((item, i) => (
                            <div 
                              key={i} 
                              className="p-3 bg-[#F4F0E6] dark:bg-[#1E1C19] border border-[#E4DFD3] dark:border-[#2D2925] flex items-center gap-3"
                            >
                              {purchase.itemThumbnails && purchase.itemThumbnails[i] ? (
                                <img
                                  src={purchase.itemThumbnails[i]}
                                  alt={item}
                                  className="w-12 h-12 object-cover object-[center_20%] border border-[#CEC7B9] dark:border-[#38332E] shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-[#8C7853]/15 text-[#8C7853] flex items-center justify-center shrink-0">
                                  <ShoppingBag className="w-5 h-5" />
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-serif-luxury text-[#181715] dark:text-[#FAF8F3] line-clamp-1 font-medium">
                                  {item}
                                </p>
                                <span className="text-[10px] text-[#706B63] dark:text-[#9F998F] block">
                                  Place Vendôme Atelier Archive Registered
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {purchase.vaultNotes && (
                          <div className="p-2.5 bg-neutral-100/60 dark:bg-neutral-900/60 border border-[#E0D9CB] dark:border-[#2A2724] text-[11px] text-[#605B54] dark:text-[#9F998F] flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#8C7853] shrink-0" />
                            <span>{purchase.vaultNotes}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Action Controls */}
                      <div className="mt-4 pt-3 border-t border-[#E8E2D5] dark:border-[#282522] flex flex-wrap items-center justify-between gap-3 text-xs">
                        {purchase.trackingNumber && (
                          <span className="font-mono text-[11px] text-[#706B63] dark:text-[#9F998F]">
                            Waybill: <strong>{purchase.trackingNumber}</strong>
                          </span>
                        )}

                        <div className="flex items-center gap-3 ml-auto">
                          {onOpenOrderStatus && (
                            <button
                              onClick={() => onOpenOrderStatus(purchase.orderId)}
                              className="px-3 py-1.5 bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] text-[11px] uppercase tracking-wider font-sans-luxury hover:bg-[#33302B] transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>Track Consignment</span>
                              <ChevronRight className="w-3 h-3 text-[#8C7853]" />
                            </button>
                          )}

                          {onOpenSalonBooking && (
                            <button
                              onClick={onOpenSalonBooking}
                              className="px-3 py-1.5 border border-[#C5BDAF] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] text-[11px] uppercase tracking-wider font-sans-luxury hover:border-[#181715] transition-colors cursor-pointer"
                            >
                              Atelier Refresh
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Timeline Bottom Guarantee */}
            <div className="p-4 bg-[#EDE8DE] dark:bg-[#1A1816] border border-[#D5CFC5] dark:border-[#2D2A26] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#706B63] dark:text-[#9F998F]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8C7853]" />
                <span>All patron orders are accompanied by official wax-sealed physical provenance dossiers.</span>
              </div>
              <button
                onClick={() => {
                  setAllocationNotice('Official Patron Archival Statement (PDF) generated with Place Vendôme heraldic signet.');
                  setTimeout(() => setAllocationNotice(null), 4000);
                }}
                className="text-[#8C7853] hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Client Archival Dossier (PDF)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: All 3 Tiers Comparison */}
        {activeTab === 'benefits' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {ELITE_TIERS.map((tier) => {
              const isCurrent = tier.id === activeTier;
              return (
                <div
                  key={tier.id}
                  className={`p-6 border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-[#FAF9F5] dark:bg-[#191715] border-[#8C7853] shadow-md ring-1 ring-[#8C7853]'
                      : 'bg-[#FAF9F5]/70 dark:bg-[#151311] border-[#E0D9CB] dark:border-[#2C2926]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-sans-luxury text-[#8C7853] dark:text-[#C5B492] font-semibold">
                        {tier.frenchTitle}
                      </span>
                      {isCurrent ? (
                        <span className="px-2 py-0.5 bg-[#8C7853] text-white text-[10px] font-sans-luxury uppercase tracking-wider font-medium">
                          Your Active Tier
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#878177]">
                          From €{tier.minSpend.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] mb-1">
                      {tier.name}
                    </h4>

                    <div className="py-2 border-b border-[#E8E4DC] dark:border-[#272421] text-xs text-[#706B63] dark:text-[#9F998F] flex items-center justify-between font-mono tabular-nums">
                      <span>Threshold:</span>
                      <span className="font-semibold text-[#181715] dark:text-[#FAF8F3]">
                        €{tier.minSpend.toLocaleString()} {tier.maxSpend ? `– €${tier.maxSpend.toLocaleString()}` : '+'}
                      </span>
                    </div>

                    <ul className="mt-4 space-y-2 text-xs text-[#57534D] dark:text-[#ACA59B]">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <Check className="w-3.5 h-3.5 text-[#8C7853] shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8E4DC] dark:border-[#272421]">
                    <div className="text-[11px] text-[#706B63] dark:text-[#9F998F] space-y-1">
                      <p><strong className="text-[#181715] dark:text-[#FAF8F3]">Early Access: </strong>{tier.perkHighlights.earlyAccessHours} Hours</p>
                      <p><strong className="text-[#181715] dark:text-[#FAF8F3]">Advisory Desk: </strong>{tier.perkHighlights.conciergeLevel}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Private Event Invitations */}
        {activeTab === 'events' && (
          <div className="mt-8 space-y-4 animate-fade-in">
            {events.map((ev) => {
              const isLocked = ev.requiredTier === 'nocturne' && activeTier !== 'nocturne';

              return (
                <div
                  key={ev.id}
                  className={`p-6 border transition-all ${
                    isLocked
                      ? 'bg-[#F2EDE2]/60 dark:bg-[#161412] border-[#E0D9CB] dark:border-[#2B2724] opacity-80'
                      : 'bg-[#FAF9F5] dark:bg-[#181614] border-[#E0D9CB] dark:border-[#2C2926]'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-sans-luxury text-[#8C7853] dark:text-[#C5B492] font-semibold">
                          {ev.city} · {ev.location}
                        </span>
                        <span aria-hidden="true" className="opacity-40">·</span>
                        <span className="text-[10px] font-sans-luxury uppercase text-[#706B63] dark:text-[#9F998F]">
                          Dress Code: {ev.dressCode}
                        </span>
                        {isLocked ? (
                          <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-amber-800 dark:text-amber-400 font-sans-luxury uppercase border border-amber-300 dark:border-amber-800 px-2 py-0.5">
                            <Lock className="w-3 h-3" />
                            <span>Reserved for Cercle Nocturne</span>
                          </span>
                        ) : (
                          <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-emerald-800 dark:text-emerald-400 font-sans-luxury uppercase border border-emerald-300 dark:border-emerald-800 px-2 py-0.5">
                            <Unlock className="w-3 h-3" />
                            <span>Invitation Unlocked for Your Tier</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
                        {ev.title}
                      </h3>

                      <p className="text-xs italic font-serif-luxury text-[#787268] dark:text-[#9E978C]">
                        {ev.frenchTitle} · Hosted by {ev.curatorHost}
                      </p>

                      <p className="text-xs text-[#57534D] dark:text-[#ACA59B] leading-relaxed max-w-2xl font-light">
                        {ev.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#706B63] dark:text-[#9F998F] pt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#8C7853]" />
                          <span>{ev.date}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#8C7853]" />
                          <span>{ev.time}</span>
                        </span>
                      </div>
                    </div>

                    {/* RSVP Controls */}
                    <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2 pt-2 lg:pt-0">
                      {isLocked ? (
                        <div className="text-right">
                          <button
                            onClick={handleSimulatePurchase}
                            className="px-4 py-2 bg-[#181715] text-[#FAF9F5] text-xs uppercase tracking-wider font-sans-luxury cursor-pointer"
                          >
                            Reach Nocturne Tier
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleRsvp(ev.id, 'attending')}
                            className={`px-4 py-2 text-xs uppercase tracking-wider font-sans-luxury transition-all cursor-pointer ${
                              ev.rsvpStatus === 'attending'
                                ? 'bg-emerald-800 text-white font-medium'
                                : 'border border-[#C8C2B7] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] hover:bg-[#181715] hover:text-white'
                            }`}
                          >
                            {ev.rsvpStatus === 'attending' ? 'Attending Confirmed ✓' : 'Accept Invitation'}
                          </button>

                          <button
                            onClick={() => handleToggleRsvp(ev.id, 'declined')}
                            className={`px-3 py-2 text-xs uppercase tracking-wider font-sans-luxury transition-all cursor-pointer ${
                              ev.rsvpStatus === 'declined'
                                ? 'bg-zinc-800 text-white'
                                : 'text-[#878177] hover:text-[#181715] dark:hover:text-white'
                            }`}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Early Access Capsules */}
        {activeTab === 'capsules' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            {UPCOMING_CAPSULES.map((cap) => {
              const isUnlocked = activeTier === 'nocturne' || (activeTier === 'or' && cap.unlockedFor === 'or');

              return (
                <div
                  key={cap.id}
                  className="p-6 bg-[#FAF9F5] dark:bg-[#181614] border border-[#E0D9CB] dark:border-[#2C2926] flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] max-h-60 overflow-hidden mb-4 bg-black/10">
                      <img
                        src={cap.previewImage}
                        alt={cap.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-[center_20%] filter brightness-[0.95]"
                      />
                      <div className="absolute top-3 left-3 bg-[#181715]/90 text-white px-2.5 py-1 text-[10px] uppercase tracking-wider font-sans-luxury">
                        Release Date: {cap.releaseDate}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#8C7853] dark:text-[#C5B492] mb-1 font-semibold">
                      <span>{cap.piecesCount} Numbered Silhouettes</span>
                      <span>{isUnlocked ? 'Unlocked 48h Window' : 'Locked Tier Preview'}</span>
                    </div>

                    <h4 className="text-2xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
                      {cap.title}
                    </h4>

                    <p className="text-xs uppercase tracking-wider text-[#706B63] dark:text-[#9F998F] pt-0.5">
                      {cap.subtitle}
                    </p>

                    <p className="text-xs text-[#57534D] dark:text-[#ACA59B] pt-3 leading-relaxed font-light">
                      {cap.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8E4DC] dark:border-[#272421] flex items-center justify-between">
                    <span className="text-[11px] text-[#706B63] dark:text-[#9F998F]">
                      Archival Priority Allocation
                    </span>

                    {isUnlocked ? (
                      <button
                        onClick={() => handleRequestAllocation(cap.title)}
                        className="py-2 px-4 bg-[#181715] text-[#FAF9F5] hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] text-xs uppercase tracking-wider font-sans-luxury font-medium transition-colors cursor-pointer"
                      >
                        Request Pre-Order Allocation
                      </button>
                    ) : (
                      <span className="text-xs text-amber-800 dark:text-amber-400 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Requires Nocturne Standing</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 4: Acquisition History Ledger */}
        {activeTab === 'ledger' && (
          <div className="mt-8 space-y-4 animate-fade-in">
            <div className="p-4 bg-[#FAF9F5] dark:bg-[#181614] border border-[#E0D9CB] dark:border-[#2C2926] overflow-x-auto">
              <table className="w-full text-left font-sans-luxury text-xs">
                <thead>
                  <tr className="border-b border-[#D5CFC5] dark:border-[#38332E] text-[#878177] uppercase text-[10px] tracking-wider">
                    <th className="pb-2 font-normal">Docket / Order</th>
                    <th className="pb-2 font-normal">Date</th>
                    <th className="pb-2 font-normal">Silhouettes Acquired</th>
                    <th className="pb-2 font-normal">Settled Amount</th>
                    <th className="pb-2 font-normal">Logistics Status</th>
                    <th className="pb-2 font-normal text-right">Consignment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E1D8] dark:divide-[#272320]">
                  {purchases.map((purchase) => (
                    <tr key={purchase.orderId} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 font-mono font-medium text-[#181715] dark:text-[#FAF8F3]">
                        {purchase.orderId}
                      </td>
                      <td className="py-3 font-mono text-[#706B63] dark:text-[#9F998F]">
                        {purchase.date}
                      </td>
                      <td className="py-3 text-[#181715] dark:text-[#FAF8F3]">
                        <ul className="space-y-0.5">
                          {purchase.items.map((item, idx) => (
                            <li key={idx}>· {item}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3 font-mono font-semibold text-[#181715] dark:text-[#FAF8F3]">
                        €{purchase.amount.toLocaleString()} EUR
                      </td>
                      <td className="py-3">
                        <span className={`font-medium ${
                          purchase.status === 'In Transit' 
                            ? 'text-amber-700 dark:text-amber-400' 
                            : 'text-emerald-700 dark:text-emerald-400'
                        }`}>
                          {purchase.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {onOpenOrderStatus && (
                          <button
                            onClick={() => onOpenOrderStatus(purchase.orderId)}
                            className="text-[#8C7853] hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <span>Inspect Waybill</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-[#706B63] dark:text-[#9F998F] pt-2">
              <span>All acquisitions are signed and preserved in the Place Vendôme historic archive ledger.</span>
              <button
                onClick={() => {
                  setAllocationNotice('Official Patron Archival Statement generated with Place Vendôme heraldic stamp.');
                  setTimeout(() => setAllocationNotice(null), 4000);
                }}
                className="text-[#8C7853] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Official Patron Statement</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: REAL-TIME SALON CONCIERGE CHAT WITH BOUTIQUE STYLISTS     */}
        {/* ============================================================== */}
        {activeTab === 'concierge-chat' && (
          <div className="mt-8 animate-fade-in">
            <ConciergeChatSection
              onOpenSalonBooking={onOpenSalonBooking}
              onOpenAuthModal={onOpenAuthModal}
              onSelectProduct={onSelectProduct}
            />
          </div>
        )}

        {/* Dynamic Loyalty Tier Privileges Dossier Modal */}
        {isTierModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
            onClick={() => setIsTierModalOpen(false)}
          >
            <div 
              className="relative w-full max-w-xl bg-[#FAF9F5] dark:bg-[#161513] border border-[#DDD6C8] dark:border-[#2C2926] shadow-2xl p-6 sm:p-8 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#E8E2D5] dark:border-[#2B2724]">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-md ${dynamicBadgeBg} border ${dynamicBorderColor} flex items-center justify-center ${dynamicGlow}`}>
                    <Crown className={`w-6 h-6 ${dynamicTextColor}`} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-[#8C7853] block">
                      Place Vendôme Archival Register
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
                      {dynamicTier} Patron Standing
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setIsTierModalOpen(false)}
                  className="p-1 text-[#706B63] hover:text-[#181715] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status details */}
              <div className="mt-5 space-y-4 text-xs">
                <div className="p-3.5 bg-[#F2EDE2] dark:bg-[#1F1D1A] border border-[#E0D9CB] dark:border-[#2C2926] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-[#706B63] dark:text-[#9F998F] block">
                      Completed Checkout Spend
                    </span>
                    <span className="font-mono text-base font-bold text-[#181715] dark:text-[#FAF8F3]">
                      €{currentCheckoutSpend.toLocaleString()} EUR
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-[#706B63] dark:text-[#9F998F] block">
                      Tier Level
                    </span>
                    <span className={`font-serif-luxury font-bold text-sm ${dynamicTextColor}`}>
                      {dynamicTier} ({dynamicEarlyAccessHours}h Early Access)
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] uppercase tracking-wider font-sans-luxury text-[#181715] dark:text-[#FAF8F3] font-semibold mb-2">
                    Unlocked Tier Privileges
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>{dynamicEarlyAccessHours}-Hour Runway Early Access:</strong> Pre-emptive reservations on upcoming capsules from Louis Vuitton, Dior, Victoria's Secret, and Maison Aurelia.co before global release.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Place Vendôme Private Salons:</strong> Dedicated fitting salons in Paris, Milan, London, and New York with personalized champagne service.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Bespoke Monogramming:</strong> Complimentary hot foil or 24k gold leaf initials on leather maroquinerie, coats, and silk robes.</span>
                    </li>
                    {currentCheckoutSpend >= 8000 && (
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Direct Liaison Concierge:</strong> Direct WhatsApp/Signal contact with Atelier Curator Éléonore de Rochechouart.</span>
                      </li>
                    )}
                    {currentCheckoutSpend >= 15000 && (
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span><strong>Couture Elite Grand Patronage:</strong> Lifetime complimentary tailoring adjustments, biometric armored chauffeur delivery, and private vault champagne hospitality at 14 Place Vendôme.</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsTierModalOpen(false)}
                    className="w-full py-2.5 bg-[#181715] text-[#FAF8F3] dark:bg-[#FAF8F3] dark:text-[#181715] uppercase tracking-wider text-xs font-semibold cursor-pointer"
                  >
                    Close Privileges Dossier
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
