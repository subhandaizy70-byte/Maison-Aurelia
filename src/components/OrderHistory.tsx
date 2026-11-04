import React, { useState, useEffect } from 'react';
import { useAuth, ClientPaymentOrder } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  getDocs,
  orderBy 
} from 'firebase/firestore';
import { 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Copy, 
  Check, 
  Search, 
  RefreshCw, 
  Printer, 
  ShieldCheck, 
  Sparkles, 
  X, 
  ExternalLink, 
  ShoppingBag,
  Award,
  Crown,
  ChevronRight,
  Filter
} from 'lucide-react';

interface OrderHistoryProps {
  onTrackOrder?: (orderId: string) => void;
  onConsultStylist?: (orderId: string, itemSummary: string) => void;
  onBrowseCollections?: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  onTrackOrder,
  onConsultStylist,
  onBrowseCollections,
}) => {
  const { user, profile, orders: contextOrders } = useAuth();
  const [orders, setOrders] = useState<ClientPaymentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Settled / Confirmed' | 'Processing'>('all');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [selectedDossierOrder, setSelectedDossierOrder] = useState<ClientPaymentOrder | null>(null);

  // Fetch orders from Firestore with real-time updates and fallback to context
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // If virtual or guest session, populate immediately from context/localStorage
    if (user.uid.startsWith('vip-') || user.uid.startsWith('full-access-') || user.uid.startsWith('google-vip-')) {
      if (contextOrders && contextOrders.length > 0) {
        setOrders(contextOrders);
        setIsLoading(false);
        return;
      }
      const saved = localStorage.getItem('maison_vip_guest_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed?.orders) {
            setOrders(parsed.orders);
            setIsLoading(false);
            return;
          }
        } catch (_e) {}
      }
    }

    // Real Firestore query for user's past purchases
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', user.uid));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedOrders: ClientPaymentOrder[] = [];
          snapshot.forEach((docSnap) => {
            fetchedOrders.push({
              id: docSnap.id,
              ...(docSnap.data() as ClientPaymentOrder),
            });
          });

          // Sort newest first
          fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          if (fetchedOrders.length > 0) {
            setOrders(fetchedOrders);
          } else if (contextOrders && contextOrders.length > 0) {
            setOrders(contextOrders);
          } else {
            setOrders([]);
          }
          setIsLoading(false);
        },
        (error) => {
          console.warn('Firestore orders subscription notice:', error);
          // Fall back gracefully to context orders
          if (contextOrders && contextOrders.length > 0) {
            setOrders(contextOrders);
          }
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn('Error establishing Firestore orders listener:', e);
      if (contextOrders) setOrders(contextOrders);
      setIsLoading(false);
    }
  }, [user, contextOrders]);

  // Manual Refresh Handler
  const handleRefresh = async () => {
    if (!user) return;
    setIsRefreshing(true);
    try {
      if (!user.uid.startsWith('vip-') && !user.uid.startsWith('full-access-') && !user.uid.startsWith('google-vip-')) {
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const list: ClientPaymentOrder[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as ClientPaymentOrder) }));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(list.length > 0 ? list : contextOrders);
      } else {
        if (contextOrders) setOrders(contextOrders);
      }
    } catch (e) {
      console.warn('Refresh notice:', e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Copy Order Reference
  const handleCopyId = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === 'all' || ord.paymentStatus.toLowerCase().includes(statusFilter.toLowerCase());
    const queryLower = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !queryLower || 
      ord.orderId.toLowerCase().includes(queryLower) ||
      ord.items.toLowerCase().includes(queryLower) ||
      (ord.paymentReference && ord.paymentReference.toLowerCase().includes(queryLower)) ||
      (ord.paymentMethod && ord.paymentMethod.toLowerCase().includes(queryLower));
    return matchesStatus && matchesSearch;
  });

  // Calculate Cumulative Metrics
  const totalSpend = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalItemsCount = orders.reduce((sum, o) => sum + (o.itemCount || 1), 0);

  return (
    <div className="space-y-6">
      
      {/* ========================================================= */}
      {/* EXECUTIVE ACQUISITION METRICS BANNER                      */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white dark:bg-[#1A1816] border border-[#E0D9CB] dark:border-[#2C2824] shadow-sm">
          <div className="flex items-center justify-between text-[#8C7853] dark:text-[#C5B492] mb-1">
            <span className="text-[10px] uppercase font-sans-luxury tracking-[0.2em] font-medium">Total Settled Spend</span>
            <Crown className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-mono font-bold text-[#181715] dark:text-[#FAF8F3]">
            €{totalSpend.toLocaleString()} EUR
          </div>
          <div className="text-[10px] text-[#787268] dark:text-[#9F998F] font-mono mt-0.5">
            Dior Vault Encrypted Tokenization
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1A1816] border border-[#E0D9CB] dark:border-[#2C2824] shadow-sm">
          <div className="flex items-center justify-between text-[#8C7853] dark:text-[#C5B492] mb-1">
            <span className="text-[10px] uppercase font-sans-luxury tracking-[0.2em] font-medium">Acquisitions</span>
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-mono font-bold text-[#181715] dark:text-[#FAF8F3]">
            {orders.length} Order{orders.length !== 1 ? 's' : ''} ({totalItemsCount} Piece{totalItemsCount !== 1 ? 's' : ''})
          </div>
          <div className="text-[10px] text-[#787268] dark:text-[#9F998F] font-mono mt-0.5">
            100% Provenance Certified
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1A1816] border border-[#E0D9CB] dark:border-[#2C2824] shadow-sm">
          <div className="flex items-center justify-between text-[#8C7853] dark:text-[#C5B492] mb-1">
            <span className="text-[10px] uppercase font-sans-luxury tracking-[0.2em] font-medium">Atelier Registry</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-sm font-serif-luxury font-bold text-[#181715] dark:text-[#FAF8F3] truncate">
            {profile?.clientNumber || 'AU-VENDOME-4402'}
          </div>
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-sans-luxury mt-0.5">
            Place Vendôme Archive Verified
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SEARCH, STATUS FILTER & REFRESH CONTROLS                  */}
      {/* ========================================================= */}
      <div className="p-3 bg-[#F4EFE6] dark:bg-[#181614] border border-[#DFD9CD] dark:border-[#2C2824] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#8C7853] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, garment, or payment reference..."
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#1F1D1A] border border-[#CEC7B9] dark:border-[#38332E] text-xs font-sans-luxury placeholder-[#9E988D] text-[#181715] dark:text-[#FAF8F3] focus:border-[#8C7853] outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#787268] hover:text-black dark:hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Pills & Refresh */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-white dark:bg-[#1F1D1A] p-0.5 border border-[#CEC7B9] dark:border-[#38332E]">
            {(['all', 'Settled / Confirmed', 'Processing'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-2 py-1 text-[10px] uppercase font-sans-luxury tracking-wider transition-colors cursor-pointer ${
                  statusFilter === filter
                    ? 'bg-[#181715] text-white dark:bg-[#FAF8F3] dark:text-[#181715] font-semibold'
                    : 'text-[#706B63] dark:text-[#A7A096] hover:text-[#181715] dark:hover:text-white'
                }`}
              >
                {filter === 'all' ? 'All' : filter.split(' / ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh order history from Firestore"
            className="p-1.5 border border-[#CEC7B9] dark:border-[#38332E] bg-white dark:bg-[#1F1D1A] text-[#8C7853] hover:text-[#181715] dark:hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ORDER CARDS LIST                                          */}
      {/* ========================================================= */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 mx-auto border-2 border-[#8C7853] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-[0.2em] font-sans-luxury text-[#8C7853]">
            Accessing Place Vendôme Archive Records...
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#1A1816] border border-dashed border-[#DFD9CD] dark:border-[#2F2B26] space-y-3">
          <ShoppingBag className="w-9 h-9 mx-auto text-[#8C7853]/60 stroke-1" />
          <h5 className="font-serif-luxury text-base text-[#181715] dark:text-[#FAF8F3]">
            {searchQuery ? 'No matching acquisitions found.' : 'No purchases registered on this dossier yet.'}
          </h5>
          <p className="text-xs text-[#706B63] dark:text-[#9F998F] max-w-sm mx-auto leading-relaxed">
            {searchQuery 
              ? 'Try modifying your search keywords or clear filters.'
              : 'Acquisitions made online or at 14 Place Vendôme will appear here with complete provenance certificates.'}
          </p>
          {onBrowseCollections && !searchQuery && (
            <button
              onClick={onBrowseCollections}
              className="mt-2 px-5 py-2 bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] text-xs uppercase tracking-[0.18em] font-sans-luxury hover:opacity-90 transition-opacity cursor-pointer"
            >
              Browse Collections
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((ord) => (
            <div 
              key={ord.id || ord.orderId}
              className="p-4 bg-white dark:bg-[#1A1816] border border-[#DFD9CD] dark:border-[#2F2B26] hover:border-[#8C7853] transition-all shadow-sm"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-[#EAE4D7] dark:border-[#27231F] gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-[#8C7853] dark:text-[#C5B492]">
                    <span>{ord.orderId}</span>
                    <button
                      onClick={(e) => handleCopyId(ord.orderId, e)}
                      title="Copy Order ID"
                      className="p-0.5 text-[#787268] hover:text-[#181715] dark:hover:text-white transition-colors"
                    >
                      {copiedOrderId === ord.orderId ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <span aria-hidden="true" className="text-[#C5B492] opacity-40">·</span>

                  <span className="text-[11px] text-[#787268] dark:text-[#9F998F] font-mono">
                    {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>

                  <span aria-hidden="true" className="text-[#C5B492] opacity-40 hidden sm:inline">·</span>

                  <span className="text-[10px] uppercase font-sans-luxury tracking-wider text-[#8C7853] hidden sm:inline">
                    Place Vendôme Registry
                  </span>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-mono font-semibold bg-emerald-900/15 text-emerald-700 dark:text-emerald-400 border border-emerald-700/30 flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{ord.paymentStatus}</span>
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="mb-3">
                <div className="text-sm font-serif-luxury text-[#181715] dark:text-[#FAF8F3] font-medium leading-snug">
                  {ord.items}
                </div>
                {ord.shippingAddress && (
                  <div className="text-[11px] text-[#706B63] dark:text-[#9F998F] flex items-center gap-1 mt-1 font-sans-luxury">
                    <span className="text-[#8C7853]">Dispatch to:</span>
                    <span className="truncate">{ord.shippingAddress}</span>
                  </div>
                )}
              </div>

              {/* Payment Details & Total */}
              <div className="p-3 bg-[#FAF8F3] dark:bg-[#151412] border border-[#EBE4D8] dark:border-[#2A2622] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#181715] dark:text-[#FAF8F3]">
                    <CreditCard className="w-3.5 h-3.5 text-[#8C7853]" />
                    <span>{ord.paymentMethod}</span>
                    <span className="text-[#8C7853]">(•••• {ord.cardLast4 || '1947'})</span>
                  </div>
                  {ord.paymentReference && (
                    <div className="text-[10px] font-mono text-[#787268] dark:text-[#9F998F]">
                      Auth Ref: {ord.paymentReference}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#787268] dark:text-[#9F998F] block font-sans-luxury">
                    Settled Amount
                  </span>
                  <span className="text-base font-mono font-bold text-[#181715] dark:text-[#FAF8F3]">
                    €{ord.totalAmount.toLocaleString()} {ord.currency || 'EUR'}
                  </span>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="mt-3 pt-3 border-t border-[#EAE4D7] dark:border-[#27231F] flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {/* Provenance Dossier Button */}
                  <button
                    onClick={() => setSelectedDossierOrder(ord)}
                    className="px-2.5 py-1.5 border border-[#8C7853] hover:bg-[#8C7853]/10 text-[#8C7853] dark:text-[#C5B492] text-[10px] uppercase tracking-wider font-sans-luxury font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Provenance Dossier & Invoice</span>
                  </button>

                  {/* Stylist Advice on Piece */}
                  {onConsultStylist && (
                    <button
                      onClick={() => onConsultStylist(ord.orderId, ord.items)}
                      className="px-2.5 py-1.5 border border-[#D5CFC5] dark:border-[#38332E] hover:border-[#8C7853] text-[#706B63] dark:text-[#A7A096] hover:text-[#181715] dark:hover:text-[#FAF8F3] text-[10px] uppercase tracking-wider font-sans-luxury flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-[#8C7853]" />
                      <span>Stylist Consult</span>
                    </button>
                  )}
                </div>

                {/* Live Track Consignment Button */}
                {onTrackOrder && (
                  <button
                    onClick={() => onTrackOrder(ord.orderId)}
                    className="px-3 py-1.5 bg-[#181715] text-white hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white text-[10px] uppercase tracking-wider font-sans-luxury font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Truck className="w-3 h-3" />
                    <span>Track Consignment</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* OFFICIAL PLACE VENDÔME PROVENANCE DOSSIER & INVOICE MODAL  */}
      {/* ========================================================= */}
      {selectedDossierOrder && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setSelectedDossierOrder(null)}
        >
          <div 
            className="w-full max-w-2xl bg-[#FAF9F5] text-[#181715] border border-[#C5B492] shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedDossierOrder(null)}
              className="absolute top-4 right-4 p-1.5 text-[#787268] hover:text-black transition-colors cursor-pointer"
              aria-label="Close dossier"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dossier Letterhead */}
            <div className="text-center pb-6 border-b border-[#D8D1C4] space-y-1">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img 
                  src="/assets/images/maison_aurelia_short_logo.jpg" 
                  alt="Maison Aurelia" 
                  className="w-8 h-8 rounded-full border border-[#C5B492] object-cover" 
                />
                <span className="text-xs uppercase font-serif-luxury tracking-[0.26em] text-[#8C7853]">
                  Maison Aurelia · Paris
                </span>
              </div>
              <h3 className="text-xl font-serif-luxury tracking-wide uppercase">
                Certificat d'Authenticité & Dossier de Facturation
              </h3>
              <p className="text-[10px] font-mono tracking-widest text-[#787268] uppercase">
                14 Place Vendôme · 75001 Paris · France · RCS Paris 440 281 902
              </p>
            </div>

            {/* Serialized Provenance Seal */}
            <div className="my-5 p-3.5 bg-[#F2EDE2] border border-[#D5CFC5] flex items-center justify-between flex-wrap gap-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-sans-luxury tracking-wider text-[#8C7853] block">
                  Couture Serial Number & Provenance Reference
                </span>
                <span className="font-mono font-bold text-sm text-[#181715]">
                  REG-{selectedDossierOrder.orderId}-PVMMXXVI
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#C5B492] text-[#8C7853] text-[10px] font-mono uppercase font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Wax-Sealed Archive Certified</span>
              </div>
            </div>

            {/* Patron & Destination Dossier Details */}
            <div className="grid grid-cols-2 gap-4 text-xs py-3 border-b border-[#E6E1D8]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#787268] block font-sans-luxury">
                  Client Acquirer:
                </span>
                <span className="font-serif-luxury font-semibold text-sm">
                  {selectedDossierOrder.customerName || profile?.displayName || 'Distinguished Patron'}
                </span>
                <p className="font-mono text-[11px] text-[#787268]">{selectedDossierOrder.customerEmail}</p>
                <p className="text-[10px] font-sans-luxury text-[#8C7853] mt-0.5">
                  Client ID: {profile?.clientNumber || 'AU-4402'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#787268] block font-sans-luxury">
                  Settlement Date & Protocol:
                </span>
                <span className="font-mono">
                  {new Date(selectedDossierOrder.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
                <p className="text-[11px] text-[#787268] font-sans-luxury">
                  Payment: {selectedDossierOrder.paymentMethod}
                </p>
                <p className="text-[10px] font-mono text-[#8C7853]">
                  Auth Code: {selectedDossierOrder.paymentReference}
                </p>
              </div>
            </div>

            {/* Itemized Garment List */}
            <div className="py-4 border-b border-[#E6E1D8] space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-[#787268] block font-sans-luxury">
                Acquired Silhouettes & Craftsmanship Specifications
              </span>
              <div className="p-3 bg-white border border-[#DFD9CD] flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-serif-luxury text-sm font-semibold text-[#181715]">
                    {selectedDossierOrder.items}
                  </div>
                  <div className="text-[11px] text-[#787268]">
                    Origin: Place Vendôme Paris Atelier · Acid-Free Silk Wrap & Archival Cedar Packaging
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-sm">
                  €{selectedDossierOrder.totalAmount.toLocaleString()} EUR
                </div>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="py-4 space-y-1.5 text-xs text-[#706B63]">
              <div className="flex items-center justify-between">
                <span>Total Hors Taxes (HT)</span>
                <span className="font-mono">€{Math.round(selectedDossierOrder.totalAmount * 0.8333).toLocaleString()} EUR</span>
              </div>
              <div className="flex items-center justify-between">
                <span>TVA Française (20% Luxury Rate - Included)</span>
                <span className="font-mono">€{Math.round(selectedDossierOrder.totalAmount * 0.1667).toLocaleString()} EUR</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Insured Global Courier (White-Glove)</span>
                <span className="text-[#8C7853] uppercase text-[10px]">Complimentary</span>
              </div>
              <div className="pt-2 border-t border-[#D8D1C4] flex items-baseline justify-between text-sm font-bold text-[#181715]">
                <span className="uppercase font-sans-luxury tracking-wider">Total Net Settled</span>
                <span className="font-mono text-base text-[#8C7853]">
                  €{selectedDossierOrder.totalAmount.toLocaleString()} EUR
                </span>
              </div>
            </div>

            {/* Signatory seal */}
            <div className="mt-4 pt-4 border-t border-[#D8D1C4] flex items-center justify-between text-[11px] text-[#787268]">
              <div>
                <span className="block font-serif-luxury font-semibold text-[#181715]">
                  Éléonore de Rochechouart
                </span>
                <span className="text-[10px]">Head of Atelier Patrimoine · 14 Place Vendôme</span>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-[#181715] text-white hover:bg-[#33302B] text-[10px] uppercase tracking-wider font-sans-luxury flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
