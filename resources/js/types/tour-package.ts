export interface TourPackage {
    id: number;

    title: string;
    subtitle?: string | null;
    overview?: string | null;
    content?: string | null;

    location: string;
    slug: string;

    city_id: number;

    duration?: string | null; // e.g. "3D2N"
    price_per_head?: number | null;
    pax_kids?: number | null;
    pax_adult?: number | null;
    available_from?: string | null; // ISO date string, e.g. "2025-06-01"
    available_until?: string | null;
    image_url?: string | null;

    created_at: string;
    updated_at: string;
}
  
