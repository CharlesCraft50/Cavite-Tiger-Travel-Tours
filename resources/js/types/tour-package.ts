import { City } from "./city";
import { OtherService } from "./other-service";
import { PackageCategory } from "./package-category";
import { PackageReview } from "./package-review";
import { PreferredVan } from "./preferred-van";
import { Wishlist } from "./wishlist";

export interface TourPackage {
    id: number;

    title: string;
    subtitle?: string | null;
    overview?: string | null;
    content?: string | null;

    location: string;
    slug: string;

    city_id?: number | null;

    duration?: string | null; // e.g. "3D2N"
    pax_kids?: number | null;
    pax_adult?: number | null;
    available_from?: string | null; // ISO date string, e.g. "2025-06-01"
    available_until?: string | null;
    image_overview?: string | null;
    image_banner?: string | null;

    base_price: number;

    package_type: string;
    event_type?: string | null;
    preferred_days?: number | null | undefined;

    other_services: OtherService[];
    package_categories: PackageCategory[];
    wishlist: Wishlist;
    preferred_vans: PreferredVan[];
    city?: City;
    reviews?: PackageReview[];
    reviewByUser?: PackageReview;

    reviews_paginated?: {
        data: PackageReview[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };

    created_at: string;
    updated_at: string;
}
  
