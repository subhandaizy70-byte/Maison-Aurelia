import React, { useState, useMemo } from 'react';
import { 
  Crown, 
  Sparkles, 
  Award, 
  Coins, 
  TrendingUp, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  ChevronRight, 
  ArrowRight, 
  ShoppingBag, 
  Plus, 
  ShieldCheck, 
  Gift, 
  Flame,
  Star,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PatronPurchase } from '../types/fashion';

export interface VvipTier {
  id: 'silver' | 'vip-gold' | 'vvip-platinum' | 'vvip-imperial';
  name: string;
  badge: string;
  frenchTitle: string;
  minPoints: number;
  maxPoints: number | null;
  multiplier: number;
  perks: string[];
  vvipExclusive: boolean;
  accentColor: string;
  badgeBg: string;
}

export const VVIP_TIERS: VvipTier[] = [
  {
    id: 'silver',
    name: 'Adhérent Silver',
    badge: 'Member',
    frenchTitle: 'Cercle d’Argent · Initiation Place Vendôme',
    minPoints: 0,
    maxPoints: 2999,
    multiplier: 1.0,
    perks: [
      'Standard 1.0x Patron Points accrual on all acquisitions',
      'Complimentary insured express courier worldwide',
      'Digital provenance registry archival certificates'
    ],
    vvipExclusive: false,
    accentColor: 'text-slate-300 border-slate-400',
    badgeBg: 'bg-gradient-to-br from-[#2A2927] to-[#171614]'
  },
  {
    id: 'vip-gold',
    name: 'VIP Gold',
    badge: 'VIP',
    frenchTitle: 'Cercle d’Or · Rang des Curateurs',
    minPoints: 3000,
    maxPoints: 7999,
    multiplier: 1.5,
    perks: [
      '1.5x Accelerated Patron Points on every checkout',
      '48-Hour priority early access to Haute Couture capsules',
      'Private fitting suite & Champagne reception in Paris & Milan',
      'Bespoke 24k gold initial monogramming on leather goods'
    ],
    vvipExclusive: false,
    accentColor: 'text-[#D4AF37] border-[#C5A059]',
    badgeBg: 'bg-gradient-to-br from-[#302517] to-[#1C160F]'
  },
  {
    id: 'vvip-platinum',
    name: 'VVIP Platine',
    badge: 'VVIP',
    frenchTitle: 'Cercle Platine d’Exception · Haute Présidence',
    minPoints: 8000,
    maxPoints: 14999,
    multiplier: 2.0,
    perks: [
      '2.0x Double Patron Points on all pieces & commissions',
      'Direct dedicated cell to Salon Director Éléonore',
      'Personal master tailor assigned for bespoke fittings in 4 capitals',
      'Pre-emptive runway reservations before public disclosure',
      'Complimentary armored biometric courier hand-delivery'
    ],
    vvipExclusive: true,
    accentColor: 'text-indigo-200 border-indigo-400',
    badgeBg: 'bg-gradient-to-br from-[#1E2230] to-[#10121B]'
  },
  {
    id: 'vvip-imperial',
    name: 'VVIP Grand Cercle Impérial',
    badge: 'VVIP SOVEREIGN',
    frenchTitle: 'Cercle Impérial Vendôme · Grand Patron Archival',
    minPoints: 15000,
    maxPoints: null,
    multiplier: 3.0,
    perks: [
      '3.0x Triple Patron Points with permanent sovereign lifetime validity',
      '100% Unrestricted global atelier runway allocation rights',
      'Master tailor & private wardrobe team flown to your residence',
      'Exclusive invitation to the annual Place Vendôme Private Gala & Cellar Tasting',
      'Custom silk weaver commission rights with bespoke monogram jacquard'
    ],
    vvipExclusive: true,
    accentColor: 'text-amber-300 border-amber-300',
    badgeBg: 'bg-gradient-to-br from-[#261E0E] via-[#382B12] to-[#110D05]'
  }
];

