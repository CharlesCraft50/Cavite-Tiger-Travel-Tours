<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TourPackage;
use App\Models\PreferredVan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\StoreBookNowRequest;
use App\Models\Booking;
use App\Services\VanAvailabilityService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Mail\BookingCreated;
use Illuminate\Support\Facades\Mail;

class BookNowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Inertia::render('dashboard/bookings/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, $slug, $categorySlug = null) {
        $packages = TourPackage::where('slug', $slug)->firstOrFail();

        $packages->load([
            'categories' => function ($query) {
                $query->where('has_button', true);
            },
            'preferredVans', // ✅ Load only the selected preferred vans
            'otherServices',
        ]);

        // Find selected category by slug (from URL), fallback null if none
        $selectedCategoryId = null;
        if ($categorySlug) {
            $category = $packages->categories->firstWhere('slug', $categorySlug);
            $selectedCategoryId = $category ? $category->id : null;
        }

        return Inertia::render('book-now/create', [
            'packages' => $packages,
            'categories' => $packages->categories,
            'selectedCategoryId' => $selectedCategoryId,
            'preferredVans' => $packages->preferredVans,
            'otherServices' => $packages->otherServices,
        ]);
    }

    protected $availabilityService;

    public function __construct(VanAvailabilityService $availabilityService)
    {
        $this->availabilityService = $availabilityService;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookNowRequest $request)
    {
        $validated = $request->validated();

        $availability = $this->availabilityService->getAvailableDateRanges($validated['preferred_van_id']);

        if(empty($availability)) {
            return back()->withErrors(['preferred_van_id' => 'Van availability not found.']);
        }

        $from = Carbon::parse($validated['departure_date']);
        $until = Carbon::parse($validated['return_date']);

        if($from->lt($availability['available_from']) || $from->gt($availability['available_until'])) {
            return back()->withErrors(['departure_date' => 'Selected dates are outside van\'s availability range.']);
        }

        if(in_array($from->toDateString(), $availability['fully_booked_dates']) || 
            in_array($until->toDateString(), $availability['fully_booked_dates'])) {
                return back()->withErrors(['departure_date' => 'Selected van is fully booked for your chosen dates.']);
        }

        // Get package, category, van, other services
        $package = TourPackage::with(['categories', 'otherServices'])->findOrFail($validated['tour_package_id']);
        $van = PreferredVan::findOrFail($validated['preferred_van_id']);

        // Start with base price
        $totalAmount = $package->base_price;

        // Add custom category price if applicable
        if (!empty($validated['package_category_id'])) {
            $category = $package->categories->firstWhere('id', $validated['package_category_id']);
            if ($category && $category->use_custom_price && $category->custom_price !== null) {
                $totalAmount += $category->custom_price;
            }
        }

        $totalAmount += $van->additional_fee ?? 0;

        if ($request->has('other_services')) {
            foreach ($request->input('other_services') as $serviceId) {
                $service = $package->otherServices->firstWhere('id', $serviceId);
                if ($service) {
                    $totalAmount += $service->pivot->package_specific_price ?? ($service->price ?? 0);
                }
            }
        }

        $user = Auth::user();
        $userId = null;

        if($user) {
            $userId = $user->id;
        }

        $booking = Booking::create([
            ...$validated,
            'total_amount' => $totalAmount,
            'user_id' => $userId,
        ]);
        
        if ($request->has('other_services')) {
            $booking->otherServices()->sync($request->input('other_services'));
        }

        Mail::to($booking->email)->send(new BookingCreated($booking));

        return to_route('booking.payment', ['booking_id' => $booking->id]);
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
