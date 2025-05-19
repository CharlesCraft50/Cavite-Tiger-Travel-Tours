<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Country;
use App\Models\City;
use App\Models\TourPackage;
use App\Models\PackageCategory;

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
            'image_url' => 'https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/Calaguas_Island.jpg',
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
            'image_url' => 'tagaytay.jpg',
            'slug' => Str::slug('Chill and Dine Tagaytay'),
        ]);

        PackageCategory::create([
            'tour_package_id' => $tagaytayTour->id,
            'name' => '2D1N Tagaytay Chill',
            'content' => '₱1,800 per head. Inclusions: Hotel stay, park tickets, transport, and 1 free dinner voucher.',
        ]);
    }
}
