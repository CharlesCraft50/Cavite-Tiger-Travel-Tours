<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Country;
use App\Models\CustomTrip;
use App\Models\PreferredVan;
use App\Models\TourPackage;
use App\Models\User;
use App\Models\VanCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $bookings = null;
        $customTrips = null;

        if ($user->isAdmin() || $user->isStaff()) {
            $bookings = Booking::with(['tourPackage', 'preferredVan', 'packageCategory', 'payment'])
                ->orderByDesc('created_at')
                ->get();
            $customTrips = CustomTrip::with(['preferredVan', 'payment'])
                ->orderByDesc('created_at')
                ->get();
        } elseif ($user->isDriver()) {
            $bookings = Booking::with(['tourPackage', 'preferredVan', 'packageCategory', 'payment'])
                ->where('driver_id', $user->id)
                ->orderByDesc('created_at')
                ->get();
            $customTrips = CustomTrip::with(['preferredVan', 'payment'])
                ->where('driver_id', $user->id)
                ->orderByDesc('created_at')
                ->get();
        } else {
            $bookings = Booking::with(['tourPackage', 'preferredVan', 'packageCategory', 'payment'])
                ->where('user_id', $user->id)
                ->orderByDesc('created_at')
                ->get();
            $customTrips = CustomTrip::with(['preferredVan', 'payment'])
                ->where('user_id', $user->id)
                ->orderByDesc('created_at')
                ->get();
        }

        $bookingCount = $bookings->count();

        return Inertia::render('dashboard', [
            'bookingCount' => $bookingCount,
            'userBookings' => $bookings,
            'userCustomTrips' => $customTrips,
        ]);
    }

    public function customTrip()
    {
        $user = Auth::user();

        $bookings = null;

        if ($user->isAdmin()) {
            $bookings = Booking::with(['tourPackage', 'preferredVan', 'packageCategory'])
                ->orderByDesc('created_at')
                ->get();
        } elseif ($user->isDriver()) {
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

        $bookingCount = $bookings->count();

        $preferredVans = PreferredVan::with(['availabilities', 'category'])->get();
        $vanCategories = VanCategory::all();
        $drivers = User::where('role', 'driver')->get();

        return Inertia::render('dashboard/custom-trip', [
            'bookingCount' => $bookingCount,
            'userBookings' => $bookings,
            'preferredVans' => $preferredVans,
            'drivers' => $drivers,
            'vanCategories' => $vanCategories,
        ]);
    }

    public function localTrip(Request $request)
    {
        $selectedCountryName = 'Philippines';
        $selectedCountry = Country::where('name', $selectedCountryName)->first();
        $cities = $selectedCountry ? $selectedCountry->cities : collect();

        $baseQuery = TourPackage::query();

        if ($request->has('city_id')) {
            $baseQuery->where('city_id', $request->city_id);
        }

        $mainQuery = (clone $baseQuery);

        $packages = $mainQuery->get();

        $packages->load([
            'categories',
            'preferredVans.availabilities',
            'wishlist',
            'otherServices' => function ($query) {
                $query->withPivot(['package_specific_price', 'is_recommended', 'sort_order']);
            },
            'reviews',
        ]);

        foreach ($packages as $package) {
            $package->reviews_paginated = $package->reviews()
                ->with('user')
                ->latest()
                ->paginate(5);
        }

        return Inertia::render('dashboard/local-trip', [
            'packages' => $packages,
            'cities' => $cities,
            'countries' => Country::all(),
            'selectedCountry' => $selectedCountry,
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
    public function store(Request $request)
    {
        //
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
