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

type FilterCategory = 'all' | 'outerwear' | 'tailoring' | 'gowns' | 'bags' | 'shoes' | 'jewellery';
type GenderFilter = 'all' | 'femme' | 'homme' | 'universal';

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
  wishlistIds,
}) => {
  const [selectedGender, setSelectedGender] = useState<GenderFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'curated' | 'price-asc' | 'price-desc'>('curated');
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  const genderOptions: { key: GenderFilter; label: string; sub: string }[] = [
    { key: 'all', label: 'All Silhouettes', sub: 'Tous les Genres' },
    { key: 'femme', label: 'Femme', sub: 'Haute Couture & Fine Gowns' },
    { key: 'homme', label: 'Homme', sub: 'Sartorial Tailoring & Footwear' },
    { key: 'universal', label: 'Universal', sub: 'Architectural & Genderless Cuts' },
  ];

  const categories: { key: FilterCategory; label: string }[] = [
    { key: 'all', label: 'All Categories' },
    { key: 'outerwear', label: 'Outerwear & Coats' },
    { key: 'tailoring', label: 'Tailoring' },
    { key: 'shoes', label: 'Chaussures (Shoes)' },
    { key: 'bags', label: 'Maroquinerie & Knit Knot' },
    { key: 'gowns', label: 'Haute Gowns' },
    { key: 'jewellery', label: 'Objects & Jewellery' },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Gender filter
      const matchesGender = selectedGender === 'all' || 
        item.gender === selectedGender || 
        (selectedGender === 'femme' && item.gender === 'universal') ||
        (selectedGender === 'homme' && item.gender === 'universal');

      // Category filter
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        item.name.toLowerCase().includes(q) ||
        (item.frenchName && item.frenchName.toLowerCase().includes(q)) ||
        item.fabric.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );

      return matchesGender && matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedGender, selectedCategory, searchQuery, sortBy]);

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

      {/* 1. GENDER SELECTION MODULE (Luxe Design interactive tab bar) */}
      <div className="pt-8 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-[0.2em] font-sans-luxury text-[#706B63] dark:text-[#A7A096] flex items-center gap-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-[#8C7853]" />
            <span>Select Wardrobe Division & Gender</span>
          </span>
          <span className="text-[11px] text-[#8C7853] dark:text-[#C5B492] font-mono tabular-nums">
            {filteredProducts.length} Silhouettes Available
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-1.5 bg-[#F2EDE2] dark:bg-[#1D1B18] border border-[#E0D9CB] dark:border-[#2C2926]">
          {genderOptions.map((g) => {
            const isSelected = selectedGender === g.key;
            return (
              <button
                key={g.key}
                onClick={() => setSelectedGender(g.key)}
                className={`relative p-3 text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] shadow-sm'
                    : 'bg-transparent text-[#605B54] dark:text-[#A7A096] hover:bg-white/60 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif-luxury text-sm sm:text-base font-medium">
                    {g.label}
                  </span>
                  {isSelected && (
                    <motion.span 
                      layoutId="activeGenderDot"
                      className="w-1.5 h-1.5 rounded-full bg-[#8C7853]" 
                    />
                  )}
                </div>
                <span className={`text-[10px] tracking-wider uppercase block mt-0.5 truncate ${
                  isSelected ? 'opacity-80' : 'opacity-60'
                }`}>
                  {g.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CATEGORY FILTER TABS & SEARCH */}
      <div className="py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Segmented Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] font-sans-luxury transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] font-medium'
                    : 'bg-[#F2EFE9] text-[#605B54] hover:bg-[#EAE5DC] dark:bg-[#1E1C1A] dark:text-[#A7A096] dark:hover:bg-[#282522]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
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
            onClick={() => { setSelectedGender('all'); setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-4 px-5 py-2 text-xs uppercase tracking-[0.16em] bg-[#181715] text-[#FAF9F5] dark:bg-white dark:text-[#181715] hover:opacity-90"
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
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
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
                    <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5">
                      <span className="text-[10px] tracking-[0.18em] uppercase font-sans-luxury text-[#181715] dark:text-[#FAF8F3] bg-[#FAF9F5]/90 dark:bg-[#181715]/90 backdrop-blur-sm px-2.5 py-1 border border-[#E8E4DC]/80 dark:border-[#38332E]">
                        {product.gender === 'femme' ? 'Femme' : product.gender === 'homme' ? 'Homme' : 'Universal'}
                      </span>
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
