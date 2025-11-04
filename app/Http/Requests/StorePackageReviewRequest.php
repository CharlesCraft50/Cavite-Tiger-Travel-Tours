<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePackageReviewRequest extends FormRequest
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
            'tour_package_id' => [
                'nullable',
                'exists:tour_packages,id',
                'required_without:custom_trip_id',
            ],
            'custom_trip_id' => [
                'nullable',
                'exists:custom_trips,id',
                'required_without:tour_package_id',
            ],
            'rating' => [
                'required',
                'integer',
                'min:1',
                'max:5',
            ],
            'comment' => [
                'nullable',
                'string',
            ],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'rating.required' => 'You must give at least one star.',
            'tour_package_id.required_without' => 'A tour package or custom trip is required.',
            'custom_trip_id.required_without' => 'A custom trip or tour package is required.',
        ];
    }
}
