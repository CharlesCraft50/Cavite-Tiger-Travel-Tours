<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreBookingPaymentRequest;
use Inertia\Inertia;
use App\Traits\StoresImages;
use App\Models\Booking;
use App\Models\BookingPayment;
use Illuminate\Support\Facades\Auth;

class BookingPaymentController extends Controller
{
    use StoresImages;
    /**
     * Display a listing of the resource.
     */
    public function index(string $booking_id)
    {
        $user = Auth::user();
        $booking = Booking::with('payment')
                            ->findOrFail($booking_id);

        // Prevent duplicate payment
        $existingPayment = BookingPayment::where('booking_id', $booking_id)->first();
        $isDeclined = null;
        if ($existingPayment && !($existingPayment->status === 'declined')) {
            $isDeclined = $existingPayment->status === 'declined';
            return Inertia::render('error-page', [
                'title' => 'Payment Already Submitted',
                'description' => 'This booking already has a payment on file. If you believe this is an error, please contact support.',
                'redirectUrl' => route('bookings.show', $booking_id),
            ]);
        }

        if($booking->user_id) {
            if($user) {
                // Allow admin and driver to access all bookings
                if($user->isAdmin() || $user->isDriver()) {
                    // Admin and driver have full access - no restrictions
                } 
                // For regular users, only allow access to their own bookings
                elseif($user->id !== $booking->user_id) {
                    abort(404);
                }
            } else {
                // No authenticated user - deny access
                abort(404);
            }
        }

        if($booking->status == 'past_due') {
            abort(404);
        }
        
        if($booking->payment) {
            if($booking->payment->status == "pending") {
                return Inertia::render('success-page', [
                    'title' => '✅ Payment Submitted',
                    'description' => 'We’ve received your payment and it’s now being reviewed. You’ll get a confirmation soon. Thank you!',
                    'redirectUrl' => route('bookings.show', $booking->id),
                ]);
            }
        }

        return Inertia::render('book-now/payment', [
            'booking_id' => $booking->id,
            'booking_payment' => $isDeclined ? $booking->payment : null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingPaymentRequest $request)
    {
        $validated = $request->validated();

        $existingPayment = BookingPayment::where('booking_id', $validated['booking_id'])->first();

        // Store image if present
        if ($request->hasFile('payment_proof')) {
            $validated['payment_proof_path'] = asset('storage/' . $this->storeGetImage($request, 'payment_proof', 'payment_proofs'));
        }

        // Handle declined resubmission
        if ($existingPayment && $existingPayment->status === 'declined') {
            $existingPayment->payment_method = $validated['payment_method'];
            $existingPayment->reference_number = $validated['reference_number'];
            if (isset($validated['payment_proof_path'])) {
                $existingPayment->payment_proof_path = $validated['payment_proof_path'];
            }
            $existingPayment->status = 'pending'; // Force set back to pending
            $existingPayment->save();

            return Inertia::render('success-page', [
                'title' => 'Payment Resubmitted!',
                'description' => 'Your updated payment has been received. We will review and confirm your booking shortly.',
                'redirectUrl' => route('bookings.show', $existingPayment->booking_id),
            ]);
        }

        // Prevent duplicate submission
        if ($existingPayment) {
            return Inertia::render('error-page', [
                'title' => 'Payment Already Submitted',
                'description' => 'This booking already has a payment on file. If you believe this is an error, please contact support.',
                'redirectUrl' => route('bookings.show', $validated['booking_id']),
            ]);
        }

        // Create new payment
        $bookingPayment = BookingPayment::create($validated + ['status' => 'pending']);

        return Inertia::render('success-page', [
            'title' => 'Payment Submitted!',
            'description' => 'Your payment has been received. We will review and confirm your booking shortly.',
            'redirectUrl' => route('bookings.show', $bookingPayment->booking_id),
        ]);
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
