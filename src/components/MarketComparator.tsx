import React, { useState, useMemo } from 'react';
import { LUXURY_PRICE_COMPARISONS } from '../data/shipmentsAndComparisons';
import { LuxuryPriceComparison } from '../types/fashion';
import { Search, SlidersHorizontal, CheckCircle2, TrendingDown, Shield, Globe, ExternalLink, Sparkles, Building, ChevronDown, ChevronUp, X } from 'lucide-react';

interface MarketComparatorProps {
  isOpen?: boolean;
  onClose?: () => void;
  isStandaloneSection?: boolean;
}

export const MarketComparator: React.FC<MarketComparatorProps> = ({
  isOpen = true,
  onClose,
  isStandaloneSection = false,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(LUXURY_PRICE_COMPARISONS[0].id);

  const brands = ['all', 'Louis Vuitton', 'Maison Aurelia', 'The Row', 'Brunello Cucinelli', 'Loro Piana', 'Bottega Veneta'];
  const categories = ['all', 'Outerwear', 'Maroquinerie', 'Tailoring', 'Footwear & Objects', 'Haute Gowns'];

  const filteredItems = useMemo(() => {
    return LUXURY_PRICE_COMPARISONS.filter((item) => {
      const matchesBrand = selectedBrand === 'all' || item.brand === selectedBrand;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        item.itemName.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.lowestPlatform.toLowerCase().includes(q)
      );
      return matchesBrand && matchesCategory && matchesSearch;
    });
  }, [selectedBrand, selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const content = (
    <div className="space-y-6 text-xs">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#E8E4DC] dark:border-[#272421] gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-1">
            <span>Global Luxury Valuation Index</span>
            <span aria-hidden="true">·</span>
            <span>Multi-House Price Intelligence</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
            Cross-Application Price & Valuation Comparator
          </h3>
        </div>

        <p className="text-xs text-[#706B63] dark:text-[#9F998F] max-w-md font-light leading-relaxed">
          Real-time price intelligence aggregating quotes across official brand flagships, 24S (LVMH), Net-a-Porter, SSENSE, Mytheresa, and Sotheby’s Luxury Vault to identify the lowest authenticated acquisition price.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[#F2EDE2] dark:bg-[#1C1A17] border border-[#E0D9CB] dark:border-[#2B2723] space-y-3">
        
        {/* Brand Segmented Tabs */}
        <div>
          <span className="text-[10px] uppercase tracking-wider font-sans-luxury text-[#706B63] dark:text-[#A7A096] block mb-1.5 font-medium">
            Filter by House / Brand
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-sans-luxury transition-all cursor-pointer ${
                  selectedBrand === b
                    ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] font-medium'
                    : 'bg-[#FAF9F5] text-[#605B54] hover:bg-[#EAE4D7] dark:bg-[#25221F] dark:text-[#A7A096]'
                }`}
              >
                {b === 'all' ? 'All Luxury Houses' : b}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          <div className="sm:col-span-7 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#878177]" />
            <input
              type="text"
              placeholder="Search silhouette, house, or platform (e.g. The Row, 24S, Cashmere)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F5] dark:bg-[#151311] border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
            />
          </div>

          <div className="sm:col-span-5 flex items-center bg-[#FAF9F5] dark:bg-[#151311] border border-[#D5CFC5] dark:border-[#38332E] px-3 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-[#878177]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by luxury category"
              className="w-full bg-transparent text-xs text-[#181715] dark:text-[#FAF8F3] focus:outline-none cursor-pointer tracking-wider uppercase font-sans-luxury"
            >
              <option value="all">All Categories</option>
              <option value="Outerwear">Outerwear & Coats</option>
              <option value="Maroquinerie">Maroquinerie (Bags)</option>
              <option value="Tailoring">Tailoring & Blazers</option>
              <option value="Footwear & Objects">Footwear & Objects</option>
              <option value="Haute Gowns">Haute Evening Gowns</option>
            </select>
          </div>
        </div>

      </div>

      {/* Comparisons List */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const priceDifference = item.officialBoutiquePrice - item.lowestFoundPrice;
          const savingsPercentage = Math.round((priceDifference / item.officialBoutiquePrice) * 100);

          return (
            <div
              key={item.id}
              className="border border-[#E0D9CB] dark:border-[#2C2926] bg-[#FAF9F5] dark:bg-[#171513] transition-all"
            >
              {/* Main Summary Header Row */}
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-[#F6F3EC] dark:hover:bg-[#1E1C1A] transition-colors"
              >
                {/* Left: Thumbnail & Brand/Title */}
                <div className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.itemName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-16 sm:w-16 sm:h-20 object-cover object-center border border-[#D5CFC5] dark:border-[#38332E] shrink-0"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-0.5">
                      <span className="font-semibold">{item.brand}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.category}</span>
                    </div>
                    <h4 className="font-serif-luxury text-base sm:text-lg text-[#181715] dark:text-[#FAF8F3] leading-snug">
                      {item.itemName}
                    </h4>
                    <p className="text-[11px] text-[#706B63] dark:text-[#9F998F] pt-0.5">
                      Lowest authentic route: <span className="font-medium text-[#181715] dark:text-[#FAF8F3]">{item.lowestPlatform}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Price Benchmark & Lowest Offer */}
                <div className="flex items-center justify-between lg:justify-end gap-6 sm:gap-8 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E8E4DC] dark:border-[#262421]">
                  
                  {/* Official Boutique Base */}
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] uppercase text-[#878177] tracking-wider block">Official Flagship</span>
                    <span className="font-mono text-xs tabular-nums text-[#605B54] dark:text-[#9F998F] line-through">
                      €{item.officialBoutiquePrice.toLocaleString()} {item.currency}
                    </span>
                  </div>

                  {/* Lowest Verified Price */}
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] uppercase text-[#8C7853] dark:text-[#C5B492] tracking-wider block font-medium">
                      Lowest Verified
                    </span>
                    <span className="font-mono text-base font-semibold tabular-nums text-[#181715] dark:text-[#FAF8F3]">
                      €{item.lowestFoundPrice.toLocaleString()} {item.currency}
                    </span>
                  </div>

                  {/* Savings Indicator */}
                  {priceDifference > 0 ? (
                    <div className="bg-[#8C7853]/15 text-[#8C7853] dark:text-[#C5B492] px-2.5 py-1 text-[11px] font-mono tracking-wider font-semibold whitespace-nowrap">
                      Save €{priceDifference.toLocaleString()} ({savingsPercentage}%)
                    </div>
                  ) : (
                    <div className="bg-black/5 dark:bg-white/5 text-[#706B63] dark:text-[#A7A096] px-2.5 py-1 text-[10px] tracking-wider uppercase whitespace-nowrap">
                      Parity Pricing
                    </div>
                  )}

                  <div className="text-[#878177] hover:text-[#181715] dark:hover:text-white p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>

                </div>
              </div>

              {/* Expanded Breakdown Table & Arbitrage Intelligence */}
              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-[#E8E4DC] dark:border-[#272421] bg-[#F5F2EA] dark:bg-[#141210] space-y-4 animate-fade-in">
                  
                  {/* Arbitrage & Provenance Note */}
                  <div className="p-3.5 bg-white dark:bg-black/40 border border-[#D5CFC5] dark:border-[#38332E] text-xs">
                    <div className="flex items-center gap-1.5 text-[#8C7853] dark:text-[#C5B492] font-medium uppercase tracking-wider text-[10px] mb-1">
                      <Globe className="w-3.5 h-3.5" />
                      <span>House Market Arbitrage & Tax Advisory</span>
                    </div>
                    <p className="text-[#57534D] dark:text-[#ACA59B] leading-relaxed">
                      {item.arbitrageNote}
                    </p>
                  </div>

                  {/* Quotes from Official Apps and Platforms Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans-luxury text-[11px]">
                      <thead>
                        <tr className="border-b border-[#D5CFC5] dark:border-[#38332E] text-[#878177] uppercase text-[10px] tracking-wider">
                          <th className="pb-2 font-normal">Platform / Application</th>
                          <th className="pb-2 font-normal">Price Quote</th>
                          <th className="pb-2 font-normal">Condition</th>
                          <th className="pb-2 font-normal">Inventory Status</th>
                          <th className="pb-2 font-normal">Transit & Duties</th>
                          <th className="pb-2 font-normal text-right">Acquisition Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E6E1D8] dark:divide-[#272421]">
                        {item.platforms.map((plat, idx) => {
                          const isLowest = plat.price === item.lowestFoundPrice;
                          return (
                            <tr key={idx} className={isLowest ? 'bg-[#8C7853]/10 font-medium' : ''}>
                              <td className="py-2.5 text-[#181715] dark:text-[#FAF8F3] font-medium flex items-center gap-1.5">
                                {isLowest && <CheckCircle2 className="w-3.5 h-3.5 text-[#8C7853]" />}
                                <span>{plat.platformName}</span>
                              </td>
                              <td className="py-2.5 font-mono tabular-nums text-xs font-semibold text-[#181715] dark:text-[#FAF8F3]">
                                €{plat.price.toLocaleString()} {plat.currency}
                              </td>
                              <td className="py-2.5 text-[#706B63] dark:text-[#A7A096]">
                                {plat.condition}
                              </td>
                              <td className="py-2.5">
                                <span className={
                                  plat.availability === 'In Stock'
                                    ? 'text-emerald-700 dark:text-emerald-400'
                                    : plat.availability === 'Limited Stock'
                                    ? 'text-[#8C7853] dark:text-[#C5B492]'
                                    : 'text-[#878177]'
                                }>
                                  {plat.availability}
                                </span>
                              </td>
                              <td className="py-2.5 text-[#706B63] dark:text-[#A7A096]">
                                {plat.shippingTime} · {plat.dutiesIncluded ? 'Duties Paid' : 'Excl. Duties'}
                              </td>
                              <td className="py-2.5 text-right">
                                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#8C7853] hover:underline cursor-pointer">
                                  <span>{plat.directUrlHint.split('/')[0]}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );

  if (isStandaloneSection) {
    return (
      <section id="market-index" className="py-20 px-6 lg:px-12 max-w-[1440px] mx-auto border-t border-[#E8E4DC] dark:border-[#272421]">
        {content}
      </section>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div
        className="relative w-full max-w-5xl bg-[#FAF9F5] dark:bg-[#151311] border border-[#E0DBD0] dark:border-[#2C2926] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#706B63] hover:text-[#181715] dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Close market index modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1 pr-1">
          {content}
        </div>
      </div>
    </div>
  );
};
