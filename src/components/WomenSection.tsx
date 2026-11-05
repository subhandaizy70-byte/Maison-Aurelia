import React, { useState, useMemo } from 'react';
import { Product } from '../types/fashion';
import { PRODUCTS } from '../data/products';
import { Heart, Eye, Plus, Search, SlidersHorizontal, Check, Sparkles, Crown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WomenSectionProps {
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
}

type WomenCategoryFilter = 'all' | 'clothes' | 'shoes' | 'boots' | 'bags' | 'accessories';

// Example CSS / Tailwind classes for your Product Grid & Card
export const productGridStyles = {
  // Container
  grid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 w-full max-w-7xl mx-auto",
  
  // Individual Card Container (Prevents content spilling)
  card: "relative flex flex-col bg-white dark:bg-[#1A1816] border border-[#E5E0D8] dark:border-[#2C2926] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer",
  
  // Image Wrapper (Fixes aspect ratio and prevents image overlap)
  imageWrapper: "relative w-full h-72 bg-[#F9F8F6] dark:bg-[#201D1A] overflow-hidden flex items-center justify-center shrink-0",
  
  // Image Element
  image: "w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105 product-card-img"
};

export const WomenSection: React.FC<WomenSectionProps> = ({
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
  wishlistIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WomenCategoryFilter>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'curated' | 'price-asc' | 'price-desc'>('curated');
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  const womenHouses = [
    { key: 'all', label: 'All Maisons', badge: 'Paris & Milan' },
    { key: 'Chanel', label: 'Chanel', badge: '31 Rue Cambon' },
    { key: 'Christian Dior', label: 'Christian Dior', badge: '30 Avenue Montaigne' },
    { key: 'Saint Laurent', label: 'Saint Laurent', badge: '37 Rue de Bellechasse' },
    { key: 'Celine', label: 'Celine', badge: '16 Rue Vivienne' },
    { key: 'Valentino', label: 'Valentino', badge: 'Piazza Mignanelli' },
    { key: 'Schiaparelli', label: 'Schiaparelli', badge: '21 Place Vendôme' },
    { key: 'Givenchy', label: 'Givenchy', badge: '3 Avenue George V' },
    { key: 'Balenciaga', label: 'Balenciaga', badge: '10 Avenue George V' },
    { key: "Victoria's Secret", label: "Victoria's Secret", badge: 'Atelier Gold' },
    { key: 'Maison Aurelia', label: 'Maison Aurelia.co', badge: '14 Place Vendôme' },
  ];

  const categoryOptions: { key: WomenCategoryFilter; label: string; french: string; countLabel?: string }[] = [
    { key: 'all', label: 'All Women’s Silhouettes', french: 'Toutes les Créations Femme' },
    { key: 'clothes', label: 'Clothes & Gowns', french: 'Robes du Soir, Manteaux & Tailleurs' },
    { key: 'shoes', label: 'Shoes & Stilettos', french: 'Escarpins & Mules Sculpturales' },
    { key: 'boots', label: 'Boots', french: 'Bottes & Bottines en Veau Velours' },
    { key: 'bags', label: 'Bags & Maroquinerie', french: 'Sacs d’Exception & Pochettes' },
    { key: 'accessories', label: 'Jewellery & Accessories', french: 'Colliers en Or 24k & Écharpes' },
  ];

  const womenProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Must belong to femme or universal
      const isFemme = item.gender === 'femme' || item.gender === 'universal';
      if (!isFemme) return false;

      // Brand filter
      const itemBrand = item.brand || 'Maison Aurelia';
      if (selectedBrand !== 'all' && itemBrand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // Category filter
      if (selectedCategory === 'clothes') {
        const isClothing = ['outerwear', 'tailoring', 'gowns'].includes(item.category);
        if (!isClothing) return false;
      } else if (selectedCategory === 'shoes') {
        const isShoe = item.category === 'shoes' && !item.name.toLowerCase().includes('boot') && !item.silhouette.toLowerCase().includes('boot');
        if (!isShoe) return false;
      } else if (selectedCategory === 'boots') {
        const isBoot = item.category === 'shoes' && (item.name.toLowerCase().includes('boot') || item.silhouette.toLowerCase().includes('boot'));
        if (!isBoot) return false;
      } else if (selectedCategory === 'bags') {
        if (item.category !== 'bags') return false;
      } else if (selectedCategory === 'accessories') {
        if (item.category !== 'jewellery') return false;
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const match = 
          item.name.toLowerCase().includes(q) ||
          (item.frenchName && item.frenchName.toLowerCase().includes(q)) ||
          item.fabric.toLowerCase().includes(q) ||
          item.categoryLabel.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          itemBrand.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedCategory, selectedBrand, searchQuery, sortBy]);

  const handleQuickAddClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onQuickAdd(product);
    setAddedNoticeId(product.id);
    setTimeout(() => setAddedNoticeId(null), 1800);
  };

  return (
    <section 
      id="collection-women" 
      className="py-20 lg:py-28 px-6 lg:px-12 max-w-[1440px] mx-auto border-t border-[#E8E4DC] dark:border-[#272421]"
    >
      {/* Anchor alias for french navigation */}
      <div id="collection-femme" className="-mt-20 pt-20" />

      {/* Editorial Women's Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E8E4DC] dark:border-[#272421] gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-2 font-medium">
            <Crown className="w-3.5 h-3.5" />
            <span>Univers Femme · Section Dédiée</span>
            <span aria-hidden="true">·</span>
            <span>Parisian Haute Couture</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
            Women’s Couture, Gowns & Footwear
          </h2>
          <p className="text-xs uppercase tracking-[0.16em] text-[#8C7853] mt-1.5 font-sans-luxury">
            Maison Aurelia · Chanel · Christian Dior · Saint Laurent · Celine · Valentino · Schiaparelli
          </p>
        </div>

        <p className="text-sm text-[#706B63] dark:text-[#9F998F] max-w-md font-light leading-relaxed">
          The women’s sanctuary: from hand-embroidered Lyon silk evening gowns and sculpted hour-glass cashmeres to Brâncuși brass-heeled mules and quilted lambskin maroquinerie.
        </p>
      </motion.div>

      {/* 1. SEPARATE CHOOSE OPTION: CLOTHES, SHOES, BOOTS, BAGS, ACCESSORIES */}
      <div className="pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <span className="text-[11px] uppercase tracking-[0.2em] font-sans-luxury text-[#706B63] dark:text-[#A7A096] flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#8C7853]" />
            <span>Select Women’s Category (Separate Clothes, Shoes, Boots, Bags)</span>
          </span>
          <span className="text-[11px] font-mono text-[#8C7853]">
            {womenProducts.length} pieces available
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 bg-[#F2EDE2] dark:bg-[#1D1B18] border border-[#E0D9CB] dark:border-[#2C2926]">
          {categoryOptions.map((opt) => {
            const isSelected = selectedCategory === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setSelectedCategory(opt.key)}
                className={`p-3 text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] shadow-sm font-semibold'
                    : 'bg-transparent text-[#605B54] dark:text-[#A7A096] hover:bg-white/60 dark:hover:bg-white/5'
                }`}
              >
                <div className="text-xs sm:text-sm font-serif-luxury font-medium">
                  {opt.label}
                </div>
                <div className="text-[9px] uppercase tracking-wider opacity-70 line-clamp-1 mt-0.5">
                  {opt.french}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. LUXURY MAISONS FILTER PILLS */}
      <div className="pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {womenHouses.map((house) => {
            const isSelected = selectedBrand === house.key;
            return (
              <button
                key={house.key}
                onClick={() => setSelectedBrand(house.key)}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-sans-luxury transition-all cursor-pointer flex items-center gap-2 border ${
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

      {/* 3. SEARCH & SORT TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-8 gap-4 border-b border-[#E8E4DC] dark:border-[#272421]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706B63] dark:text-[#9F998F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search silk gowns, coats, stilettos..."
            className="w-full bg-[#FAF9F5] dark:bg-[#1A1816] border border-[#DCD6C9] dark:border-[#2C2926] pl-10 pr-4 py-2 text-xs font-sans-luxury tracking-wide text-[#181715] dark:text-[#FAF8F3] placeholder-[#706B63] focus:outline-none focus:border-[#8C7853]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#706B63] font-mono">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C7853]" />
            <span>Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#FAF9F5] dark:bg-[#1A1816] border border-[#DCD6C9] dark:border-[#2C2926] px-3 py-1.5 text-xs font-sans-luxury tracking-wide text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853] cursor-pointer"
          >
            <option value="curated">Curated Runway Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 4. PRODUCT CARDS GRID */}
      {womenProducts.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-[#DCD6C9] dark:border-[#2C2926] my-8">
          <p className="text-base font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
            No women’s silhouettes match the selected filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedBrand('all');
              setSearchQuery('');
            }}
            className="mt-4 px-5 py-2 text-xs uppercase tracking-widest font-sans-luxury bg-[#181715] text-white dark:bg-white dark:text-[#181715] hover:opacity-90"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className={productGridStyles.grid}>
          {womenProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const isJustAdded = addedNoticeId === product.id;

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => onSelectProduct(product)}
                className={productGridStyles.card}
              >
                {/* Image Wrapper (Fixes aspect ratio and prevents image overlap) */}
                <div className={productGridStyles.imageWrapper}>
                  <img
                    src={product.image || '/assets/images/placeholder.jpg'}
                    alt={product.name}
                    className={productGridStyles.image}
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to a neutral placeholder if image fails to load
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Secondary image hover effect if available */}
                  {product.secondaryImage && (
                    <img
                      src={product.secondaryImage}
                      alt={`${product.name} detail`}
                      className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}

                  {/* House Hallmark Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
                    <span className="px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] font-mono bg-[#181715]/90 text-[#FAF9F5] backdrop-blur-sm border border-white/10 rounded-sm">
                      {product.brand || 'Maison Aurelia'}
                    </span>
                    {product.featured && (
                      <span className="px-2 py-0.5 text-[8px] uppercase tracking-wider font-mono bg-[#8C7853] text-white rounded-sm">
                        Salons Archive
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    className={`absolute top-3 right-3 p-2.5 transition-colors duration-200 cursor-pointer z-10 ${
                      isWishlisted
                        ? 'bg-[#8C7853] text-white'
                        : 'bg-white/80 dark:bg-[#181715]/80 text-[#181715] dark:text-white hover:bg-white'
                    }`}
                    aria-label="Save to Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>

                  {/* Quick Acquisition Button on Hover */}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 z-10">
                    <button
                      onClick={(e) => handleQuickAddClick(e, product)}
                      className="flex-1 py-2 text-[10px] uppercase tracking-[0.18em] font-sans-luxury bg-white text-[#181715] hover:bg-[#FAF9F5] flex items-center justify-center gap-1.5 transition-colors font-medium shadow-sm"
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Acquired in Cart</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>Quick Acquire</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="p-2 bg-white/20 hover:bg-white/30 text-white transition-colors"
                      title="Inspect Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Individual Card Content - Prevents content spilling */}
                <div className="p-4 flex flex-col flex-1 bg-white dark:bg-[#1A1816]">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#8C7853] dark:text-[#C5B492] font-mono">
                    {product.categoryLabel} · {product.sizes[0] || 'FR 36'}
                  </div>
                  <h3 className="text-base font-serif-luxury text-[#181715] dark:text-[#FAF8F3] group-hover:text-[#8C7853] transition-colors mt-1 line-clamp-1">
                    {product.name}
                  </h3>
                  {product.frenchName && (
                    <div className="text-xs text-[#706B63] dark:text-[#9F998F] italic font-serif-luxury line-clamp-1 mt-0.5">
                      {product.frenchName}
                    </div>
                  )}

                  <div className="mt-2 text-xs font-mono text-[#706B63] dark:text-[#9F998F] line-clamp-1">
                    {product.fabric}
                  </div>

                  <div className="mt-auto pt-3 flex items-center justify-between border-t border-[#E8E4DC] dark:border-[#272421]">
                    <span className="text-sm font-mono font-bold text-[#181715] dark:text-[#FAF8F3]">
                      €{product.price.toLocaleString()} {product.currency}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#8C7853] dark:text-[#C5B492] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};
