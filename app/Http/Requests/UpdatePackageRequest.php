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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:70'],
            'subtitle' => ['sometimes', 'nullable', 'string', 'max:50'],
            'overview' => ['sometimes', 'nullable', 'string', 'max:262'],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'city_id' => ['sometimes', 'integer', 'exists:cities,id'],
            'content' => ['sometimes', 'string'],
            'duration' => ['sometimes', 'nullable', 'string', 'max:10'],
            'available_from' => ['sometimes', 'nullable', 'date', 'required_if:activeExpiry,true'],
            'available_until' => ['sometimes', 'nullable', 'date', 'required_if:activeExpiry,true', 'after_or_equal:available_from'],
            'image_overview' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'image_banner' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:4096'],

            // ✅ Optional categories array
            'categories' => ['sometimes', 'nullable', 'array'],
            'categories.*.name' => ['required_with:categories', 'string', 'max:70'],
            'categories.*.content' => ['required_with:categories', 'string'],
            'categories.*.has_button' => ['sometimes', 'nullable', 'boolean'],
            'categories.*.button_text' => ['sometimes', 'nullable', 'string', 'max:20'],
        ];
    }
}
