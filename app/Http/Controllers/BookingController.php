<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TourPackage;
use App\Models\PreferredVan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\OtherService;
use App\Services\VanAvailabilityService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UpdateBookingRequest;
use App\Mail\BookingUpdated;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $user = Auth::user();

        $bookings = null;

        if ($user->isAdmin()) {
            $bookings = Booking::with(['tourPackage', 'preferredVan', 'packageCategory'])
                        ->orderByDesc('created_at')
                        ->get();
        } else if ($user->isDriver()) {
            $bookings = Booking::with(['tourPackage', 'preferredVan', 'packageCategory'])
                        ->where('driver_id', $user->id)
                        ->orderByDesc('created_at')
                        ->get();
        } else {
            $bookings = Booking::with(['tourPackage', 'preferredVan', 'packageCategory'])
                        ->where('user_id', $user->id)
                        ->orderByDesc('created_at')
                        ->get();
        }

        return Inertia::render('dashboard/bookings/index', [
            'userBookings' => $bookings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, $slug, $categorySlug = null) {
        
    }

    protected $availabilityService;

    public function __construct(VanAvailabilityService $availabilityService)
    {
        $this->availabilityService = $availabilityService;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request)
    {
        
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $user = Auth::user();

        $otherServices = OtherService::all();

        $booking = Booking::with(['tourPackage', 'preferredVan', 'otherServices', 'payment', 'packageCategory'])
                        ->findOrFail($id);

        $packages = TourPackage::findOrFail($booking->tour_package_id);
        $vans = PreferredVan::all();
        $packages->load([
            'categories', 
            'preferredVans.availabilities', 
            'otherServices' => function ($query) {
                $query->withPivot(['package_specific_price', 'is_recommended', 'sort_order']);
            }
        ]);

        return Inertia::render('dashboard/bookings/show', [
            'booking' => $booking,
            'isAdmin' => $user->isAdmin(),
            'otherServices' => $otherServices,
            'packages' => $packages,
            'vans' => $vans,
        ]);
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
    public function update(UpdateBookingRequest $request, string $id)
    {
        //
        $validated = $request->validated();

        $booking = Booking::findOrFail($id);

        if ($request->has('payment_status') && $booking->payment) {
            $booking->payment->status = $request->input('payment_status');
            $booking->payment->save();
        }

        if($request->has('other_services')) {
            $booking->otherServices()->sync($request->input('other_services'));
        }

        $fieldsToUpdate = collect(['preferred_van_id', 'departure_date', 'return_date', 'status', 'notes', 'total_amount'])
            ->filter(fn($field) => $request->filled($field))
            ->mapWithKeys(fn($field) => [$field => $request->input($field)])
            ->toArray();

        $booking->update($fieldsToUpdate);

        Mail::to($booking->email)->send(new BookingUpdated($booking));

        return redirect()->back()->with('success', 'Booking updated and email sent.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function analytics()
    {
        return Inertia::render('dashboard/analytics/index', [
            'bookings' => Booking::with('payment')->get()
        ]);
    }

    public function cancel(string $id)
    {
        $booking = Booking::findOrFail($id);

        // Optional: Only allow cancel if not already cancelled
        if ($booking->status === 'cancelled') {
            return redirect()->back()->with('info', 'Booking is already cancelled.');
        }

        $booking->update([
            'status' => 'cancelled',
        ]);

        return redirect()->back()->with('success', 'Booking has been cancelled.');
    }
}
