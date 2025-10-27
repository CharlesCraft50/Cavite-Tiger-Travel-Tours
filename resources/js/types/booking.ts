import { BookingPayment } from "./booking-payment";
import { OtherService } from "./other-service";
import { PackageCategory } from "./package-category";
import { PreferredPreparation } from "./preferred-preparation";
import { PreferredVan } from "./preferred-van";
import { TourPackage } from "./tour-package";

export interface Booking {
    id: number;
    tour_package_id: number;
    package_category_id?: number;
    user_id?: number;

    // Customer Details
    first_name: string;
    last_name: string;
    contact_number: string;
    email: string;

    // Booking Details
    departure_date: string; // ISO date string, e.g., "2025-06-01"
    return_date: string; // ISO date string, e.g., "2025-06-01"
    pax_adult: number;
    pax_kids: number;
    notes?: string | null;
    pickup_address: string;

    is_confirmed: boolean;

    // Admin Status
    status: 'pending' | 'accepted' | 'declined' | 'past_due' | 'cancelled' | 'completed' | 'on_process';
    
    tour_package?: TourPackage;
    preferred_van?: PreferredVan;
    other_services?: OtherService[];
    package_category?: PackageCategory;
    payment: BookingPayment;
    booking_number: string;
    total_amount: number;
    is_final_total: boolean;
    preferred_preparation_id: number;
    
    preferred_preparation: PreferredPreparation;
    valid_id_paths?: string[]; 

    created_at: string;
    updated_at: string;
}
