<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TourPackage;
use App\Models\PreferredVan;
use App\Models\PreferredVanAvailability;

class PreferredVansTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Retrieve the "Calaguas Island Getaway" tour package
        $calaguas = TourPackage::where('title', 'Calaguas Island Getaway')->first();

        // Retrieve the "Tagaytay" tour package
        $tagaytayTour = TourPackage::where('title', 'Chill and Dine Tagaytay')->first();

        $hiAce = PreferredVan::create([
            'name' => 'Toyota HiAce',
            'image_url' => 'https://1cars.org/wp-content/uploads/2019/03/Toyota-Hiace-1.jpg',
            'additional_fee' => 1500,
            'pax_adult' => 10,
            'pax_kids' => 2,
            'user_id' => 3,
        ]);

        $urvan = PreferredVan::create([
            'name' => 'Nissan Urvan',
            'image_url' => 'https://www.autohubgroup.com/wp-content/uploads/2020/03/nissan-urvan-premium-2020-autohub-group-philippines-1.jpg',
            'additional_fee' => 1300,
            'pax_adult' => 8,
            'pax_kids' => 3,
        ]);

        $starex = PreferredVan::create([
            'name' => 'Hyundai Starex',
            'image_url' => 'https://hyundaipasig.com/wp-content/uploads/2016/07/starex4.png',
            'additional_fee' => 1200,
            'pax_adult' => 7,
            'pax_kids' => 2,
        ]);

        $transit = PreferredVan::create([
            'name' => 'Ford Transit',
            'image_url' => 'https://d2ivfcfbdvj3sm.cloudfront.net/7fc965ab77efe6e0fa62e4ca1ea7673bb25a42530a1e3d8e88cb/stills_0640_png/MY2015/10321/10321_st0640_116.png',
            'additional_fee' => 1600,
            'pax_adult' => 12,
            'pax_kids' => 4,
        ]);

        $carnival = PreferredVan::create([
            'name' => 'Kia Carnival',
            'image_url' => 'https://heritagecabs.in/assets/uploads/product_images/Kia-carniwal-rental-in-jaipur.png',
            'additional_fee' => 1400,
            'pax_adult' => 6,
            'pax_kids' => 2,
        ]);

        $calaguas->preferredVans()->attach([$hiAce->id, $urvan->id]);
        $tagaytayTour->preferredVans()->attach([$urvan->id]);

        PreferredVanAvailability::create([
            'preferred_van_id' => $hiAce->id,
            'available_from' => now(),
            'available_until' => now()->addMonths(2),
            'count' => 1,
        ]);

        PreferredVanAvailability::create([
            'preferred_van_id' => $urvan->id,
            'available_from' => now(),
            'available_until' => now()->addMonths(2),
            'count' => 4,
        ]);

        PreferredVanAvailability::create([
            'preferred_van_id' => $starex->id,
            'available_from' => now(),
            'available_until' => now()->addMonths(2),
            'count' => 2,
        ]);

        PreferredVanAvailability::create([
            'preferred_van_id' => $transit->id,
            'available_from' => now(),
            'available_until' => now()->addMonths(2),
            'count' => 5,
        ]);

        PreferredVanAvailability::create([
            'preferred_van_id' => $carnival->id,
            'available_from' => now(),
            'available_until' => now()->addMonths(2),
            'count' => 2,
        ]);
    }
}
