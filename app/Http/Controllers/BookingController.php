<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TourPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, $slug, $categorySlug = null) {
        $packages = TourPackage::where('slug', $slug)->firstOrFail();

        $packages->load(['categories' => function ($query) {
            $query->where('has_button', true);
        }]);

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
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request)
    {
        $validated = $request->validated();

        Booking::create($validated);

        return Inertia::render('success-page', [
            'title' => 'Booking Confirmed!',
            'description' => 'Thank you for booking. Please check your email for confirmation and details.',
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
