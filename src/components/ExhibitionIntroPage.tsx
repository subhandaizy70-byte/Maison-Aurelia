import React from 'react';
import { 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Building, 
  BarChart3, 
  ArrowRight, 
  Compass, 
  CheckCircle2, 
  Layers, 
  Film, 
  Gem, 
  Calendar,
  Lock,
  UserCheck,
  ChevronRight,
  ExternalLink,
  Flame,
  Award,
  Music2,
  Volume2
} from 'lucide-react';
import { motion } from 'motion/react';
import { luxuryAudio } from '../utils/audio';
import { NavigationPage } from './Header';
import { LuxeLogo } from './LuxeLogo';

interface ExhibitionIntroPageProps {
  onNavigatePage: (page: NavigationPage) => void;
  onOpenSalonBooking: () => void;
  onOpenAliceBot: () => void;
  onOpenAuthModal: () => void;
}

export const ExhibitionIntroPage: React.FC<ExhibitionIntroPageProps> = ({
  onNavigatePage,
  onOpenSalonBooking,
  onOpenAliceBot,
  onOpenAuthModal,
}) => {
  const privileges = [
    {
      icon: ShieldCheck,
      badge: '01 · Authentication',
      title: 'Haute Couture Provenance & Sealed Archives',
      french: 'Authenticité & Certificat de Provenance Place Vendôme',
      description: 'Every garment, flacon, and pair of footwear is cataloged in the Place Vendôme master registry. Each acquisition arrives accompanied by a physical wax-sealed archive dossier, individual limited edition serial stamping (e.g. 15 to 40 pieces worldwide), and a cryptographically verifiable provenance hash.',
      highlight: 'Numbered Editions · Wax-Sealed Dossiers'
    },
    {
      icon: Sparkles,
      badge: '02 · Concierge Stylist',
      title: 'Madame Alice · 24/7 AI Boutique Stylist',
      french: 'Conseil Privé & Stylisme Haute Couture en Temps Réel',
      description: 'Direct interactive communication with our digital concierge trained on historical Place Vendôme atelier archives, seasonal color analysis, fabric drape dynamics, and bespoke measurement translations. Get instant styling advice, size recommendations, and salon appointment confirmations.',
      highlight: 'Real-Time Stylist · Bespoke Sizing'
    },
    {
      icon: Building,
      badge: '03 · Global Salons Privés',
      title: 'Private Fitting Salons Across 4 Capitals',
      french: 'Salons d\'Essayage Privés : Paris, Milan, Londres & New York',
      description: 'Patrons enjoy exclusive reservation rights at our private salons: 14 Place Vendôme (Paris), Palazzo Montenapoleone (Milan), Old Bond Street (London), and Madison Avenue Penthouse (New York). Appointments include bespoke champagne reception, private fitting suite, and master tailor presence.',
      highlight: 'Paris · Milan · London · New York'
    },
    {
      icon: Truck,
      badge: '04 · White-Glove Consignment',
      title: 'Armored & Climate-Controlled Global Transit',
      french: 'Acheminement Sécurisé & Coffre Thermorégulé',
      description: 'Discreet, temperature-controlled transit engineered to preserve noble virgin wool, double-faced cashmere, and delicate mulberry silk. Equipped with active GPS tracking, numbered tamper seals, and personal security hand-delivery directly to your residence or hotel suite.',
      highlight: 'Active GPS · Tamper-Sealed Vaults'
    },
    {
      icon: Crown,
      badge: '05 · Maison Elite Patronage',
      title: 'Cumulative Spend Tiers & Runway Privileges',
      french: 'Programme de Haute Fidélité & Tiers de Patronage',
      description: 'All acquisitions automatically accrue to your client identity in real-time Firestore storage. Advance across prestigious tiers—Client Privé, Salon Vendôme, and Or Impérial—unlocking private defilé runway front-row access, complimentary salon champagne tastings, and personal master cutter allocation.',
      highlight: 'Tier Status · Real-Time Firestore Sync'
    },
    {
      icon: BarChart3,
      badge: '06 · Market Transparency',
      title: 'Global Multi-House Valuation & Price Index',
      french: 'Index Comparatif du Marché du Luxe International',
      description: 'A revolutionary luxury comparator benchmarking Place Vendôme silhouettes against the world’s most prestigious fashion houses: Chanel, Christian Dior, Hermès, Loro Piana, Brunello Cucinelli, and Saint Laurent. Real-time metrics evaluate price-per-gram of cashmere, atelier craft hours, and fabrication origins.',
      highlight: 'Cross-House Valuation · Material Integrity'
    }
  ];

  const websitePages = [
    {
      id: 'women',
      name: 'Univers Femme',
      subtitle: 'Women’s Couture, Gowns & Footwear',
      french: 'Robes du Soir, Manteaux Sablier, Escarpins & Maroquinerie',
      houses: 'Chanel · Christian Dior · Saint Laurent · Celine · Valentino · Schiaparelli',
      image: '/assets/images/chanel_tweed_jacket.jpg',
      badge: 'Exhibition Wing A',
      action: () => onNavigatePage('women')
    },
    {
      id: 'men',
      name: 'Univers Homme',
      subtitle: 'Men’s Bespoke Tailoring & Footwear',
      french: 'Pardessus en Cachemire 520gsm, Derbies Goodyear & Souliers',
      houses: 'Hermès · Loro Piana · Brunello Cucinelli · Saint Laurent · Prada · McQueen',
      image: '/assets/images/ysl_smoking_tuxedo.jpg',
      badge: 'Exhibition Wing B',
      action: () => onNavigatePage('men')
    },
    {
      id: 'parfumerie',
      name: 'Haute Parfumerie',
      subtitle: 'Olfactory Flacons d’Exception',
      french: 'Extraits Purs à 32% · Feuilles d’Or 24k & Marbre Calacatta',
      houses: 'Maison Aurelia Grand Extrait · Christian Dior Rose des Vents',
      image: '/assets/images/calacatta_perfume_still.jpg',
      badge: 'Exhibition Wing C',
      action: () => onNavigatePage('parfumerie')
    },
    {
      id: 'lookbook',
      name: 'Digital Lookbook',
      subtitle: '35mm Runway & Editorial Cinema',
      french: 'Photographie 35mm · Loupe Optique Dior & Scan Panoramique VS',
      houses: 'Official 35mm Archives · Trending & Editorial Choice Highlights',
      image: '/assets/images/couture_salon_gown.jpg',
      badge: 'Exhibition Wing D',
      action: () => onNavigatePage('lookbook')
    },
    {
      id: 'elite',
      name: 'Maison Elite & Client Space',
      subtitle: 'Patronage Program & Purchase Dossiers',
      french: 'Historique des Commandes en Temps Réel, Cartes & Factures Imprimables',
      houses: 'Client Space · Firestore Orders Synchronisation',
      image: '/assets/images/aurelia_velvet_model.jpg',
      badge: 'Exhibition Wing E',
      action: () => onNavigatePage('elite')
    },
    {
      id: 'salons',
      name: 'Global Salons Privés',
      subtitle: 'Private Fitting Appointments',
      french: 'Réservations Privées · Paris, Milan, Londres & New York',
      houses: '14 Place Vendôme · Palazzo Montenapoleone · Old Bond St',
      image: '/assets/images/fashion_atelier_craft_1793507763048.jpg',
      badge: 'Exhibition Wing F',
      action: () => onNavigatePage('salons')
    },
    {
      id: 'soundscape',
      name: 'Salon Musique MMXXVI',
      subtitle: 'Dedicated Acoustic Sanctuary & Turntable',
      french: 'Acoustique Haute-Fidélité, Vinyles & Ambiance Vendôme 432Hz',
      houses: 'Dedicated Music Tab · Uninterrupted Background Listening',
      image: '/assets/images/calacatta_perfume_still.jpg',
      badge: 'Exhibition Wing G',
      action: () => onNavigatePage('soundscape')
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#161513] dark:bg-[#141311] dark:text-[#FAF8F3] transition-colors duration-300">
      
      {/* 1. TOP EXHIBITION BANNER */}
      <div className="bg-[#181715] text-[#FAF9F5] dark:bg-[#0E0D0C] border-b border-[#C5B492]/40 py-3 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="font-mono text-[#D4AF37] uppercase tracking-[0.2em] font-semibold">
              Pavillon d'Exposition MMXXVI
            </span>
            <span aria-hidden="true" className="opacity-40 hidden sm:inline">·</span>
            <span className="text-[#A7A096] hidden sm:inline font-sans-luxury">
              Official Exhibition Showcase for Distinguished Visitors & Patrons
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigatePage('all')}
              className="text-[#D4AF37] hover:underline font-mono text-[11px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Continuous Showcase</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="opacity-30">|</span>
            <button
              onClick={onOpenAuthModal}
              className="px-2.5 py-1 bg-[#8C7853] text-white hover:bg-[#A38D64] text-[10px] uppercase tracking-wider font-mono font-medium transition-colors cursor-pointer"
            >
              VIP Exhibition Pass
            </button>
          </div>
        </div>
      </div>

      {/* 2. GRAND HERO: THE EXHIBITION INTRODUCTION */}
      <section className="relative py-20 lg:py-28 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-[#E8E4DC] dark:border-[#272421]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492]">
              <Crown className="w-4 h-4 text-[#8C7853]" />
              <span>14 Place Vendôme, Paris</span>
              <span aria-hidden="true">·</span>
              <span>Exhibition & Curatorial Manifesto</span>
            </div>

            <div className="pt-2">
              <LuxeLogo size="lg" variant="horizontal" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] leading-[1.08] [text-wrap:balance]">
              The Sovereign World of LUXE LAYOUT.
            </h1>

            <p className="text-base sm:text-lg text-[#605B54] dark:text-[#A7A096] font-light leading-relaxed max-w-2xl">
              Engineered exclusively for tomorrow’s grand exhibition: an immersive digital pavilion uniting the grand Parisian houses of Place Vendôme, Rue Cambon, and Avenue Montaigne under the curatorial vision of LUXE LAYOUT. 
              Discover unparalleled patron privileges, mathematical tailoring precision, and transparent multi-house valuation.
            </p>

            {/* Quick Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigatePage('women')}
                className="px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-sans-luxury font-medium bg-[#181715] text-[#FAF9F5] hover:bg-[#322F2A] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white transition-colors cursor-pointer shadow-lg flex items-center gap-2"
              >
                <span>Explore Univers Femme</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigatePage('men')}
                className="px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-sans-luxury font-medium border border-[#181715] dark:border-white text-[#181715] dark:text-[#FAF8F3] hover:bg-[#181715] hover:text-white dark:hover:bg-white dark:hover:text-[#181715] transition-colors cursor-pointer shadow-sm flex items-center gap-2"
              >
                <span>Explore Univers Homme</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenSalonBooking}
                className="px-6 py-3.5 text-xs uppercase tracking-[0.18em] font-sans-luxury font-medium text-[#8C7853] hover:text-[#181715] dark:hover:text-white border border-[#C5BDAF] dark:border-[#3A3530] transition-colors cursor-pointer"
              >
                Exhibition Fitting Salon
              </button>

              <button
                onClick={() => luxuryAudio.toggle()}
                className="px-6 py-3.5 text-xs uppercase tracking-[0.18em] font-sans-luxury font-medium text-[#8C7853] hover:text-[#181715] dark:hover:text-white border border-[#8C7853]/50 hover:border-[#8C7853] transition-colors cursor-pointer flex items-center gap-2 bg-[#8C7853]/10"
                title="Play or Pause Place Vendôme Luxury Soundscape"
              >
                <Music2 className="w-3.5 h-3.5 text-[#8C7853]" />
                <span>Luxury Soundscape</span>
              </button>
            </div>

            {/* Key Exhibition Metrics */}
            <div className="pt-8 border-t border-[#E8E4DC] dark:border-[#272421] grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl font-serif-luxury font-bold text-[#181715] dark:text-[#FAF8F3]">75+</div>
                <div className="text-[10px] uppercase tracking-wider font-mono text-[#8C7853]">Curated Creations</div>
              </div>
              <div>
                <div className="text-2xl font-serif-luxury font-bold text-[#181715] dark:text-[#FAF8F3]">12</div>
                <div className="text-[10px] uppercase tracking-wider font-mono text-[#8C7853]">Haute Couture Houses</div>
              </div>
              <div>
                <div className="text-2xl font-serif-luxury font-bold text-[#181715] dark:text-[#FAF8F3]">4</div>
                <div className="text-[10px] uppercase tracking-wider font-mono text-[#8C7853]">Global Fitting Salons</div>
              </div>
              <div>
                <div className="text-2xl font-serif-luxury font-bold text-[#181715] dark:text-[#FAF8F3]">100%</div>
                <div className="text-[10px] uppercase tracking-wider font-mono text-[#8C7853]">Archival Provenance</div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Spread */}
          <div className="lg:col-span-5 relative aspect-[3/4] bg-[#F2EDE2] dark:bg-[#1E1B18] overflow-hidden border border-[#DCD5C6] dark:border-[#2E2925] shadow-2xl">
            <img
              src="/assets/images/chanel_tweed_jacket.jpg"
              alt="Maison Aurelia Place Vendôme Exhibition"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 text-xs text-[#FAF9F5] border border-white/20 font-mono uppercase tracking-wider">
              Place Vendôme MMXXVI Salon Archive
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-[0.24em] font-mono text-[#C5B492] font-semibold">
                Curatorial Spotlight
              </span>
              <h3 className="text-xl font-serif-luxury">
                Chanel & Place Vendôme Tweed Architecture
              </h3>
              <p className="text-xs text-white/80 font-light line-clamp-2">
                Lesage hand-woven bouclé with 24k gilded chain weighting and natural horn lion buttons.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECTION: THE 6 ROYAL PRIVILEGES OF MAISON AURELIA */}
      <section className="py-20 lg:py-24 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-[#E8E4DC] dark:border-[#272421]">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E8E4DC] dark:border-[#272421] gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-2 font-medium">
              <Gem className="w-3.5 h-3.5 text-[#8C7853]" />
              <span>Client Privileges & Haute Horlogerie Standards</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
              The Six Sovereign Client Privileges
            </h2>
          </div>

          <p className="text-sm text-[#706B63] dark:text-[#9F998F] max-w-md font-light leading-relaxed">
            Every guest and patron of Maison Aurelia operates with unrestrained access to our finest atelier services, personal styling advisement, and verified authentication.
          </p>
        </div>

        {/* 6 Privileges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
          {privileges.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-8 bg-[#F5F1E8] dark:bg-[#181614] border border-[#E0D9CB] dark:border-[#2C2723] hover:border-[#8C7853] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#8C7853] dark:text-[#C5B492] font-semibold">
                      {item.badge}
                    </span>
                    <div className="w-9 h-9 rounded-sm bg-white dark:bg-[#201D1A] border border-[#DDD6C7] dark:border-[#332E29] flex items-center justify-center text-[#8C7853] group-hover:bg-[#8C7853] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] mb-1">
                    {item.title}
                  </h3>
                  <div className="text-xs text-[#8C7853] dark:text-[#C5B492] italic font-serif-luxury mb-4">
                    {item.french}
                  </div>

                  <p className="text-xs sm:text-sm text-[#605B54] dark:text-[#A7A096] font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E4DECFA0] dark:border-[#27231F] flex items-center justify-between text-[11px] font-mono text-[#8C7853]">
                  <span>{item.highlight}</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. SECTION: ABOUT THE WHOLE WEBSITE & DIFFERENT EXHIBITION PAGES */}
      <section className="py-20 lg:py-24 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-[#E8E4DC] dark:border-[#272421]">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E8E4DC] dark:border-[#272421] gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-2 font-medium">
              <Compass className="w-3.5 h-3.5 text-[#8C7853]" />
              <span>Interactive Exhibition Directory & Pavilion Tour</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
              The Exhibition Wings & Dedicated Pages
            </h2>
          </div>

          <p className="text-sm text-[#706B63] dark:text-[#9F998F] max-w-md font-light leading-relaxed">
            Prepared for exhibition visitors: choose any pavilion below to inspect dedicated garments, bespoke footwear, pure extraits, and 35mm runway film.
          </p>
        </div>

        {/* 6 Exhibition Wings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
          {websitePages.map((wing) => (
            <div
              key={wing.id}
              onClick={wing.action}
              className="group cursor-pointer bg-[#F5F1E8] dark:bg-[#181614] border border-[#E0D9CB] dark:border-[#2C2723] hover:border-[#8C7853] transition-all duration-300 flex flex-col overflow-hidden shadow-sm hover:shadow-xl"
            >
              {/* Image Preview with Badge */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black/10">
                <img
                  src={wing.image}
                  alt={wing.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                <span className="absolute top-3 left-3 px-2.5 py-1 text-[9px] uppercase tracking-wider font-mono bg-black/85 text-[#FAF9F5] border border-white/15">
                  {wing.badge}
                </span>

                <span className="absolute bottom-3 right-3 p-2 bg-white text-black group-hover:bg-[#8C7853] group-hover:text-white transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Text Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] group-hover:text-[#8C7853] transition-colors">
                    {wing.name}
                  </h3>
                  <div className="text-xs uppercase tracking-wider font-mono text-[#8C7853] mt-0.5">
                    {wing.subtitle}
                  </div>
                  <div className="text-xs text-[#706B63] dark:text-[#9F998F] italic font-serif-luxury mt-1 line-clamp-1">
                    {wing.french}
                  </div>

                  <p className="text-xs text-[#605B54] dark:text-[#A7A096] mt-3 font-light">
                    Featured Houses: <strong className="font-medium text-[#181715] dark:text-[#FAF8F3]">{wing.houses}</strong>
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E8E2D5] dark:border-[#2A2622] flex items-center justify-between text-xs font-sans-luxury uppercase tracking-wider text-[#8C7853] font-semibold">
                  <span>Enter Pavilion</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EXHIBITION BOTTOM CALLOUT & VIP ACCESS */}
      <section className="py-16 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="p-8 sm:p-12 bg-[#181715] text-[#FAF9F5] dark:bg-[#1A1816] border border-[#C5B492]/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-xl z-10">
            <span className="text-[10px] uppercase tracking-[0.24em] font-mono text-[#D4AF37] font-semibold">
              Exhibition Visitor Protocol
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury">
              Ready to Inspect the Haute Couture Collections?
            </h3>
            <p className="text-xs sm:text-sm text-[#A7A096] font-light leading-relaxed">
              Explore freely without registration. Customers can inspect all garments, fabric compositions, and market valuations without signing in. Account creation is only required for one-click private salon acquisitions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full md:w-auto">
            <button
              onClick={() => onNavigatePage('women')}
              className="w-full sm:w-auto px-6 py-3 bg-[#FAF9F5] text-[#181715] hover:bg-white text-xs uppercase tracking-widest font-sans-luxury font-medium transition-colors text-center cursor-pointer"
            >
              Begin Exhibition Walkthrough
            </button>
            <button
              onClick={onOpenAuthModal}
              className="w-full sm:w-auto px-6 py-3 border border-[#C5B492] text-[#FAF9F5] hover:bg-white/10 text-xs uppercase tracking-widest font-sans-luxury font-medium transition-colors text-center cursor-pointer"
            >
              VIP Patron Sign-In
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
