import React from 'react';
import { Scissors, Sparkles, Shield, Compass } from 'lucide-react';

interface AtelierStoryProps {
  onOpenSalonBooking: () => void;
}

export const AtelierStory: React.FC<AtelierStoryProps> = ({ onOpenSalonBooking }) => {
  return (
    <section id="savoir-faire" className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
      
      {/* 2-Column Split: Story Image Left, Manifesto Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Documentary Atelier Craft Image */}
        <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-[5/4] max-h-[540px] bg-[#F2EFE9] dark:bg-[#1E1C1A] overflow-hidden border border-[#E5E0D5] dark:border-[#2C2925] shadow-lg">
          <img
            src="/assets/images/fashion_atelier_craft_1793507763048.jpg"
            alt="Artisans hand-stitching silk in the Maison Aurelia Place Vendôme atelier"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.98] hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Floating Caption Tag */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto max-w-sm bg-[#FAF9F5]/95 dark:bg-[#151311]/95 backdrop-blur-md p-4 border border-[#E0D9CB] dark:border-[#38332E]">
            <p className="text-[10px] tracking-[0.2em] uppercase font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-1">
              Atelier Place Vendôme · No. 14
            </p>
            <p className="text-xs font-serif-luxury text-[#181715] dark:text-[#FAF8F3] leading-snug">
              Master tailors Marie-Thérèse and Jean-Marc hand-rolling edges on 28 Momme silk charmeuse.
            </p>
          </div>
        </div>

        {/* Right Column: The Atelier Manifesto */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
          
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-2">
              <span>Savoir-Faire & Le Geste</span>
              <span aria-hidden="true">·</span>
              <span>The Paris Manifesto</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] leading-[1.15] [text-wrap:balance]">
              The Quiet Discipline of Slow Needlework.
            </h2>

            <p className="mt-5 text-base text-[#605B54] dark:text-[#A7A096] font-light leading-relaxed">
              At Maison Aurelia, we reject the frantic churn of seasonal obsolescence. Our Place Vendôme workshops operate under the principle of the singular artisan: each tailored garment is drawn, basted, and assembled by one master craftsman from first chalk mark to final buttonhole.
            </p>
          </div>

          {/* 3 Pillars of House Rigor */}
          <div className="space-y-4 border-t border-[#E8E4DC] dark:border-[#272421] pt-6">
            
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs text-[#8C7853] pt-1 tabular-nums">01.</span>
              <div>
                <h3 className="text-sm font-semibold tracking-wide uppercase text-[#181715] dark:text-[#FAF8F3] font-sans-luxury">
                  Natural Purity & Fiber Provenance
                </h3>
                <p className="text-xs text-[#706B63] dark:text-[#9F998F] pt-0.5 leading-relaxed">
                  We exclusively source raw Mongolian cashmere, organic Biella worsted twills, and vegetable-tanned Tuscan calfskin. Zero plastic linings, zero toxic dyes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="font-mono text-xs text-[#8C7853] pt-1 tabular-nums">02.</span>
              <div>
                <h3 className="text-sm font-semibold tracking-wide uppercase text-[#181715] dark:text-[#FAF8F3] font-sans-luxury">
                  Forty-Two Hours of Manual Labor
                </h3>
                <p className="text-xs text-[#706B63] dark:text-[#9F998F] pt-0.5 leading-relaxed">
                  Every floating horsehair canvas is stitched by hand to breathe with the wearer’s body heat. No fused glue adhesives; our lapels roll with natural sculptural grace.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="font-mono text-xs text-[#8C7853] pt-1 tabular-nums">03.</span>
              <div>
                <h3 className="text-sm font-semibold tracking-wide uppercase text-[#181715] dark:text-[#FAF8F3] font-sans-luxury">
                  Archival Restoration Registry
                </h3>
                <p className="text-xs text-[#706B63] dark:text-[#9F998F] pt-0.5 leading-relaxed">
                  Every numbered piece is catalogued in our private register. We offer lifetime complimentary steam refreshes, lining repairs, and horn fastener replacement.
                </p>
              </div>
            </div>

          </div>

          {/* Action to Book Atelier Tour / Fitting */}
          <div className="pt-2">
            <button
              onClick={onOpenSalonBooking}
              className="px-6 py-3 border border-[#181715] text-[#181715] hover:bg-[#181715] hover:text-[#FAF9F5] dark:border-[#FAF8F3] dark:text-[#FAF8F3] dark:hover:bg-[#FAF8F3] dark:hover:text-[#181715] text-xs uppercase tracking-[0.18em] font-sans-luxury transition-all flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Arrange Private Fitting in Paris or London</span>
            </button>
          </div>

        </div>

      </div>

    </section>
  );
};
