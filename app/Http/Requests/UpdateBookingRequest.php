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
            'departure_date' => ['nullable', 'date'],
            'return_date' => ['nullable', 'date', 'after_or_equal:departure_date'],
            'status' => ['sometimes', 'required', 'in:pending,on_process,accepted,declined,past_due,cancelled,completed'],
            'notes' => ['nullable', 'string'],
            'total_amount' => ['nullable', 'numeric'],
            'pax_adult' => ['nullable', 'numeric'],
            'pax_kids' => ['nullable', 'numeric'],
            'payment_status' => ['nullable', 'in:pending,on_process,accepted,declined'],
            'pickup_address' => ['sometimes', 'string', 'max:255'],
        ];
    }
}
