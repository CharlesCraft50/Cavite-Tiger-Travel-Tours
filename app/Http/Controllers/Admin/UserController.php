<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CustomTrip;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::withCount('bookings')
            ->with(['bookings' => fn ($q) => $q->select('id', 'user_id', 'total_amount')])
            ->get()
            ->map(function ($user) {
                $user->total_spent = $user->bookings->sum('total_amount');

                return $user;
            });

        return Inertia::render('dashboard/users/index', [
            'users' => $users,
        ]);
    }

    public function show($id)
    {
        $user = User::with(['bookings.payment', 'bookings.tourPackage'])->findOrFail($id);

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

        $totalSpent = $bookings
            ->filter(fn ($b) => optional($b->payment)->status === 'accepted')
            ->sum('total_amount');

        return Inertia::render('dashboard/users/show', [
            'user' => $user,
            'bookings' => $bookings,
            'totalSpent' => $totalSpent,
            'userBookings' => $bookings,
            'userCustomTrips' => $customTrips,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'role' => ['required', 'string', 'in:admin,user,driver,staff'],
        ]);

        $user = User::findOrFail($id);
        $user->update([
            'role' => $validated['role'],
        ]);

        return redirect()->back()->with('success', 'User role updated successfully.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Delete user's bookings and related records first
        $user->bookings()->each(function ($booking) {
            // Delete related payments if they exist
            if ($booking->payment) {
                $booking->payment()->delete();
            }

            // Delete the booking
            $booking->delete();
        });

        // Delete user
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User and all associated bookings deleted successfully.');
    }
}
