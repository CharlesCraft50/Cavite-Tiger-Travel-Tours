<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Set to false if only certain users can use it
    }

    public function rules(): array
    {
        return [
            'preferred_van_id' => ['nullable', 'exists:preferred_vans,id'],
            'driver_id' => ['nullable', 'integer', 'exists:users,id'],
            'departure_date' => ['nullable', 'date'],
            'return_date' => ['nullable', 'date', 'after_or_equal:departure_date'],
            'status' => ['sometimes', 'nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'total_amount' => ['nullable', 'numeric', 'min:0'],
            'is_final_total' => ['sometimes', 'boolean'],
            'pax_adult' => ['nullable', 'numeric'],
            'pax_kids' => ['nullable', 'numeric'],
            'payment_status' => ['nullable', 'string'],
            'airport_transfer_type' => ['nullable', 'in:going_airport,going_home,back_to_back', 'required_with:preferred_van_id'],
            'preferred_days' => ['nullable', 'integer'],
            'pickup_address' => ['sometimes', 'string', 'max:255'],
        ];
    }
}
