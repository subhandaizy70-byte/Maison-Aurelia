import React, { useState } from 'react';
import { Product } from '../types/fashion';
import { X, Heart, ShieldCheck, Truck, Sparkles, Check, Ruler, Info } from 'lucide-react';
import { AiSizingAdvisor } from './AiSizingAdvisor';
import { consultAlice } from './MaisonStylistBot';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, monogram?: string) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [activeTab, setActiveTab] = useState<'provenance' | 'construction' | 'care'>('provenance');
  const [monogram, setMonogram] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showAiAdvisor, setShowAiAdvisor] = useState(false);
  const [unitSystem, setUnitSystem] = useState<'cm' | 'in'>('cm');
  const [justAdded, setJustAdded] = useState(false);

  const images = [product.image, product.secondaryImage].filter(Boolean) as string[];

  const handleAdd = () => {
    onAddToCart(product, selectedSize, monogram.trim().toUpperCase() || undefined);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fade-in">
      
      {/* Modal Container */}
      <div
        className="relative w-full max-w-5xl bg-[#FAF9F5] dark:bg-[#161412] border border-[#E0DBD0] dark:border-[#2C2926] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#706B63] dark:text-[#A7A096] hover:text-[#181715] dark:hover:text-[#FAF8F3] transition-colors rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md cursor-pointer"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* Left Column: Gallery & Detail Views */}
          <div className="lg:col-span-6 bg-[#F3F0E8] dark:bg-[#1C1A17] p-6 lg:p-8 flex flex-col justify-between">
            <div className="relative aspect-[4/5] max-h-[520px] bg-white dark:bg-black/40 overflow-hidden border border-[#E8E4DC] dark:border-[#2B2723]">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all duration-500 ${
                  product.category === 'shoes' || product.category === 'bags'
                    ? 'object-center'
                    : 'object-[center_16%]'
                }`}
              />

              {/* Numbered Edition watermark kicker */}
              <div className="absolute bottom-3 left-3 bg-[#FAF9F5]/90 dark:bg-[#161412]/90 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-sans-luxury text-[#181715] dark:text-[#FAF8F3]">
                {product.editionLimit}
              </div>
            </div>

            {/* Thumbnail Switcher */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 pt-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-20 sm:w-20 sm:h-24 border overflow-hidden transition-all cursor-pointer ${
                      activeImage === img
                        ? 'border-[#8C7853] opacity-100 ring-1 ring-[#8C7853]'
                        : 'border-[#D5CFC5] dark:border-[#38332E] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      className={`w-full h-full object-cover ${
                        product.category === 'shoes' || product.category === 'bags'
                          ? 'object-center'
                          : 'object-[center_20%]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Authenticity Certificate Note */}
            <div className="mt-6 pt-4 border-t border-[#E4DFD5] dark:border-[#2B2723] flex items-center gap-3 text-xs text-[#706B63] dark:text-[#9F998F]">
              <ShieldCheck className="w-4 h-4 text-[#8C7853] shrink-0" />
              <span>Registered in Maison Aurelia Place Vendôme Archive. Accompanied by wax-sealed provenance certificate.</span>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#FAF9F5] dark:bg-[#161412]">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#8C7853] dark:text-[#C5B492] uppercase tracking-[0.2em] font-sans-luxury mb-1">
                <span>{product.categoryLabel}</span>
                <span>{product.origin.split(',')[0]}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] leading-snug">
                {product.name}
              </h2>

              {product.frenchName && (
                <p className="text-sm italic font-serif-luxury text-[#787268] dark:text-[#9A9388] pt-1">
                  {product.frenchName}
                </p>
              )}

              {/* Price & Currency */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-mono tabular-nums font-medium text-[#181715] dark:text-[#FAF8F3]">
                  €{product.price.toLocaleString()}
                </span>
                <span className="text-xs uppercase tracking-wider text-[#787268] dark:text-[#9A9388]">
                  EUR · Tax & Import Duties Included
                </span>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-[#57534D] dark:text-[#ACA59B] leading-relaxed font-light">
                {product.description}
              </p>

              {/* Silhouette Highlight */}
              <div className="mt-4 p-3 bg-[#F3EFE7] dark:bg-[#1E1B18] border border-[#E5E0D5] dark:border-[#2D2925] text-xs">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-[#8C7853] dark:text-[#C5B492] block mb-0.5">
                  Silhouette & Cut
                </span>
                <span className="text-[#3A3834] dark:text-[#D5CFC5]">
                  {product.silhouette}
                </span>
              </div>

              {/* Size Selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-[0.16em] font-sans-luxury text-[#181715] dark:text-[#FAF8F3]">
                    Selected Size: <span className="font-semibold text-[#8C7853] dark:text-[#C5B492]">{selectedSize}</span>
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAiAdvisor(!showAiAdvisor);
                        if (!showAiAdvisor) setShowSizeGuide(false);
                      }}
                      className={`text-xs flex items-center gap-1.5 transition-colors cursor-pointer px-2 py-0.5 border ${
                        showAiAdvisor
                          ? 'border-[#8C7853] bg-[#8C7853]/15 text-[#8C7853] font-medium'
                          : 'border-[#C8C2B7] dark:border-[#38332E] text-[#8C7853] dark:text-[#C5B492] hover:border-[#8C7853]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Sizing & Fit Advisor</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowSizeGuide(!showSizeGuide);
                        if (!showSizeGuide) setShowAiAdvisor(false);
                      }}
                      className="text-xs text-[#706B63] dark:text-[#9F998F] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Metric Chart</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-2 text-xs font-sans-luxury tracking-wider uppercase transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] ring-1 ring-[#8C7853]'
                          : 'bg-[#F2EFE9] text-[#605B54] hover:bg-[#E7E2D7] dark:bg-[#201D1A] dark:text-[#A7A096]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {/* AI-Powered Sizing Recommendation Tool */}
                {showAiAdvisor && (
                  <div className="mt-3">
                    <AiSizingAdvisor
                      product={product}
                      selectedSize={selectedSize}
                      onApplySize={(newSize) => setSelectedSize(newSize)}
                      onClose={() => setShowAiAdvisor(false)}
                    />
                  </div>
                )}

                {/* Collapsible Size Guide Table */}
                {showSizeGuide && (
                  <div className="mt-3 p-4 bg-[#F2EFE8] dark:bg-[#1B1917] border border-[#E2DDCF] dark:border-[#302C28] text-xs animate-fade-in">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[#181715] dark:text-[#FAF8F3] uppercase tracking-wider text-[11px]">
                        Atelier Sizing Metric
                      </span>
                      <div className="flex items-center gap-1 bg-white/70 dark:bg-black/40 p-0.5 border border-[#D5CFC5] dark:border-[#38332E]">
                        <button
                          onClick={() => setUnitSystem('cm')}
                          className={`px-2 py-0.5 text-[10px] ${unitSystem === 'cm' ? 'bg-[#181715] text-white dark:bg-white dark:text-black font-semibold' : 'text-slate-500'}`}
                        >
                          CM
                        </button>
                        <button
                          onClick={() => setUnitSystem('in')}
                          className={`px-2 py-0.5 text-[10px] ${unitSystem === 'in' ? 'bg-[#181715] text-white dark:bg-white dark:text-black font-semibold' : 'text-slate-500'}`}
                        >
                          INCH
                        </button>
                      </div>
                    </div>
                    <table className="w-full text-left font-mono tabular-nums text-[11px]">
                      <thead>
                        <tr className="border-b border-[#D5CFC5] dark:border-[#38332E] text-[#878177]">
                          <th className="pb-1 font-normal">French Size</th>
                          <th className="pb-1 font-normal">Bust</th>
                          <th className="pb-1 font-normal">Waist</th>
                          <th className="pb-1 font-normal">Hips</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E6E1D8] dark:divide-[#272320]">
                        <tr>
                          <td className="py-1 text-[#181715] dark:text-[#FAF8F3]">FR 34 (US 2)</td>
                          <td className="py-1">{unitSystem === 'cm' ? '82 cm' : '32.3 in'}</td>
                          <td className="py-1">{unitSystem === 'cm' ? '62 cm' : '24.4 in'}</td>
                          <td className="py-1">{unitSystem === 'cm' ? '88 cm' : '34.6 in'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-[#181715] dark:text-[#FAF8F3]">FR 36 (US 4)</td>
                          <td className="py-1">{unitSystem === 'cm' ? '86 cm' : '33.8 in'}</td>
                          <td className="py-1">{unitSystem === 'cm' ? '66 cm' : '26.0 in'}</td>
                          <td className="py-1">{unitSystem === 'cm' ? '92 cm' : '36.2 in'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-[#181715] dark:text-[#FAF8F3]">FR 38 (US 6)</td>
                          <td className="py-1">{unitSystem === 'cm' ? '90 cm' : '35.4 in'}</td>
                          <td className="py-1">{unitSystem === 'cm' ? '70 cm' : '27.5 in'}</td>
                          <td className="py-1">{unitSystem === 'cm' ? '96 cm' : '37.8 in'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-[#181715] dark:text-[#FAF8F3]">FR 40 (US 8)</td>
                          <td className="py-1">{unitSystem === 'cm' ? '94 cm' : '37.0 in'}</td>
                          <td className="py-1">{unitSystem === 'cm' ? '74 cm' : '29.1 in'}</td>
                          <td className="py-1">{unitSystem === 'cm' ? '100 cm' : '39.3 in'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Complimentary Concierge Monogram Option */}
              <div className="mt-5 pt-4 border-t border-[#EDE8DE] dark:border-[#272421]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-sans-luxury text-[#181715] dark:text-[#FAF8F3]">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C7853]" />
                    <span>Complimentary Monogram (Optional)</span>
                  </span>
                  <span className="text-[10px] text-[#8C7853] dark:text-[#C5B492] uppercase">24k Gold Foil or Tone-on-Tone</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="E.g. A.V."
                    value={monogram}
                    onChange={(e) => setMonogram(e.target.value.toUpperCase())}
                    className="w-24 px-3 py-1.5 text-xs font-mono tracking-widest text-center uppercase bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                  />
                  <span className="text-[11px] text-[#706B63] dark:text-[#9F998F]">
                    {monogram ? `Embossing will appear as “${monogram}”` : 'Up to 3 initials embossed by our Place Vendôme bookbinder'}
                  </span>
                </div>
              </div>

              {/* Craftsmanship Accordion Tabs */}
              <div className="mt-6 pt-4 border-t border-[#EDE8DE] dark:border-[#272421]">
                <div className="flex border-b border-[#E5E0D5] dark:border-[#2C2926] text-xs">
                  <button
                    onClick={() => setActiveTab('provenance')}
                    className={`pb-2 mr-4 uppercase tracking-[0.14em] font-sans-luxury transition-colors cursor-pointer ${
                      activeTab === 'provenance'
                        ? 'border-b-2 border-[#181715] dark:border-[#FAF8F3] text-[#181715] dark:text-[#FAF8F3] font-medium'
                        : 'text-[#878177] hover:text-[#181715] dark:hover:text-white'
                    }`}
                  >
                    Provenance
                  </button>
                  <button
                    onClick={() => setActiveTab('construction')}
                    className={`pb-2 mr-4 uppercase tracking-[0.14em] font-sans-luxury transition-colors cursor-pointer ${
                      activeTab === 'construction'
                        ? 'border-b-2 border-[#181715] dark:border-[#FAF8F3] text-[#181715] dark:text-[#FAF8F3] font-medium'
                        : 'text-[#878177] hover:text-[#181715] dark:hover:text-white'
                    }`}
                  >
                    Construction
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`pb-2 uppercase tracking-[0.14em] font-sans-luxury transition-colors cursor-pointer ${
                      activeTab === 'care'
                        ? 'border-b-2 border-[#181715] dark:border-[#FAF8F3] text-[#181715] dark:text-[#FAF8F3] font-medium'
                        : 'text-[#878177] hover:text-[#181715] dark:hover:text-white'
                    }`}
                  >
                    Archival Care
                  </button>
                </div>

                <div className="py-3 text-xs text-[#605B54] dark:text-[#A7A096] leading-relaxed">
                  {activeTab === 'provenance' && (
                    <ul className="space-y-1">
                      {product.composition.map((comp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#8C7853]">·</span>
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {activeTab === 'construction' && (
                    <p>
                      Meticulously patterned and cut in our historic Place Vendôme atelier. Every boundary seam is hand-turned with French seams to ensure structural durability and zero friction against the silhouette.
                    </p>
                  )}
                  {activeTab === 'care' && (
                    <p>{product.careInstructions}</p>
                  )}
                </div>
              </div>

            </div>

            {/* Purchase CTA Strip */}
            <div className="mt-8 pt-4 border-t border-[#EDE8DE] dark:border-[#272421]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  disabled={justAdded}
                  className="flex-1 py-3.5 px-6 bg-[#181715] text-[#FAF9F5] hover:bg-[#322F2A] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white text-xs uppercase tracking-[0.2em] font-sans-luxury font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <span>Add to Shopping Bag · €{product.price.toLocaleString()}</span>
                  )}
                </button>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-3.5 border transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-[#8C7853] text-white border-[#8C7853]'
                      : 'border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] hover:bg-[#F2EFE9] dark:hover:bg-[#221F1C]'
                  }`}
                  aria-label="Wishlist piece"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Consult Stylist Alice for Bespoke Advice */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  consultAlice(`Bonjour Alice, I would like bespoke styling advice and sizing confirmation for the ${product.name} (€${product.price}).`, true);
                }}
                className="w-full mt-2.5 py-2 px-3 border border-[#D5CFC5] dark:border-[#38332E] hover:border-[#8C7853] text-[11px] uppercase tracking-[0.14em] text-[#8C7853] dark:text-[#C5B492] hover:text-[#181715] dark:hover:text-[#FAF8F3] transition-colors flex items-center justify-center gap-2 cursor-pointer bg-[#F7F4ED]/50 dark:bg-[#1E1C1A]/50 group"
              >
                <Sparkles className="w-3 h-3 text-[#8C7853] group-hover:rotate-12 transition-transform" />
                <span>Consult Alice · Ask Stylist About This Piece</span>
              </button>

              {/* Delivery & Assurance */}
              <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] text-[#706B63] dark:text-[#9F998F]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#8C7853] shrink-0" />
                  <span>Insured Express Courier</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#8C7853] shrink-0" />
                  <span>30-Day Salon Return Privileges</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
