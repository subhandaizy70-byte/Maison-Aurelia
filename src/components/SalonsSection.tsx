import React from 'react';
import { SALONS } from '../data/products';
import { MapPin, Clock, Phone, Sparkles } from 'lucide-react';

interface SalonsSectionProps {
  onOpenSalonBooking: () => void;
}

export const SalonsSection: React.FC<SalonsSectionProps> = ({ onOpenSalonBooking }) => {
  return (
    <section id="salons" className="py-24 bg-[#FAF9F5] dark:bg-[#141311] border-t border-[#E8E4DC] dark:border-[#272421]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 border-b border-[#E8E4DC] dark:border-[#272421] gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-2">
              <span>Private Appointments & Fittings</span>
              <span aria-hidden="true">·</span>
              <span>International Salons</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
              The Private Salons
            </h2>
          </div>

          <p className="text-sm text-[#706B63] dark:text-[#9F998F] max-w-md font-light leading-relaxed">
            Four private sanctuaries designed for intimate wardrobe consultation, bespoke measurement mapping, and archive trials.
          </p>
        </div>

        {/* 4 Salons Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SALONS.map((salon) => (
            <div
              key={salon.id}
              className="p-6 bg-[#F6F3EB] dark:bg-[#1A1816] border border-[#E5E0D5] dark:border-[#2A2622] flex flex-col justify-between hover:border-[#8C7853] dark:hover:border-[#8C7853] transition-all group"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] block mb-1">
                  {salon.city}
                </span>

                <h3 className="text-xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] mb-3 group-hover:text-[#8C7853] transition-colors">
                  {salon.name}
                </h3>

                <div className="space-y-2 text-xs text-[#605B54] dark:text-[#A7A096] font-light">
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8C7853] shrink-0 mt-0.5" />
                    <span>{salon.address}</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#8C7853] shrink-0 mt-0.5" />
                    <span>{salon.hours}</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#8C7853] shrink-0 mt-0.5" />
                    <span className="font-mono">{salon.phone}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E3D8] dark:border-[#2B2723] text-[11px] text-[#706B63] dark:text-[#9F998F]">
                  <p className="font-serif-luxury italic text-[#181715] dark:text-[#FAF8F3]">
                    Salon Director: {salon.director}
                  </p>
                  <p className="text-[10px] tracking-wider uppercase opacity-80 pt-0.5">
                    Lead: {salon.leadSpecialist}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8E3D8] dark:border-[#2B2723]">
                <button
                  onClick={onOpenSalonBooking}
                  className="w-full py-2.5 px-4 text-xs uppercase tracking-[0.16em] font-sans-luxury border border-[#C8C2B7] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] hover:bg-[#181715] hover:text-[#FAF9F5] dark:hover:bg-white dark:hover:text-[#181715] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#8C7853]" />
                  <span>Reserve Suite</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
