export interface BookingPayment {
    id: number;
    booking_id: number;
    payment_method: string;
    reference_number: string;
    payment_proof_path: string;
    status: string;

    created_at: string;
    updated_at: string;
}
