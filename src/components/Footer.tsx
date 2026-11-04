import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { consultAlice } from './MaisonStylistBot';

interface FooterProps {
  onOpenSalonBooking: () => void;
  onOpenOrderStatus?: () => void;
  onOpenMarketComparator?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSalonBooking,
  onOpenOrderStatus,
  onOpenMarketComparator,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#141311] text-[#EAE6DE] border-t border-[#262421]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        
        {/* Top Grid: Newsletter Invitation & Brand Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#2A2724]">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/images/maison_aurelia_short_logo.jpg"
                alt="Maison Aurelia Paris Seal"
                className="w-10 h-10 object-cover rounded border border-[#8C7853]/40 shadow-sm"
              />
              <div>
                <span className="text-2xl lg:text-3xl tracking-[0.24em] uppercase font-serif-luxury text-[#F3F0E6] block">
                  Maison Aurelia
                </span>
                <p className="text-[10px] tracking-[0.2em] uppercase font-sans-luxury text-[#C5B492]">
                  Place Vendôme · Paris · Fondée en MMXXI
                </p>
              </div>
            </div>
            <p className="text-sm text-[#A7A096] font-light max-w-md leading-relaxed">
              An architectural haute couture house dedicated to the slow rhythm of the singular craftsperson, noble natural fibers, and timeless silence.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans-luxury text-[#FAF8F3]">
              La Gazette d’Aurelia
            </h4>
            <p className="text-xs text-[#A7A096] font-light">
              Receive private salon invitations, preview upcoming seasonal lookbooks, and access private capsule releases prior to public disclosure.
            </p>

            <form onSubmit={handleSubscribe} className="flex max-w-md border border-[#3D3833]">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs bg-transparent text-[#FAF8F3] placeholder-[#787268] focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FAF8F3] text-[#141311] hover:bg-white text-xs uppercase tracking-widest font-sans-luxury font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Enrolled</span>
                  </>
                ) : (
                  <>
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Secondary Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-xs text-[#A7A096] border-b border-[#2A2724]">
          
          <div className="space-y-3">
            <h5 className="text-[11px] uppercase tracking-[0.2em] font-sans-luxury text-[#FAF8F3] font-medium">
              Collections
            </h5>
            <ul className="space-y-2">
              <li><a href="#collections" className="hover:text-white transition-colors">Outerwear & Coats</a></li>
              <li><a href="#collections" className="hover:text-white transition-colors">Savile Row Tailoring</a></li>
              <li><a href="#collections" className="hover:text-white transition-colors">Haute Silk Gowns</a></li>
              <li><a href="#parfumerie" className="hover:text-[#C5B492] text-[#E0D5BE] transition-colors font-medium">Haute Parfumerie & Flacons</a></li>
              <li><a href="#collections" className="hover:text-white transition-colors">Tuscan Maroquinerie & Bags</a></li>
              <li><a href="#collections" className="hover:text-white transition-colors">24k Gold Objects</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[11px] uppercase tracking-[0.2em] font-sans-luxury text-[#FAF8F3] font-medium">
              The Maison
            </h5>
            <ul className="space-y-2">
              <li><a href="#savoir-faire" className="hover:text-white transition-colors">Savoir-Faire Manifesto</a></li>
              <li><a href="#lookbook" className="hover:text-white transition-colors">Runway Lookbook Archive</a></li>
              <li><button onClick={onOpenSalonBooking} className="hover:text-white transition-colors text-left cursor-pointer">Place Vendôme Atelier</button></li>
              <li><a href="#salons" className="hover:text-white transition-colors">Palazzo Montenapoleone</a></li>
              <li><a href="#salons" className="hover:text-white transition-colors">Mayfair Townhouse</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[11px] uppercase tracking-[0.2em] font-sans-luxury text-[#FAF8F3] font-medium">
              Client Care
            </h5>
            <ul className="space-y-2">
              <li><a href="#maison-elite" className="hover:text-white transition-colors text-left cursor-pointer text-[#C5B492] font-medium">Maison Elite Patronage</a></li>
              <li><button onClick={() => consultAlice(undefined, true)} className="hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5 text-[#C5B492]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Alice · Private Stylist Online</span>
              </button></li>
              <li><button onClick={onOpenSalonBooking} className="hover:text-white transition-colors text-left cursor-pointer">Private Salon Fittings</button></li>
              <li><button onClick={onOpenOrderStatus} className="hover:text-white transition-colors text-left cursor-pointer text-[#C5B492]">Track Consignment Status</button></li>
              <li><button onClick={onOpenMarketComparator} className="hover:text-white transition-colors text-left cursor-pointer">Global Luxury Price Index</button></li>
              <li><span className="hover:text-white transition-colors">Bespoke Monogramming</span></li>
              <li><span className="hover:text-white transition-colors">Lifetime Archival Refresh</span></li>
              <li><span className="hover:text-white transition-colors">Authentication Certificates</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[11px] uppercase tracking-[0.2em] font-sans-luxury text-[#FAF8F3] font-medium">
              Luxury Houses & Partners
            </h5>
            <ul className="space-y-2">
              <li><span className="hover:text-white transition-colors">Zero Synthetic Fibers</span></li>
              <li><span className="hover:text-white transition-colors">100% Traceable Provenance</span></li>
              <li><span className="hover:text-white transition-colors">Fair Artisan Compensation</span></li>
            </ul>
            <div className="pt-3 border-t border-[#2A2724] space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[#C5B492] font-semibold block">Official Brand Archives</span>
              <div className="flex flex-col gap-1 text-[11px]">
                <a href="https://louisvuitton.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#E0D5BE] transition-colors flex items-center gap-1">
                  <span>Louis Vuitton (Official)</span>
                  <span className="text-[9px] text-[#8C7853]">↗</span>
                </a>
                <a href="https://www.dior.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#E0D5BE] transition-colors flex items-center gap-1">
                  <span>Christian Dior (Official)</span>
                  <span className="text-[9px] text-[#8C7853]">↗</span>
                </a>
                <a href="https://www.balenciaga.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#E0D5BE] transition-colors flex items-center gap-1">
                  <span>Balenciaga (Official)</span>
                  <span className="text-[9px] text-[#8C7853]">↗</span>
                </a>
                <a href="https://www.victoriassecret.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#E0D5BE] transition-colors flex items-center gap-1">
                  <span>Victoria's Secret (Official)</span>
                  <span className="text-[9px] text-[#8C7853]">↗</span>
                </a>
                <a href="https://maisonaurelia.co/" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5B492] transition-colors flex items-center gap-1 font-medium">
                  <span>Maison Aurelia.co (Official)</span>
                  <span className="text-[9px] text-[#8C7853]">↗</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#706B63] gap-4">
          <p>© MMXXVI Maison Aurelia. 14 Place Vendôme, 75001 Paris, France. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#A7A096] transition-colors cursor-pointer">Confidentiality</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-[#A7A096] transition-colors cursor-pointer">Legal Mentions</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-[#A7A096] transition-colors cursor-pointer">Cookie Preferences</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
