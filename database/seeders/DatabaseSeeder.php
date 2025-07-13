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
use App\Models\OtherService;
use App\Models\OtherServiceTourPackage;
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
            'pax_kids' => 2,
            'pax_adult' => 4,
            'available_from' => now(),
            'available_until' => now()->addMonths(3),
            'image_overview' => 'https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/Calaguas_Island.jpg',
            'image_banner' => 'https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/Calaguas_Island.jpg',
            'slug' => Str::slug('Calaguas Island Getaway'),
            'base_price' => 2999.00,
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
            'content' => 'Perfect for couples and families. Includes visit to People\'s Park, Sky Ranch, Picnic Grove, and dinner with Taal Volcano view.',
            'duration' => '2D1N',
            'pax_kids' => 1,
            'pax_adult' => 3,
            'available_from' => now(),
            'available_until' => now()->addMonths(2),
            'image_banner' => 'tagaytay.jpg',
            'slug' => Str::slug('Chill and Dine Tagaytay'),
            'base_price' => 1800.00,
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

        // Create Other Services
        $travelInsurance = OtherService::create([
            'name' => 'Travel Insurance',
            'image_url' => '/images/travel-insurance.jpg',
            'price' => 500.00,
            'description' => 'Comprehensive travel insurance coverage including medical emergencies, trip cancellation, and lost luggage protection.',
        ]);

        $airportTransfer = OtherService::create([
            'name' => 'Airport Transfer',
            'image_url' => '/images/airport-transfer.jpg',
            'price' => 1500.00,
            'description' => 'Convenient door-to-door transportation service between your accommodation and the airport with professional drivers.',
        ]);

        $extraLuggage = OtherService::create([
            'name' => 'Extra Luggage',
            'image_url' => '/images/extra-luggage.jpg',
            'price' => 200.00,
            'description' => 'Additional baggage allowance for your flight, perfect for bringing back souvenirs or carrying extra gear.',
        ]);

        $photography = OtherService::create([
            'name' => 'Professional Photography',
            'image_url' => '/images/photography.jpg',
            'price' => 2500.00,
            'description' => 'Capture your precious travel memories with a professional photographer who knows the best spots and lighting.',
        ]);

        $droneVideo = OtherService::create([
            'name' => 'Drone Video Package',
            'description' => 'Stunning aerial footage and photography of your destination using professional drone equipment and editing.',
            'image_url' => '/images/drone-video.jpg',
            'price' => 3500.00,
        ]);

        $scubaGear = OtherService::create([
            'name' => 'Scuba Diving Gear Rental',
            'description' => 'Complete scuba diving equipment rental including wetsuit, BCD, regulator, and mask for underwater adventures.',
            'image_url' => '/images/scuba-gear.jpg',
            'price' => 1200.00,
        ]);

        $snorkelGear = OtherService::create([
            'name' => 'Snorkeling Equipment',
            'description' => 'High-quality snorkeling gear including mask, snorkel, fins, and optional wetsuit for exploring marine life.',
            'image_url' => '/images/snorkel-gear.jpg',
            'price' => 300.00,
        ]);

        $hikingBoots = OtherService::create([
            'name' => 'Hiking Boots Rental',
            'description' => 'Durable, comfortable hiking boots in various sizes for trekking and outdoor adventures on any terrain.',
            'image_url' => '/images/hiking-boots.jpg',
            'price' => 400.00,
        ]);

        $campingGear = OtherService::create([
            'name' => 'Camping Equipment',
            'description' => 'Complete camping setup including tent, sleeping bags, camping chairs, and essential outdoor cooking equipment.',
            'image_url' => '/images/camping-gear.jpg',
            'price' => 800.00,
        ]);

        $privateTourGuide = OtherService::create([
            'name' => 'Private Tour Guide',
            'description' => 'Experienced local guide for personalized tours, cultural insights, and access to hidden gems and local experiences.',
            'image_url' => '/images/tour-guide.jpg',
            'price' => 2000.00,
        ]);

        $massage = OtherService::create([
            'name' => 'Massage Therapy',
            'description' => 'Relaxing therapeutic massage sessions to unwind after long days of travel and sightseeing activities.',
            'image_url' => '/images/massage.jpg',
            'price' => 1500.00,
        ]);

        $wifiDevice = OtherService::create([
            'name' => 'Wi-Fi Hotspot Device',
            'description' => 'Portable internet device providing reliable Wi-Fi connection for multiple devices throughout your trip.',
            'image_url' => '/images/wifi-device.jpg',
            'price' => 250.00,
        ]);

        $powerBank = OtherService::create([
            'name' => 'Power Bank Rental',
            'description' => 'High-capacity portable charger to keep your devices powered during long days of exploration and travel.',
            'image_url' => '/images/power-bank.jpg',
            'price' => 150.00,
        ]);

        $laundryService = OtherService::create([
            'name' => 'Laundry Service',
            'description' => 'Professional laundry and dry cleaning service to keep your clothes fresh during extended travel periods.',
            'image_url' => '/images/laundry.jpg',
            'price' => 300.00,
        ]);

        // Create Package Other Services - Calaguas Island (Beach/Island Package)
        OtherServiceTourPackage::create([
            'tour_package_id' => $calaguas->id,
            'other_service_id' => $travelInsurance->id,
            'package_specific_price' => null,
            'is_recommended' => true,
            'sort_order' => 1,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $calaguas->id,
            'other_service_id' => $airportTransfer->id,
            'package_specific_price' => null,
            'is_recommended' => true,
            'sort_order' => 2,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $calaguas->id,
            'other_service_id' => $photography->id,
            'package_specific_price' => null,
            'is_recommended' => true,
            'sort_order' => 3,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $calaguas->id,
            'other_service_id' => $droneVideo->id,
            'package_specific_price' => 3000.00, // Discounted for beach shots
            'is_recommended' => true,
            'sort_order' => 4,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $calaguas->id,
            'other_service_id' => $snorkelGear->id,
            'package_specific_price' => null,
            'is_recommended' => true,
            'sort_order' => 5,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $calaguas->id,
            'other_service_id' => $scubaGear->id,
            'package_specific_price' => 1000.00, // Discounted for package
            'is_recommended' => false,
            'sort_order' => 6,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $calaguas->id,
            'other_service_id' => $campingGear->id,
            'package_specific_price' => 600.00, // Discounted for camping
            'is_recommended' => false,
            'sort_order' => 7,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $calaguas->id,
            'other_service_id' => $privateTourGuide->id,
            'package_specific_price' => 1800.00, // Discounted guide
            'is_recommended' => false,
            'sort_order' => 8,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $calaguas->id,
            'other_service_id' => $wifiDevice->id,
            'package_specific_price' => null,
            'is_recommended' => false,
            'sort_order' => 9,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $calaguas->id,
            'other_service_id' => $powerBank->id,
            'package_specific_price' => null,
            'is_recommended' => false,
            'sort_order' => 10,
        ]);

        // Create Package Other Services - Tagaytay (City/Mountain Package)
        OtherServiceTourPackage::create([
            'tour_package_id' => $tagaytayTour->id,
            'other_service_id' => $travelInsurance->id,
            'package_specific_price' => null,
            'is_recommended' => true,
            'sort_order' => 1,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $tagaytayTour->id,
            'other_service_id' => $airportTransfer->id,
            'package_specific_price' => null,
            'is_recommended' => true,
            'sort_order' => 2,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $tagaytayTour->id,
            'other_service_id' => $photography->id,
            'package_specific_price' => null,
            'is_recommended' => true,
            'sort_order' => 3,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $tagaytayTour->id,
            'other_service_id' => $massage->id,
            'package_specific_price' => 1200.00, // Spa package discount
            'is_recommended' => true,
            'sort_order' => 4,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $tagaytayTour->id,
            'other_service_id' => $hikingBoots->id,
            'package_specific_price' => null,
            'is_recommended' => false,
            'sort_order' => 5,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $tagaytayTour->id,
            'other_service_id' => $privateTourGuide->id,
            'package_specific_price' => null,
            'is_recommended' => false,
            'sort_order' => 6,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $tagaytayTour->id,
            'other_service_id' => $laundryService->id,
            'package_specific_price' => null,
            'is_recommended' => false,
            'sort_order' => 7,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $tagaytayTour->id,
            'other_service_id' => $wifiDevice->id,
            'package_specific_price' => null,
            'is_recommended' => false,
            'sort_order' => 8,
        ]);

        OtherServiceTourPackage::create([
            'tour_package_id' => $tagaytayTour->id,
            'other_service_id' => $powerBank->id,
            'package_specific_price' => null,
            'is_recommended' => false,
            'sort_order' => 9,
        ]);
        
        $cities = City::all();
        $vanIds = PreferredVan::pluck('id')->toArray();
        $services = OtherService::all();

        foreach ($cities as $city) {
            for ($i = 1; $i <= 2; $i++) { // add 2 more packages per city
                $title = $city->name . " Explorer Tour $i";
                $package = TourPackage::create([
                    'title' => $title,
                    'city_id' => $city->id,
                    'overview' => "Experience the beauty and culture of {$city->name} like never before.",
                    'subtitle' => "Immersive Adventure $i",
                    'location' => $city->name,
                    'content' => "Join our specially crafted {$city->name} Explorer Tour #$i, where you'll uncover hidden gems, enjoy local delicacies, and create unforgettable memories.",
                    'duration' => '3D2N',
                    'pax_kids' => 2,
                    'pax_adult' => 4,
                    'available_from' => now(),
                    'available_until' => now()->addMonths(3),
                    'image_banner' => 'default-banner.jpg',
                    'slug' => Str::slug($title),
                    'base_price' => 2500 + ($i * 200),
                ]);

                PackageCategory::create([
                    'tour_package_id' => $package->id,
                    'name' => "Standard Package $i",
                    'content' => "₱{$package->base_price} per head. Inclusions: Accommodation, local tour, meals, and guide.",
                ]);

                // Attach random vans
                $randomVanIds = collect($vanIds)->random(min(2, count($vanIds)))->toArray();
                $package->preferredVans()->attach($randomVanIds);

                // Attach other services
                $recommendedServices = $services->random(min(6, $services->count()));
                $this->createOtherServiceTourPackages($package, $recommendedServices);
            }
        }

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