<?php

namespace App\Http\Controllers;

use App\Models\Booking;
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

        return Inertia::render('dashboard', [
            'bookingCount' => $bookingCount,
            'userBookings' => $bookings,
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

        return Inertia::render('dashboard/custom-trip', [
            'bookingCount' => $bookingCount,
            'userBookings' => $bookings,
        ]);
    }

    public function localTrip()
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

        return Inertia::render('dashboard/local-trip', [
            'bookingCount' => $bookingCount,
            'userBookings' => $bookings,
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
