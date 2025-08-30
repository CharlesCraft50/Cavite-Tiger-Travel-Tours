<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingPaymentRequest extends FormRequest
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
            'booking_id' => ['nullable', 'integer', 'exists:bookings,id'],
            'payment_method' => ['required', 'string'],
            'reference_number' => ['required', 'string'],
            'payment_proof' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp'],
            'status' => ['nullable', 'in:pending,accepted,declined'],
        ];

    }
}