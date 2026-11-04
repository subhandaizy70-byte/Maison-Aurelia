import { BoutiqueStylist } from '../types/fashion';

export const BOUTIQUE_STYLISTS: BoutiqueStylist[] = [
  {
    id: 'eleonore-rochechouart',
    name: 'Éléonore de Rochechouart',
    frenchTitle: 'Directrice de Style & Haute Couture',
    role: 'Head Couture Stylist & Silhouette Architect',
    salon: '14 Place Vendôme, Paris',
    avatar: '/assets/images/couture_salon_gown.jpg',
    specialties: ['Architectural Silk Gowns', 'Place Vendôme Gala Protocol', 'Bridal & Red-Carpet Draping', 'Chantilly Lace Loungewear'],
    status: 'Available Online',
    bio: 'Direct descendant of classic Parisian sartorial lineage. Oversees bespoke evening commissions and red carpet silken drapes for Maison Aurelia.'
  },
  {
    id: 'francois-montmirail',
    name: 'François de Montmirail',
    frenchTitle: 'Maître Tailleur & Directeur du Savoir-Faire',
    role: 'Master Tailor & Outerwear Specialist',
    salon: '28 Rue du Faubourg Saint-Honoré, Paris',
    avatar: '/assets/images/place_vendome_twilight.jpg',
    specialties: ['Double-Faced Cashmere', 'Savile Row Structured Shoulders', 'Courchevel Alpine Luxury', 'Midnight Velvet Capes'],
    status: 'Available Online',
    bio: 'Dedicated to the millimeter-level discipline of structural tailoring and cold-season alpine performance outerwear.'
  },
  {
    id: 'camille-laurent',
    name: 'Camille Laurent',
    frenchTitle: 'Conservatrice Maroquinerie & Haute Parfumerie',
    role: 'High Leathercraft & Olfactory Curator',
    salon: 'Palazzo Montenapoleone, Milan',
    avatar: '/assets/images/dior_saddle_bag.jpg',
    specialties: ['Tuscan Maroquinerie', 'Dior Oblique Accents', 'Grasse Rose Extrait Pairings', 'Rare Calacatta Flacons'],
    status: 'Available Online',
    bio: 'Expert in artisanal leather patinas, 24k gold hardware harmony, and bespoke olfactory layerings for exclusive galas.'
  }
];

export const CONCIERGE_PRESETS = [
  {
    label: 'Gown & Gala Styling',
    query: 'Which silken evening gown and jewelry pairing do you recommend for an upcoming Palais Garnier gala?',
    targetStylistId: 'eleonore-rochechouart'
  },
  {
    label: 'Alpine Outerwear Advice',
    query: 'How should I style the Louis Vuitton Courchevel bi-stretch ski jacket for alpine evenings?',
    targetStylistId: 'francois-montmirail'
  },
  {
    label: 'Balenciaga & Dior Ensembles',
    query: 'Could you propose an ensemble pairing the Balenciaga Liquid Blue Gown with Tuscan maroquinerie?',
    targetStylistId: 'eleonore-rochechouart'
  },
  {
    label: 'Haute Parfumerie Pairing',
    query: 'Which olfactory notes from the Place Vendôme Grand Extrait best complement our midnight velvet cape?',
    targetStylistId: 'camille-laurent'
  },
  {
    label: 'Private Salon Fitting',
    query: 'I would like to request an appointment with master tailors at the 14 Place Vendôme salon.',
    targetStylistId: 'francois-montmirail'
  }
];
