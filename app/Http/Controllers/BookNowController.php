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

        // Get package, category, van, other services
        $package = TourPackage::with(['categories', 'otherServices'])->findOrFail($validated['tour_package_id']);

        $availability = null;
        $van = null;

        // Only check van availability if user selected a van
        if (! empty($validated['preferred_van_id'])) {
            $availability = $this->availabilityService->getAvailableDateRanges($validated['preferred_van_id']);
            if (empty($availability)) {
                return back()->withErrors(['preferred_van_id' => 'Van availability not found.']);
            }
        }

        // Handle file uploads for valid IDs
        $validIdPaths = [];
        if ($request->hasFile('valid_id')) {
            foreach ($request->file('valid_id') as $index => $file) {
                $filename = 'image_'.($index + 1).'.'.$file->getClientOriginalExtension();
                $path = $file->storeAs($request->user()->id.'/valid_id', $filename, 'public');
                $validIdPaths[] = asset('storage/'.$path);
            }
        }

        if (! empty($validIdPaths)) {
            $validated['valid_id_paths'] = $validIdPaths;
        }

        // Compute dates based on duration
        $from = Carbon::parse($validated['departure_date']);

        if (preg_match('/(\d+)\s*D(?:ays?)?\s*(\d+)\s*N(?:ights?)?/i', $package->duration, $matches)) {
            $days = (int) $matches[1];
            $nights = (int) $matches[2];
        } else {
            $days = (int) filter_var($package->duration, FILTER_SANITIZE_NUMBER_INT);
            $nights = $days > 0 ? $days - 1 : 0;
        }

        $until = $from->copy()->addDays($nights);

        // Only check date availability if van is selected
        if (! empty($validated['preferred_van_id']) && $availability) {
            if (in_array($from->toDateString(), $availability['fully_booked_dates']) ||
                in_array($until->toDateString(), $availability['fully_booked_dates'])) {
                return back()->withErrors(['departure_date' => 'Selected van is fully booked for your chosen dates.']);
            }
        }

        // Per-person pricing
        $adults = (int) ($validated['pax_adult'] ?? 1);
        $kids = (int) ($validated['pax_kids'] ?? 0);
        $people = $adults + $kids;
        $totalAmount = $people * $package->base_price;

        // Add category price if needed
        if (! empty($validated['package_category_id'])) {
            $category = $package->categories->firstWhere('id', $validated['package_category_id']);
            if ($category && $category->use_custom_price && $category->custom_price !== null) {
                $totalAmount += $category->custom_price;
            }
        }

        // Only add van fee if one was chosen
        if (! empty($validated['preferred_van_id'])) {
            $van = PreferredVan::findOrFail($validated['preferred_van_id']);
            $totalAmount += $van->additional_fee ?? 0;
        }

        // Add other services
        if ($request->has('other_services')) {
            foreach ($request->input('other_services') as $serviceId) {
                $service = $package->otherServices->firstWhere('id', $serviceId);
                if ($service) {
                    $totalAmount += $service->pivot->package_specific_price ?? ($service->price ?? 0);
                }
            }
        }

        // Save booking
        $userId = Auth::id();
        $booking = Booking::create([
            ...$validated,
            'return_date' => $until->toDateString(),
            'total_amount' => $totalAmount,
            'driver_id' => $validated['driver_id'] ?? null,
            'user_id' => $userId,
        ]);

        if ($request->has('other_services')) {
            $booking->otherServices()->sync($request->input('other_services'));
        }

        // Send confirmation
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