interface LoyaltyPointsProgramProps {
  purchases: PatronPurchase[];
  currentSpend: number;
  onSimulatePurchase?: () => void;
  onAdjustSpend?: (amount: number) => void;
}

export const LoyaltyPointsProgram: React.FC<LoyaltyPointsProgramProps> = ({
  purchases,
  currentSpend,
  onSimulatePurchase,
  onAdjustSpend
}) => {
  const [redemptionNotice, setRedemptionNotice] = useState<string | null>(null);

  // 1 EUR spent = 1 base Patron Point
  // Total calculated points = base purchases points + current checkout spend points
  const purchasePoints = useMemo(() => {
    return purchases.reduce((sum, p) => sum + Math.round(p.amount), 0);
  }, [purchases]);

  const totalPoints = purchasePoints + Math.round(currentSpend);

  // Determine current VVIP Tier
  const currentTier = useMemo<VvipTier>(() => {
    if (totalPoints >= 15000) return VVIP_TIERS[3];
    if (totalPoints >= 8000) return VVIP_TIERS[2];
    if (totalPoints >= 3000) return VVIP_TIERS[1];
    return VVIP_TIERS[0];
  }, [totalPoints]);

  // Determine Next VVIP Tier
  const nextTierIndex = VVIP_TIERS.findIndex((t) => t.id === currentTier.id) + 1;
  const nextTier = nextTierIndex < VVIP_TIERS.length ? VVIP_TIERS[nextTierIndex] : null;

  // Calculate progress to next tier
  const progressPercent = useMemo(() => {
    if (!nextTier) return 100;
    const tierMin = currentTier.minPoints;
    const tierMax = nextTier.minPoints;
    const pointsInTier = Math.max(0, totalPoints - tierMin);
    const range = tierMax - tierMin;
    return Math.min(100, Math.max(0, Math.round((pointsInTier / range) * 100)));
  }, [totalPoints, currentTier, nextTier]);

  const pointsToNext = nextTier ? Math.max(0, nextTier.minPoints - totalPoints) : 0;
  const atelierCreditValuation = Math.floor(totalPoints / 10); // 10 pts = €1 atelier credit

  // Redeemable Privileges catalog
  const redeemablePrivileges = [
    {
      id: 'privilege-monogram',
      title: 'Bespoke 24k Gold Foil Monogramming',
      cost: 1500,
      description: 'Hand-embossed initials stamped with authentic Place Vendôme artisanal leaf.',
      category: 'Atelier Craft'
    },
    {
      id: 'privilege-suite',
      title: 'Private Fitting Suite Champagne Reception',
      cost: 2500,
      description: 'Grand Cru champagne tasting and dedicated salon fitting suite for 3 hours.',
      category: 'Salon Privé'
    },
    {
      id: 'privilege-transit',
      title: 'Armored Bonded Courier Hand-Delivery',
      cost: 4000,
      description: 'Climate-monitored armored vault delivery directly to your penthouse or yacht.',
      category: 'White-Glove'
    },
    {
      id: 'privilege-tailor',
      title: 'Master Cutter Personal Alteration Docket',
      cost: 6500,
      description: 'Personal master tailor session with custom silk thread architectural re-draping.',
      category: 'Haute Couture'
    }
  ];

  const handleRedeem = (title: string, cost: number) => {
    if (totalPoints < cost) {
      setRedemptionNotice(`You require ${(cost - totalPoints).toLocaleString()} more Fleur-de-lis points to redeem "${title}".`);
      setTimeout(() => setRedemptionNotice(null), 4000);
      return;
    }
    setRedemptionNotice(`Privilege Confirmed: "${title}" has been reserved under your Place Vendôme account dossier.`);
    setTimeout(() => setRedemptionNotice(null), 4500);
  };

  return (
    <div className="space-y-8 font-sans-luxury">
      
      {/* 1. HERO POINTS & VVIP STATUS COCKPIT */}
      <div className="bg-[#181715] text-[#FAF9F5] dark:bg-[#121110] border border-[#8C7853]/40 p-6 sm:p-8 relative overflow-hidden shadow-xl">
        {/* Ambient Gold Radial Flare */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#D4AF37]/15 via-[#8C7853]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Total Fleur-de-lis Points Balance */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-mono text-[#D4AF37] font-semibold">
                Place Vendôme Patron Points
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono bg-[#8C7853]/30 text-[#E0D5BE] border border-[#8C7853]/40">
                1 EUR = 1 Pt
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold tracking-tight text-[#FAF9F5] tabular-nums">
                {totalPoints.toLocaleString()}
              </span>
              <span className="text-sm uppercase tracking-[0.2em] font-mono text-[#C5B492]">
                Points
              </span>
            </div>

            <p className="text-xs text-[#A59F94] leading-relaxed font-light">
              Accruing across all boutique acquisitions, bespoke commissions, and runway orders. Convertible to <strong className="text-[#FAF9F5]">€{atelierCreditValuation.toLocaleString()} EUR</strong> in atelier credits.
            </p>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#24211D] border border-[#8C7853]/50 text-[#D4AF37] text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentTier.multiplier}x Multiplier Active</span>
              </span>

              {currentTier.vvipExclusive && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37] text-[#FAF8F3] text-xs font-mono font-bold">
                  <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>VVIP STATUS GRANTED</span>
                </span>
              )}
            </div>
          </div>

          {/* Middle: Active Tier Standing & Milestone Ascension */}
          <div className="lg:col-span-4 p-5 bg-[#201D1A] border border-[#38332E] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.18em] font-mono text-[#8C7853]">
                Current Tier Standing
              </span>
              <span className="text-xs font-mono font-bold text-[#D4AF37]">
                {progressPercent}% Complete
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-sm bg-[#2C2720] border border-[#D4AF37]/60 flex items-center justify-center shrink-0 shadow-inner">
                <Crown className={`w-6 h-6 ${currentTier.vvipExclusive ? 'text-[#D4AF37]' : 'text-[#C5B492]'}`} />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-serif-luxury text-[#FAF9F5] font-medium leading-tight">
                  {currentTier.name}
                </h4>
                <p className="text-[11px] text-[#A7A096] italic truncate">
                  {currentTier.frenchTitle}
                </p>
              </div>
            </div>

            {/* Glowing Ascension Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-2.5 bg-[#141311] rounded-full overflow-hidden p-[1px] border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-[#8C7853] via-[#C5B492] to-[#D4AF37] shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#A7A096]">
                <span>{currentTier.minPoints.toLocaleString()} Pts</span>
                {nextTier ? (
                  <span className="text-[#D4AF37] font-semibold">
                    Target: {nextTier.minPoints.toLocaleString()} Pts
                  </span>
                ) : (
                  <span className="text-[#D4AF37] font-semibold">Max Standing Attained</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-[#2F2B26] text-[11px] text-[#C5B492]">
              {nextTier ? (
                <span>
                  ✦ Only <strong className="text-white font-mono">{pointsToNext.toLocaleString()} points</strong> needed to attain <strong className="text-[#D4AF37] font-serif-luxury">{nextTier.name}</strong>.
                </span>
              ) : (
                <span className="text-amber-300 font-medium">
                  ✦ Sovereign Status: You possess unrestricted front-row access to all Parisian archives.
                </span>
              )}
            </div>
          </div>

          {/* Right: Quick Points Simulator & Actions */}
          <div className="lg:col-span-3 space-y-2 border-t lg:border-t-0 lg:border-l border-[#332E28] lg:pl-6">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#8C7853] block font-semibold">
              Simulate Points Accrual:
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAdjustSpend && onAdjustSpend(3500)}
                className={`py-2 px-2 text-[10px] uppercase tracking-wider font-sans-luxury border transition-all cursor-pointer ${
                  currentTier.id === 'vip-gold'
                    ? 'bg-[#8C7853] text-white border-[#D4AF37] font-bold'
                    : 'border-[#3D3831] hover:border-[#8C7853] text-[#A59F94] hover:text-white'
                }`}
              >
                VIP Gold (3.5k)
              </button>

              <button
                onClick={() => onAdjustSpend && onAdjustSpend(8500)}
                className={`py-2 px-2 text-[10px] uppercase tracking-wider font-sans-luxury border transition-all cursor-pointer ${
                  currentTier.id === 'vvip-platinum'
                    ? 'bg-[#4338CA] text-white border-indigo-400 font-bold'
                    : 'border-[#3D3831] hover:border-indigo-400 text-[#A59F94] hover:text-white'
                }`}
              >
                VVIP Platine (8.5k)
              </button>

              <button
                onClick={() => onAdjustSpend && onAdjustSpend(16500)}
                className={`py-2 px-2 text-[10px] uppercase tracking-wider font-sans-luxury border transition-all cursor-pointer ${
                  currentTier.id === 'vvip-imperial'
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold'
                    : 'border-[#3D3831] hover:border-[#D4AF37] text-[#A59F94] hover:text-white'
                }`}
              >
                VVIP Sovereign (16.5k)
              </button>

              <button
                onClick={() => onAdjustSpend && onAdjustSpend(0)}
                className="py-2 px-2 text-[10px] uppercase tracking-wider font-sans-luxury border border-[#3D3831] hover:border-red-500 text-[#A59F94] hover:text-red-400 transition-all cursor-pointer"
              >
                Reset (0 pts)
              </button>
            </div>

            <button
              onClick={onSimulatePurchase}
              className="w-full py-2.5 px-3 text-[10px] uppercase tracking-[0.16em] font-sans-luxury bg-[#D4AF37] text-[#181715] hover:bg-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-semibold shadow-md mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Checkout (+4,200 Pts)</span>
            </button>
          </div>

        </div>
      </div>

      {/* Redemption Notification Banner */}
      {redemptionNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[#181715] text-[#FAF9F5] border border-[#D4AF37] text-xs flex items-center gap-2.5 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span>{redemptionNotice}</span>
        </motion.div>
      )}

      {/* 2. VVIP STATUS TIERS ASCENSION STEPPER */}
      <div className="bg-[#FAF9F5] dark:bg-[#181614] border border-[#E0D9CB] dark:border-[#2C2926] p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-mono text-[#8C7853] dark:text-[#C5B492] mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Ascension Hierarchy</span>
            <span aria-hidden="true">·</span>
            <span>Four Sovereign Tiers to VVIP</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
            Progress Toward VVIP Status Tiers
          </h3>
          <p className="text-xs text-[#706B63] dark:text-[#9F998F] mt-1 max-w-2xl font-light">
            Every transaction automatically advances your status in our Firestore-backed master ledger. Attaining VVIP unlocks private defilé access, dedicated master tailor allocation, and bespoke champagne suites.
          </p>
        </div>

        {/* Multi-Tier Stepper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {VVIP_TIERS.map((tier, idx) => {
            const isCompleted = totalPoints >= (tier.maxPoints ? tier.maxPoints + 1 : tier.minPoints);
            const isCurrent = currentTier.id === tier.id;
            const isLocked = totalPoints < tier.minPoints;

            return (
              <div
                key={tier.id}
                className={`p-5 flex flex-col justify-between border transition-all duration-300 relative ${
                  isCurrent
                    ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#121110] border-[#D4AF37] shadow-xl ring-1 ring-[#D4AF37]'
                    : isCompleted
                    ? 'bg-[#F5F1E8] dark:bg-[#1C1A17] border-[#C8BFB0] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3]'
                    : 'bg-[#F9F7F2] dark:bg-[#161412] border-[#E8E2D5] dark:border-[#2A2622] text-[#807B73] opacity-80'
                }`}
              >
                {/* Top Status Pill */}
                <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 gap-2">
                  <span className={`px-2 py-0.5 text-[9px] uppercase font-mono tracking-wider font-bold ${
                    tier.vvipExclusive
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-[#8C7853]/20 text-[#8C7853] dark:text-[#C5B492]'
                  }`}>
                    {tier.badge}
                  </span>

                  <span className="text-[10px] font-mono tracking-wider">
                    {isCurrent ? (
                      <span className="text-[#D4AF37] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>ACTIVE TIER</span>
                      </span>
                    ) : isCompleted ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>UNLOCKED</span>
                      </span>
                    ) : (
                      <span className="text-[#A59F94] flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>LOCKED</span>
                      </span>
                    )}
                  </span>
                </div>

                {/* Tier Name & Points Range */}
                <div className="py-4 space-y-1">
                  <div className="text-[10px] uppercase tracking-wider font-mono text-[#8C7853] dark:text-[#C5B492]">
                    Level 0{idx + 1}
                  </div>
                  <h4 className="text-lg font-serif-luxury font-medium leading-tight">
                    {tier.name}
                  </h4>
                  <div className="text-xs font-mono font-bold pt-1">
                    {tier.minPoints.toLocaleString()} {tier.maxPoints ? `– ${tier.maxPoints.toLocaleString()}` : '+'} Pts
                  </div>
                  <div className="text-[11px] text-[#D4AF37] font-mono">
                    ✦ {tier.multiplier}x Points Multiplier
                  </div>
                </div>

                {/* Tier Perks */}
                <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-2 text-xs">
                  <span className="text-[9px] uppercase tracking-wider font-mono text-[#8C7853] block">
                    Privileges:
                  </span>
                  <ul className="space-y-1.5 text-[11px] font-light leading-snug">
                    {tier.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <span className="text-[#D4AF37] shrink-0 mt-0.5">✦</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. TRACKED PURCHASES WITH EARNED POINTS FEED */}
      <div className="bg-[#FAF9F5] dark:bg-[#181614] border border-[#E0D9CB] dark:border-[#2C2926] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D5] dark:border-[#2B2724]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-mono text-[#8C7853] dark:text-[#C5B492]">
              <Coins className="w-3.5 h-3.5" />
              <span>Purchase Ledger & Points Accrual</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] mt-1">
              Tracked Purchases & Accrued Fleur-de-lis Points
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#706B63] dark:text-[#9F998F] block font-mono">
              Total Purchases Tracked:
            </span>
            <span className="text-base font-mono font-bold text-[#181715] dark:text-[#FAF8F3]">
              {purchases.length} Orders Settled
            </span>
          </div>
        </div>

        {/* Purchase Items List */}
        <div className="space-y-3">
          {purchases.map((purchase) => {
            const earnedPoints = Math.round(purchase.amount);

            return (
              <div
                key={purchase.orderId}
                className="p-4 bg-white dark:bg-[#1E1C19] border border-[#E8E2D5] dark:border-[#2E2B27] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#8C7853] shadow-xs"
              >
                {/* Left: Order Info & Thumbnail */}
                <div className="flex items-center gap-4">
                  {purchase.itemThumbnails?.[0] ? (
                    <img
                      src={purchase.itemThumbnails[0]}
                      alt="Order piece"
                      className="w-12 h-14 object-cover border border-[#DDD6C8] dark:border-[#38332E] shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-14 bg-[#F0ECE1] dark:bg-[#282522] border border-[#DDD6C8] dark:border-[#38332E] flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-5 h-5 text-[#8C7853]" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-[#181715] dark:text-[#FAF8F3]">
                        {purchase.orderId}
                      </span>
                      <span className="text-[10px] font-mono text-[#8C7853]">
                        {purchase.date}
                      </span>
                      <span className="px-2 py-0.2 text-[9px] uppercase font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        {purchase.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-serif-luxury text-[#181715] dark:text-[#FAF8F3] line-clamp-1 mt-0.5">
                      {purchase.items[0]}
                    </h4>

                    <span className="text-[11px] text-[#706B63] dark:text-[#9F998F] block font-light">
                      Destination: {purchase.destinationCity || 'Paris · 14 Place Vendôme Salon'}
                    </span>
                  </div>
                </div>

                {/* Right: Spend Amount & Earned Points Badge */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#EFECE5] dark:border-[#2C2926]">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#706B63] dark:text-[#9F998F] block font-mono">
                      Settled Spend
                    </span>
                    <span className="text-sm font-mono font-bold text-[#181715] dark:text-[#FAF8F3]">
                      €{purchase.amount.toLocaleString()} EUR
                    </span>
                  </div>

                  <div className="p-2 sm:px-3 sm:py-2 bg-[#8C7853]/10 dark:bg-[#8C7853]/20 border border-[#8C7853]/40 text-right shrink-0">
                    <span className="text-[9px] uppercase tracking-wider text-[#8C7853] dark:text-[#D4AF37] block font-mono font-bold">
                      Points Awarded:
                    </span>
                    <span className="text-sm sm:text-base font-mono font-bold text-[#8C7853] dark:text-[#D4AF37] flex items-center gap-1 justify-end">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>+{earnedPoints.toLocaleString()} Pts</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. REDEEMABLE VVIP PRIVILEGES CATALOG */}
      <div className="bg-[#FAF9F5] dark:bg-[#181614] border border-[#E0D9CB] dark:border-[#2C2926] p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-mono text-[#8C7853] dark:text-[#C5B492] mb-1">
            <Gift className="w-3.5 h-3.5" />
            <span>Patronage Rewards</span>
            <span aria-hidden="true">·</span>
            <span>Atelier Experiences</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
            Redeem Points for Private Atelier Privileges
          </h3>
          <p className="text-xs text-[#706B63] dark:text-[#9F998F] mt-1 font-light">
            Convert accrued Fleur-de-lis loyalty points into private salon fittings, gold-foil monogramming, and white-glove security services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {redeemablePrivileges.map((item) => {
            const canAfford = totalPoints >= item.cost;

            return (
              <div
                key={item.id}
                className="p-5 bg-white dark:bg-[#1D1B18] border border-[#E5E0D5] dark:border-[#2E2B27] flex flex-col justify-between hover:border-[#8C7853] transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8C7853] uppercase pb-2 border-b border-[#EAE6DE] dark:border-[#2A2724]">
                    <span>{item.category}</span>
                    <span className="font-bold text-[#D4AF37]">{item.cost.toLocaleString()} Pts</span>
                  </div>

                  <h4 className="text-base font-serif-luxury text-[#181715] dark:text-[#FAF8F3] mt-2 leading-tight">
                    {item.title}
                  </h4>

                  <p className="text-xs text-[#706B63] dark:text-[#9F998F] mt-2 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EAE6DE] dark:border-[#2A2724]">
                  <button
                    onClick={() => handleRedeem(item.title, item.cost)}
                    className={`w-full py-2 px-3 text-[10px] uppercase tracking-wider font-sans-luxury transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 ${
                      canAfford
                        ? 'bg-[#181715] text-[#FAF9F5] hover:bg-[#8C7853] dark:bg-[#FAF9F5] dark:text-[#181715] dark:hover:bg-[#D4AF37]'
                        : 'bg-[#EDE8DE] dark:bg-[#2A2724] text-[#A59F94] hover:bg-[#E2DDD3] cursor-not-allowed'
                    }`}
                  >
                    <span>{canAfford ? 'Redeem Privilege' : `Requires ${item.cost.toLocaleString()} Pts`}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
