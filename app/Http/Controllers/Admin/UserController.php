<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
            'users' => $users
        ]);
    }

    public function show($id)
    {
        $user = User::with(['bookings.payment', 'bookings.tourPackage'])->findOrFail($id);

        $bookings = $user->bookings;

        $totalSpent = $bookings
            ->filter(fn($b) => optional($b->payment)->status === 'accepted')
            ->sum('total_amount');

        return Inertia::render('dashboard/users/show', [
            'user' => $user,
            'bookings' => $bookings,
            'totalSpent' => $totalSpent,
        ]);
    }
    
    public function update(Request $request, $id) {
        $validated = $request->validate([
            'role' => ['required', 'string', 'in:admin,user,driver'],
        ]);

        $user = User::findOrFail($id);
        $user->update([
            'role' => $validated['role'],
        ]);

        return redirect()->back()->with('success', 'User role updated successfully.');
    }

}

