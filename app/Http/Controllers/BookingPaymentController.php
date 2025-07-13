<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreBookingPaymentRequest;
use Inertia\Inertia;
use App\Traits\StoresImages;
use App\Models\Booking;
use App\Models\BookingPayment;

class BookingPaymentController extends Controller
{
    use StoresImages;
    /**
     * Display a listing of the resource.
     */
    public function index(string $booking_id)
    {
        $booking = Booking::findOrFail($booking_id);
        

        return Inertia::render('book-now/payment', [
            'booking_id' => $booking->id,
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
        //

        $validated = $request->validated();

        if($request->hasFile('payment_proof')) {
            $validated['payment_proof_path'] = asset('storage/' . $this->storeGetImage($request, 'payment_proof', 'payment_proofs'));
        }

        BookingPayment::create($validated);

        return Inertia::render('success-page', [
            'title' => 'Payment Submitted!',
            'description' => 'Your payment has been received. We will review and confirm your booking shortly.',
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
