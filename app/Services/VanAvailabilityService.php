<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\CustomTrip;
use Carbon\Carbon;

class VanAvailabilityService
{
    public function getAvailableDateRanges(?int $vanId = null)
    {
        // When vanId is provided, filter by it; otherwise, get all bookings
        $bookingsQuery = Booking::query();
        $customTripsQuery = CustomTrip::query();

        if ($vanId !== null) {
            $bookingsQuery->where('preferred_van_id', $vanId);
            $customTripsQuery->where('preferred_van_id', $vanId);
        }

        $bookings = $bookingsQuery->get();
        $customTrips = $customTripsQuery->get();

        // Build a map of booked date counts
        $bookedDates = [];

        foreach ($bookings as $booking) {
            $start = Carbon::parse($booking->departure_date);
            $end = Carbon::parse($booking->return_date);

            for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
                $bookedDates[$date->toDateString()] = ($bookedDates[$date->toDateString()] ?? 0) + 1;
            }
        }

        foreach ($customTrips as $trip) {
            $start = Carbon::parse($trip->departure_date);
            $end = Carbon::parse($trip->return_date);

            for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
                $bookedDates[$date->toDateString()] = ($bookedDates[$date->toDateString()] ?? 0) + 1;
            }
        }

        $fullyBookedDates = [];

        // Block the entire range from first to last booked date
        if (! empty($bookedDates)) {
            $firstBooked = Carbon::parse(min(array_keys($bookedDates)));
            $lastBooked = Carbon::parse(max(array_keys($bookedDates)));

            for ($date = $firstBooked->copy(); $date->lte($lastBooked); $date->addDay()) {
                $fullyBookedDates[] = $date->toDateString();
            }
        }

        return [
            'fully_booked_dates' => $fullyBookedDates,
        ];
    }
}
