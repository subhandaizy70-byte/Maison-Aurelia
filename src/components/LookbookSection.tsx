import React, { useState } from 'react';
import { LOOKBOOK_SLIDES } from '../data/products';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../types/fashion';
import { PRODUCTS } from '../data/products';

interface LookbookSectionProps {
  onSelectProduct: (product: Product) => void;
  onOpenSalonBooking: () => void;
}

export const LookbookSection: React.FC<LookbookSectionProps> = ({
  onSelectProduct,
  onOpenSalonBooking,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = LOOKBOOK_SLIDES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? LOOKBOOK_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === LOOKBOOK_SLIDES.length - 1 ? 0 : prev + 1));
  };

  // Find matching product for quick shop
  const matchingProduct = PRODUCTS.find((p) => {
    if (slide.id === 'look-01') return p.id === 'coat-hourglass-cashmere';
    if (slide.id === 'look-02') return p.id === 'coat-homme-navy-cashmere';
    if (slide.id === 'look-03') return p.id === 'bag-nano-knit-knot';
    if (slide.id === 'look-04') return p.id === 'dress-silk-slip-champagne';
    return p.id === 'coat-hourglass-cashmere';
  });

  return (
    <section id="lookbook" className="py-24 bg-[#F2EFE8] dark:bg-[#121110] border-y border-[#E2DDD3] dark:border-[#24211E] transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-10 border-b border-[#DFD9CD] dark:border-[#2B2724] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-1">
              <span>Runway & Editorial Archive</span>
              <span aria-hidden="true">·</span>
              <span>{slide.season}</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
              The Lookbook
            </h2>
          </div>

          {/* Slide Navigation Controls */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono tabular-nums tracking-widest text-[#706B63] dark:text-[#A7A096]">
              {String(currentIndex + 1).padStart(2, '0')} / {String(LOOKBOOK_SLIDES.length).padStart(2, '0')}
            </span>

            <div className="flex items-center border border-[#CEC7B9] dark:border-[#38332E]">
              <button
                onClick={handlePrev}
                className="p-2.5 hover:bg-[#EAE4D7] dark:hover:bg-[#201D1A] text-[#181715] dark:text-[#FAF8F3] transition-colors cursor-pointer"
                aria-label="Previous look"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-6 bg-[#CEC7B9] dark:bg-[#38332E]" />
              <button
                onClick={handleNext}
                className="p-2.5 hover:bg-[#EAE4D7] dark:hover:bg-[#201D1A] text-[#181715] dark:text-[#FAF8F3] transition-colors cursor-pointer"
                aria-label="Next look"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Lookbook Content Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Main Visual Spread */}
          <div className="lg:col-span-7 relative aspect-[4/5] max-h-[640px] bg-[#E8E3D7] dark:bg-[#1A1816] overflow-hidden border border-[#DCD5C6] dark:border-[#2E2925] shadow-lg">
            <img
              key={slide.id}
              src={slide.image}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-[center_20%] transition-opacity duration-700 animate-fade-in"
            />
            
            {/* Top Tag */}
            <div className="absolute top-4 left-4 bg-[#FAF9F5]/90 dark:bg-[#141311]/90 backdrop-blur-sm px-3 py-1.5 text-xs font-serif-luxury text-[#181715] dark:text-[#FAF8F3] border border-[#E5DFD4] dark:border-[#332E29]">
              Look {slide.lookNumber} · {slide.season}
            </div>

            {/* Model note on bottom right */}
            <div className="absolute bottom-4 right-4 bg-[#FAF9F5]/90 dark:bg-[#141311]/90 backdrop-blur-sm px-3 py-1.5 text-[11px] font-sans-luxury text-[#605B54] dark:text-[#A7A096] border border-[#E5DFD4] dark:border-[#332E29]">
              {slide.modelSpecs}
            </div>
          </div>

          {/* Right Column: Editorial Essay & Ensemble Breakdown */}
          <div className="lg:col-span-5 flex flex-col justify-between py-4">
            
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] block mb-2">
                  Ensemble Look {slide.lookNumber}
                </span>
                <h3 className="text-3xl sm:text-4xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] leading-tight">
                  {slide.title}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-[#605B54] dark:text-[#A7A096] leading-relaxed font-light">
                {slide.description}
              </p>

              {/* Ensemble Pieces Itemization */}
              <div className="p-5 bg-[#FAF9F5] dark:bg-[#181614] border border-[#E0D9CB] dark:border-[#2C2723]">
                <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans-luxury font-semibold text-[#181715] dark:text-[#FAF8F3] mb-3">
                  Ensemble Composition
                </h4>
                <ul className="space-y-2 text-xs text-[#57534D] dark:text-[#B5ADA1]">
                  {slide.ensemblePieces.map((piece, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#8C7853] rounded-full shrink-0" />
                      <span>{piece}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions for Lookbook */}
            <div className="mt-8 pt-6 border-t border-[#DFD9CD] dark:border-[#2B2724] space-y-3">
              {matchingProduct && (
                <button
                  onClick={() => onSelectProduct(matchingProduct)}
                  className="w-full py-3.5 px-6 bg-[#181715] text-[#FAF9F5] hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white text-xs uppercase tracking-[0.2em] font-sans-luxury transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Acquire Primary Piece: {matchingProduct.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onOpenSalonBooking}
                className="w-full py-3 px-6 border border-[#BDB5A4] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] hover:border-[#181715] dark:hover:border-white text-xs uppercase tracking-[0.2em] font-sans-luxury transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8C7853]" />
                <span>Inquire Private Commission for this Look</span>
              </button>
            </div>

          </div>

        </div>

        {/* Thumbnail Selector Strip */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {LOOKBOOK_SLIDES.map((item, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`p-3 text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#8C7853] bg-[#FAF9F5] dark:bg-[#181614] shadow-sm'
                    : 'border-[#DFD9CD] dark:border-[#2B2724] hover:bg-[#FAF9F5]/50 dark:hover:bg-[#181614]/50'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] tracking-widest text-[#8C7853] dark:text-[#C5B492] uppercase font-sans-luxury mb-1">
                  <span>Look {item.lookNumber}</span>
                  <span className="font-mono">{item.season}</span>
                </div>
                <p className="text-xs font-serif-luxury text-[#181715] dark:text-[#FAF8F3] truncate">
                  {item.title}
                </p>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
