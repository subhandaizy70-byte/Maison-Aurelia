import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Maximize2, Minimize2, ExternalLink, ShieldCheck, Clock, MapPin, Compass } from 'lucide-react';

interface MaisonStylistBotProps {
  onOpenSalonBooking?: () => void;
  onOpenOrderStatus?: () => void;
}

export const MaisonStylistBot: React.FC<MaisonStylistBotProps> = ({
  onOpenSalonBooking,
  onOpenOrderStatus,
}) => {
  const [isTeaserDismissed, setIsTeaserDismissed] = useState(false);
  const [isVipSuiteOpen, setIsVipSuiteOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Listen for custom trigger events from anywhere in the app (e.g. Header, ProductModal, Salon)
  useEffect(() => {
    const handleConsultAlice = (event: Event) => {
      const customEvent = event as CustomEvent<{ topic?: string; openFullSuite?: boolean }>;
      if (customEvent.detail?.topic) {
        setSelectedTopic(customEvent.detail.topic);
      }
      if (customEvent.detail?.openFullSuite) {
        setIsVipSuiteOpen(true);
      } else {
        // First try to trigger the native embed widget
        triggerNativeWidget();
      }
    };

    window.addEventListener('maison-consult-alice', handleConsultAlice);
    return () => {
      window.removeEventListener('maison-consult-alice', handleConsultAlice);
    };
  }, []);

  const triggerNativeWidget = () => {
    // Look for Jotform / Noupe agent launcher
    const agentRoot = document.querySelector('#JotformAgent-01a1956134507000881cc0894ec0f64607f9');
    if (agentRoot) {
      const btn = agentRoot.querySelector('button, [role="button"], div[tabindex="0"]') as HTMLElement;
      if (btn) {
        btn.click();
        return;
      }
      (agentRoot as HTMLElement).click();
      return;
    }
    // If native widget is not ready yet, open the VIP suite modal
    setIsVipSuiteOpen(true);
  };

  const handleChipClick = (promptText: string) => {
    setSelectedTopic(promptText);
    // Trigger native widget
    triggerNativeWidget();
  };

  return (
    <>
      {/* Discreet Luxury Floating Concierge Badge & Teaser (Bottom Right) */}
      <aside
        aria-label="Maison Aurelia Virtual Stylist Concierge"
        className="fixed bottom-24 right-5 sm:right-8 z-40 flex flex-col items-end pointer-events-none"
      >
        {/* Expanded Teaser Card */}
        {!isTeaserDismissed ? (
          <div className="pointer-events-auto w-[310px] sm:w-[340px] bg-[#FAF9F5]/98 dark:bg-[#1A1815]/98 backdrop-blur-md border border-[#D9D3C7] dark:border-[#332F2A] shadow-2xl p-4 mb-3 transition-all duration-300 animate-fade-in relative group">
            
            {/* Top decorative gold line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] via-[#8C7853] to-[#D4AF37]" />

            {/* Header / Advisor info */}
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src="https://cdn.jotfor.ms/assets/agent-avatars/avatar_icon_67.png"
                    alt="Alice · Maison Aurelia Private Stylist"
                    className="w-10 h-10 rounded-full border border-[#8C7853]/40 object-cover bg-[#2C2926]"
                    onError={(e) => {
                      // Fallback avatar icon
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Glowing online status beacon */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1A1815] shadow-xs" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[13px] font-serif-luxury font-semibold tracking-wider text-[#181715] dark:text-[#F3F0E6] uppercase">
                      Alice
                    </h3>
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#8C7853]/15 text-[#8C7853] dark:text-[#C5B492] tracking-wider uppercase font-sans-luxury font-medium">
                      VIP Advisor
                    </span>
                  </div>
                  <p className="text-[10px] tracking-widest text-[#706B63] dark:text-[#A7A096] uppercase flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-[#8C7853]" />
                    Place Vendôme Atelier
                  </p>
                </div>
              </div>

              {/* Close / Dismiss */}
              <button
                onClick={() => setIsTeaserDismissed(true)}
                className="text-[#8C857B] hover:text-[#181715] dark:hover:text-[#F3F0E6] p-1 transition-colors"
                title="Minimize Concierge Card"
                aria-label="Minimize Concierge Card"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Personalized greeting copy */}
            <p className="text-[12px] leading-relaxed text-[#4A453E] dark:text-[#C8C2B7] mb-3 font-sans-luxury">
              Bonjour. I am <strong className="text-[#181715] dark:text-[#F3F0E6]">Alice</strong>, your private Maison advisor. Ask me for bespoke sizing, silk & cashmere provenance, salon appointments, or private order tracking.
            </p>

            {/* Interactive Luxury Prompt Chips */}
            <div className="space-y-1.5 mb-3">
              <button
                onClick={() => handleChipClick("I would like bespoke sizing advice for the Autumn/Winter collection.")}
                className="w-full text-left px-2.5 py-1.5 bg-[#F2EDE4]/70 dark:bg-[#25221E] hover:bg-[#EAE4D8] dark:hover:bg-[#2E2A25] border border-[#E0DBD0] dark:border-[#38332C] text-[11px] text-[#3D3934] dark:text-[#DDD8CF] transition-colors flex items-center justify-between group/chip"
              >
                <span className="truncate">✦ Bespoke Sizing & Silhouette Fit</span>
                <Sparkles className="w-2.5 h-2.5 text-[#8C7853] opacity-60 group-hover/chip:opacity-100" />
              </button>

              <button
                onClick={() => handleChipClick("How do I book a private fitting at the Place Vendôme salon in Paris?")}
                className="w-full text-left px-2.5 py-1.5 bg-[#F2EDE4]/70 dark:bg-[#25221E] hover:bg-[#EAE4D8] dark:hover:bg-[#2E2A25] border border-[#E0DBD0] dark:border-[#38332C] text-[11px] text-[#3D3934] dark:text-[#DDD8CF] transition-colors flex items-center justify-between group/chip"
              >
                <span className="truncate">✦ Book Place Vendôme Salon Privé</span>
                <Clock className="w-2.5 h-2.5 text-[#8C7853] opacity-60 group-hover/chip:opacity-100" />
              </button>

              <button
                onClick={() => handleChipClick("Can you explain the savoir-faire of the double-faced cashmere and silk?")}
                className="w-full text-left px-2.5 py-1.5 bg-[#F2EDE4]/70 dark:bg-[#25221E] hover:bg-[#EAE4D8] dark:hover:bg-[#2E2A25] border border-[#E0DBD0] dark:border-[#38332C] text-[11px] text-[#3D3934] dark:text-[#DDD8CF] transition-colors flex items-center justify-between group/chip"
              >
                <span className="truncate">✦ Cashmere & Silk Savoir-Faire</span>
                <ShieldCheck className="w-2.5 h-2.5 text-[#8C7853] opacity-60 group-hover/chip:opacity-100" />
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E8E4DC] dark:border-[#2C2926] text-[11px]">
              <button
                onClick={triggerNativeWidget}
                className="inline-flex items-center gap-1.5 font-medium text-[#8C7853] dark:text-[#C5B492] hover:underline cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat with Alice Now</span>
              </button>

              <button
                onClick={() => setIsVipSuiteOpen(true)}
                className="inline-flex items-center gap-1 text-[#706B63] dark:text-[#9F998F] hover:text-[#181715] dark:hover:text-white transition-colors cursor-pointer"
                title="Expand VIP Consultation Suite"
              >
                <Maximize2 className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-wider">VIP Suite</span>
              </button>
            </div>
          </div>
        ) : (
          /* Minimized floating button when teaser card is dismissed */
          <button
            onClick={() => setIsTeaserDismissed(false)}
            className="pointer-events-auto mb-2 flex items-center gap-2 px-3 py-2 bg-[#FAF9F5] dark:bg-[#1A1815] border border-[#8C7853]/50 text-[#181715] dark:text-[#F3F0E6] shadow-xl hover:border-[#8C7853] transition-all duration-200 group"
            title="Open Alice · Private Client Stylist"
            aria-label="Open Alice · Private Client Stylist"
          >
            <div className="relative">
              <img
                src="https://cdn.jotfor.ms/assets/agent-avatars/avatar_icon_67.png"
                alt="Alice"
                className="w-6 h-6 rounded-full border border-[#8C7853]/60 object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[11px] font-serif-luxury tracking-widest uppercase font-semibold text-[#8C7853] dark:text-[#C5B492]">
              Alice · Stylist
            </span>
          </button>
        )}
      </aside>

      {/* Fullscreen / Modal VIP Atelier Suite with Alice */}
      {isVipSuiteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
        >
          <div
            className="relative w-full max-w-4xl h-[88vh] max-h-[820px] bg-[#FAF9F5] dark:bg-[#141311] border border-[#8C7853]/40 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Suite Header */}
            <div className="px-6 py-4 bg-[#1E1C1A] text-[#FAF8F3] border-b border-[#332F2A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://cdn.jotfor.ms/assets/agent-avatars/avatar_icon_67.png"
                    alt="Alice"
                    className="w-9 h-9 rounded-full border border-[#8C7853] object-cover bg-[#2C2926]"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-serif-luxury tracking-[0.16em] uppercase font-bold text-[#EAE6DE]">
                      Alice · Haute Couture Advisor
                    </h2>
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-[#8C7853]/30 text-[#D4AF37] border border-[#8C7853]/40 font-mono">
                      LUXE LAYOUT Paris
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A7A096] tracking-wider">
                    Place Vendôme Flagship & Savoir-Faire Private Atelier
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsVipSuiteOpen(false)}
                  className="p-1.5 text-[#A7A096] hover:text-white transition-colors cursor-pointer"
                  title="Close Consultation Suite"
                  aria-label="Close Consultation Suite"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Context Bar */}
            {selectedTopic && (
              <div className="bg-[#F2EDE4] dark:bg-[#1C1A17] px-6 py-2 border-b border-[#E0DBD0] dark:border-[#2C2926] flex items-center justify-between text-[11px]">
                <span className="text-[#706B63] dark:text-[#A7A096] truncate">
                  Inquiry Topic: <strong className="text-[#181715] dark:text-[#F3F0E6]">{selectedTopic}</strong>
                </span>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="text-[#8C7853] hover:underline shrink-0 ml-2"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Embedded Live Agent Iframe */}
            <div className="flex-1 w-full bg-[#FFFFFF] relative">
              <iframe
                src="https://www.noupe.com/agent/01a1956134507000881cc0894ec0f64607f9"
                title="Alice · Maison Aurelia Private AI Concierge"
                className="w-full h-full border-0"
                allow="microphone *; display-capture *;"
              />
            </div>

            {/* Suite Footer Controls */}
            <div className="px-6 py-3 bg-[#FAF9F5] dark:bg-[#1A1815] border-t border-[#E8E4DC] dark:border-[#272421] flex flex-wrap items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-4 text-[#706B63] dark:text-[#9F998F]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8C7853]" />
                  Verified Maison Aurelia Concierge
                </span>
                <span className="hidden sm:inline opacity-40">·</span>
                <span className="hidden sm:inline">24/7 Place Vendôme Atelier Network</span>
              </div>

              <div className="flex items-center gap-3">
                {onOpenSalonBooking && (
                  <button
                    onClick={() => {
                      setIsVipSuiteOpen(false);
                      onOpenSalonBooking();
                    }}
                    className="text-[#8C7853] hover:underline"
                  >
                    Reserve Salon Privé
                  </button>
                )}
                {onOpenOrderStatus && (
                  <button
                    onClick={() => {
                      setIsVipSuiteOpen(false);
                      onOpenOrderStatus();
                    }}
                    className="text-[#706B63] hover:text-[#181715] dark:hover:text-white"
                  >
                    Track Shipment
                  </button>
                )}
                <button
                  onClick={() => setIsVipSuiteOpen(false)}
                  className="px-3 py-1 bg-[#181715] text-[#FAF8F3] dark:bg-[#FAF8F3] dark:text-[#181715] uppercase tracking-wider text-[10px] font-medium"
                >
                  Return to Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Global helper function to trigger Alice from any component
export const consultAlice = (topic?: string, openFullSuite: boolean = false) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('maison-consult-alice', {
        detail: { topic, openFullSuite },
      })
    );
  }
};
