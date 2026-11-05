import React, { useState, useMemo } from 'react';
import { Product } from '../types/fashion';
import { PRODUCTS } from '../data/products';
import { Heart, Eye, Plus, Search, SlidersHorizontal, Check, Sparkles, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CollectionGridProps {
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
}

type DepartmentFilter = 'all' | 'femme' | 'homme' | 'accessories' | 'fragrance';
type SilhouetteFilter = 'all' | 'clothes' | 'shoes' | 'bags' | 'jewellery' | 'fragrance';

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
  wishlistIds,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentFilter>('all');
  const [selectedSilhouette, setSelectedSilhouette] = useState<SilhouetteFilter>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'curated' | 'price-asc' | 'price-desc'>('curated');
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  const luxuryHouses: { key: string; label: string; badge: string }[] = [
    { key: 'all', label: 'All Luxury Houses', badge: 'Place Vendôme & Paris' },
    { key: 'Maison Aurelia', label: 'Maison Aurelia.co', badge: '14 Place Vendôme' },
    { key: 'Chanel', label: 'Chanel', badge: '31 Rue Cambon' },
    { key: 'Saint Laurent', label: 'Saint Laurent', badge: '37 Rue de Bellechasse' },
    { key: 'Hermès', label: 'Hermès', badge: 'Faubourg Saint-Honoré' },
    { key: 'Louis Vuitton', label: 'Louis Vuitton', badge: 'Place Vendôme & Asnières' },
    { key: 'Christian Dior', label: 'Christian Dior', badge: '30 Avenue Montaigne' },
    { key: 'Bottega Veneta', label: 'Bottega Veneta', badge: 'Montebello Vicentino' },
    { key: 'Prada', label: 'Prada', badge: 'Galleria Vittorio Emanuele' },
    { key: 'Gucci', label: 'Gucci', badge: 'Via Tornabuoni, Firenze' },
    { key: 'Loro Piana', label: 'Loro Piana', badge: 'Quarona, Piemonte' },
    { key: 'Givenchy', label: 'Givenchy', badge: '3 Avenue George V' },
    { key: 'Celine', label: 'Celine', badge: '16 Rue Vivienne' },
    { key: 'Alexander McQueen', label: 'Alexander McQueen', badge: 'Old Bond Street' },
    { key: 'Schiaparelli', label: 'Schiaparelli', badge: '21 Place Vendôme' },
    { key: 'Brunello Cucinelli', label: 'Brunello Cucinelli', badge: 'Solomeo, Umbria' },
    { key: 'Valentino', label: 'Valentino', badge: 'Piazza Mignanelli' },
    { key: 'Balenciaga', label: 'Balenciaga', badge: '10 Avenue George V' },
    { key: "Victoria's Secret", label: "Victoria's Secret", badge: 'Atelier Gold & Runway' },
  ];

  const departmentOptions: { key: DepartmentFilter; label: string; sub: string }[] = [
    { key: 'all', label: 'All Departments', sub: 'Tous les Univers' },
    { key: 'femme', label: 'Women (Femme)', sub: 'Haute Couture Gowns, Coats & Shoes' },
    { key: 'homme', label: 'Men (Homme)', sub: 'Bespoke Tailoring & Wholecut Shoes' },
    { key: 'accessories', label: 'Accessories', sub: 'Tuscan Leather & 24k Gold Objects' },
    { key: 'fragrance', label: 'Fragrance', sub: 'Haute Parfumerie & Pure Flacons' },
  ];

  const silhouetteOptions: { key: SilhouetteFilter; label: string; countHint?: string }[] = [
    { key: 'all', label: 'All Pieces' },
    { key: 'clothes', label: 'Clothes / Vêtements' },
    { key: 'shoes', label: 'Shoes & Boots / Souliers' },
    { key: 'bags', label: 'Bags & Maroquinerie' },
    { key: 'jewellery', label: 'Jewellery & Accessories' },
    { key: 'fragrance', label: 'Perfumes / Flacons' },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Brand filter
      const itemBrand = item.brand || 'Maison Aurelia';
      const matchesBrand = selectedBrand === 'all' || itemBrand.toLowerCase() === selectedBrand.toLowerCase();

      // Department filter
      let matchesDept = true;
      if (selectedDepartment === 'femme') {
        matchesDept = item.gender === 'femme' || item.gender === 'universal';
      } else if (selectedDepartment === 'homme') {
        matchesDept = item.gender === 'homme' || item.gender === 'universal';
      } else if (selectedDepartment === 'accessories') {
        matchesDept = item.category === 'bags' || item.category === 'jewellery';
      } else if (selectedDepartment === 'fragrance') {
        matchesDept = item.category === 'fragrance';
      }

      // Silhouette / Type filter
      let matchesSilhouette = true;
      if (selectedSilhouette === 'clothes') {
        matchesSilhouette = ['outerwear', 'tailoring', 'gowns'].includes(item.category);
      } else if (selectedSilhouette === 'shoes') {
        matchesSilhouette = item.category === 'shoes';
      } else if (selectedSilhouette === 'bags') {
        matchesSilhouette = item.category === 'bags';
      } else if (selectedSilhouette === 'jewellery') {
        matchesSilhouette = item.category === 'jewellery';
      } else if (selectedSilhouette === 'fragrance') {
        matchesSilhouette = item.category === 'fragrance';
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        item.name.toLowerCase().includes(q) ||
        (item.frenchName && item.frenchName.toLowerCase().includes(q)) ||
        item.fabric.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        itemBrand.toLowerCase().includes(q)
      );

      return matchesBrand && matchesDept && matchesSilhouette && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedBrand, selectedDepartment, selectedSilhouette, searchQuery, sortBy]);

  const handleQuickAddClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onQuickAdd(product);
    setAddedNoticeId(product.id);
    setTimeout(() => setAddedNoticeId(null), 1800);
  };

  return (
    <section id="collections" className="py-20 lg:py-28 px-6 lg:px-12 max-w-[1440px] mx-auto">
      
      {/* Bonito Luxe Design-Inspired Heading & Ordering */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E8E4DC] dark:border-[#272421] gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-2">
            <span>Luxe Design & Architectural Living</span>
            <span aria-hidden="true">·</span>
            <span>Personalized Elegance for Every Realm</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
            Curated Wardrobe & Footwear Silhouettes
          </h2>
        </div>

        <p className="text-sm text-[#706B63] dark:text-[#9F998F] max-w-md font-light leading-relaxed">
          Inspired by personalized architectural design: turning every silhouette into a tailored sanctuary of noble cashmere, museum calfskin, and tactile winter knits.
        </p>
      </motion.div>

      {/* 0. LUXURY HOUSES & WEBSITES SELECTION (Maison Aurelia.co, Louis Vuitton, Dior, Victoria's Secret) */}
      <div className="pt-8 pb-3">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] uppercase tracking-[0.2em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Luxury House & Atelier Archive</span>
          </span>
          <span className="text-[10px] text-[#706B63] dark:text-[#9F998F] uppercase tracking-wider font-mono">
            Official Runway & Boutique Pieces with Models
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {luxuryHouses.map((house) => {
            const isSelected = selectedBrand === house.key;
            return (
              <button
                key={house.key}
                onClick={() => setSelectedBrand(house.key)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-sans-luxury transition-all cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#181715] text-[#FAF9F5] border-[#181715] dark:bg-[#FAF8F3] dark:text-[#181715] dark:border-white shadow-sm font-semibold'
                    : 'bg-[#FAF9F5] dark:bg-[#1A1816] border-[#DCD6C9] dark:border-[#2C2926] text-[#605B54] dark:text-[#A7A096] hover:border-[#8C7853]'
                }`}
              >
                <span>{house.label}</span>
                <span className={`text-[9px] px-1.5 py-0.5 font-mono ${
                  isSelected 
                    ? 'bg-[#8C7853] text-white' 
                    : 'bg-[#8C7853]/15 text-[#8C7853] dark:text-[#C5B492]'
                }`}>
                  {house.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. REALM & DEPARTMENT CHOOSE OPTION (Women, Men, Accessories, Fragrance) */}
      <div className="pt-4 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <span className="text-[11px] uppercase tracking-[0.2em] font-sans-luxury text-[#706B63] dark:text-[#A7A096] flex items-center gap-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-[#8C7853]" />
            <span>Choose Department & Realm (Men, Women, Accessories, Fragrance)</span>
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <a href="#parfumerie" className="text-[#8C7853] dark:text-[#C5B492] hover:underline font-sans-luxury uppercase tracking-wider font-semibold">
              Dedicated Parfumerie ➔
            </a>
            <span className="opacity-40">·</span>
            <a href="#lookbook" className="text-[#8C7853] dark:text-[#C5B492] hover:underline font-sans-luxury uppercase tracking-wider font-semibold">
              Looks in Clothes ➔
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 p-1.5 bg-[#F2EDE2] dark:bg-[#1D1B18] border border-[#E0D9CB] dark:border-[#2C2926]">
          {departmentOptions.map((d) => {
            const isSelected = selectedDepartment === d.key;
            return (
              <button
                key={d.key}
                onClick={() => setSelectedDepartment(d.key)}
                className={`relative p-3 text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] shadow-sm font-semibold'
                    : 'bg-transparent text-[#605B54] dark:text-[#A7A096] hover:bg-white/60 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif-luxury text-sm sm:text-base font-medium">
                    {d.label}
                  </span>
                  {isSelected && (
                    <motion.span 
                      layoutId="activeDeptDot"
                      className="w-1.5 h-1.5 rounded-full bg-[#8C7853]" 
                    />
                  )}
                </div>
                <span className={`text-[10px] tracking-wider uppercase block mt-0.5 truncate ${
                  isSelected ? 'opacity-90 font-medium' : 'opacity-60'
                }`}>
                  {d.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SILHOUETTE & PRODUCT TYPE CHOOSE OPTION (Clothes, Shoes & Boots, Bags, Accessories, Fragrance) */}
      <div className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#E8E4DC] dark:border-[#272421] pb-6">
        
        {/* Segmented Filter Buttons */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono text-[#8C7853] dark:text-[#C5B492] block">
            Choose Garment Silhouette & Item Type:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {silhouetteOptions.map((sil) => {
              const isActive = selectedSilhouette === sil.key;
              return (
                <button
                  key={sil.key}
                  onClick={() => setSelectedSilhouette(sil.key)}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] font-sans-luxury transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] font-semibold border border-[#181715] dark:border-white shadow-sm'
                      : 'bg-[#F2EFE9] text-[#605B54] hover:bg-[#EAE5DC] dark:bg-[#1E1C1A] dark:text-[#A7A096] dark:hover:bg-[#282522] border border-transparent'
                  }`}
                >
                  {sil.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Sort Area */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#878177]" />
            <input
              type="text"
              placeholder="Search shoes, coat, knit knot, silk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] placeholder-[#9E978C] focus:outline-none focus:border-[#181715] dark:focus:border-white transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="relative flex items-center border border-[#D5CFC5] dark:border-[#38332E] px-3 py-1.5 bg-transparent">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-[#878177]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'curated' | 'price-asc' | 'price-desc')}
              aria-label="Sort collection items"
              className="bg-transparent text-xs text-[#181715] dark:text-[#FAF8F3] focus:outline-none cursor-pointer tracking-wider uppercase font-sans-luxury pr-2"
            >
              <option value="curated" className="bg-[#FAF9F5] dark:bg-[#141311]">Curated Order</option>
              <option value="price-asc" className="bg-[#FAF9F5] dark:bg-[#141311]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#FAF9F5] dark:bg-[#141311]">Price: High to Low</option>
            </select>
          </div>

        </div>

      </div>

      {/* 3. PRODUCT & FOOTWEAR GRID WITH FLUID ANIMATIONS */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center border border-[#E8E4DC] dark:border-[#272421] bg-[#F7F5EE] dark:bg-[#191715] p-8">
          <p className="font-serif-luxury text-xl text-[#181715] dark:text-[#FAF8F3]">
            No silhouettes found for the selected gender or criteria.
          </p>
          <p className="text-xs text-[#706B63] dark:text-[#9F998F] pt-2">
            Try switching to &ldquo;All Silhouettes&rdquo; or reset the category filters.
          </p>
          <button
            onClick={() => { setSelectedDepartment('all'); setSelectedSilhouette('all'); setSelectedBrand('all'); setSearchQuery(''); }}
            className="mt-4 px-5 py-2 text-xs uppercase tracking-[0.16em] bg-[#181715] text-[#FAF9F5] dark:bg-white dark:text-[#181715] hover:opacity-90 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
        >
          <AnimatePresence>
            {filteredProducts.map((product, index) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const isAddedNotice = addedNoticeId === product.id;

              return (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => onSelectProduct(product)}
                  className="group cursor-pointer flex flex-col bg-[#FAF9F5] dark:bg-[#171513] border border-[#EAE6DE] dark:border-[#2A2723] hover:border-[#BFB8AA] dark:hover:border-[#4B443B] transition-all duration-300"
                >
                  {/* Product Image Stage (65-75% visual dominance) */}
                  <div className="relative aspect-[4/5] bg-[#F2EFE9] dark:bg-[#1D1B19] overflow-hidden">
                    <img
                      src={product.image || '/assets/images/placeholder.jpg'}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                        product.category === 'shoes' || product.category === 'bags'
                          ? 'object-center'
                          : 'object-[center_16%]'
                      }`}
                      onError={(e) => {
                        // Fallback to a neutral placeholder if image fails to load
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
                      }}
                    />

                    {/* Top Floating Controls */}
                    <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product.id);
                        }}
                        className={`p-2 transition-colors rounded-full backdrop-blur-md cursor-pointer ${
                          isWishlisted
                            ? 'bg-[#8C7853] text-white'
                            : 'bg-[#FAF9F5]/85 dark:bg-[#181715]/85 text-[#181715] dark:text-[#FAF8F3] hover:bg-white dark:hover:bg-black'
                        }`}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Clean unboxed text tags */}
                    <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] tracking-[0.18em] uppercase font-sans-luxury text-[#181715] dark:text-[#FAF8F3] bg-[#FAF9F5]/90 dark:bg-[#181715]/90 backdrop-blur-sm px-2.5 py-1 border border-[#E8E4DC]/80 dark:border-[#38332E]">
                        {product.gender === 'femme' ? 'Femme' : product.gender === 'homme' ? 'Homme' : 'Universal'}
                      </span>
                      {product.brand && (
                        <span className="text-[10px] tracking-[0.16em] uppercase font-sans-luxury text-[#8C7853] bg-white/90 dark:bg-black/85 px-2 py-1 border border-[#8C7853]/40 font-medium">
                          {product.brand}
                        </span>
                      )}
                      {product.id === 'bag-nano-knit-knot' && (
                        <span className="text-[10px] tracking-[0.16em] uppercase font-sans-luxury text-[#8C7853] bg-white/90 dark:bg-black/80 px-2 py-1 border border-[#8C7853]/40">
                          Winter Capsule
                        </span>
                      )}
                    </div>

                    {/* Bottom Quick-Action Overlay on Hover */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="flex-1 py-2 px-3 text-[11px] uppercase tracking-[0.14em] font-sans-luxury bg-white/95 text-[#181715] hover:bg-white transition-colors flex items-center justify-center gap-1.5 font-medium cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Silhouette</span>
                      </button>
                      
                      <button
                        onClick={(e) => handleQuickAddClick(e, product)}
                        className="py-2 px-3 text-[11px] uppercase tracking-[0.14em] font-sans-luxury bg-[#181715] text-white hover:bg-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        title="Add Default Size to Bag"
                      >
                        {isAddedNotice ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Quick Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Content & Typographic Hierarchy */}
                  <div className="p-5 flex flex-col justify-between flex-grow">
                    
                    {/* Category & Origin Line */}
                    <div>
                      <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-1.5">
                        <span>{product.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{product.fabric.split('(')[0]}</span>
                      </div>

                      <h3 className="text-lg font-serif-luxury text-[#181715] dark:text-[#FAF8F3] group-hover:text-[#8C7853] transition-colors leading-snug">
                        {product.name}
                      </h3>

                      {product.frenchName && (
                        <p className="text-xs italic font-serif-luxury text-[#878177] dark:text-[#8E877D] pt-0.5">
                          {product.frenchName}
                        </p>
                      )}
                    </div>

                    {/* Price & Action Footer */}
                    <div className="mt-4 pt-3 border-t border-[#EDE9E1] dark:border-[#262320] flex items-baseline justify-between">
                      <div>
                        <span className="text-sm font-mono tabular-nums font-medium text-[#181715] dark:text-[#FAF8F3]">
                          €{product.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#878177] dark:text-[#8E877D] tracking-wider uppercase ml-1">
                          EUR
                        </span>
                      </div>

                      <span className="text-[11px] tracking-wider uppercase text-[#706B63] dark:text-[#9F998F] group-hover:text-[#181715] dark:group-hover:text-white transition-colors">
                        Acquire Piece →
                      </span>
                    </div>

                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

    </section>
  );
};
