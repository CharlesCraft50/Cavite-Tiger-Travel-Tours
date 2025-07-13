<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOtherServiceRequest extends FormRequest
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
            'services' => ['required', 'array'],
            'services.*.id' => ['nullable', 'integer'],
            'services.*.name' => ['required', 'string'],
            'services.*.image_url' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'services.*.description' => ['nullable', 'string', 'max:130'],
            'services.*.price' => ['required', 'numeric'],
            'services.*.action' => ['sometimes', 'string'],
        ];

    }
}
