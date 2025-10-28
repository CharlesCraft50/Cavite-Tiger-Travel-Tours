<?php

namespace App\Http\Requests;

use App\Models\PreferredPreparation;
use App\Models\PreferredVan;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookNowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Set to false if only certain users can use it
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

    public function rules(): array
    {
        $requiresId = false;
        if ($this->preferred_preparation_id) {
            $prep = PreferredPreparation::find($this->preferred_preparation_id);
            $requiresId = $prep && $prep->requires_valid_id;
        }

        return [
            'tour_package_id' => ['required', 'exists:tour_packages,id'],
            'package_category_id' => ['nullable', 'integer', 'exists:package_categories,id'],
            'preferred_van_id' => ['nullable', 'integer', 'exists:preferred_vans,id'],
            'preferred_preparation_id' => ['required', 'integer', 'exists:preferred_preparations,id'],

            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'contact_number' => ['required', 'string'],
            'email' => ['required', 'email'],

            'departure_date' => ['required', 'date'],
            'pax_adult' => [
                'required',
                'integer',
                'min:0',
                'max:'.($this->van_pax_adult_max ?? 20),
            ],
            'pax_kids' => [
                'nullable',
                'integer',
                'min:0',
                'max:'.($this->van_pax_kids_max ?? 20),
            ],
            'notes' => ['nullable', 'string'],
            'other_services' => ['array'],
            'other_services.*' => ['exists:other_services,id'],
            'driver_id' => ['nullable', 'integer', 'exists:users,id'],
            'pickup_address' => ['required', 'string', 'max:255'],

            'valid_id' => [
                $requiresId ? 'required' : 'nullable',
                'array',
            ],
            'valid_id.*' => [
                'image',
                'mimes:jpg,jpeg,png',
                'max:2048',
            ],
        ];
    }
}
