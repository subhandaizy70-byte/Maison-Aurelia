import React from 'react';
import { Product } from '../types/fashion';
import { PRODUCTS } from '../data/products';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  onRemoveWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  onRemoveWishlist,
  onSelectProduct,
  onQuickAdd,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
      
      {/* Drawer */}
      <div
        className="w-full max-w-md bg-[#FAF9F5] dark:bg-[#151311] h-full shadow-2xl flex flex-col justify-between border-l border-[#E2DDD3] dark:border-[#282522]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-[#E8E4DC] dark:border-[#272421] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#8C7853]" />
            <h3 className="text-sm uppercase tracking-[0.2em] font-sans-luxury font-medium text-[#181715] dark:text-[#FAF8F3]">
              Curated Wishlist
            </h3>
            <span className="text-xs font-mono tabular-nums text-[#878177]">
              ({wishlistedProducts.length})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#706B63] hover:text-[#181715] dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <Heart className="w-10 h-10 mx-auto text-[#8C7853]/60 stroke-1" />
              <div>
                <p className="font-serif-luxury text-xl text-[#181715] dark:text-[#FAF8F3]">
                  No silhouettes saved yet.
                </p>
                <p className="text-xs text-[#706B63] dark:text-[#9F998F] pt-1">
                  Click the heart icon on any piece to curate your private wardrobe selection.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#181715] text-[#FAF9F5] dark:bg-white dark:text-[#181715] text-xs uppercase tracking-[0.16em] hover:opacity-90 cursor-pointer"
              >
                Explore Archive
              </button>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-[#EDE9E1] dark:divide-[#272421]">
              {wishlistedProducts.map((product) => (
                <div key={product.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                  <div
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="w-20 h-24 bg-[#F2EDE4] dark:bg-[#1E1C1A] overflow-hidden shrink-0 cursor-pointer border border-[#E2DDCF] dark:border-[#2F2B27]"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8C7853] dark:text-[#C5B492] block">
                        {product.categoryLabel}
                      </span>
                      <h4
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="text-sm font-serif-luxury text-[#181715] dark:text-[#FAF8F3] hover:underline cursor-pointer leading-tight"
                      >
                        {product.name}
                      </h4>
                      <p className="text-xs font-mono tabular-nums text-[#181715] dark:text-[#FAF8F3] pt-1">
                        €{product.price.toLocaleString()} EUR
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-3">
                      <button
                        onClick={() => {
                          onQuickAdd(product);
                          onRemoveWishlist(product.id);
                        }}
                        className="py-1.5 px-3 bg-[#181715] text-[#FAF9F5] dark:bg-white dark:text-[#181715] text-[11px] uppercase tracking-wider font-sans-luxury flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>

                      <button
                        onClick={() => onRemoveWishlist(product.id)}
                        className="text-[11px] text-[#878177] hover:text-rose-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistedProducts.length > 0 && (
          <div className="p-6 border-t border-[#E8E4DC] dark:border-[#272421] bg-[#F7F4EC] dark:bg-[#181614]">
            <p className="text-xs text-[#706B63] dark:text-[#9F998F] text-center">
              Items in your private wishlist are held for 14 days in our Place Vendôme client ledger.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
