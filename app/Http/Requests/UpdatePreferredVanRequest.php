<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePreferredVanRequest extends FormRequest
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
            'vans' => ['required', 'array'],
            'vans.*.id' => ['nullable', 'integer'],
            'vans.*.user_id' => ['nullable', 'integer'],
            'vans.*.name' => ['required', 'string'],
            'vans.*.image_url' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp'],
            'vans.*.additional_fee' => ['required', 'numeric'],
            'vans.*.pax_adult' => ['required', 'integer'],
            'vans.*.pax_kids' => ['required', 'integer'],
            'vans.*.action' => ['sometimes', 'string'],
            'vans.*.availabilities' => ['nullable', 'array'],
            'vans.*.availabilities.*.available_from' => ['nullable', 'date'],
            'vans.*.availabilities.*.available_until' => ['nullable', 'date'],
            'vans.*.availabilities.*.count' => ['nullable', 'integer'],
        ];

    }
}
