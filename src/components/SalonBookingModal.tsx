import React, { useState } from 'react';
import { SALONS } from '../data/products';
import { BookingRequest } from '../types/fashion';
import { X, Calendar, Clock, MapPin, CheckCircle2, Sparkles, User, Mail, Phone } from 'lucide-react';

interface SalonBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SalonBookingModal: React.FC<SalonBookingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [salonId, setSalonId] = useState<'paris' | 'milan' | 'london' | 'newyork'>('paris');
  const [service, setService] = useState<'couture' | 'wardrobe' | 'leather'>('wardrobe');
  const [date, setDate] = useState('2026-11-14');
  const [time, setTime] = useState('14:30');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const selectedSalon = SALONS.find((s) => s.id === salonId) || SALONS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `MA-${selectedSalon.city.toUpperCase().slice(0, 3)}-${randomSuffix}`;
    setConfirmationCode(code);
    setIsConfirmed(true);
  };

  const handleReset = () => {
    setIsConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-[#FAF9F5] dark:bg-[#161412] border border-[#E0DBD0] dark:border-[#2C2926] shadow-2xl overflow-hidden my-auto p-6 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 text-[#706B63] dark:text-[#A7A096] hover:text-[#181715] dark:hover:text-[#FAF8F3] transition-colors rounded-full cursor-pointer"
          aria-label="Close salon modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isConfirmed ? (
          /* Confirmation Screen */
          <div className="py-6 text-center space-y-6 animate-fade-in">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#8C7853]/15 text-[#8C7853] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492]">
                Reservation Confirmed
              </span>
              <h3 className="text-3xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] pt-1">
                We Await Your Presence in {selectedSalon.city}.
              </h3>
            </div>

            {/* Confirmation Card */}
            <div className="max-w-md mx-auto p-6 bg-[#F3EFE7] dark:bg-[#1D1B18] border border-[#E2DDCF] dark:border-[#332E29] text-left text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#E0D9CB] dark:border-[#2B2723] pb-2">
                <span className="text-[#787268] uppercase tracking-wider text-[10px]">Reference Code</span>
                <span className="font-mono font-medium text-[#181715] dark:text-[#FAF8F3] tracking-widest">{confirmationCode}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#787268]">Private Salon</span>
                <span className="font-medium text-[#181715] dark:text-[#FAF8F3]">{selectedSalon.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#787268]">Address</span>
                <span className="font-medium text-[#181715] dark:text-[#FAF8F3] text-right">{selectedSalon.address}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#787268]">Date & Time</span>
                <span className="font-mono text-[#181715] dark:text-[#FAF8F3]">{date} at {time}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#787268]">Salon Director</span>
                <span className="font-medium text-[#181715] dark:text-[#FAF8F3]">{selectedSalon.director}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#787268]">Guest</span>
                <span className="font-medium text-[#181715] dark:text-[#FAF8F3]">{fullName}</span>
              </div>
            </div>

            <p className="text-xs text-[#706B63] dark:text-[#9F998F] max-w-sm mx-auto font-light">
              An invitation dossier with private access details has been dispatched to <span className="font-medium text-[#181715] dark:text-[#FAF8F3]">{email}</span>. Champagne and private fitting suite prepared upon arrival.
            </p>

            <button
              onClick={handleReset}
              className="px-8 py-3 text-xs uppercase tracking-[0.2em] bg-[#181715] text-[#FAF9F5] hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white font-sans-luxury cursor-pointer"
            >
              Return to Maison Aurelia
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-1">
                <span>Salon Privé</span>
                <span aria-hidden="true">·</span>
                <span>Private Consultation & Fitting</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
                Arrange a Private Fitting Appointment
              </h2>
              <p className="text-xs text-[#706B63] dark:text-[#9F998F] pt-1">
                Enjoy an uninterrupted, personal appointment in our private chambers with our Master Tailors and archival champagne hospitality.
              </p>
            </div>

            {/* Salon Selection Tabs */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.16em] font-sans-luxury text-[#181715] dark:text-[#FAF8F3] mb-2 font-medium">
                1. Select Maison Salon
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SALONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSalonId(s.id as 'paris' | 'milan' | 'london' | 'newyork')}
                    className={`p-3 text-left border transition-all cursor-pointer ${
                      salonId === s.id
                        ? 'border-[#8C7853] bg-[#F2EDE2] dark:bg-[#1E1C19] shadow-sm'
                        : 'border-[#E0D9CB] dark:border-[#2C2723] hover:bg-[#F8F5EE] dark:hover:bg-[#1C1A18]'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider text-[#8C7853] dark:text-[#C5B492] block">
                      {s.city}
                    </span>
                    <span className="text-xs font-serif-luxury font-medium text-[#181715] dark:text-[#FAF8F3] block truncate">
                      {s.name.split(' ')[0]} {s.name.split(' ')[1]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected Salon Address Card */}
              <div className="mt-2.5 p-3 bg-[#F2EFE8] dark:bg-[#1B1917] border border-[#E0DBD0] dark:border-[#2C2926] text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#605B54] dark:text-[#A7A096]">
                  <MapPin className="w-3.5 h-3.5 text-[#8C7853] shrink-0" />
                  <span>{selectedSalon.address} · {selectedSalon.hours}</span>
                </div>
                <span className="text-[11px] font-mono text-[#8C7853] hidden sm:inline">{selectedSalon.phone}</span>
              </div>
            </div>

            {/* Service Type Selection */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.16em] font-sans-luxury text-[#181715] dark:text-[#FAF8F3] mb-2 font-medium">
                2. Experience & Purpose
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setService('wardrobe')}
                  className={`p-3 text-left border text-xs transition-all cursor-pointer ${
                    service === 'wardrobe'
                      ? 'border-[#8C7853] bg-[#F2EDE2] dark:bg-[#1E1C19]'
                      : 'border-[#E0D9CB] dark:border-[#2C2723] hover:bg-[#F8F5EE] dark:hover:bg-[#1C1A18]'
                  }`}
                >
                  <p className="font-serif-luxury text-sm text-[#181715] dark:text-[#FAF8F3]">Prêt-à-Porter Fitting</p>
                  <p className="text-[10px] text-[#706B63] dark:text-[#9F998F] pt-0.5">Trial current seasonal coats, knitwear, and silk slips.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setService('couture')}
                  className={`p-3 text-left border text-xs transition-all cursor-pointer ${
                    service === 'couture'
                      ? 'border-[#8C7853] bg-[#F2EDE2] dark:bg-[#1E1C19]'
                      : 'border-[#E0D9CB] dark:border-[#2C2723] hover:bg-[#F8F5EE] dark:hover:bg-[#1C1A18]'
                  }`}
                >
                  <p className="font-serif-luxury text-sm text-[#181715] dark:text-[#FAF8F3]">Haute Couture Bespoke</p>
                  <p className="text-[10px] text-[#706B63] dark:text-[#9F998F] pt-0.5">Private pattern drafting and bespoke silhouette creation.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setService('leather')}
                  className={`p-3 text-left border text-xs transition-all cursor-pointer ${
                    service === 'leather'
                      ? 'border-[#8C7853] bg-[#F2EDE2] dark:bg-[#1E1C19]'
                      : 'border-[#E0D9CB] dark:border-[#2C2723] hover:bg-[#F8F5EE] dark:hover:bg-[#1C1A18]'
                  }`}
                >
                  <p className="font-serif-luxury text-sm text-[#181715] dark:text-[#FAF8F3]">Maroquinerie & Objects</p>
                  <p className="text-[10px] text-[#706B63] dark:text-[#9F998F] pt-0.5">Custom leather patina selection and 24k monogramming.</p>
                </button>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] font-sans-luxury text-[#181715] dark:text-[#FAF8F3] mb-1 font-medium">
                  3. Preferred Date
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#878177]" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] font-sans-luxury text-[#181715] dark:text-[#FAF8F3] mb-1 font-medium">
                  Time Slot
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#878177]" />
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    aria-label="Appointment time slot"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853] cursor-pointer"
                  >
                    <option value="11:00" className="bg-[#FAF9F5] dark:bg-[#141311]">11:00 AM (Morning Salon)</option>
                    <option value="13:00" className="bg-[#FAF9F5] dark:bg-[#141311]">01:00 PM (Midday)</option>
                    <option value="14:30" className="bg-[#FAF9F5] dark:bg-[#141311]">02:30 PM (Afternoon Tea)</option>
                    <option value="16:30" className="bg-[#FAF9F5] dark:bg-[#141311]">04:30 PM (Nocturne Prelude)</option>
                    <option value="18:00" className="bg-[#FAF9F5] dark:bg-[#141311]">06:00 PM (Twilight Fitting)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#706B63] dark:text-[#9F998F] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Madame / Monsieur"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#706B63] dark:text-[#9F998F] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#706B63] dark:text-[#9F998F] mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+33 6 00 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                />
              </div>
            </div>

            {/* Private Notes */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#706B63] dark:text-[#9F998F] mb-1">
                Specific Pieces or Sizing Requirements
              </label>
              <textarea
                rows={2}
                placeholder="E.g. Desiring to inspect the Cashmere Hourglass Coat in FR 36 and discuss made-to-measure trousers."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 text-xs uppercase tracking-wider font-sans-luxury text-[#706B63] hover:text-[#181715] dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-7 py-3 text-xs uppercase tracking-[0.2em] font-sans-luxury font-medium bg-[#181715] text-[#FAF9F5] hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white transition-colors cursor-pointer"
              >
                Confirm Salon Reservation
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
