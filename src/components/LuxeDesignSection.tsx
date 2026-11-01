import React from 'react';
import { motion } from 'motion/react';
import { Home, Sparkles, Sliders, ShieldCheck, ArrowRight } from 'lucide-react';

interface LuxeDesignSectionProps {
  onExploreCollection: () => void;
  onOpenSalonBooking: () => void;
}

export const LuxeDesignSection: React.FC<LuxeDesignSectionProps> = ({
  onExploreCollection,
  onOpenSalonBooking,
}) => {
  const pillars = [
    {
      num: '01',
      title: 'Personalized Elegance for Every Scale',
      subtitle: 'From Compact Atelier Suites to Grand Private Residences',
      description: 'True luxury is never confined to sprawling mansions. Just as bespoke interior design transforms intimate 1BHK, 2BHK, and 3BHK residences into personal sanctuaries, our silhouettes are mathematically sculpted to elevate everyday living into an effortless art form.',
      highlight: 'Custom Silhouette Calibration'
    },
    {
      num: '02',
      title: 'Layered Textures & Tactile Warmth',
      subtitle: 'Cashmere Wool Knits, Raw Silk & Travertine Finishes',
      description: 'Drawing from contemporary interior design layering, we combine tactile shearling, soft virgin wool knit knots (inspired by high alpine retreats), and hand-finished box calfskin to create garments that feel like a physical shelter of silence.',
      highlight: 'Multi-Sensory Fabric Harmony'
    },
    {
      num: '03',
      title: 'Smart Architectural Versatility',
      subtitle: 'Convertible Elements & Kinetic Flow',
      description: 'Form engineered for fluid movement. From detachable 24k gold chain straps on the Nano Knit Knot bucket bag to unlined double-faced cashmere overcoats that transition seamlessly from gallery openings to private salon soirées.',
      highlight: 'Fluid Multi-Use Engineering'
    },
    {
      num: '04',
      title: 'Celebrity Mastercraft & Haute Collaboration',
      subtitle: 'Collaborative Philosophy of the Singular Artisan',
      description: 'Every collection embodies the rarefied spirit of celebrity architectural collaborations—hand-signed, numbered in strictly limited runs of 35 to 60 pieces, and tailored with generational European savoir-faire.',
      highlight: 'Signed Archival Provenance'
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-[#FAF9F5] dark:bg-[#141311] border-b border-[#E8E4DC] dark:border-[#272421]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Section Header with smooth entrance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between pb-10 border-b border-[#E8E4DC] dark:border-[#272421] gap-6"
        >
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-2">
              <Home className="w-3.5 h-3.5 text-[#8C7853]" />
              <span>LUXE Interior & Wardrobe Design Philosophy</span>
              <span aria-hidden="true">·</span>
              <span>2026/2027</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
              The Architecture of Living & Silhouettes
            </h2>
          </div>

          <p className="text-sm text-[#706B63] dark:text-[#9F998F] max-w-md font-light leading-relaxed">
            Bridging architectural interior harmony and haute couture: where every room, every line, and every tactile textile serves the quiet dignity of the inhabitant.
          </p>
        </motion.div>

        {/* 4 Pillars Grid with Staggered Motion */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="p-6 bg-[#F6F3EB] dark:bg-[#1A1816] border border-[#E5E0D5] dark:border-[#2A2622] flex flex-col justify-between hover:border-[#8C7853] dark:hover:border-[#8C7853] transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-base text-[#8C7853] dark:text-[#C5B492] font-semibold tabular-nums">
                    {pillar.num}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-sans-luxury text-[#706B63] dark:text-[#9F998F] border border-[#D5CFC5] dark:border-[#38332E] px-2 py-0.5">
                    {pillar.highlight}
                  </span>
                </div>

                <h3 className="text-lg font-serif-luxury text-[#181715] dark:text-[#FAF8F3] leading-snug mb-1 group-hover:text-[#8C7853] transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-[11px] uppercase tracking-wider text-[#8C7853] dark:text-[#C5B492] mb-3 font-sans-luxury">
                  {pillar.subtitle}
                </p>

                <p className="text-xs text-[#605B54] dark:text-[#A7A096] leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8E3D8] dark:border-[#2B2723]">
                <button
                  onClick={onExploreCollection}
                  className="text-[11px] uppercase tracking-wider font-sans-luxury text-[#181715] dark:text-[#FAF8F3] group-hover:text-[#8C7853] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Explore Design Works</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlight Banner: Bonito Luxe Living & Nano Knit Knot Spotlight */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 p-6 bg-[#181715] text-[#FAF9F5] dark:bg-[#1E1C1A] border border-[#38332E] flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#8C7853]/20 text-[#C5B492] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans-luxury text-[#C5B492] block">
                Seasonal Spotlight · Winter Bundling Capsule
              </span>
              <h4 className="text-xl font-serif-luxury text-white">
                The Nano Knit Knot & Handcrafted Footwear Collection
              </h4>
              <p className="text-xs text-[#A7A096] pt-0.5">
                Featuring the Cashmere-Pink Knit Knot bucket bag, Brâncuși brass heel mules, and Savile Goodyear derbies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onExploreCollection}
              className="px-5 py-2.5 bg-[#FAF9F5] text-[#181715] hover:bg-white text-xs uppercase tracking-wider font-sans-luxury font-medium transition-colors cursor-pointer"
            >
              Discover Capsule
            </button>
            <button
              onClick={onOpenSalonBooking}
              className="px-5 py-2.5 border border-[#524B43] text-[#FAF9F5] hover:border-white text-xs uppercase tracking-wider font-sans-luxury transition-colors cursor-pointer"
            >
              Book Salon Fitting
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
