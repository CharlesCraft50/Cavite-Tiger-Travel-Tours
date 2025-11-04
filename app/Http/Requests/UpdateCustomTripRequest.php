<?php

namespace App\Http\Requests;

use App\Models\PreferredVan;
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

    public function prepareForValidation()
    {
        $van = PreferredVan::find($this->preferred_van_id);

        if ($van) {
            $this->merge([
                'van_pax_adult_max' => $van->pax_adult,
                'van_pax_kids_max' => $van->pax_kids,
            ]);
        }
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
            'pickup_address' => ['sometimes', 'string', 'max:255'],
            'destination' => ['sometimes', 'string', 'max:255'],

            'trip_type' => ['required', 'in:single_trip,round_trip'],
            'costing_type' => ['required', 'in:all_in,all_out'],
            'duration' => ['nullable', 'string', 'max:255', 'required_if:trip_type,round_trip'],

            'preferred_van_id' => ['nullable', 'exists:preferred_vans,id'],
            'driver_id' => ['nullable', 'exists:users,id'],

            'is_confirmed' => ['sometimes', 'boolean'],
            'total_amount' => ['nullable', 'numeric', 'min:0'],
            'is_final_total' => ['sometimes', 'boolean'],
            'status' => ['sometimes', 'in:pending,on_process,accepted,declined,past_due,cancelled,completed'],
            'payment_status' => ['nullable', 'in:pending,on_process,accepted,declined'],

            'pax_adult' => [
                'nullable',
                'integer',
                'min:0',
                'max:'.($this->van_pax_adult_max ?? 1000),
            ],
            'pax_kids' => [
                'nullable',
                'integer',
                'min:0',
                'max:'.($this->van_pax_kids_max ?? 1000),
            ],

            'notes' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'date_of_trip.after_or_equal' => 'The date of trip must be today or a future date.',
            'trip_type.in' => 'The selected trip type is invalid.',
            'costing_type.in' => 'The selected costing type is invalid.',
        ];
    }
}
