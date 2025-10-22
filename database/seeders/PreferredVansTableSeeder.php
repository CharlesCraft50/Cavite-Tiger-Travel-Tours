<?php

namespace Database\Seeders;

use App\Models\PreferredVan;
use App\Models\User;
use App\Models\VanCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PreferredVansTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Retrieve all available drivers
        $drivers = User::where('role', 'driver')->get();

        if ($drivers->isEmpty()) {
            $this->command->warn('⚠️ No drivers found. Please seed some users with role=driver before running this seeder.');
        }

        // Helper: Generate random plate number (e.g., ABC 1234)
        $generatePlate = function () {
            return strtoupper(Str::random(3)).' '.rand(1000, 9999);
        };

        // Helper: Pick a random driver
        $getDriverId = function () use ($drivers) {
            return $drivers->isNotEmpty() ? $drivers->random()->id : null;
        };

        // Retrieve categories
        $categories = [
            'Commuter Van' => VanCategory::where('name', 'Commuter Van')->first(),
            'GL Grandia' => VanCategory::where('name', 'GL Grandia')->first(),
            'High Roof Van' => VanCategory::where('name', 'High Roof Van')->first(),
            'NV350' => VanCategory::where('name', 'NV350')->first(),
            'NV350 Plus' => VanCategory::where('name', 'NV350 Plus')->first(),
            'Deluxe Van' => VanCategory::where('name', 'Deluxe Van')->first(),
            'Traveller XL' => VanCategory::where('name', 'Traveller XL')->first(),
            'Premium Van' => VanCategory::where('name', 'Premium Van')->first(),
            'Toyota Deluxe Captain Seat' => VanCategory::where('name', 'Toyota Deluxe Captain Seat')->first(),
        ];

        // Van data
        $vans = [
            [
                'name' => 'Commuter Van',
                'image_url' => 'https://i.ibb.co/S760twyr/Commuter-Van.png',
                'additional_fee' => 1000,
                'pax_adult' => 10,
                'pax_kids' => 2,
            ],
            [
                'name' => 'GL Grandia',
                'image_url' => 'https://i.ibb.co/zVv3fYJ7/GLgrandia.png',
                'additional_fee' => 1000,
                'pax_adult' => 10,
                'pax_kids' => 2,
            ],
            [
                'name' => 'High Roof Van',
                'image_url' => 'https://i.ibb.co/DPYjZ4Fp/High-Roof-Van.png',
                'additional_fee' => 1000,
                'pax_adult' => 10,
                'pax_kids' => 2,
            ],
            [
                'name' => 'NV350',
                'image_url' => 'https://i.ibb.co/yFKzZ530/NV350.png',
                'additional_fee' => 1000,
                'pax_adult' => 10,
                'pax_kids' => 2,
            ],
            [
                'name' => 'NV350 Plus',
                'image_url' => 'https://i.ibb.co/Zp34SSTt/NV350-Plus.png',
                'additional_fee' => 1000,
                'pax_adult' => 12,
                'pax_kids' => 3,
            ],
            [
                'name' => 'Deluxe Van',
                'image_url' => 'https://i.ibb.co/q3LBKTL5/Deluxe-Van.png',
                'additional_fee' => 2000,
                'pax_adult' => 8,
                'pax_kids' => 2,
            ],
            [
                'name' => 'Traveller XL',
                'image_url' => 'https://i.ibb.co/VcSJ0qbM/traveler-XL.png',
                'additional_fee' => 2000,
                'pax_adult' => 12,
                'pax_kids' => 4,
            ],
            [
                'name' => 'Premium Van',
                'image_url' => 'https://i.ibb.co/QF8XhSMj/premium-Van.png',
                'additional_fee' => 2000,
                'pax_adult' => 10,
                'pax_kids' => 3,
            ],
            [
                'name' => 'Toyota Deluxe Captain Seat',
                'image_url' => 'https://i.ibb.co/4gKCFghL/captain-Seat.png',
                'additional_fee' => 2000,
                'pax_adult' => 6,
                'pax_kids' => 2,
            ],
        ];

        // Seed each van
        foreach ($vans as $vanData) {
            PreferredVan::create([
                ...$vanData,
                'van_category_id' => $categories[$vanData['name']]?->id,
                'plate_number' => $generatePlate(),
                'user_id' => $getDriverId(),
            ]);
        }

        $this->command->info('✅ Preferred vans seeded successfully with random plate numbers and assigned drivers.');
    }
}
