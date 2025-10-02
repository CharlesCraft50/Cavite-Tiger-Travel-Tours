<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateBookingRequest;
use App\Mail\BookingUpdated;
use App\Models\Booking;
use App\Models\Notification;
use App\Models\OtherService;
use App\Models\PreferredVan;
use App\Models\TourPackage;
use App\Models\VanCategory;
use App\Services\VanAvailabilityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

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
            $bookings = Booking::with(['tourPackage', 'preferredVan', 'packageCategory', 'payment'])
                ->orderByDesc('created_at')
                ->get();
        } elseif ($user->isDriver()) {
            $bookings = Booking::with(['tourPackage', 'preferredVan', 'packageCategory', 'payment'])
                ->where('driver_id', $user->id)
                ->orderByDesc('created_at')
                ->get();
        } else {
            $bookings = Booking::with(['tourPackage', 'preferredVan', 'packageCategory', 'payment'])
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
    public function create(Request $request, $slug, $categorySlug = null) {}

    protected $availabilityService;

    public function __construct(VanAvailabilityService $availabilityService)
    {
        $this->availabilityService = $availabilityService;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request) {}

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
        $vans = PreferredVan::with(['availabilities', 'driver', 'category'])->get();

        $packages->load([
            'categories',
            'preferredVans.availabilities',
            'otherServices' => function ($query) {
                $query->withPivot(['package_specific_price', 'is_recommended', 'sort_order']);
            },
        ]);

        $vanCategories = VanCategory::all();

        return Inertia::render('dashboard/bookings/show', [
            'booking' => $booking,
            'isAdmin' => $user->isAdmin(),
            'otherServices' => $otherServices,
            'packages' => $packages,
            'vans' => $vans,
            'vanCategories' => $vanCategories,
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

        if ($request->has('other_services')) {
            $booking->otherServices()->sync($request->input('other_services'));
        }

        $fieldsToUpdate = collect(['preferred_van_id', 'departure_date', 'return_date', 'status', 'notes', 'pickup_address', 'total_amount', 'pax_adult', 'pax_kids'])
            ->filter(fn ($field) => $request->has($field))
            ->mapWithKeys(fn ($field) => [$field => $request->input($field)])
            ->toArray();

        $oldStatus = $booking->status;

        $booking->update($fieldsToUpdate);

        if ($request->status != $oldStatus) {
            if ($booking->user) {
                $statusMessages = [
                    'pending' => 'is now pending confirmation.',
                    'accepted' => 'has been accepted! 🎉',
                    'declined' => 'was unfortunately declined.',
                ];

                $message = "Your booking #{$booking->booking_number} "
                    .($statusMessages[$request->status] ?? 'status was updated.');
                Notification::create([
                    'user_id' => $booking->user->id,
                    'type' => 'Booking'.ucwords($request->status),
                    'data' => json_encode([
                        'message' => $message,
                        'booking_number' => $booking->booking_number,
                        'booking_id' => $booking->id,
                        'tour_package_id' => $booking->tour_package_id,
                        'image_overview' => $booking->tourPackage?->image_overview,
                        'slug' => $booking->tourPackage?->slug,
                        'title' => $booking->tourPackage?->title,
                        'departure_date' => $booking->departure_date,
                        'return_date' => $booking->return_date,
                        'total_amount' => $booking->total_amount,
                    ]),
                    'read_at' => null,
                ]);
            }
        }

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
            'bookings' => Booking::with('payment')->get(),
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
