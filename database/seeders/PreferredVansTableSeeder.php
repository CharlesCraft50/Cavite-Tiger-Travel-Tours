<?php

namespace Database\Seeders;

use App\Models\PreferredVan;
use App\Models\PreferredVanAvailability;
use App\Models\VanCategory;
use Illuminate\Database\Seeder;

class PreferredVansTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Retrieve categories
        $commuterVan = VanCategory::where('name', 'Commuter Van')->first();
        $glGrandia = VanCategory::where('name', 'GL Grandia')->first();
        $highRoof = VanCategory::where('name', 'High Roof Van')->first();
        $nv350 = VanCategory::where('name', 'NV350')->first();
        $nv350Plus = VanCategory::where('name', 'NV350 Plus')->first();

        $deluxe = VanCategory::where('name', 'Deluxe Van')->first();
        $travellerXL = VanCategory::where('name', 'Traveller XL')->first();
        $premiumVan = VanCategory::where('name', 'Premium Van')->first();
        $captainSeat = VanCategory::where('name', 'Toyota Deluxe Captain Seat')->first();

        // STANDARD VANS - 1,000 PHP additional fee
        $commuterVanModel = PreferredVan::create([
            'name' => 'Commuter Van',
            'image_url' => 'https://i.ibb.co/S760twyr/Commuter-Van.png',
            'additional_fee' => 1000,
            'pax_adult' => 10,
            'pax_kids' => 2,
            'van_category_id' => $commuterVan?->id,
        ]);

        $glGrandiaModel = PreferredVan::create([
            'name' => 'GL Grandia',
            'image_url' => 'https://i.ibb.co/zVv3fYJ7/GLgrandia.png',
            'additional_fee' => 1000,
            'pax_adult' => 10,
            'pax_kids' => 2,
            'van_category_id' => $glGrandia?->id,
        ]);

        $highRoofModel = PreferredVan::create([
            'name' => 'High Roof Van',
            'image_url' => 'https://i.ibb.co/DPYjZ4Fp/High-Roof-Van.png',
            'additional_fee' => 1000,
            'pax_adult' => 10,
            'pax_kids' => 2,
            'van_category_id' => $highRoof?->id,
        ]);

        $nv350Model = PreferredVan::create([
            'name' => 'NV350',
            'image_url' => 'https://i.ibb.co/yFKzZ530/NV350.png',
            'additional_fee' => 1000,
            'pax_adult' => 10,
            'pax_kids' => 2,
            'van_category_id' => $nv350?->id,
        ]);

        $nv350PlusModel = PreferredVan::create([
            'name' => 'NV350 Plus',
            'image_url' => 'https://i.ibb.co/Zp34SSTt/NV350-Plus.png',
            'additional_fee' => 1000,
            'pax_adult' => 12,
            'pax_kids' => 3,
            'van_category_id' => $nv350Plus?->id,
        ]);

        // PREMIUM VANS - 2,000 PHP additional fee
        $deluxeModel = PreferredVan::create([
            'name' => 'Deluxe Van',
            'image_url' => 'https://i.ibb.co/q3LBKTL5/Deluxe-Van.png',
            'additional_fee' => 2000,
            'pax_adult' => 8,
            'pax_kids' => 2,
            'van_category_id' => $deluxe?->id,
        ]);

        $travellerXLModel = PreferredVan::create([
            'name' => 'Traveller XL',
            'image_url' => 'https://i.ibb.co/VcSJ0qbM/traveler-XL.png',
            'additional_fee' => 2000,
            'pax_adult' => 12,
            'pax_kids' => 4,
            'van_category_id' => $travellerXL?->id,
        ]);

        $premiumVanModel = PreferredVan::create([
            'name' => 'Premium Van',
            'image_url' => 'https://i.ibb.co/QF8XhSMj/premium-Van.png',
            'additional_fee' => 2000,
            'pax_adult' => 10,
            'pax_kids' => 3,
            'van_category_id' => $premiumVan?->id,
        ]);

        $captainSeatModel = PreferredVan::create([
            'name' => 'Toyota Deluxe Captain Seat',
            'image_url' => 'https://i.ibb.co/4gKCFghL/captain-Seat.png',
            'additional_fee' => 2000,
            'pax_adult' => 6,
            'pax_kids' => 2,
            'van_category_id' => $captainSeat?->id,
        ]);

        // // Availabilities for Standard Vans
        // PreferredVanAvailability::create([
        //     'preferred_van_id' => $commuterVanModel->id,
        //     'available_from' => now(),
        //     'available_until' => now()->addMonths(2),
        //     'count' => 3,
        // ]);

        // PreferredVanAvailability::create([
        //     'preferred_van_id' => $glGrandiaModel->id,
        //     'available_from' => now(),
        //     'available_until' => now()->addMonths(2),
        //     'count' => 2,
        // ]);

        // PreferredVanAvailability::create([
        //     'preferred_van_id' => $highRoofModel->id,
        //     'available_from' => now(),
        //     'available_until' => now()->addMonths(2),
        //     'count' => 2,
        // ]);

        // PreferredVanAvailability::create([
        //     'preferred_van_id' => $nv350Model->id,
        //     'available_from' => now(),
        //     'available_until' => now()->addMonths(2),
        //     'count' => 4,
        // ]);

        // PreferredVanAvailability::create([
        //     'preferred_van_id' => $nv350PlusModel->id,
        //     'available_from' => now(),
        //     'available_until' => now()->addMonths(2),
        //     'count' => 3,
        // ]);

        // // Availabilities for Premium Vans
        // PreferredVanAvailability::create([
        //     'preferred_van_id' => $deluxeModel->id,
        //     'available_from' => now(),
        //     'available_until' => now()->addMonths(2),
        //     'count' => 2,
        // ]);

        // PreferredVanAvailability::create([
        //     'preferred_van_id' => $travellerXLModel->id,
        //     'available_from' => now(),
        //     'available_until' => now()->addMonths(2),
        //     'count' => 2,
        // ]);

        // PreferredVanAvailability::create([
        //     'preferred_van_id' => $premiumVanModel->id,
        //     'available_from' => now(),
        //     'available_until' => now()->addMonths(2),
        //     'count' => 3,
        // ]);

        // PreferredVanAvailability::create([
        //     'preferred_van_id' => $captainSeatModel->id,
        //     'available_from' => now(),
        //     'available_until' => now()->addMonths(2),
        //     'count' => 1,
        // ]);
    }
}
