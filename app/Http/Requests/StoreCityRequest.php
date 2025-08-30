<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCityRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', 'unique:cities,name'],
            'overview' => ['sometimes', 'string'],
            'image_url' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp'],
            'country_id' => ['sometimes', 'exists:countries,id'],
        ];

    }

    public function messages()
    {
        return [
            'name.unique' => 'This city name already exists.',
        ];
    }
}
