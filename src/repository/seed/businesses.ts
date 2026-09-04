import type { Business, BusinessService, NicosiaArea, ServiceCategory } from "@/domain/types";

interface SeedServiceDef {
  name: string;
  description: string;
  durationMinutes: number;
  normalPrice: number;
}

interface SeedBusinessDef {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  area: NicosiaArea;
  addressLine: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  imageKey: string;
  services: SeedServiceDef[];
}

const MASSAGE_SERVICES: SeedServiceDef[] = [
  { name: "Deep Tissue Massage", description: "Firm-pressure full body massage that targets muscle tension.", durationMinutes: 60, normalPrice: 55 },
  { name: "Relaxing Massage", description: "Gentle full body massage for stress relief and circulation.", durationMinutes: 60, normalPrice: 50 },
  { name: "Express Massage", description: "A focused 30-minute session for a quick reset.", durationMinutes: 30, normalPrice: 30 },
  { name: "Head & Neck Massage", description: "Targeted tension release for head, neck and shoulders.", durationMinutes: 30, normalPrice: 35 },
];

const HAIR_SERVICES: SeedServiceDef[] = [
  { name: "Women's Cut & Blowdry", description: "Precision cut finished with a full blowdry style.", durationMinutes: 60, normalPrice: 40 },
  { name: "Men's Haircut", description: "Classic or modern cut, tailored to you.", durationMinutes: 30, normalPrice: 20 },
  { name: "Full Colour", description: "All-over colour application with gloss finish.", durationMinutes: 120, normalPrice: 85 },
  { name: "Balayage", description: "Hand-painted highlights for a natural, sun-kissed look.", durationMinutes: 150, normalPrice: 110 },
];

const NAILS_SERVICES: SeedServiceDef[] = [
  { name: "Classic Manicure", description: "Shape, cuticle care and polish.", durationMinutes: 45, normalPrice: 25 },
  { name: "Gel Manicure", description: "Long-lasting gel polish with shape and cuticle care.", durationMinutes: 60, normalPrice: 35 },
  { name: "Classic Pedicure", description: "Soak, shape, callus care and polish.", durationMinutes: 60, normalPrice: 30 },
  { name: "Gel Pedicure", description: "Long-lasting gel polish pedicure.", durationMinutes: 75, normalPrice: 40 },
];

const BEAUTY_SERVICES: SeedServiceDef[] = [
  { name: "Signature Facial", description: "Deep cleanse, exfoliation and hydration facial.", durationMinutes: 60, normalPrice: 50 },
  { name: "Express Facial", description: "A quick refresh for tired or dull skin.", durationMinutes: 30, normalPrice: 30 },
  { name: "Eyebrow Shaping", description: "Wax or thread shaping tailored to your face.", durationMinutes: 20, normalPrice: 15 },
  { name: "Lash Lift", description: "Semi-permanent curl for natural-looking lashes.", durationMinutes: 45, normalPrice: 35 },
];

