<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation(): void
    {
        // Only keep image fields if they are uploaded files
        if (!$this->hasFile('image_overview')) {
            $this->request->remove('image_overview');
        }

        if (!$this->hasFile('image_banner')) {
            $this->request->remove('image_banner');
        }
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
            'city_id' => ['required', 'integer', 'exists:cities,id'],
            'content' => ['required', 'string'],
            'duration' => ['nullable', 'string', 'max:10'],
            'available_from' => ['nullable', 'date', 'required_if:activeExpiry,true'],
            'available_until' => ['nullable', 'date', 'required_if:activeExpiry,true', 'after_or_equal:available_from'],
            'image_overview' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'image_banner' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:4096'],
            'base_price' => ['nullable', 'required', 'integer'],

            // ✅ Validate categories as array
            'categories' => ['nullable', 'array'],
            'categories.*.name' => ['required', 'string', 'max:70'],
            'categories.*.content' => ['required', 'string'],
            'categories.*.has_button' => ['nullable', 'boolean'],
            'categories.*.button_text' => ['nullable', 'string', 'max:20'],
            'categories.*.use_custom_price' => ['nullable', 'boolean'],
            'categories.*.custom_price' => ['nullable', 'integer'],

            // ✅ Validate preferred_van as array
            'preferred_van_ids' => ['nullable', 'array'],
            'preferred_van_ids.*' => ['integer', 'exists:preferred_vans,id'],

            // ✅ Validate other_service_ids as array
            'other_service_ids' => ['nullable', 'array'],
            'other_service_ids.*' => ['integer', 'exists:other_service_ids,id'],
        ];

    }
}
