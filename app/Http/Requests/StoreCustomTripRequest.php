<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomTripRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow all authenticated users to submit a custom trip
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Customer Details
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'contact_number' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255'],

            // Trip Details
            'date_of_trip' => ['required', 'date', 'after_or_equal:today'],
            'pickup_time' => ['nullable', 'date_format:H:i'],
            'dropoff_time' => ['nullable', 'date_format:H:i', 'after_or_equal:pickup_time'],
            'pickup_address' => ['required', 'string', 'max:255'],
            'destination' => ['required', 'string', 'max:255'],

            // Van & Driver
            'preferred_van_id' => ['nullable', 'exists:preferred_vans,id'],
            'driver_id' => ['nullable', 'exists:users,id'],

            // Booking (optional, handled by admin)
            'is_confirmed' => ['sometimes', 'boolean'],
            'total_amount' => ['nullable', 'numeric', 'min:0'],

            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * Customize validation messages (optional)
     */
    public function messages(): array
    {
        return [
            'date_of_trip.after_or_equal' => 'The date of trip must be today or a future date.',
            'dropoff_time.after_or_equal' => 'Drop-off time must be after or equal to pick-up time.',
        ];
    }
}
