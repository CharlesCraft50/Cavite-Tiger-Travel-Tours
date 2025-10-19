
export interface CustomTripPayment {
  id: number;
  custom_trip_id: number;
  payment_method?: string | null;
  reference_number: string;
  payment_proof_path: string;
  status: string;
  created_at: string;
  updated_at: string;
}
