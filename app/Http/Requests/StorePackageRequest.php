<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:70'],
            'subtitle' => ['nullable', 'string', 'max:50'],
            'overview' => ['nullable', 'string', 'max:262'],
            'location' => ['nullable', 'string', 'max:255'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id', 'required_if:package_type,normal'],
            'content' => ['required', 'string'],
            'duration' => ['nullable', 'string', 'max:255'],
            'available_from' => ['nullable', 'date', 'required_if:activeExpiry,true'],
            'available_until' => ['nullable', 'date', 'required_if:activeExpiry,true', 'after_or_equal:available_from'],
            'image_overview' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp'],
            'image_banner' => ['nullable', 'array'],
            'image_banner.*' => ['image', 'mimes:jpeg,png,jpg,gif,svg,webp'],
            'base_price' => ['required', 'numeric'],

            // ✅ Validate categories as array
            'categories' => ['nullable', 'array'],
            'categories.*.name' => ['required', 'string', 'max:70'],
            'categories.*.content' => ['required', 'string'],
            'categories.*.has_button' => ['nullable', 'boolean'],
            'categories.*.button_text' => ['nullable', 'string', 'max:20'],

            // ✅ Validate preferred_van as array
            'preferred_van_ids' => ['nullable', 'array'],
            'preferred_van_ids.*' => ['integer', 'exists:preferred_vans,id'],

            // ✅ Validate other_service_ids as array
            'other_service_ids' => ['nullable', 'array'],
            'other_service_ids.*' => ['integer', 'exists:other_service_ids,id'],

            'from' => ['nullable', 'string'],

            'package_type' => ['required', 'in:normal,event'],
            'event_type' => [
                'nullable',
                'in:limited_time,popular,seasonal,festival,exclusive,new_arrival,flash_sale',
                'required_if:package_type,event',
            ],
        ];

    }
}
