<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomTripPaymentRequest;
use App\Models\CustomTrip;
use App\Models\CustomTripPayment;
use App\Traits\StoresImages;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomTripPaymentController extends Controller
{
    use StoresImages;

    /**
     * Display the payment form for a Custom Trip
     */
    public function index(int $trip_id)
    {
        $user = Auth::user();
        $trip = CustomTrip::with(['payment'])->findOrFail($trip_id);

        // Prevent duplicate payment
        $existingPayment = CustomTripPayment::where('custom_trip_id', $trip_id)->first();
        $isDeclined = null;
        if ($existingPayment && $existingPayment->status !== 'declined') {
            $isDeclined = $existingPayment->status === 'declined';

            return Inertia::render('error-page', [
                'title' => 'Payment Already Submitted',
                'description' => 'This trip already has a payment on file. If you believe this is an error, please contact support.',
                'redirectUrl' => route('customTrips.show', $trip_id),
            ]);
        }

        // Regular user can only access their own trips
        if (! $user->isAdmin() && ! $user->isDriver() && $user->id !== $trip->user_id) {
            abort(404);
        }

        if ($trip->status === 'past_due') {
            abort(404);
        }

        if ($trip->payment && $trip->payment->status === 'pending') {
            return Inertia::render('success-page', [
                'title' => 'Payment Submitted',
                'description' => 'We’ve received your payment and it’s now being reviewed. You’ll get a confirmation soon. Thank you!',
                'redirectUrl' => route('customTrips.show', $trip->id),
            ]);
        }

        return Inertia::render('book-now/custom-trip-payment', [
            'trip_id' => $trip->id,
            'trip' => $trip,
            'trip_payment' => $isDeclined ? $trip->payment : null,
        ]);
    }

    /**
     * Store a newly created payment for a Custom Trip
     */
    public function store(StoreCustomTripPaymentRequest $request)
    {
        $validated = $request->validated();

        $existingPayment = CustomTripPayment::where('custom_trip_id', $validated['custom_trip_id'])->first();

        // Store uploaded image
        if ($request->hasFile('payment_proof')) {
            $validated['payment_proof_path'] = asset('storage/'.$this->storeGetImage($request, 'payment_proof', 'custom_trip_payments'));
        }

        // Handle declined resubmission
        if ($existingPayment && $existingPayment->status === 'declined') {
            $existingPayment->payment_method = $validated['payment_method'];
            $existingPayment->reference_number = $validated['reference_number'] ?? '';
            if (isset($validated['payment_proof_path'])) {
                $existingPayment->payment_proof_path = $validated['payment_proof_path'];
            }
            $existingPayment->status = 'pending'; // Force set back to pending
            $existingPayment->save();

            return Inertia::render('success-page', [
                'title' => 'Payment Resubmitted!',
                'description' => 'Your updated payment has been received. We will review and confirm your trip shortly.',
                'redirectUrl' => route('customTrips.show', $existingPayment->custom_trip_id),
            ]);
        }

        // Prevent duplicate submission
        if ($existingPayment) {
            return Inertia::render('error-page', [
                'title' => 'Payment Already Submitted',
                'description' => 'This trip already has a payment on file. If you believe this is an error, please contact support.',
                'redirectUrl' => route('customTrips.show', $validated['custom_trip_id']),
            ]);
        }

        // Create new payment
        $tripPayment = CustomTripPayment::create($validated + ['status' => 'pending']);

        return Inertia::render('success-page', [
            'title' => 'Payment Submitted!',
            'description' => 'Your payment has been received. We will review and confirm your trip shortly.',
            'redirectUrl' => route('customTrips.show', $tripPayment->custom_trip_id),
        ]);
    }
}
