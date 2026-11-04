import { EliteTier, PatronPurchase, PrivateEvent } from '../types/fashion';

export const ELITE_TIERS: EliteTier[] = [
  {
    id: 'argent',
    name: "Cercle d'Argent",
    frenchTitle: 'Le Premier Rang',
    minSpend: 0,
    maxSpend: 4999,
    benefits: [
      'Complimentary Insured Express Worldwide Courier',
      'Archival Charcoal Linen Box & Cedar Aromatic Hanger',
      'Place Vendôme Digital Provenance Registry',
      '24-Hour Digital Atelier Concierge Service',
      'Seasonal Lookbook Digital Previews'
    ],
    perkHighlights: {
      earlyAccessHours: 24,
      conciergeLevel: 'Digital Atelier Desk',
      privateEvents: false,
      monogramming: 'Standard Embossing'
    }
  },
  {
    id: 'or',
    name: "Cercle d'Or",
    frenchTitle: 'Le Rang des Curateurs',
    minSpend: 5000,
    maxSpend: 14999,
    benefits: [
      '48-Hour Priority Early Access to Haute Capsule Collections & Pre-Orders',
      'Invitations to Private Salon Soirées in Paris, Milan, London & New York',
      'Complimentary Bespoke 24k Gold Foil Initial Monogramming',
      'Personal Wardrobe Sizing Mapping by Place Vendôme Master Cutters',
      'Seasonal Hardcover Lookbook Delivered in Wax-Sealed Linen Dossier',
      'Direct Chauffeur Hand-Delivery within Metropolises'
    ],
    perkHighlights: {
      earlyAccessHours: 48,
      conciergeLevel: 'Dedicated Sartorial Specialist',
      privateEvents: true,
      monogramming: '24k Gold Hot Foil Stamping'
    }
  },
  {
    id: 'nocturne',
    name: 'Cercle Nocturne',
    frenchTitle: 'Le Grand Patron Archival',
    minSpend: 15000,
    benefits: [
      '72-Hour Pre-Emptive Runway Reservation Prior to Public Disclosure',
      'Exclusive Paris Fashion Week Haute Couture Salon Defilé & Gala Dinner Invitations',
      'Dedicated Master Tailor Assigned for Lifetime Bespoke Alterations & Refreshes',
      'Private Vault Tasting & Champagne Suite at 14 Place Vendôme',
      'Unlimited Armored Biometric Chauffeur Deliveries',
      'Custom Silk Weaver Commission Rights (Bespoke Monogram Jacquard Weaving)'
    ],
    perkHighlights: {
      earlyAccessHours: 72,
      conciergeLevel: 'Direct Cell to Atelier Director Éléonore',
      privateEvents: true,
      monogramming: 'Bespoke Woven Jacquard & Gold Leaf'
    }
  }
];

export const INITIAL_PATRON_PURCHASES: PatronPurchase[] = [
  {
    orderId: 'MA-CMD-849201',
    date: '2026-10-30',
    amount: 7050,
    items: [
      'The Structured Sculptural Coat (FR 36 / Monogram G.D.)',
      'The Vendôme Top-Handle Bag in Box-Calf (Ambré)'
    ],
    status: 'In Transit',
    itemThumbnails: [
      '/assets/images/hero_luxury_fashion_model_1793507760974.jpg',
      '/assets/images/fashion_bag_leather_1793507761189.jpg'
    ],
    trackingNumber: 'FR-PV-849201-VAL',
    destinationCity: 'Paris · 8ème Arrondissement',
    vaultNotes: 'Insured transit via Place Vendôme armored courier service. Tamper seal verified.'
  },
  {
    orderId: 'MA-CMD-712093',
    date: '2026-08-14',
    amount: 2750,
    items: [
      'The Draped Bias-Cut Silk Evening Gown (FR 34 / Champagne)'
    ],
    status: 'Delivered',
    itemThumbnails: [
      '/assets/images/fashion_silk_dress_1793507762000.jpg'
    ],
    trackingNumber: 'FR-PV-712093-DEL',
    destinationCity: 'London · Mayfair Townhouse',
    vaultNotes: 'Delivered in archival charcoal linen storage box with cedar aromatics. Signed by patron.'
  },
  {
    orderId: 'MA-CMD-604182',
    date: '2026-05-22',
    amount: 1450,
    items: [
      'The Brâncuși Sculptural Heel Mule (EU 38 / Solid Brass Balance)'
    ],
    status: 'Delivered',
    itemThumbnails: [
      '/assets/images/fashion_shoes_derby_mule_1793509823708.jpg'
    ],
    trackingNumber: 'FR-PV-604182-ARC',
    destinationCity: 'Paris · Place Vendôme Salon',
    vaultNotes: 'Handover completed in private salon following bespoke shoe fitting session.'
  }
];

