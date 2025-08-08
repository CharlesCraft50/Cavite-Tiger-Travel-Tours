<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TourPackage;
use App\Models\OtherService;
use App\Models\OtherServiceTourPackage;

class OtherServicesTableSeeder extends Seeder
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
        
    }
}
