import { PackageReview, PreferredVan, User } from '.';
import { CustomTripPayment } from './custom-trip-payment';

export interface CustomTrip {
  id: number;
  user_id: number | null;

  // Customer Details
  first_name: string;
  last_name: string;
  contact_number: string;
  email: string;

  // Trip Details
  date_of_trip: string; // corresponds to `date_of_trip` in migration
  pickup_time?: string | null;
  pickup_address: string;
  destination: string;

  // Van & Driver
  preferred_van_id?: number | null;
  driver_id?: number | null;

  // Booking
  is_confirmed: boolean;
  booking_number?: string | null;
  total_amount?: number;
  is_final_total: boolean;
  is_completed: boolean;

  // Admin Status
  status: string;
  pax_adult: number;
  pax_kids: number;
  // Notes / optional
  notes?: string;

  // Payment
  payment?: CustomTripPayment;

  trip_type?: string,
  costing_type?: string,
  duration?: string;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Optional relations (if loaded)
  user?: User;
  preferred_van?: PreferredVan;
  driver?: User;
  reviewByUser?: PackageReview;
}