export const INITIAL_PRIVATE_EVENTS: PrivateEvent[] = [
  {
    id: 'event-vendome-twilight',
    title: 'Twilight Salon Fitting & Dom Pérignon Millésime Preview',
    frenchTitle: 'Soirée Dégustation & Essayage Nocturne',
    date: 'November 18, 2026',
    time: '19:30 – 22:30 CET',
    location: 'Salon Privé No. 14, Place Vendôme',
    city: 'Paris, France',
    requiredTier: 'or',
    description: 'An intimate twilight trial of the upcoming Winter Silk capsule followed by private cellar champagne hospitality amidst 18th-century boiserie salons.',
    dressCode: 'Black Tie Minimalist / Dark Tailoring',
    curatorHost: 'Salon Director Éléonore de Rochechouart',
    rsvpStatus: 'attending'
  },
  {
    id: 'event-mayfair-sculpture',
    title: 'Haute Joaillerie & Silk Sculpture Showcase',
    frenchTitle: 'Exposition Privée Or & Soie Roulottée',
    date: 'December 05, 2026',
    time: '18:00 – 21:00 GMT',
    location: 'Mayfair Townhouse, 22 Old Bond Street',
    city: 'London, United Kingdom',
    requiredTier: 'or',
    description: 'Private salon examination of hand-hammered 24k torque collars paired with liquid bias-cut charmeuse gowns before international press unveil.',
    dressCode: 'Sartorial Evening Elegance',
    curatorHost: 'Victoria Montgomery-Smythe',
    rsvpStatus: 'unconfirmed'
  },
  {
    id: 'event-pfw-gala',
    title: 'Haute Couture Salon Defilé & Gala Dinner (PFW)',
    frenchTitle: 'Grand Défilé Haute Couture & Dîner de Gala',
    date: 'January 26, 2027',
    time: '20:30 – 01:00 CET',
    location: 'Grand Palais & Hôtel de Bourvallais',
    city: 'Paris, France',
    requiredTier: 'nocturne',
    description: 'Front-row presence for Collection Printemps MMXXVII followed by an eight-course private culinary experience celebrating heritage craftsmanship.',
    dressCode: 'White Tie / Archival Couture',
    curatorHost: 'Maison Aurelia Artistic Direction & Patrons Circle',
    rsvpStatus: 'unconfirmed'
  }
];

export const UPCOMING_CAPSULES = [
  {
    id: 'capsule-printemps-2027',
    title: 'Collection Printemps MMXXVII',
    subtitle: 'Lumière du Marais · Architectural Poplin & Pale Cashmere',
    releaseDate: 'November 15, 2026',
    piecesCount: 14,
    previewImage: '/assets/images/hero_luxury_fashion_model_1793507760974.jpg',
    unlockedFor: 'or' as const,
    description: 'An early release of pure Egyptian Giza cotton tunics, fluid oyster silk culottes, and deconstructed featherweight cashmere blazers.'
  },
  {
    id: 'capsule-joaillerie-nocturne',
    title: 'Série Haute Joaillerie No. 03',
    subtitle: 'Brâncuși Torques & Hand-Planished Platinum Pins',
    releaseDate: 'December 01, 2026',
    piecesCount: 6,
    previewImage: '/assets/images/fashion_silk_dress_1793507762000.jpg',
    unlockedFor: 'nocturne' as const,
    description: 'Six unique sculptural objects forged in the Marais workshops, set with unheated Ceylon sapphires and hand-brushed satin platinum.'
  }
];
