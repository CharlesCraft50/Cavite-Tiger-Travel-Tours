<?php

namespace App\Services;

use App\Models\PreferredVanAvailability;
use App\Models\Booking;
use Carbon\Carbon;

class VanAvailabilityService
{
    public function getAvailableDateRanges(int $vanId)
    {
        $availability = PreferredVanAvailability::where('preferred_van_id', $vanId)->first();

        if (!$availability) return [];

        $from = Carbon::parse($availability->available_from);
        $until = Carbon::parse($availability->available_until);

        // Get all bookings for the van
        $bookings = Booking::where('preferred_van_id', $vanId)->get();

        // Build a map of booked date counts
        $bookedDates = [];

        foreach ($bookings as $booking) {
            $start = Carbon::parse($booking->departure_date);
            $end = Carbon::parse($booking->return_date);

            for ($date = $start; $date->lte($end); $date->addDay()) {
                $bookedDates[$date->toDateString()] = ($bookedDates[$date->toDateString()] ?? 0) + 1;
            }
        }

        $fullyBookedDates = [];

        // Old logic (commented out)
        /*
        foreach ($bookedDates as $date => $count) {
            if ($count >= $availability->count) {
                $fullyBookedDates[] = $date;
            }
        }
        */

        // New logic to block the entire range from the first to the last booked date
        if (!empty($bookedDates)) {
            $firstBooked = Carbon::parse(min(array_keys($bookedDates)));
            $lastBooked  = Carbon::parse(max(array_keys($bookedDates)));

            for ($date = $firstBooked; $date->lte($lastBooked); $date->addDay()) {
                $fullyBookedDates[] = $date->toDateString();
            }
        }

        return [
            'available_from' => $from->toDateString(),
            'available_until' => $until->toDateString(),
            'fully_booked_dates' => $fullyBookedDates,
        ];
    }
}