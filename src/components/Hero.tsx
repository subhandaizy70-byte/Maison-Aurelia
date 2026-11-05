import React from 'react';
import { ArrowDown, Compass } from 'lucide-react';

interface HeroProps {
  onExploreCollection: () => void;
  onExploreWomen?: () => void;
  onExploreMen?: () => void;
  onViewLookbook: () => void;
  onOpenSalonBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCollection,
  onExploreWomen,
  onExploreMen,
  onViewLookbook,
  onOpenSalonBooking,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-[#E8E4DC] dark:border-[#272421]">
      {/* 2-Column Desktop Split / Responsive Grid */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-5.5rem)] lg:min-h-[720px] items-stretch">
        
        {/* Left Column: Editorial Typography & Intent */}
        <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 bg-[#FAF9F5] dark:bg-[#141311] z-10">
          
          {/* Top Kicker */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs tracking-[0.24em] uppercase font-sans-luxury text-[#8C7853] dark:text-[#C5B492]">
              <span>Haute Couture & Prêt-à-Porter</span>
              <span aria-hidden="true">·</span>
              <span>Paris</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl tracking-tight leading-[1.08] font-serif-luxury text-[#181715] dark:text-[#FAF8F3] [text-wrap:balance]">
              The Architecture of Silence.
            </h1>

            <p className="text-base sm:text-lg text-[#605B54] dark:text-[#A7A096] font-light leading-relaxed max-w-lg pt-2">
              A masterclass in sculptural reduction, heavy unbleached cashmere, and liquid bias-cut mulberry silk. Every silhouette is engineered through forty-two atelier hours of bespoke hand craftsmanship.
            </p>
          </div>

          {/* Action CTAs: Distinct Women's & Men's Exploration */}
          <div className="py-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onExploreWomen || onExploreCollection}
                className="px-6 py-3.5 text-xs uppercase tracking-[0.18em] font-sans-luxury font-medium bg-[#181715] text-[#FAF9F5] hover:bg-[#322F2A] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white transition-colors text-center cursor-pointer"
              >
                Univers Femme (Women)
              </button>
              
              <button
                onClick={onExploreMen || onExploreCollection}
                className="px-6 py-3.5 text-xs uppercase tracking-[0.18em] font-sans-luxury font-medium border border-[#181715] dark:border-white text-[#181715] dark:text-[#FAF8F3] hover:bg-[#181715] hover:text-white dark:hover:bg-white dark:hover:text-[#181715] transition-colors text-center cursor-pointer"
              >
                Univers Homme (Men)
              </button>

              <button
                onClick={onViewLookbook}
                className="px-5 py-3.5 text-xs uppercase tracking-[0.18em] font-sans-luxury font-medium border border-[#C8C2B7] dark:border-[#3D3833] text-[#706B63] dark:text-[#A7A096] hover:border-[#181715] dark:hover:border-white transition-colors text-center cursor-pointer"
              >
                Lookbook
              </button>
            </div>

            {/* Unboxed editorial metadata */}
            <div className="flex items-center gap-2 text-xs text-[#878177] dark:text-[#8E877D] pt-2">
              <span>Hiver MMXXVI</span>
              <span aria-hidden="true">·</span>
              <span>Place Vendôme Salon</span>
              <span aria-hidden="true">·</span>
              <span>Limited Cadence</span>
            </div>
          </div>

          {/* Bottom Curator Note */}
          <div className="border-t border-[#E8E4DC] dark:border-[#272421] pt-6 flex items-center justify-between text-xs text-[#706B63] dark:text-[#9F998F]">
            <div>
              <p className="font-serif-luxury italic text-sm text-[#181715] dark:text-[#F3F0E6]">
                &ldquo;Form exists only to serve the dignity of the body.&rdquo;
              </p>
              <p className="text-[11px] tracking-wider uppercase pt-0.5 opacity-80">
                Atelier LUXE LAYOUT · Cahier No. 12
              </p>
            </div>
            <button
              onClick={onOpenSalonBooking}
              className="text-[#8C7853] dark:text-[#C5B492] hover:underline flex items-center gap-1 shrink-0 ml-4 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Private Salon</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Visual Asset */}
        <div className="lg:col-span-7 relative min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] max-h-[740px] bg-[#EAE7DF] dark:bg-[#1E1C1A] overflow-hidden">
          <img
            src="/assets/images/hero_luxury_fashion_model_1793507760974.jpg"
            alt="LUXE LAYOUT Autumn Winter Collection featuring the sculpted cashmere coat in Parisian apartment"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_22%] filter brightness-[0.98] contrast-[1.02] transition-transform duration-1000 ease-out hover:scale-[1.02]"
          />
          
          {/* Subtle measured scrim for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {/* Floating Image Attribution / Craft Card */}
          <div className="absolute bottom-6 right-6 left-6 sm:left-auto max-w-sm bg-[#FAF9F5]/90 dark:bg-[#181715]/90 backdrop-blur-md p-4 border border-[#E8E4DC]/80 dark:border-[#38332E] text-xs">
            <div className="flex items-center justify-between text-[#8C7853] dark:text-[#C5B492] text-[10px] tracking-[0.2em] uppercase font-sans-luxury pb-1">
              <span>Look 01 · Primary Study</span>
              <span>Hiver MMXXVI</span>
            </div>
            <p className="font-serif-luxury text-base text-[#181715] dark:text-[#FAF8F3] leading-snug">
              The Sculptural Hourglass Coat in Smoke Cashmere
            </p>
            <p className="text-[11px] text-[#706B63] dark:text-[#9F998F] pt-1">
              Paired with high-waisted fluid crepe trousers. Hand-shaped in Place Vendôme.
            </p>
          </div>
        </div>

      </div>

      {/* 3-Column Proof Strip Below Hero Split */}
      <div className="border-t border-[#E8E4DC] dark:border-[#272421] bg-[#F4F1EA] dark:bg-[#191715]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#605B54] dark:text-[#A7A096]">
          
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[#8C7853] text-sm tabular-nums">01</span>
            <div>
              <p className="font-medium text-[#181715] dark:text-[#FAF8F3] tracking-wide uppercase text-[11px]">Traceable Heritage Fibers</p>
              <p className="text-[12px] opacity-80 pt-0.5">Direct partnership with generational spinning mills in Biella & silk looms in Lyon.</p>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[#8C7853] text-sm tabular-nums">02</span>
            <div>
              <p className="font-medium text-[#181715] dark:text-[#FAF8F3] tracking-wide uppercase text-[11px]">Place Vendôme Atelier</p>
              <p className="text-[12px] opacity-80 pt-0.5">Patterned, hand-cut, and meticulously finished under one Parisian roof.</p>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[#8C7853] text-sm tabular-nums">03</span>
            <div>
              <p className="font-medium text-[#181715] dark:text-[#FAF8F3] tracking-wide uppercase text-[11px]">Curated Limited Cadence</p>
              <p className="text-[12px] opacity-80 pt-0.5">Strictly 35 to 60 numbered pieces per silhouette. Zero mass manufacturing.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
