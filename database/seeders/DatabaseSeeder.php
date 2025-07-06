<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Country;
use App\Models\City;
use App\Models\TourPackage;
use App\Models\PackageCategory;
use App\Models\PreferredVan;
use App\Models\PreferredVanAvailability;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Country
        $philippines = Country::create([
            'name' => 'Philippines'
        ]);

        // Cities
        $camarinesNorte = City::create([
            'country_id' => $philippines->id,
            'name' => 'Camarines Norte',
            'overview' => 'White sand beach and crystal-clear water, situated in the province of Camarines Norte.',
        ]);

        $tagaytay = City::create([
            'country_id' => $philippines->id,
            'name' => 'Tagaytay City',
            'overview' => 'Tagaytay is a quick escape from Manila and a romantic getaway with cool temperatures and overlooking view restaurants.',
        ]);

        // Tour Package - Camarines Norte
        $calaguas = TourPackage::create([
            'title' => 'Calaguas Island Getaway',
            'city_id' => $camarinesNorte->id,
            'overview' => 'Explore the pristine white sands and turquoise waters of Calaguas Island – a hidden paradise perfect for a tranquil escape.',
            'subtitle' => 'Tropical Paradise Adventure',
            'location' => 'Calaguas Island, Camarines Norte',
            'content' => 'Calaguas Island is known for its stunning beachscapes, untouched beauty, and peaceful vibes. Ideal for backpackers, couples, or family trips who want to unplug and enjoy nature.',
            'duration' => '4D3N',
            'price_per_head' => 2999.00,
            'pax_kids' => 2,
            'pax_adult' => 4,
            'available_from' => now(),
            'available_until' => now()->addMonths(3),
            'image_overview' => 'https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/Calaguas_Island.jpg',
            'image_banner' => 'https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/Calaguas_Island.jpg',
            'slug' => Str::slug('Calaguas Island Getaway'),
        ]);

        PackageCategory::create([
            'tour_package_id' => $calaguas->id,
            'name' => '4D3N Package',
            'content' => '₱2,999 per head. Inclusions: Boat transfers, tent accommodation, island hopping, and meals.',
        ]);

        // Tour Package - Tagaytay
        $tagaytayTour = TourPackage::create([
            'title' => 'Chill and Dine Tagaytay',
            'city_id' => $tagaytay->id,
            'overview' => 'Relax in Tagaytay with scenic views, cool weather, and local culinary delights.',
            'subtitle' => 'Tagaytay City Day Tour',
            'location' => 'Tagaytay City',
            'content' => 'Perfect for couples and families. Includes visit to People’s Park, Sky Ranch, Picnic Grove, and dinner with Taal Volcano view.',
            'duration' => '2D1N',
            'price_per_head' => 1800.00,
            'pax_kids' => 1,
            'pax_adult' => 3,
            'available_from' => now(),
            'available_until' => now()->addMonths(2),
            'image_banner' => 'tagaytay.jpg',
            'slug' => Str::slug('Chill and Dine Tagaytay'),
        ]);

        PackageCategory::create([
            'tour_package_id' => $tagaytayTour->id,
            'name' => '2D1N Tagaytay Chill',
            'content' => '₱1,800 per head. Inclusions: Hotel stay, park tickets, transport, and 1 free dinner voucher.',
        ]);

        $hiAce = PreferredVan::create([
            'name' => 'Toyota HiAce',
            'image_url' => 'https://1cars.org/wp-content/uploads/2019/03/Toyota-Hiace-1.jpg',
            'additional_fee' => 1500,
            'pax_adult' => 10,
            'pax_kids' => 2,
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
    
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'password' => Hash::make('asdasd'),
            'email_verified_at' => now(),
            'is_admin' => true,
        ]);

        PreferredVanAvailability::create([
            'preferred_van_id' => $hiAce->id,
            'available_from' => now(),
            'available_until' => now()->addMonths(2),
            'count' => 3,
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
