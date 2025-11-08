<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookNowRequest;
use App\Mail\BookingCreated;
use App\Models\Booking;
use App\Models\PreferredPreparation;
use App\Models\PreferredVan;
use App\Models\TourPackage;
use App\Models\User;
use App\Models\VanCategory;
use App\Services\VanAvailabilityService;
use App\Traits\StoresImages;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class BookNowController extends Controller
{
    use StoresImages;

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
    public function create(Request $request, $slug, $categorySlug = null)
    {
        $packages = TourPackage::where('slug', $slug)->firstOrFail();

        $packages->load([
            'categories' => function ($query) {
                $query->where('has_button', true);
            },
            'preferredVans' => function ($query) {
                // $query->with(['availabilities', 'driver', 'category']);
                $query->with(['driver', 'category']);
            },
            'otherServices',
        ]);

        // Find selected category by slug (from URL), fallback null if none
        $selectedCategoryId = null;
        if ($categorySlug) {
            $category = $packages->categories->firstWhere('slug', $categorySlug);
            $selectedCategoryId = $category ? $category->id : null;
        }

        $drivers = User::where('role', 'driver')->get();
        $vanCategories = VanCategory::all();
        $preferredPreparations = PreferredPreparation::all();

        return Inertia::render('book-now/create', [
            'packages' => $packages,
            'drivers' => $drivers,
            'categories' => $packages->categories,
            'selectedCategoryId' => $selectedCategoryId,
            'preferredVans' => $packages->preferredVans,
            'otherServices' => $packages->otherServices,
            'vanCategories' => $vanCategories,
            'preferredPreparations' => $preferredPreparations,
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

        // Get the tour package with related data
        $package = TourPackage::with(['categories', 'otherServices'])->findOrFail($validated['tour_package_id']);

        $availability = null;
        $van = null;
        $from = null;
        $until = null;

        // Check van availability only if selected
        if (! empty($validated['preferred_van_id'])) {
            $availability = $this->availabilityService->getAvailableDateRanges($validated['preferred_van_id']);
            if (empty($availability)) {
                return back()->withErrors(['preferred_van_id' => 'Van availability not found.']);
            }
        }

        // Handle valid ID uploads
        $validIdPaths = [];
        if ($request->hasFile('valid_id')) {
            foreach ($request->file('valid_id') as $index => $file) {
                $filename = 'image_'.($index + 1).'.'.$file->getClientOriginalExtension();
                $path = $file->storeAs($request->user()->id.'/valid_id', $filename, 'public');
                $validIdPaths[] = asset('storage/'.$path);
            }
            $validated['valid_id_paths'] = $validIdPaths;
        }

        // Parse departure date
        if (! empty($validated['departure_date'])) {
            $from = Carbon::parse($validated['departure_date']);
        }

        // Determine duration days and nights
        $days = 1;
        $nights = 0;
        if ($package->duration) {
            if (preg_match('/(\d+)\s*D(?:ays?)?\s*(\d+)\s*N(?:ights?)?/i', $package->duration, $matches)) {
                $days = (int) $matches[1];
                $nights = (int) $matches[2];
            } else {
                $days = (int) filter_var($package->duration, FILTER_SANITIZE_NUMBER_INT);
                $nights = max(0, $days - 1);
            }
        }

        // Compute until date if from exists
        if ($from) {
            $until = $from->copy()->addDays($nights);

            // Check if selected van is available for these dates
            if (! empty($validated['preferred_van_id']) && $availability) {
                $fullyBooked = collect($availability['fully_booked_dates'] ?? []);
                if ($fullyBooked->contains($from->toDateString()) || $fullyBooked->contains($until->toDateString())) {
                    return back()->withErrors(['departure_date' => 'Selected van is fully booked for your chosen dates.']);
                }
            }
        }

        // Calculate total amount
        $adults = (int) ($validated['pax_adult'] ?? 1);
        $kids = (int) ($validated['pax_kids'] ?? 0);
        $people = $adults + $kids;
        $totalAmount = $people * $package->base_price;

        // Add category price
        if (! empty($validated['package_category_id'])) {
            $category = $package->categories->firstWhere('id', $validated['package_category_id']);
            if ($category && $category->use_custom_price && $category->custom_price !== null) {
                $totalAmount += $category->custom_price;
            }
        }

        // Add van fee if selected
        if (! empty($validated['preferred_van_id'])) {
            $van = PreferredVan::find($validated['preferred_van_id']);
            if ($van) {
                $totalAmount += $van->additional_fee ?? 0;
            }
        }

        // Add other service prices
        if ($request->filled('other_services')) {
            foreach ($request->input('other_services') as $serviceId) {
                $service = $package->otherServices->firstWhere('id', $serviceId);
                if ($service) {
                    $totalAmount += $service->pivot->package_specific_price ?? ($service->price ?? 0);
                }
            }
        }

        // Only check preparation if provided
        $preferredPreparation = null;
        if (! empty($validated['preferred_preparation_id'])) {
            $preferredPreparation = PreferredPreparation::find($validated['preferred_preparation_id']);
            if ($preferredPreparation && $preferredPreparation->name === 'land') {
                $validated['is_final_total'] = true;
            }
        }

        // Create the booking
        $userId = Auth::id();
        $booking = Booking::create([
            ...$validated,
            'return_date' => $until ? $until->toDateString() : null,
            'total_amount' => $totalAmount,
            'driver_id' => $validated['driver_id'] ?? null,
            'user_id' => $userId,
        ]);

        // Sync other services
        if ($request->filled('other_services')) {
            $booking->otherServices()->sync($request->input('other_services'));
        }

        // Send confirmation email (safe)
        try {
            if ($preferredPreparation) {
                Mail::to($booking->email)->send(new BookingCreated($booking, $preferredPreparation));
            }
        } catch (\Exception $e) {
            \Log::error('Booking email failed: '.$e->getMessage());

            return Inertia::render('success-page', [
                'title' => 'Booking Submitted!',
                'description' => 'Your booking has been saved, but we couldn’t send the confirmation email. Please contact support for details.',
                'redirectUrl' => route('bookings.show', $booking->id),
            ]);
        }

        // Handle post-booking redirects
        if ($preferredPreparation && $preferredPreparation->name === 'all_in') {
            return Inertia::render('success-page', [
                'title' => 'Booking Submitted!',
                'description' => 'Await admin approval and final amount before payment.',
                'redirectUrl' => route('bookings.show', $booking->id),
            ]);
        }

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
