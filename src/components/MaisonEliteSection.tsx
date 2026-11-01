import React, { useState } from 'react';
import { ELITE_TIERS, INITIAL_PATRON_PURCHASES, INITIAL_PRIVATE_EVENTS, UPCOMING_CAPSULES } from '../data/maisonEliteData';
import { PatronPurchase, PrivateEvent, EliteTierLevel } from '../types/fashion';
import { Crown, Sparkles, Calendar, Clock, MapPin, CheckCircle2, Lock, Unlock, ArrowRight, ShieldCheck, Download, UserCheck, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MaisonEliteSectionProps {
  onOpenOrderStatus?: (orderId: string) => void;
  onOpenSalonBooking?: () => void;
  externalSpend?: number;
}

export const MaisonEliteSection: React.FC<MaisonEliteSectionProps> = ({
  onOpenOrderStatus,
  onOpenSalonBooking,
  externalSpend = 0,
}) => {
  const [purchases, setPurchases] = useState<PatronPurchase[]>(INITIAL_PATRON_PURCHASES);
  const [events, setEvents] = useState<PrivateEvent[]>(INITIAL_PRIVATE_EVENTS);
  const [activeTab, setActiveTab] = useState<'benefits' | 'events' | 'capsules' | 'ledger'>('benefits');
  const [rsvpNotice, setRsvpNotice] = useState<string | null>(null);
  const [allocationNotice, setAllocationNotice] = useState<string | null>(null);

  // Calculate cumulative spend
  const baseSpend = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalSpend = baseSpend + externalSpend;

  // Determine active tier
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

  // Simulate spending increment
  const handleSimulatePurchase = () => {
    const newOrder: PatronPurchase = {
      orderId: `MA-CMD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: '2026-10-31',
      amount: 2450,
      items: ['The Architectural Double-Breasted Blazer in Super 160s Wool (Place Vendôme)'],
      status: 'Handover Scheduled'
    };
    setPurchases([newOrder, ...purchases]);
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
              Maison Elite Patronage
            </h2>
          </div>

          <p className="text-sm text-[#706B63] dark:text-[#9F998F] max-w-md font-light leading-relaxed">
            Honoring our most devoted connoisseurs with pre-emptive runway allocations, private salon fitting galas, and bespoke master tailor access based on cumulative patronage.
          </p>
        </div>

        {/* Client Tier Dashboard Card */}
        <div className="mt-8 p-6 sm:p-8 bg-[#FAF9F5] dark:bg-[#181614] border border-[#DDD6C8] dark:border-[#2C2926] shadow-sm">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Active Tier Badge & Spending Overview */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492]">
                <span>Registered Patron Ledger #4402</span>
                <span aria-hidden="true">·</span>
                <span>Active Standing</span>
              </div>

              <div className="flex items-baseline gap-3">
                <h3 className="text-3xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
                  {currentTierData.name}
                </h3>
                <span className="text-xs italic font-serif-luxury text-[#787268] dark:text-[#9E978C]">
                  ({currentTierData.frenchTitle})
                </span>
              </div>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-mono tabular-nums font-bold text-[#181715] dark:text-[#FAF8F3]">
                  €{totalSpend.toLocaleString()}
                </span>
                <span className="text-xs uppercase tracking-wider text-[#706B63] dark:text-[#9F998F]">
                  EUR Cumulative Patronage
                </span>
              </div>

              <p className="text-xs text-[#605B54] dark:text-[#A7A096] font-light leading-relaxed">
                Enjoy {currentTierData.perkHighlights.earlyAccessHours}-hour pre-release runway privileges, {currentTierData.perkHighlights.monogramming}, and bespoke appointments.
              </p>
            </div>

            {/* Middle: Progress to Next Tier */}
            <div className="lg:col-span-4 p-5 bg-[#F4F1EA] dark:bg-[#1E1C19] border border-[#E2DDD3] dark:border-[#302C28] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase tracking-wider font-sans-luxury text-[#706B63] dark:text-[#9F998F]">
                  {nextTierData ? `Ascension to ${nextTierData.name}` : 'Highest Standing Attained'}
                </span>
                <span className="font-mono text-xs text-[#8C7853] font-semibold">
                  {progressPercent}% Complete
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#E2DDCF] dark:bg-[#2C2926] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-[#8C7853] rounded-full"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#706B63] dark:text-[#9F998F]">
                {nextTierData ? (
                  <>
                    <span>Remaining: <strong className="font-mono text-[#181715] dark:text-[#FAF8F3]">€{nextTierGap.toLocaleString()} EUR</strong></span>
                    <span>Goal: €{nextTierData.minSpend.toLocaleString()}</span>
                  </>
                ) : (
                  <span>You have unlocked the pinnacle of Place Vendôme Archival Privileges.</span>
                )}
              </div>
            </div>

            {/* Right: Quick Simulation & Privileges Hotline */}
            <div className="lg:col-span-3 flex flex-col justify-center space-y-2.5 border-t lg:border-t-0 lg:border-l border-[#E2DDD3] dark:border-[#2C2926] lg:pl-6">
              <button
                onClick={handleSimulatePurchase}
                className="w-full py-2.5 px-3 text-[11px] uppercase tracking-wider font-sans-luxury border border-[#C8C2B7] dark:border-[#38332E] hover:border-[#181715] dark:hover:border-white text-[#181715] dark:text-[#FAF8F3] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Simulate adding another boutique purchase to see patronage increase"
              >
                <Plus className="w-3.5 h-3.5 text-[#8C7853]" />
                <span>Simulate Spend (+€2,450)</span>
              </button>

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
            onClick={() => setActiveTab('benefits')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans-luxury transition-all cursor-pointer ${
              activeTab === 'benefits'
                ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] font-medium'
                : 'bg-[#EDE8DE] text-[#605B54] hover:bg-[#E2DDCF] dark:bg-[#1E1C19] dark:text-[#A7A096]'
            }`}
          >
            Personalized Tier Benefits
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans-luxury transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'events'
                ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] font-medium'
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
                ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] font-medium'
                : 'bg-[#EDE8DE] text-[#605B54] hover:bg-[#E2DDCF] dark:bg-[#1E1C19] dark:text-[#A7A096]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#8C7853]" />
            <span>Early Access Capsules</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans-luxury transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] font-medium'
                : 'bg-[#EDE8DE] text-[#605B54] hover:bg-[#E2DDCF] dark:bg-[#1E1C19] dark:text-[#A7A096]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#8C7853]" />
            <span>Acquisition Ledger ({purchases.length})</span>
          </button>
        </div>

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
                    <div className="relative aspect-[16/9] overflow-hidden mb-4 bg-black/10">
                      <img
                        src={cap.previewImage}
                        alt={cap.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top filter brightness-[0.95]"
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
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
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
                onClick={() => alert('Official Patron Archival Statement generated with Place Vendôme heraldic stamp.')}
                className="text-[#8C7853] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Official Patron Statement</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
