<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Set to false if only certain users can use it
    }

    public function rules(): array
    {
        return [
            'tour_package_id' => ['required', 'exists:tour_packages,id'],
            'package_category_id' => ['nullable', 'integer', 'exists:package_categories,id'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'contact_number' => ['required', 'string'],
            'email' => ['required', 'email'],
            'departure_date' => ['required', 'date'],
            'return_date' => ['required', 'date'],
            'pax_adult' => ['required', 'integer', 'min:0'],
            'pax_kids' => ['required', 'integer', 'min:0'],
            'travel_insurance' => ['required', 'boolean'],
            'comments' => ['nullable', 'string'],
        ];
    }
}
