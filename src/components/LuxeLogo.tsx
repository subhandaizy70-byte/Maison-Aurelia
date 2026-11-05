import React from 'react';

interface LuxeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'emblem' | 'horizontal' | 'stacked';
  showSubtitle?: boolean;
}

export const LuxeLogo: React.FC<LuxeLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
  showSubtitle = true
}) => {
  // Dimensions for the emblem SVG
  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-11 h-11',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-base sm:text-lg tracking-[0.2em]',
    md: 'text-xl sm:text-2xl lg:text-[23px] tracking-[0.24em]',
    lg: 'text-2xl sm:text-3xl tracking-[0.26em]',
    xl: 'text-3xl sm:text-4xl tracking-[0.28em]'
  };

  const subtitleSizes = {
    sm: 'text-[8px] tracking-[0.24em]',
    md: 'text-[9px] tracking-[0.28em]',
    lg: 'text-[10px] tracking-[0.32em]',
    xl: 'text-[12px] tracking-[0.35em]'
  };

  // Distinctive Place Vendôme architectural interlocking double-L monogram emblem
  const Emblem = (
    <div className={`relative shrink-0 ${emblemSizes[size]} flex items-center justify-center`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(212,175,55,0.25)]"
      >
        <defs>
          <linearGradient id="luxeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E9D9B4" />
            <stop offset="45%" stopColor="#D4AF37" />
            <stop offset="85%" stopColor="#8C7853" />
            <stop offset="100%" stopColor="#C5B492" />
          </linearGradient>
          <linearGradient id="luxeInnerGold" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FAF7F0" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#695738" />
          </linearGradient>
        </defs>

        {/* Place Vendôme Octagonal Cartouche Frame */}
        <polygon
          points="28,4 72,4 96,28 96,72 72,96 28,96 4,72 4,28"
          stroke="url(#luxeGoldGrad)"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />

        {/* Inner concentric geometric hairline */}
        <polygon
          points="31,10 69,10 90,31 90,69 69,90 31,90 10,69 10,31"
          stroke="url(#luxeGoldGrad)"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          fill="none"
          opacity="0.6"
        />

        {/* Architectural Double-L Interlocking Geometry (Luxe Layout) */}
        {/* First 'L' (Ascending left column & base) */}
        <path
          d="M32 24 V74 H66"
          stroke="url(#luxeInnerGold)"
          strokeWidth="5"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        {/* Second interlocking 'L' (Offset and mirrored upper-right) */}
        <path
          d="M68 76 V26 H42"
          stroke="url(#luxeGoldGrad)"
          strokeWidth="4"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        {/* Golden Diamond Pivot Point in Center */}
        <polygon
          points="50,44 56,50 50,56 44,50"
          fill="url(#luxeGoldGrad)"
        />

        {/* Subtle 4 Corner Accent dots */}
        <circle cx="28" cy="4" r="1.5" fill="#D4AF37" />
        <circle cx="72" cy="4" r="1.5" fill="#D4AF37" />
        <circle cx="72" cy="96" r="1.5" fill="#D4AF37" />
        <circle cx="28" cy="96" r="1.5" fill="#D4AF37" />
      </svg>
    </div>
  );

  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {Emblem}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {Emblem}
        <div className="mt-3">
          <span className={`block font-serif-luxury font-medium uppercase text-[#181715] dark:text-[#FAF8F5] leading-none ${textSizes[size]}`}>
            LUXE LAYOUT
          </span>
          {showSubtitle && (
            <span className={`block uppercase font-sans-luxury text-[#8C7853] dark:text-[#C5B492] font-semibold mt-1.5 ${subtitleSizes[size]}`}>
              HAUTE COUTURE · PLACE VENDÔME
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default horizontal
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {Emblem}
      <div className="flex flex-col">
        <span className={`font-serif-luxury font-medium uppercase text-[#181715] dark:text-[#FAF8F5] leading-tight whitespace-nowrap ${textSizes[size]}`}>
          LUXE LAYOUT
        </span>
        {showSubtitle && (
          <span className={`uppercase font-sans-luxury text-[#8C7853] dark:text-[#C5B492] font-semibold whitespace-nowrap ${subtitleSizes[size]}`}>
            PARIS · PLACE VENDÔME
          </span>
        )}
      </div>
    </div>
  );
};
