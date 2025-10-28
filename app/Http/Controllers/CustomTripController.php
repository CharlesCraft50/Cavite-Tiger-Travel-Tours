<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomTripRequest;
use App\Http\Requests\UpdateCustomTripRequest;
use App\Mail\CustomTripCreated;
use App\Mail\CustomTripUpdated;
use App\Models\CustomTrip;
use App\Models\Notification;
use App\Models\PreferredVan;
use App\Models\TourPackage;
use App\Models\VanCategory;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomTripController extends Controller
{
    /**
     * Display a listing of custom trips for dashboard.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->isAdmin() || $user->isStaff()) {
            $trips = CustomTrip::with(['preferredVan', 'driver', 'payment'])
                ->orderByDesc('created_at')
                ->get();
        } else {
            $trips = CustomTrip::with(['preferredVan', 'driver', 'payment'])
                ->where('user_id', $user->id)
                ->orderByDesc('created_at')
                ->get();
        }

        $preferredVans = PreferredVan::all();
        $vanCategories = VanCategory::all();

        return Inertia::render('dashboard/custom-trip/index', [
            'userTrips' => $trips,
            'preferredVans' => $preferredVans,
            'vanCategories' => $vanCategories,
        ]);
    }

    /**
     * Show a single custom trip for admin or owner.
     */
    public function show(string $id)
    {
        $user = Auth::user();

        $customTrip = CustomTrip::with([
            'preferredVan.driver',
            'payment',
        ])->findOrFail($id);

        $isDriver = $user->isDriver();

        if (! ($user->isAdmin() || $user->isStaff()) && $user->id !== $customTrip->user_id && $user->id !== $customTrip->driver_id) {
            abort(403, 'Unauthorized action.');
        }

        $vans = PreferredVan::with(['availabilities', 'category'])->get();
        $packages = TourPackage::with(['package_categories', 'other_services'])
            ->find($customTrip->tour_package_id);
        $vanCategories = VanCategory::all();

        return Inertia::render('dashboard/custom-trip/show', [
            'booking' => $customTrip,
            'isAdmin' => $user->isAdmin() || $isDriver || $user->isStaff(),
            'packages' => $packages,
            'vans' => $vans,
            'vanCategories' => $vanCategories,
        ]);
    }

    /**
     * Store a new custom trip.
     */
    public function store(StoreCustomTripRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = Auth::id();

        $trip = CustomTrip::create($data);

        try {
            if ($trip->user && $trip->user->email) {
                Mail::to($trip->user->email)->send(new CustomTripCreated($trip));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send CustomTripCreated email: '.$e->getMessage());

            return redirect()
                ->route('customTrips.show', ['id' => $trip->id])
                ->with('warning', 'Trip created, but failed to send confirmation email.');
        }

        return to_route('customTrips.show', ['id' => $trip->id]);
    }

    /**
     * Update an existing custom trip.
     */
    public function update(UpdateCustomTripRequest $request, string $id)
    {
        $customTrip = CustomTrip::findOrFail($id);

        $validated = $request->validated();

        if ($request->has('payment_status') && $customTrip->payment) {
            $customTrip->payment->status = $request->input('payment_status');
            $customTrip->payment->save();
        }

        // Fields that can be updated
        $updatableFields = [
            'preferred_van_id',
            'date_of_trip',
            'pickup_time',
            'dropoff_time',
            'pickup_address',
            'destination',
            'status',
            'notes',
            'total_amount',
            'is_final_total',
            'booking_number',
        ];

        $fieldsToUpdate = [];

        foreach ($updatableFields as $field) {
            // Use the request value if present and not null, otherwise keep old value
            $fieldsToUpdate[$field] = $request->has($field) && $request->filled($field)
                ? $request->input($field)
                : $customTrip->$field;
        }

        $oldStatus = $customTrip->status;

        $customTrip->update($fieldsToUpdate);

        // Notify user if status changed
        if (($request->input('status') ?? $oldStatus) !== $oldStatus && $customTrip->user) {
            $message = "Your custom trip #{$customTrip->id} status has been updated to {$fieldsToUpdate['status']}.";
            Notification::create([
                'user_id' => $customTrip->user->id,
                'type' => 'CustomTripStatusUpdated',
                'data' => json_encode([
                    'message' => $message,
                    'custom_trip_id' => $customTrip->id,
                ]),
                'read_at' => null,
            ]);
        }

        try {
            if ($customTrip->user && $customTrip->user->email) {
                Mail::to($customTrip->user->email)->send(new CustomTripUpdated($customTrip));
            }
            $flashMessage = 'Custom trip updated and email sent successfully.';
        } catch (\Exception $e) {
            Log::error('Failed to send CustomTripUpdated email: '.$e->getMessage());
            $flashMessage = 'Custom trip updated, but failed to send email.';
        }

        return redirect()->back()->with('success', $flashMessage);

        return redirect()->back()->with('success', $flashMessage);
    }

    /**
     * Cancel a custom trip.
     */
    public function cancel(string $id)
    {
        $customTrip = CustomTrip::findOrFail($id);

        if ($customTrip->status === 'cancelled') {
            return redirect()->back()->with('info', 'Custom trip is already cancelled.');
        }

        $customTrip->update(['status' => 'cancelled']);

        return redirect()->back()->with('success', 'Custom trip has been cancelled.');
    }
}
