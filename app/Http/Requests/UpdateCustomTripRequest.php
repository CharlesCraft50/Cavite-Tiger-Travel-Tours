<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomTripRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

        return auth()->check();
    }

    /**
     * Validation rules for updating a custom trip
     */
    public function rules(): array
    {
        return [
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'contact_number' => ['sometimes', 'string', 'max:20'],
            'email' => ['sometimes', 'email', 'max:255'],

            'date_of_trip' => ['sometimes', 'date', 'after_or_equal:today'],
            'pickup_time' => ['nullable', 'date_format:H:i'],
            'dropoff_time' => ['nullable', 'date_format:H:i', 'after_or_equal:pickup_time'],
            'pickup_address' => ['sometimes', 'string', 'max:255'],
            'destination' => ['sometimes', 'string', 'max:255'],

            'preferred_van_id' => ['nullable', 'exists:preferred_vans,id'],
            'driver_id' => ['nullable', 'exists:users,id'],

            'is_confirmed' => ['sometimes', 'boolean'],
            'total_amount' => ['nullable', 'numeric', 'min:0'],
            'status' => ['sometimes', 'in:pending,on_process,accepted,declined,past_due,cancelled,completed'],
            'payment_status' => ['nullable', 'in:pending,on_process,accepted,declined'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'date_of_trip.after_or_equal' => 'The date of trip must be today or a future date.',
            'dropoff_time.after_or_equal' => 'Drop-off time must be after or equal to pick-up time.',
        ];
    }
}
