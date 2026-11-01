import { ShipmentRecord, LuxuryPriceComparison } from '../types/fashion';

export const SAMPLE_SHIPMENTS: Record<string, ShipmentRecord> = {
  'MA-CMD-849201': {
    orderId: 'MA-CMD-849201',
    customerEmail: 'subhandaizy70@gmail.com',
    recipientName: 'Lady Genevieve Dupont',
    destination: '28 Rue du Faubourg Saint-Honoré, 75008 Paris, France',
    carrier: 'Ferrari Security Express · White-Glove Armored Division',
    waybillNumber: 'FER-PAR-778912-FR',
    tamperSealId: 'WAX-SEAL-9014-VENDOME',
    insuranceValuation: '€7,050 EUR (Lloyd’s of London Archival Underwrite)',
    status: 'out_for_delivery',
    statusLabel: 'Out for Scheduled White-Glove Delivery',
    estimatedDelivery: 'Today by 17:30 CET',
    temperatureControlled: true,
    vaultLocation: 'Private Armored Transit Unit 04 · Place Vendôme',
    items: [
      {
        productName: 'The Structured Sculptural Coat',
        size: 'FR 36 (US 4)',
        price: 3850,
        image: '/assets/images/hero_luxury_fashion_model_1793507760974.jpg',
        monogram: 'G.D.',
        serialNumber: 'MA-MMXXVI-004/035'
      },
      {
        productName: 'The Vendôme Top-Handle Bag',
        size: 'One Size',
        price: 3200,
        image: '/assets/images/fashion_bag_leather_1793507761189.jpg',
        monogram: 'G.D.',
        serialNumber: 'MA-MMXXVI-BAG-019'
      }
    ],
    checkpoints: [
      {
        status: 'Atelier Pattern & Quality Verification',
        location: '14 Place Vendôme Atelier, Paris',
        timestamp: '2026-10-30 08:30 CET',
        completed: true,
        description: '36-point inspection executed by Master Tailor Jean-Marc. Unbleached cashmere steamed with aromatic cedar.'
      },
      {
        status: 'Archival Packaging & Hot Wax Tamper Seal',
        location: 'Maison Aurelia Vault, Paris',
        timestamp: '2026-10-30 16:45 CET',
        completed: true,
        description: 'Garments enveloped in acid-free silk paper, enclosed in hand-turned cedar box. 24k gold leaf seal WAX-SEAL-9014 applied.'
      },
      {
        status: 'Handover to Armored Ferrari Transport',
        location: 'Paris Logistics Terminal',
        timestamp: '2026-10-31 06:15 CET',
        completed: true,
        description: 'Secure armored vehicle dispatch with dual biometric courier escort.'
      },
      {
        status: 'White-Glove Courier Out for Hand Delivery',
        location: '8th Arrondissement, Paris',
        timestamp: '2026-10-31 11:20 CET',
        completed: true,
        description: 'Personal courier Henri V. is en route to 28 Rue du Faubourg Saint-Honoré. Direct signature verification required.'
      }
    ]
  },
  'MA-CMD-740192': {
    orderId: 'MA-CMD-740192',
    customerEmail: 'vip.client@aurelia.paris',
    recipientName: 'Kenjiro Takahashi',
    destination: 'Minami-Aoyama 5-Chome, Minato-ku, Tokyo 107-0062, Japan',
    carrier: 'Malca-Amit Luxury Air Transit · Vault-to-Vault',
    waybillNumber: 'MAL-TYO-441029-JP',
    tamperSealId: 'WAX-SEAL-8812-VENDOME',
    insuranceValuation: '€3,400 EUR (Full Air Transit Coverage)',
    status: 'in_transit',
    statusLabel: 'In Transcontinental Air Transit',
    estimatedDelivery: 'November 03, 2026 by 14:00 JST',
    temperatureControlled: true,
    vaultLocation: 'Air France Priority Cargo Vault · Flight AF272',
    items: [
      {
        productName: 'The Architectural Double-Breasted Blazer',
        size: 'FR 38 (US 6)',
        price: 2450,
        image: '/assets/images/fashion_coat_cashmere_1793507760608.jpg',
        serialNumber: 'MA-MMXXVI-BLZ-022'
      },
      {
        productName: 'The Sculptural Aurelia Torque Collar',
        size: 'Universal (38cm)',
        price: 950,
        image: '/assets/images/fashion_silk_dress_1793507762000.jpg',
        serialNumber: 'MA-MMXXVI-TRQ-009'
      }
    ],
    checkpoints: [
      {
        status: 'Place Vendôme Atelier Release',
        location: '14 Place Vendôme, Paris',
        timestamp: '2026-10-29 11:00 CET',
        completed: true,
        description: 'Handcrafted garments signed by atelier director and certified for export.'
      },
      {
        status: 'Customs Export Clearance (Paris CDG)',
        location: 'Charles de Gaulle Airport, France',
        timestamp: '2026-10-30 14:30 CET',
        completed: true,
        description: 'Diplomatic courier clearance granted with export VAT refund documentation.'
      },
      {
        status: 'Transcontinental Flight Departure',
        location: 'En Route to Tokyo Haneda (HND)',
        timestamp: '2026-10-31 01:20 CET',
        completed: true,
        description: 'Secured inside climate-controlled pressurized vault aboard flight AF272.'
      },
      {
        status: 'Tokyo Customs & White-Glove Dispatch',
        location: 'Haneda Secure Bonded Facility, Tokyo',
        timestamp: 'Scheduled Nov 02, 2026',
        completed: false,
        description: 'Direct transfer to Malca-Amit Japan armored courier team.'
      }
    ]
  }
};