export const SEED_BUSINESSES: SeedBusinessDef[] = [
  {
    id: "biz-serenity-wellness",
    name: "Serenity Wellness",
    category: "massage",
    description: "A calm, minimal studio focused on therapeutic massage.",
    area: "Engomi",
    addressLine: "12 Kallipoleos Ave",
    distanceKm: 2.1,
    rating: 4.8,
    reviewCount: 126,
    imageKey: "massage-1",
    services: MASSAGE_SERVICES,
  },
  {
    id: "biz-calm-room",
    name: "Calm Room Massage",
    category: "massage",
    description: "Neighbourhood massage studio, appointment-only, four rooms.",
    area: "Lakatamia",
    addressLine: "5 Ayias Fylaxeos St",
    distanceKm: 4.6,
    rating: 4.7,
    reviewCount: 81,
    imageKey: "massage-2",
    services: MASSAGE_SERVICES,
  },
  {
    id: "biz-studio-eleven",
    name: "Studio Eleven Hair",
    category: "hair",
    description: "Contemporary hair studio known for colour work.",
    area: "Nicosia Centre",
    addressLine: "11 Ledra St",
    distanceKm: 3.4,
    rating: 4.9,
    reviewCount: 214,
    imageKey: "hair-1",
    services: HAIR_SERVICES,
  },
  {
    id: "biz-urban-hair-lab",
    name: "Urban Hair Lab",
    category: "hair",
    description: "Fast, friendly cuts and styling for everyday and events.",
    area: "Engomi",
    addressLine: "44 Nikis Ave",
    distanceKm: 1.6,
    rating: 4.6,
    reviewCount: 58,
    imageKey: "hair-2",
    services: HAIR_SERVICES,
  },
  {
    id: "biz-riverside-hair",
    name: "Riverside Hair Co.",
    category: "hair",
    description: "Relaxed, light-filled salon with a focus on healthy hair.",
    area: "Strovolos",
    addressLine: "78 Strovolos Ave",
    distanceKm: 5.2,
    rating: 4.7,
    reviewCount: 96,
    imageKey: "hair-3",
    services: HAIR_SERVICES,
  },
  {
    id: "biz-gloss-nail-bar",
    name: "Gloss Nail Bar",
    category: "nails",
    description: "Bright, tidy nail bar specialising in gel finishes.",
    area: "Acropolis",
    addressLine: "9 Acropolis Ave",
    distanceKm: 2.8,
    rating: 4.6,
    reviewCount: 142,
    imageKey: "nails-1",
    services: NAILS_SERVICES,
  },
  {
    id: "biz-velvet-nails",
    name: "Velvet Nails",
    category: "nails",
    description: "Detail-oriented nail studio, walk-ins welcome between bookings.",
    area: "Dasoupolis",
    addressLine: "23 Prodromou St",
    distanceKm: 3.9,
    rating: 4.5,
    reviewCount: 63,
    imageKey: "nails-2",
    services: NAILS_SERVICES,
  },
  {
    id: "biz-aura-beauty",
    name: "Aura Beauty Studio",
    category: "beauty",
    description: "Skin-first beauty studio offering facials and brow treatments.",
    area: "Strovolos",
    addressLine: "31 Strovolos Ave",
    distanceKm: 4.1,
    rating: 4.8,
    reviewCount: 108,
    imageKey: "beauty-1",
    services: BEAUTY_SERVICES,
  },
  {
    id: "biz-olive-beauty",
    name: "Olive Beauty Lounge",
    category: "beauty",
    description: "Boutique beauty lounge with a loyal local following.",
    area: "Aglantzia",
    addressLine: "6 Aglantzias Ave",
    distanceKm: 3.0,
    rating: 4.6,
    reviewCount: 74,
    imageKey: "beauty-2",
    services: BEAUTY_SERVICES,
  },
  {
    id: "biz-bloom-beauty",
    name: "Bloom Beauty House",
    category: "beauty",
    description: "Central beauty house, popular for lash and brow work.",
    area: "Nicosia Centre",
    addressLine: "17 Onasagorou St",
    distanceKm: 3.6,
    rating: 4.9,
    reviewCount: 189,
    imageKey: "beauty-3",
    services: BEAUTY_SERVICES,
  },
];

export function buildBusinessesAndServices(): {
  businesses: Business[];
  services: BusinessService[];
} {
  const businesses: Business[] = [];
  const services: BusinessService[] = [];
  const now = new Date().toISOString();

  for (const def of SEED_BUSINESSES) {
    businesses.push({
      id: def.id,
      name: def.name,
      category: def.category,
      description: def.description,
      location: {
        area: def.area,
        addressLine: def.addressLine,
        distanceKm: def.distanceKm,
      },
      rating: def.rating,
      reviewCount: def.reviewCount,
      imageKey: def.imageKey,
      createdAt: now,
    });

    def.services.forEach((s, idx) => {
      services.push({
        id: `${def.id}-svc-${idx}`,
        businessId: def.id,
        name: s.name,
        description: s.description,
        durationMinutes: s.durationMinutes,
        normalPrice: s.normalPrice,
        category: def.category,
        active: true,
      });
    });
  }

  return { businesses, services };
}
