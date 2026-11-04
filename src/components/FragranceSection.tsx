import React, { useState } from 'react';
import { Product } from '../types/fashion';
import { PRODUCTS } from '../data/products';
import { 
  Sparkles, 
  ShoppingBag, 
  Droplet, 
  Wind, 
  Clock, 
  Shield, 
  Check, 
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';

interface FragranceSectionProps {
  onSelectProduct: (product: Product) => void;
  onOpenSalonBooking: () => void;
}

export const FragranceSection: React.FC<FragranceSectionProps> = ({
  onSelectProduct,
  onOpenSalonBooking,
}) => {
  const fragranceProducts = PRODUCTS.filter((p) => p.category === 'fragrance');
  const [selectedFragranceId, setSelectedFragranceId] = useState<string>(
    fragranceProducts[0]?.id || 'aurelia-place-vendome-extrait'
  );
  const [activeNoteTab, setActiveNoteTab] = useState<'all' | 'top' | 'heart' | 'base'>('all');
  const [sampleRequested, setSampleRequested] = useState(false);

  const activeFragrance = fragranceProducts.find((p) => p.id === selectedFragranceId) || fragranceProducts[0];

  return (
    <section id="parfumerie" className="py-24 bg-[#FAF8F5] dark:bg-[#121110] border-t border-[#E2DDD3] dark:border-[#221F1C] transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E2DDD3] dark:border-[#292622] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-1">
              <span>Haute Parfumerie & Olfactory Atelier</span>
              <span aria-hidden="true">·</span>
              <span>Grasse & 14 Place Vendôme</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
              L'Atelier Olfactif d'Exception
            </h2>
          </div>

          <p className="text-xs text-[#706B63] dark:text-[#9F998F] max-w-md font-light leading-relaxed">
            Distilled in the historic solar hills of Grasse, France. Formulations crafted with pure Centifolia rose absolute, wild Cambodian agarwood, and authentic suspended 24k gold leaf.
          </p>
        </div>

        {/* Main Fragrance Spotlight Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Monumental Crystal Flacon Artwork */}
          <div className="lg:col-span-6 relative aspect-square max-h-[640px] bg-[#EAE5DA] dark:bg-[#181614] border border-[#D5CFC3] dark:border-[#2F2B26] overflow-hidden shadow-2xl group">
            <img
              src={activeFragrance.image}
              alt={activeFragrance.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Brand Emblem Tag */}
            <div className="absolute top-4 left-4 bg-[#FAF9F5]/90 dark:bg-[#141311]/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-serif-luxury text-[#181715] dark:text-[#FAF8F3] border border-[#E5DFD4] dark:border-[#332E29] shadow-sm flex items-center gap-2">
              <span className="font-semibold text-[#8C7853]">{activeFragrance.brand || 'Maison Aurelia'}</span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span className="font-mono text-[10px]">{activeFragrance.concentration || 'Pure Extrait'}</span>
            </div>

            {/* Scent Volume Badge */}
            <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-white px-3 py-1.5 text-xs font-mono border border-white/15">
              <span>{activeFragrance.bottleSize || '100ml / 3.4 FL. OZ.'}</span>
            </div>

            {/* Direct Acquire Button Overlay */}
            <div className="absolute bottom-4 right-4">
              <button
                onClick={() => onSelectProduct(activeFragrance)}
                className="px-4 py-2.5 bg-[#FAF9F5] text-[#181715] hover:bg-white dark:bg-[#1A1816] dark:text-[#FAF8F3] dark:hover:bg-[#25221F] border border-[#8C7853] text-xs uppercase tracking-wider font-sans-luxury font-semibold transition-all shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#8C7853]" />
                <span>Acquire Flacon (€{activeFragrance.price.toLocaleString()})</span>
              </button>
            </div>
          </div>

          {/* Right Column: Olfactory Architecture & Notes Pyramid */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Flacon Selector Chips */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-[#E2DDD3] dark:border-[#292622]">
              {fragranceProducts.map((p) => {
                const isSelected = p.id === selectedFragranceId;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedFragranceId(p.id);
                      setSampleRequested(false);
                    }}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider font-sans-luxury border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#8C7853] bg-[#8C7853] text-white font-semibold shadow-sm'
                        : 'border-[#CEC7B9] dark:border-[#38332E] text-[#605B54] dark:text-[#A7A096] hover:border-[#8C7853]'
                    }`}
                  >
                    {p.name.split('(')[0]}
                  </button>
                );
              })}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs uppercase tracking-[0.2em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492]">
                  {activeFragrance.olfactoryFamily || 'Grand Extrait de Parfum'}
                </span>
                <span className="text-[10px] font-mono text-[#787268] dark:text-[#9F998F]">
                  [{activeFragrance.productCode || 'PARFUM-MMXXVI'}]
                </span>
              </div>
              <h3 className="text-3xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
                {activeFragrance.name}
              </h3>
              {activeFragrance.frenchName && (
                <p className="text-sm font-serif-luxury italic text-[#8C7853] dark:text-[#C5B492] mt-0.5">
                  {activeFragrance.frenchName}
                </p>
              )}
            </div>

            <p className="text-sm text-[#605B54] dark:text-[#A7A096] leading-relaxed font-light">
              {activeFragrance.description}
            </p>

            {/* Olfactory Pyramid Exploration Box */}
            <div className="p-5 bg-white dark:bg-[#181614] border border-[#DFD9CD] dark:border-[#2C2723] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EDE8DE] dark:border-[#282420]">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-[#8C7853]" />
                  <span className="text-xs uppercase tracking-[0.18em] font-sans-luxury font-semibold text-[#181715] dark:text-[#FAF8F3]">
                    Pyramide Olfactive (Fragrance Notes)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#8C7853]">
                  {activeFragrance.concentration || '32% Extrait'}
                </span>
              </div>

              {/* Notes Pyramid Breakdown */}
              <div className="space-y-3 text-xs">
                {/* Top Notes */}
                <div className="p-2.5 bg-[#FAF9F5] dark:bg-[#121110] border border-[#E5DFD4] dark:border-[#262320]">
                  <div className="text-[10px] uppercase tracking-wider text-[#8C7853] font-semibold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Notes de Tête (Top Notes · First 30 Minutes)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeFragrance.topNotes || ['Greek Saffron', 'Calabrian Bergamot', 'Rose Petals']).map((note, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white dark:bg-[#1C1A18] border border-[#DFD9CD] dark:border-[#332F2B] text-[11px] font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Heart Notes */}
                <div className="p-2.5 bg-[#FAF9F5] dark:bg-[#121110] border border-[#E5DFD4] dark:border-[#262320]">
                  <div className="text-[10px] uppercase tracking-wider text-[#8C7853] font-semibold mb-1 flex items-center gap-1.5">
                    <Wind className="w-3 h-3" />
                    <span>Notes de Cœur (Heart Notes · 2 to 8 Hours)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeFragrance.heartNotes || ['Golden Amber', 'Damask Rose Absolute', 'Florentine Iris']).map((note, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white dark:bg-[#1C1A18] border border-[#DFD9CD] dark:border-[#332F2B] text-[11px] font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Base Notes */}
                <div className="p-2.5 bg-[#FAF9F5] dark:bg-[#121110] border border-[#E5DFD4] dark:border-[#262320]">
                  <div className="text-[10px] uppercase tracking-wider text-[#8C7853] font-semibold mb-1 flex items-center gap-1.5">
                    <Flame className="w-3 h-3" />
                    <span>Notes de Fond (Base Notes · 24 to 36 Hour Persistence)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeFragrance.baseNotes || ['Wild Cambodian Oud', 'Bourbon Vanilla', '24k Gold Essence']).map((note, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white dark:bg-[#1C1A18] border border-[#DFD9CD] dark:border-[#332F2B] text-[11px] font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sillage & Longevity Telemetry */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                <div className="p-2 bg-[#F4EFE6] dark:bg-[#1C1917] border border-[#E2DDD3] dark:border-[#2C2723]">
                  <div className="text-[10px] uppercase tracking-wider text-[#7A746B] dark:text-[#9A9388]">Sillage & Projection</div>
                  <div className="font-serif-luxury font-semibold text-[#8C7853] mt-0.5">Grand Sillage Majestueux (Heavy / Room-filling)</div>
                </div>
                <div className="p-2 bg-[#F4EFE6] dark:bg-[#1C1917] border border-[#E2DDD3] dark:border-[#2C2723]">
                  <div className="text-[10px] uppercase tracking-wider text-[#7A746B] dark:text-[#9A9388]">Persistence on Skin</div>
                  <div className="font-serif-luxury font-semibold text-[#8C7853] mt-0.5">36+ Hours (Extrait Formula)</div>
                </div>
              </div>
            </div>

            {/* Actions for Parfumerie */}
            <div className="pt-2 space-y-3">
              <button
                onClick={() => onSelectProduct(activeFragrance)}
                className="w-full py-3.5 px-6 bg-[#181715] text-[#FAF9F5] hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white text-xs uppercase tracking-[0.2em] font-sans-luxury transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-4 h-4 text-[#8C7853]" />
                <span>Acquire Flacon d'Exception (€{activeFragrance.price.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setSampleRequested(true)}
                  className="w-full sm:w-1/2 py-2.5 px-3 border border-[#BDB5A4] dark:border-[#38332E] hover:border-[#8C7853] text-[#181715] dark:text-[#FAF8F3] text-[11px] uppercase tracking-wider font-sans-luxury text-center transition-colors cursor-pointer"
                >
                  {sampleRequested ? '✓ Complimentary Blotter Dispatched' : 'Request Complimentary Scent Blotter'}
                </button>
                <button
                  onClick={onOpenSalonBooking}
                  className="w-full sm:w-1/2 py-2.5 px-3 border border-[#BDB5A4] dark:border-[#38332E] hover:border-[#8C7853] text-[#181715] dark:text-[#FAF8F3] text-[11px] uppercase tracking-wider font-sans-luxury text-center transition-colors cursor-pointer"
                >
                  Book Private Olfactory Consultation
                </button>
              </div>

              {sampleRequested && (
                <div className="p-3 bg-emerald-950/20 border border-emerald-700/40 text-emerald-800 dark:text-emerald-300 text-xs font-sans-luxury flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your luxury silk-scented blotter has been scheduled for complimentary delivery to your client address via Place Vendôme courier.</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