export const LUXURY_PRICE_COMPARISONS: LuxuryPriceComparison[] = [
  {
    id: 'comp-lv-nano-noe-knit-knot',
    itemName: 'Nano Noé ‘Knit Knot’ (Ref: M2A816)',
    brand: 'Louis Vuitton',
    category: 'Maroquinerie',
    image: '/assets/images/fashion_bag_nano_knit_knot_1793509825306.jpg',
    officialBoutiquePrice: 2100,
    lowestFoundPrice: 1950,
    lowestPlatform: '24S (LVMH Official Partner)',
    currency: 'EUR',
    taxRefundSavingsPct: 12.0,
    arbitrageNote: 'Official Louis Vuitton retail is €2,100 (₹2,10,000). Available on 24S Paris with verified provenance at €1,950 for VIP clients, plus 12% Paris CDG export tax refund.',
    platforms: [
      {
        platformName: '24S (LVMH Official Partner)',
        price: 1950,
        currency: 'EUR',
        availability: 'Limited Stock',
        condition: 'Atelier Direct',
        shippingTime: '1-2 Days Paris Express',
        dutiesIncluded: true,
        directUrlHint: '24s.com/louis-vuitton/nano-noe-knit-knot-m2a816'
      },
      {
        platformName: 'Louis Vuitton Flagship Boutique',
        price: 2100,
        currency: 'EUR',
        availability: 'Limited Stock',
        condition: 'Atelier Direct',
        shippingTime: 'White-Glove Courier',
        dutiesIncluded: true,
        directUrlHint: 'louisvuitton.com/eng-in/products/nano-noe-knit-knot-P00142206/M2A816'
      },
      {
        platformName: 'Sotheby’s Sealed Luxury Vault',
        price: 1980,
        currency: 'EUR',
        availability: 'Limited Stock',
        condition: 'Archival Mint',
        shippingTime: 'Armored 48h Transit',
        dutiesIncluded: true,
        directUrlHint: 'sothebys.com/luxury/louis-vuitton-nano-noe'
      },
      {
        platformName: 'Farfetch Curated Boutiques',
        price: 2180,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '3-4 Business Days',
        dutiesIncluded: true,
        directUrlHint: 'farfetch.com/designers/louis-vuitton'
      }
    ]
  },
  {
    id: 'comp-coat-sculptural',
    itemName: 'The Structured Sculptural Coat',
    brand: 'Maison Aurelia',
    category: 'Outerwear',
    image: '/assets/images/hero_luxury_fashion_model_1793507760974.jpg',
    officialBoutiquePrice: 3850,
    lowestFoundPrice: 3790,
    lowestPlatform: '24S (LVMH Official Partner)',
    currency: 'EUR',
    taxRefundSavingsPct: 12.0,
    arbitrageNote: 'Secured at €3,790 on 24S with verified Paris provenance. International clients visiting Europe can claim up to 12% (€454) VAT refund at Paris CDG.',
    platforms: [
      {
        platformName: '24S (LVMH Paris)',
        price: 3790,
        currency: 'EUR',
        availability: 'Limited Stock',
        condition: 'Atelier Direct',
        shippingTime: '1-2 Days Express',
        dutiesIncluded: true,
        directUrlHint: '24s.com/maison-aurelia/sculptural-coat'
      },
      {
        platformName: 'Maison Aurelia Flagship',
        price: 3850,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Atelier Direct',
        shippingTime: 'Same-Day Place Vendôme Courier',
        dutiesIncluded: true,
        directUrlHint: 'maison-aurelia.paris/collections/coat'
      },
      {
        platformName: 'Net-a-Porter Private Suite',
        price: 3850,
        currency: 'EUR',
        availability: 'Limited Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '2-3 Business Days',
        dutiesIncluded: true,
        directUrlHint: 'net-a-porter.com/shop/aurelia'
      },
      {
        platformName: 'Farfetch Luxury Partner',
        price: 3920,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '3-5 Business Days',
        dutiesIncluded: true,
        directUrlHint: 'farfetch.com/designers/maison-aurelia'
      }
    ]
  },
  {
    id: 'comp-row-margaux',
    itemName: 'Margaux 15 Smooth Leather Tote',
    brand: 'The Row',
    category: 'Maroquinerie',
    image: '/assets/images/fashion_bag_leather_1793507761189.jpg',
    officialBoutiquePrice: 4950,
    lowestFoundPrice: 4500,
    lowestPlatform: 'Sotheby’s Sealed Luxury Vault',
    currency: 'EUR',
    taxRefundSavingsPct: 8.5,
    arbitrageNote: 'The Row flagship maintains long waiting lists. Sotheby’s Sealed offers an unworn archival piece with certificate at €4,500 (Save €450).',
    platforms: [
      {
        platformName: 'Sotheby’s Sealed Vault',
        price: 4500,
        currency: 'EUR',
        availability: 'Limited Stock',
        condition: 'Archival Mint',
        shippingTime: 'Armored 48h Transit',
        dutiesIncluded: true,
        directUrlHint: 'sothebys.com/luxury/the-row-margaux-15'
      },
      {
        platformName: 'SSENSE VIP Allocation',
        price: 4650,
        currency: 'EUR',
        availability: 'Limited Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '2-3 Days Worldwide',
        dutiesIncluded: true,
        directUrlHint: 'ssense.com/en-us/women/the-row'
      },
      {
        platformName: '24S (LVMH)',
        price: 4890,
        currency: 'EUR',
        availability: 'Sold Out',
        condition: 'Pristine / New with Tags',
        shippingTime: 'Pre-Order Waitlist',
        dutiesIncluded: true,
        directUrlHint: '24s.com/the-row/margaux-tote'
      },
      {
        platformName: 'The Row Official Salon',
        price: 4950,
        currency: 'EUR',
        availability: 'Atelier Pre-Order',
        condition: 'Atelier Direct',
        shippingTime: '4-6 Weeks Custom Run',
        dutiesIncluded: true,
        directUrlHint: 'therow.com/shop/margaux-15'
      }
    ]
  },
  {
    id: 'comp-cucinelli-blazer',
    itemName: 'Monili Double-Faced Cashmere Blazer',
    brand: 'Brunello Cucinelli',
    category: 'Tailoring',
    image: '/assets/images/fashion_coat_cashmere_1793507760608.jpg',
    officialBoutiquePrice: 4800,
    lowestFoundPrice: 4320,
    lowestPlatform: 'Mytheresa Private Client',
    currency: 'EUR',
    taxRefundSavingsPct: 11.0,
    arbitrageNote: 'Mytheresa seasonal privilege discount brings this Solomeo cashmere blazer to €4,320 (Save €480 vs Milan flagship).',
    platforms: [
      {
        platformName: 'Mytheresa Private Client',
        price: 4320,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '1-2 Days DHL Express',
        dutiesIncluded: true,
        directUrlHint: 'mytheresa.com/brunello-cucinelli'
      },
      {
        platformName: 'Net-a-Porter',
        price: 4560,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '2-3 Days',
        dutiesIncluded: true,
        directUrlHint: 'net-a-porter.com/cucinelli-blazer'
      },
      {
        platformName: 'Farfetch Partner Boutiques',
        price: 4720,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '3-4 Days',
        dutiesIncluded: true,
        directUrlHint: 'farfetch.com/brunello-cucinelli'
      },
      {
        platformName: 'Brunello Cucinelli Boutique',
        price: 4800,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Atelier Direct',
        shippingTime: 'White-Glove Italian Courier',
        dutiesIncluded: true,
        directUrlHint: 'brunellocucinelli.com/shop'
      }
    ]
  },
  {
    id: 'comp-loro-piana-loafers',
    itemName: 'Summer Walk Water-Repellent Suede Loafers',
    brand: 'Loro Piana',
    category: 'Footwear & Objects',
    officialBoutiquePrice: 1180,
    lowestFoundPrice: 1040,
    lowestPlatform: 'Harrods Private Wardrobe',
    currency: 'EUR',
    taxRefundSavingsPct: 10.5,
    arbitrageNote: 'Harrods London client allocation pricing is currently €1,040 (Save €140 vs Via Montenapoleone boutique).',
    platforms: [
      {
        platformName: 'Harrods Private Concierge',
        price: 1040,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '2 Days Insured Delivery',
        dutiesIncluded: true,
        directUrlHint: 'harrods.com/en-gb/loro-piana-summer-walk'
      },
      {
        platformName: 'Mytheresa',
        price: 1100,
        currency: 'EUR',
        availability: 'Limited Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '1-2 Days Express',
        dutiesIncluded: true,
        directUrlHint: 'mytheresa.com/loro-piana'
      },
      {
        platformName: 'Loro Piana Flagship',
        price: 1180,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Atelier Direct',
        shippingTime: 'Direct Italian Courier',
        dutiesIncluded: true,
        directUrlHint: 'loropiana.com/footwear'
      },
      {
        platformName: 'Farfetch Verified Vault',
        price: 1180,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '3-5 Days',
        dutiesIncluded: true,
        directUrlHint: 'farfetch.com/loro-piana'
      }
    ]
  },
  {
    id: 'comp-bottega-andiamo',
    itemName: 'Andiamo Intrecciato Top-Handle Bag',
    brand: 'Bottega Veneta',
    category: 'Maroquinerie',
    image: '/assets/images/fashion_bag_leather_1793507761189.jpg',
    officialBoutiquePrice: 3800,
    lowestFoundPrice: 3550,
    lowestPlatform: '24S (LVMH Official Partner)',
    currency: 'EUR',
    taxRefundSavingsPct: 12.0,
    arbitrageNote: '24S features direct Paris tax incentives lowering the acquisition price to €3,550 with complimentary door-to-door courier.',
    platforms: [
      {
        platformName: '24S (LVMH Official Partner)',
        price: 3550,
        currency: 'EUR',
        availability: 'Limited Stock',
        condition: 'Atelier Direct',
        shippingTime: '1-2 Days Paris Express',
        dutiesIncluded: true,
        directUrlHint: '24s.com/bottega-veneta/andiamo'
      },
      {
        platformName: 'SSENSE Global',
        price: 3680,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '2-4 Days Express',
        dutiesIncluded: true,
        directUrlHint: 'ssense.com/bottega-veneta'
      },
      {
        platformName: 'Net-a-Porter',
        price: 3750,
        currency: 'EUR',
        availability: 'Limited Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '2 Days',
        dutiesIncluded: true,
        directUrlHint: 'net-a-porter.com/andiamo-bag'
      },
      {
        platformName: 'Bottega Veneta Official',
        price: 3800,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Atelier Direct',
        shippingTime: 'Insured White-Glove Courier',
        dutiesIncluded: true,
        directUrlHint: 'bottegaveneta.com/bags/andiamo'
      }
    ]
  },
  {
    id: 'comp-aurelia-vendome-bag',
    itemName: 'The Vendôme Top-Handle Bag in Box-Calf',
    brand: 'Maison Aurelia',
    category: 'Maroquinerie',
    image: '/assets/images/fashion_bag_leather_1793507761189.jpg',
    officialBoutiquePrice: 3200,
    lowestFoundPrice: 3120,
    lowestPlatform: '24S (LVMH Curated Capsule)',
    currency: 'EUR',
    taxRefundSavingsPct: 12.0,
    arbitrageNote: 'Acquire direct through 24S Paris for €3,120 or at Place Vendôme atelier with private champagne concierge and bespoke initial foil stamping.',
    platforms: [
      {
        platformName: '24S (LVMH Capsule)',
        price: 3120,
        currency: 'EUR',
        availability: 'Limited Stock',
        condition: 'Atelier Direct',
        shippingTime: '1-2 Days Express',
        dutiesIncluded: true,
        directUrlHint: '24s.com/maison-aurelia/sac-vendome'
      },
      {
        platformName: 'Maison Aurelia Place Vendôme',
        price: 3200,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Atelier Direct',
        shippingTime: 'Private Chauffeur Hand-Delivery',
        dutiesIncluded: true,
        directUrlHint: 'maison-aurelia.paris/maroquinerie/vendome'
      },
      {
        platformName: 'Net-a-Porter Private Suite',
        price: 3200,
        currency: 'EUR',
        availability: 'Limited Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '2-3 Business Days',
        dutiesIncluded: true,
        directUrlHint: 'net-a-porter.com/shop/aurelia-bag'
      },
      {
        platformName: 'Farfetch Luxury Partner',
        price: 3290,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '3-5 Business Days',
        dutiesIncluded: true,
        directUrlHint: 'farfetch.com/maison-aurelia/vendome'
      }
    ]
  },
  {
    id: 'comp-aurelia-silk-gown',
    itemName: 'The Draped Bias-Cut Silk Evening Gown',
    brand: 'Maison Aurelia',
    category: 'Haute Gowns',
    image: '/assets/images/fashion_silk_dress_1793507762000.jpg',
    officialBoutiquePrice: 2750,
    lowestFoundPrice: 2680,
    lowestPlatform: 'Net-a-Porter Private Wardrobe',
    currency: 'EUR',
    taxRefundSavingsPct: 12.0,
    arbitrageNote: 'Net-a-Porter VIP salon members receive preferred pricing of €2,680 (Save €70). Archival numbered series guaranteed.',
    platforms: [
      {
        platformName: 'Net-a-Porter Private Wardrobe',
        price: 2680,
        currency: 'EUR',
        availability: 'Limited Stock',
        condition: 'Pristine / New with Tags',
        shippingTime: '1-2 Days Express',
        dutiesIncluded: true,
        directUrlHint: 'net-a-porter.com/aurelia-silk-gown'
      },
      {
        platformName: 'Maison Aurelia Paris Flagship',
        price: 2750,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Atelier Direct',
        shippingTime: 'Same-Day Courier / Salon Fitting',
        dutiesIncluded: true,
        directUrlHint: 'maison-aurelia.paris/gowns/silk-slip'
      },
      {
        platformName: '24S LVMH',
        price: 2750,
        currency: 'EUR',
        availability: 'In Stock',
        condition: 'Atelier Direct',
        shippingTime: '2 Days Express',
        dutiesIncluded: true,
        directUrlHint: '24s.com/maison-aurelia/robe-du-soir'
      }
    ]
  }
];
