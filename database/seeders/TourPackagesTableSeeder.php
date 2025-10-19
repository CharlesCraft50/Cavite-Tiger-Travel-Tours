<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use App\Models\OtherService;
use App\Models\PackageCategory;
use App\Models\PreferredVan;
use App\Models\TourPackage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TourPackagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Country
        $philippines = Country::create([
            'name' => 'Philippines',
            'image_url' => 'https://upload.imgshare.cc/images/z1ipupg9.webp',
        ]);

        // Cities
        $camarinesNorte = City::create([
            'country_id' => $philippines->id,
            'name' => 'Camarines Norte',
            'image_url' => 'https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/Calaguas_Island.jpg',
            'overview' => 'White sand beach and crystal-clear water, situated in the province of Camarines Norte.',
        ]);

        $tagaytay = City::create([
            'country_id' => $philippines->id,
            'name' => 'Tagaytay City',
            'image_url' => 'https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/275774475_714502919546027_1975803185873096686_n.jpg',
            'overview' => 'Tagaytay is a quick escape from Manila and a romantic getaway with cool temperatures and overlooking view restaurants.',
        ]);

        // // Tour Package - Camarines Norte
        // $calaguas = TourPackage::create([
        //     'title' => 'Calaguas Island Getaway',
        //     'city_id' => $camarinesNorte->id,
        //     'overview' => 'Explore the pristine white sands and turquoise waters of Calaguas Island – a hidden paradise perfect for a tranquil escape.',
        //     'subtitle' => 'Tropical Paradise Adventure',
        //     'location' => 'Calaguas Island, Camarines Norte',
        //     'content' => 'Calaguas Island is known for its stunning beachscapes, untouched beauty, and peaceful vibes. Ideal for backpackers, couples, or family trips who want to unplug and enjoy nature.',
        //     'duration' => '4D3N',
        //     'pax_kids' => 2,
        //     'pax_adult' => 4,
        //     'available_from' => now(),
        //     'available_until' => now()->addMonths(3),
        //     'image_overview' => 'https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/Calaguas_Island.jpg',
        //     'image_banner' => 'https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/Calaguas_Island.jpg',
        //     'slug' => Str::slug('Calaguas Island Getaway'),
        //     'base_price' => 2999.00,
        // ]);

        // PackageCategory::create([
        //     'tour_package_id' => $calaguas->id,
        //     'name' => '4D3N Package',
        //     'content' => '₱2,999 per head. Inclusions: Boat transfers, tent accommodation, island hopping, and meals.',
        // ]);

        // // Tour Package - Tagaytay
        // $tagaytayTour = TourPackage::create([
        //     'title' => 'Chill and Dine Tagaytay',
        //     'city_id' => $tagaytay->id,
        //     'overview' => 'Relax in Tagaytay with scenic views, cool weather, and local culinary delights.',
        //     'subtitle' => 'Tagaytay City Day Tour',
        //     'location' => 'Tagaytay City',
        //     'content' => 'Perfect for couples and families. Includes visit to People\'s Park, Sky Ranch, Picnic Grove, and dinner with Taal Volcano view.',
        //     'duration' => '2D1N',
        //     'pax_kids' => 1,
        //     'pax_adult' => 3,
        //     'available_from' => now(),
        //     'available_until' => now()->addMonths(2),
        //     'image_banner' => 'https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/275774475_714502919546027_1975803185873096686_n.jpg',
        //     'image_overview' => 'https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/275774475_714502919546027_1975803185873096686_n.jpg',
        //     'slug' => Str::slug('Chill and Dine Tagaytay'),
        //     'base_price' => 1800.00,
        // ]);

        // PackageCategory::create([
        //     'tour_package_id' => $tagaytayTour->id,
        //     'name' => '2D1N Tagaytay Chill',
        //     'content' => '₱1,800 per head. Inclusions: Hotel stay, park tickets, transport, and 1 free dinner voucher.',
        // ]);

        // $cities = City::all();
        // $vanIds = PreferredVan::pluck('id')->toArray();
        // $services = OtherService::all();

        // foreach ($cities as $city) {
        //     for ($i = 1; $i <= 2; $i++) { // add 2 more packages per city
        //         $title = $city->name . " Explorer Tour $i";
        //         $package = TourPackage::create([
        //             'title' => $title,
        //             'city_id' => $city->id,
        //             'overview' => "Experience the beauty and culture of {$city->name} like never before.",
        //             'subtitle' => "Immersive Adventure $i",
        //             'location' => $city->name,
        //             'content' => "Join our specially crafted {$city->name} Explorer Tour #$i, where you'll uncover hidden gems, enjoy local delicacies, and create unforgettable memories.",
        //             'duration' => '3D2N',
        //             'pax_kids' => 2,
        //             'pax_adult' => 4,
        //             'available_from' => now(),
        //             'available_until' => now()->addMonths(3),
        //             'image_banner' => 'default-banner.jpg',
        //             'slug' => Str::slug($title),
        //             'base_price' => 2500 + ($i * 200),
        //         ]);

        //         PackageCategory::create([
        //             'tour_package_id' => $package->id,
        //             'name' => "Standard Package $i",
        //             'content' => "₱{$package->base_price} per head. Inclusions: Accommodation, local tour, meals, and guide.",
        //         ]);

        //         // Attach random vans
        //         $randomVanIds = collect($vanIds)->random(min(2, count($vanIds)))->toArray();
        //         $package->preferredVans()->attach($randomVanIds);

        //         // Attach other services
        //         $recommendedServices = $services->random(min(6, $services->count()));
        //         $this->createOtherServiceTourPackages($package, $recommendedServices);
        //     }
        // }
    }

    private function createOtherServiceTourPackages($package, $services)
    {
        $sortOrder = 1;
        foreach ($services as $service) {
            $isRecommended = $sortOrder <= 4;
            $packageSpecificPrice = null;

            if ($service->name === 'Drone Video Package' && str_contains($package->title, 'Island')) {
                $packageSpecificPrice = 3000.00;
            } elseif ($service->name === 'Scuba Diving Gear Rental' && str_contains($package->title, 'Beach')) {
                $packageSpecificPrice = 1000.00;
            } elseif ($service->name === 'Massage Therapy' && str_contains($package->title, 'Chill')) {
                $packageSpecificPrice = 1200.00;
            }

            OtherServiceTourPackage::create([
                'tour_package_id' => $package->id,
                'other_service_id' => $service->id,
                'package_specific_price' => $packageSpecificPrice,
                'is_recommended' => $isRecommended,
                'sort_order' => $sortOrder,
            ]);

            $sortOrder++;
        }
    }
}
