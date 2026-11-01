export interface Product {
  id: string;
  name: string;
  frenchName?: string;
  gender: 'femme' | 'homme' | 'universal';
  category: 'outerwear' | 'tailoring' | 'gowns' | 'bags' | 'jewellery' | 'shoes';
  categoryLabel: string;
  price: number;
  currency: string;
  image: string;
  secondaryImage?: string;
  silhouette: string;
  fabric: string;
  origin: string;
  description: string;
  composition: string[];
  careInstructions: string;
  editionLimit: string;
  sizes: string[];
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
  monogram?: string;
}

export interface BookingRequest {
  salon: 'paris' | 'milan' | 'london' | 'newyork';
  service: 'couture' | 'wardrobe' | 'leather';
  date: string;
  time: string;
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface LookbookSlide {
  id: string;
  lookNumber: string;
  title: string;
  season: string;
  image: string;
  description: string;
  ensemblePieces: string[];
  modelSpecs: string;
}

export interface TrackingCheckpoint {
  status: string;
  location: string;
  timestamp: string;
  completed: boolean;
  description: string;
}

export interface ShipmentRecord {
  orderId: string;
  customerEmail: string;
  recipientName: string;
  destination: string;
  carrier: string;
  waybillNumber: string;
  tamperSealId: string;
  insuranceValuation: string;
  status: 'atelier_prep' | 'in_transit' | 'customs_cleared' | 'out_for_delivery' | 'delivered';
  statusLabel: string;
  estimatedDelivery: string;
  temperatureControlled: boolean;
  vaultLocation: string;
  items: {
    productName: string;
    size: string;
    price: number;
    image: string;
    monogram?: string;
    serialNumber: string;
  }[];
  checkpoints: TrackingCheckpoint[];
}

export interface PlatformPriceQuote {
  platformName: string;
  price: number;
  currency: string;
  availability: 'In Stock' | 'Limited Stock' | 'Atelier Pre-Order' | 'Sold Out';
  condition: 'Pristine / New with Tags' | 'Atelier Direct' | 'Archival Mint';
  shippingTime: string;
  dutiesIncluded: boolean;
  directUrlHint: string;
}

export interface LuxuryPriceComparison {
  id: string;
  itemName: string;
  brand: string;
  category: string;
  image?: string;
  officialBoutiquePrice: number;
  lowestFoundPrice: number;
  lowestPlatform: string;
  currency: string;
  taxRefundSavingsPct: number;
  arbitrageNote: string;
  platforms: PlatformPriceQuote[];
}

export type EliteTierLevel = 'argent' | 'or' | 'nocturne';

export interface EliteTier {
  id: EliteTierLevel;
  name: string;
  frenchTitle: string;
  minSpend: number;
  maxSpend?: number;
  benefits: string[];
  perkHighlights: {
    earlyAccessHours: number;
    conciergeLevel: string;
    privateEvents: boolean;
    monogramming: string;
  };
}

export interface PatronPurchase {
  orderId: string;
  date: string;
  amount: number;
  items: string[];
  status: 'Delivered' | 'In Transit' | 'Handover Scheduled';
}

export interface PrivateEvent {
  id: string;
  title: string;
  frenchTitle: string;
  date: string;
  time: string;
  location: string;
  city: string;
  requiredTier: EliteTierLevel;
  description: string;
  dressCode: string;
  curatorHost: string;
  rsvpStatus: 'unconfirmed' | 'attending' | 'declined';
}

