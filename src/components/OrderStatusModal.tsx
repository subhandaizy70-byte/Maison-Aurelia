import React, { useState } from 'react';
import { SAMPLE_SHIPMENTS } from '../data/shipmentsAndComparisons';
import { ShipmentRecord } from '../types/fashion';
import { X, Search, ShieldCheck, Truck, MapPin, Package, Clock, CheckCircle2, AlertCircle, FileText, Lock, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMarketComparator?: () => void;
  prefillOrderId?: string;
}

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  isOpen,
  onClose,
  onOpenMarketComparator,
  prefillOrderId = '',
}) => {
  if (!isOpen) return null;

  const [orderInput, setOrderInput] = useState(prefillOrderId || 'MA-CMD-849201');
  const [emailInput, setEmailInput] = useState('subhandaizy70@gmail.com');
  const [activeShipment, setActiveShipment] = useState<ShipmentRecord | null>(() => {
    return SAMPLE_SHIPMENTS[prefillOrderId] || SAMPLE_SHIPMENTS['MA-CMD-849201'] || null;
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWaybillPrint, setShowWaybillPrint] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const cleanOrder = orderInput.trim().toUpperCase();
    const cleanEmail = emailInput.trim().toLowerCase();

    setTimeout(() => {
      setIsLoading(false);

      // Check if matches known mock order
      if (SAMPLE_SHIPMENTS[cleanOrder]) {
        setActiveShipment(SAMPLE_SHIPMENTS[cleanOrder]);
        return;
      }

      // If user provided a session order ID (e.g. from checkout MA-CMD-XXXXXX)
      if (cleanOrder.startsWith('MA-CMD-') && cleanEmail) {
        const syntheticShipment: ShipmentRecord = {
          orderId: cleanOrder,
          customerEmail: cleanEmail,
          recipientName: 'Honored Client',
          destination: 'Private Consignment Residence',
          carrier: 'Ferrari Security Express · White-Glove Armored Division',
          waybillNumber: `FER-${Math.floor(100000 + Math.random() * 900000)}-EU`,
          tamperSealId: `WAX-SEAL-${Math.floor(1000 + Math.random() * 9000)}-VENDOME`,
          insuranceValuation: 'Full Replacement Archival Cover (Lloyd’s of London)',
          status: 'atelier_prep',
          statusLabel: 'Atelier Pattern & Finishing Inspection in Place Vendôme',
          estimatedDelivery: '3 to 5 Business Days via Armored Escort',
          temperatureControlled: true,
          vaultLocation: 'Salon Vault 02 · 14 Place Vendôme, Paris',
          items: [
            {
              productName: 'The Structured Sculptural Coat',
              size: 'FR 36 (US 4)',
              price: 3850,
              image: '/src/assets/images/hero_luxury_fashion_model_1793507760974.jpg',
              monogram: 'A.V.',
              serialNumber: `MA-MMXXVI-${cleanOrder.slice(-4)}`
            }
          ],
          checkpoints: [
            {
              status: 'Order Authenticated & Registered in House Archive',
              location: '14 Place Vendôme Atelier, Paris',
              timestamp: 'Just now',
              completed: true,
              description: 'Consignment docket generated and allocated to master cutter bench.'
            },
            {
              status: 'Aromatic Cedar Steaming & Wax Sealing',
              location: 'Maison Aurelia Vault, Paris',
              timestamp: 'Scheduled Today',
              completed: false,
              description: 'Archival silk lining preparation and 24k gold leaf hot wax sealing.'
            },
            {
              status: 'Handover to Armored Chauffeur Courier',
              location: 'Paris Logistics Hub',
              timestamp: 'Scheduled Tomorrow',
              completed: false,
              description: 'Direct departure under dual biometric custody.'
            }
          ]
        };
        setActiveShipment(syntheticShipment);
        return;
      }

      setErrorMsg('No active consignment found for this Order Reference and Email. Please verify your reference (e.g. MA-CMD-849201).');
    }, 450);
  };

  const handleLoadDemo = (orderId: string, email: string) => {
    setOrderInput(orderId);
    setEmailInput(email);
    setErrorMsg(null);
    if (SAMPLE_SHIPMENTS[orderId]) {
      setActiveShipment(SAMPLE_SHIPMENTS[orderId]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      
      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl bg-[#FAF9F5] dark:bg-[#151311] border border-[#E0DBD0] dark:border-[#2C2926] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E8E4DC] dark:border-[#272421] flex items-center justify-between bg-[#F5F2EA] dark:bg-[#1A1816]">
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-[#8C7853]" />
            <div>
              <span className="text-[10px] uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] block">
                Maison Aurelia · Haute Logistique
              </span>
              <h3 className="text-xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] leading-none">
                Consignment & Order Status Dossier
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#706B63] hover:text-[#181715] dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close status modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Lookup Input Form */}
          <div className="p-5 bg-[#F2EDE2] dark:bg-[#1D1B18] border border-[#E0D9CB] dark:border-[#2F2B27]">
            <form onSubmit={handleLookup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                
                <div className="sm:col-span-5">
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-luxury text-[#706B63] dark:text-[#A7A096] mb-1 font-medium">
                    Order Reference / Docket #
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. MA-CMD-849201"
                    value={orderInput}
                    onChange={(e) => setOrderInput(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-transparent font-mono tracking-wider uppercase border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-luxury text-[#706B63] dark:text-[#A7A096] mb-1 font-medium">
                    Client Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@domain.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-[#D5CFC5] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] focus:outline-none focus:border-[#8C7853]"
                  />
                </div>

                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-3 bg-[#181715] text-[#FAF9F5] hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white text-[11px] uppercase tracking-[0.18em] font-sans-luxury font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Search className="w-3 h-3" />
                    <span>{isLoading ? 'Searching...' : 'Locate'}</span>
                  </button>
                </div>

              </div>

              {/* Instant Sample Fill Shortcuts */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#706B63] dark:text-[#9F998F]">
                <span className="uppercase tracking-wider text-[10px]">Instant Demo Dockets:</span>
                <button
                  type="button"
                  onClick={() => handleLoadDemo('MA-CMD-849201', 'subhandaizy70@gmail.com')}
                  className="px-2 py-0.5 border border-[#D5CFC5] dark:border-[#38332E] hover:border-[#181715] dark:hover:border-white transition-colors cursor-pointer text-[#181715] dark:text-[#FAF8F3]"
                >
                  Paris Chauffeur Delivery (MA-CMD-849201)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadDemo('MA-CMD-740192', 'vip.client@aurelia.paris')}
                  className="px-2 py-0.5 border border-[#D5CFC5] dark:border-[#38332E] hover:border-[#181715] dark:hover:border-white transition-colors cursor-pointer text-[#181715] dark:text-[#FAF8F3]"
                >
                  Tokyo Transcontinental Air Vault (MA-CMD-740192)
                </button>
              </div>

            </form>

            {errorMsg && (
              <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Active Shipment Results */}
          {activeShipment && (
            <div className="space-y-6">
              
              {/* Primary Status Banner */}
              <div className="p-5 bg-[#FAF9F5] dark:bg-[#181614] border border-[#E2DDD3] dark:border-[#2C2926] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-1">
                    <span>Carrier: {activeShipment.carrier.split('·')[0]}</span>
                    <span aria-hidden="true">·</span>
                    <span>Waybill: {activeShipment.waybillNumber}</span>
                  </div>
                  <h4 className="text-xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
                    {activeShipment.statusLabel}
                  </h4>
                  <p className="text-xs text-[#706B63] dark:text-[#9F998F] pt-0.5">
                    Estimated Hand Delivery: <span className="font-medium text-[#181715] dark:text-[#FAF8F3]">{activeShipment.estimatedDelivery}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowWaybillPrint(!showWaybillPrint)}
                    className="px-3.5 py-2 border border-[#C8C2B7] dark:border-[#38332E] hover:border-[#181715] dark:hover:border-white text-[11px] uppercase tracking-wider font-sans-luxury text-[#181715] dark:text-[#FAF8F3] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{showWaybillPrint ? 'Hide Waybill' : 'Archival Waybill Slip'}</span>
                  </button>

                  {onOpenMarketComparator && (
                    <button
                      onClick={onOpenMarketComparator}
                      className="px-3.5 py-2 bg-[#8C7853] text-white hover:bg-[#786644] text-[11px] uppercase tracking-wider font-sans-luxury transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Compare Market Prices</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Printable Archival Waybill Drawer/Card */}
              {showWaybillPrint && (
                <div className="p-6 bg-white dark:bg-black/60 border border-[#D5CFC5] dark:border-[#332F2B] font-mono text-[11px] space-y-4 animate-fade-in text-[#2C2926] dark:text-[#E0DBD0]">
                  <div className="flex justify-between border-b border-black/10 dark:border-white/10 pb-3">
                    <div>
                      <span className="font-serif-luxury text-base uppercase tracking-widest block font-bold">
                        MAISON AURELIA · PLACE VENDÔME
                      </span>
                      <span className="text-[10px] opacity-70">Bespoke Consignment Transport Waybill & Provenance Register</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold">DOCKET: {activeShipment.orderId}</span>
                      <span className="text-[10px] opacity-70">DATE: 2026-10-31</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] uppercase opacity-60 block">Shipper / Atelier:</span>
                      <p>Maison Aurelia Haute Couture<br />14 Place Vendôme<br />75001 Paris, France</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase opacity-60 block">Consignee / Recipient:</span>
                      <p>{activeShipment.recipientName}<br />{activeShipment.destination}</p>
                    </div>
                  </div>

                  <div className="border-t border-b border-black/10 dark:border-white/10 py-2 grid grid-cols-3 gap-2 text-[10px]">
                    <div>
                      <span className="opacity-60 block">TAMPER PROOF SEAL:</span>
                      <span className="font-bold">{activeShipment.tamperSealId}</span>
                    </div>
                    <div>
                      <span className="opacity-60 block">INSURANCE UNDERWRITE:</span>
                      <span className="font-bold">{activeShipment.insuranceValuation}</span>
                    </div>
                    <div>
                      <span className="opacity-60 block">TEMPERATURE REGIME:</span>
                      <span className="font-bold">18°C Controlled Vault Box</span>
                    </div>
                  </div>

                  <div className="text-[10px] opacity-70 text-center pt-1">
                    Certified for diplomatic luxury transport. Sealed with Place Vendôme heraldic signet.
                  </div>
                </div>
              )}

              {/* Milestone Tracking Stepper */}
              <div className="p-5 bg-[#FAF9F5] dark:bg-[#181614] border border-[#E2DDD3] dark:border-[#2C2926]">
                <h5 className="text-[11px] uppercase tracking-[0.2em] font-sans-luxury text-[#181715] dark:text-[#FAF8F3] font-semibold mb-4">
                  Consignment Milestones & Chain of Custody
                </h5>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#D5CFC5] dark:before:bg-[#38332E]">
                  {activeShipment.checkpoints.map((cp, idx) => (
                    <div key={idx} className="relative">
                      {/* Checkpoint Dot */}
                      <span
                        className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                          cp.completed
                            ? 'bg-[#8C7853] text-white ring-4 ring-[#FAF9F5] dark:ring-[#181614]'
                            : 'border-2 border-[#D5CFC5] dark:border-[#38332E] bg-white dark:bg-black text-transparent'
                        }`}
                      >
                        {cp.completed && '✓'}
                      </span>

                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <span className={`font-medium ${cp.completed ? 'text-[#181715] dark:text-[#FAF8F3]' : 'text-[#878177]'}`}>
                          {cp.status}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-[#706B63] dark:text-[#A7A096]">
                          <span>{cp.location}</span>
                          <span aria-hidden="true">·</span>
                          <span>{cp.timestamp}</span>
                        </div>
                      </div>

                      <p className="text-[#605B54] dark:text-[#9F998F] pt-1 text-[11.5px] leading-relaxed">
                        {cp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security & Vault Spec Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-[#F6F3EB] dark:bg-[#1B1917] border border-[#E5E0D5] dark:border-[#2C2824]">
                  <div className="flex items-center gap-1.5 text-[#8C7853] dark:text-[#C5B492] text-[10px] uppercase tracking-wider mb-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Wax Tamper Seal</span>
                  </div>
                  <p className="font-mono text-xs text-[#181715] dark:text-[#FAF8F3] font-medium">{activeShipment.tamperSealId}</p>
                  <p className="text-[10px] text-[#706B63] dark:text-[#9F998F] pt-0.5">Gold leaf heraldic wax intact.</p>
                </div>

                <div className="p-3.5 bg-[#F6F3EB] dark:bg-[#1B1917] border border-[#E5E0D5] dark:border-[#2C2824]">
                  <div className="flex items-center gap-1.5 text-[#8C7853] dark:text-[#C5B492] text-[10px] uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Transit Insurance</span>
                  </div>
                  <p className="text-xs text-[#181715] dark:text-[#FAF8F3] font-medium leading-tight">{activeShipment.insuranceValuation}</p>
                  <p className="text-[10px] text-[#706B63] dark:text-[#9F998F] pt-0.5">Lloyd’s underwritten.</p>
                </div>

                <div className="p-3.5 bg-[#F6F3EB] dark:bg-[#1B1917] border border-[#E5E0D5] dark:border-[#2C2824]">
                  <div className="flex items-center gap-1.5 text-[#8C7853] dark:text-[#C5B492] text-[10px] uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Current Custody Hub</span>
                  </div>
                  <p className="text-xs text-[#181715] dark:text-[#FAF8F3] font-medium leading-tight">{activeShipment.vaultLocation}</p>
                  <p className="text-[10px] text-[#706B63] dark:text-[#9F998F] pt-0.5">Biometric escort active.</p>
                </div>
              </div>

              {/* Items Contained in This Consignment */}
              <div className="p-5 bg-[#FAF9F5] dark:bg-[#181614] border border-[#E2DDD3] dark:border-[#2C2926]">
                <h5 className="text-[11px] uppercase tracking-[0.2em] font-sans-luxury text-[#181715] dark:text-[#FAF8F3] font-semibold mb-3">
                  Silhouettes Enclosed ({activeShipment.items.length})
                </h5>

                <div className="space-y-3 divide-y divide-[#EDE9E1] dark:divide-[#272421]">
                  {activeShipment.items.map((item, idx) => (
                    <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.productName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-14 object-cover object-top border border-[#D5CFC5] dark:border-[#38332E]"
                        />
                        <div>
                          <h6 className="font-serif-luxury text-sm text-[#181715] dark:text-[#FAF8F3] font-medium">
                            {item.productName}
                          </h6>
                          <div className="text-[11px] text-[#706B63] dark:text-[#9F998F] flex items-center gap-2">
                            <span>Size: {item.size}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">Serial: {item.serialNumber}</span>
                            {item.monogram && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-[#8C7853]">Monogram: {item.monogram}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="font-mono tabular-nums text-xs font-medium text-[#181715] dark:text-[#FAF8F3]">
                        €{item.price.toLocaleString()} EUR
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-[#E8E4DC] dark:border-[#272421] bg-[#F5F2EA] dark:bg-[#1A1816] flex items-center justify-between text-xs text-[#706B63] dark:text-[#A7A096]">
          <span>Place Vendôme Client Concierge: concierge@aurelia.paris · +33 1 42 68 00 14</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#181715] text-[#FAF9F5] dark:bg-white dark:text-[#181715] text-[11px] uppercase tracking-wider font-sans-luxury cursor-pointer"
          >
            Close Dossier
          </button>
        </div>

      </div>

    </div>
  );
};
