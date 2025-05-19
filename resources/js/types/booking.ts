export interface Booking {
    id: number;
    tour_package_id: number;

    // Customer Details
    first_name: string;
    last_name: string;
    contact_number: string;
    email: string;

    // Booking Details
    departure_date: string; // ISO date string, e.g., "2025-06-01"
    return_date: string; // ISO date string, e.g., "2025-06-01"
    pax_adults: number;
    pax_kids: number;
    travel_insurance: boolean;
    notes?: string | null;

    // Payment Method
    payment_method: 'gcash' | 'paypal' | 'bank_deposit';

    is_confirmed: boolean;

    // Admin Status
    status: 'pending' | 'accepted' | 'declined';

    created_at: string;
    updated_at: string;
}
