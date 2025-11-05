<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use App\Models\TourPackage;
use Illuminate\Database\Seeder;

class TourPackagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Philippines Country
        $philippines = Country::firstOrCreate(
            ['name' => 'Philippines'],
            ['image_url' => 'https://i.ibb.co/f3R7nx7/abstract-dark-blue-scratch-background.jpg']
        );

        // Create Cities
        $cities = [
            [
                'name' => 'PALAWAN',
                'overview' => '',
                'image_url' => 'https://cavitetigertours.com/storage/cities/fpA5tMrNM47lFZ3hx3WNCdWQXkjHFok2aU45OaLU.jpg',
            ],
            [
                'name' => 'CEBU',
                'overview' => '',
                'image_url' => 'https://cavitetigertours.com/storage/cities/6p02TfKPjql8la1MreVUzdDFI3HUgQmcmTAulGTr.webp',
            ],
            [
                'name' => 'BOHOL',
                'overview' => '',
                'image_url' => 'https://cavitetigertours.com/storage/cities/B8yk1TtW1bAjRwTFAcwYBUxThosYrDWidxpC5B7E.png',
            ],
            [
                'name' => 'DAVAO',
                'overview' => '',
                'image_url' => 'https://cavitetigertours.com/storage/cities/GhDGXbsupHDn9A3m3Wkgjtasx1u8rkWrFTD360St.jpg',
            ],
            [
                'name' => 'ILO-ILO',
                'overview' => '',
                'image_url' => 'https://cavitetigertours.com/storage/cities/VelPR8YJMk87AOCwGgmge0JZilijjHFVx4I2u6zR.webp',
            ],
            [
                'name' => 'AKLAN',
                'overview' => '',
                'image_url' => 'https://cavitetigertours.com/storage/cities/JRIXcTrM7dUoAJkeh5nuihtkvZmYdXOd9aeOuTEx.jpg',
            ],
            [
                'name' => 'NEGROS OCCIDENTAL',
                'overview' => '',
                'image_url' => 'https://cavitetigertours.com/storage/cities/KHaSDjf8b8oai3t7gAQLDBNTE9RsSaXzJ449zpBv.png',
            ],
            [
                'name' => 'CAGAYAN DE ORO + CAMIGUIN ISLAND',
                'overview' => '',
                'image_url' => 'https://cavitetigertours.com/storage/cities/iOkcW2ZA38i0OkKx1BhZkyUHTEpN6MJrJOqdoN7L.webp',
            ],
            [
                'name' => 'NEGROS ORIENTAL',
                'overview' => '',
                'image_url' => 'https://cavitetigertours.com/storage/cities/BOBpiWv0GKehivmniC7xUrIYHdmHnrY4MBPRlRgR.jpg',
            ],
            [
                'name' => 'SURIGAO DEL NORTE',
                'overview' => '',
                'image_url' => 'https://cavitetigertours.com/storage/cities/HRRBP3QHwfxruLIBRvPmfDohz94e5XaiJGmUcfuL.jpg',
            ],
            [
                'name' => 'BATANES',
                'overview' => '',
                'image_url' => 'https://cavitetigertours.com/storage/cities/JdxqRrEkSNiUBkBYia7MEDiwhh2ELharvT58YRFP.jpg',
            ],
        ];

        $cityMap = [];
        foreach ($cities as $cityData) {
            $city = City::create([
                'country_id' => $philippines->id,
                'name' => $cityData['name'],
                'overview' => $cityData['overview'],
                'image_url' => $cityData['image_url'],
            ]);
            $cityMap[$cityData['name']] = $city->id;
        }

        // Create Tour Packages
        $packages = [
            [
                'title' => 'CEBU CITY (BUDGET TOUR)',
                'city_name' => 'CEBU',
                'subtitle' => 'Cebu',
                'location' => 'CEBU',
                'duration' => '3 Days 2 Nights',
                'overview' => 'A package that made to give everyone a budget friendly tour that enhance and unlocks their world view and explore many different locations on Cebu to discover its outrageous beauty!',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]<br>DURATION [ 3 Days 2 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>A Cebu City tour is a guided exploration of the city\'s key historical, cultural, and scenic spots, including landmarks like Magellan\'s Cross, Basilica del Santo Niño, and the Taoist Temple. Tours often include visits to modern attractions like Sirao Garden and the Temple of Leah, offering a blend of history and scenic views.</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL AT CEBU AIRPORT</strong></h3><p>Meet our representative at the Airport and transfer to Hotel for Check-In.</p><h3><strong>[ DAY 2 ] BREAKFAST AND PROCEED TO CEBU CITY TOUR</strong></h3><p><strong>PLACES TO VISIT</strong></p><ul><li><p>Sirao Garden</p></li><li><p>Temple of Leah</p></li><li><p>Taoist Temple</p></li><li><p>Yap San Diego Ancestral House</p></li><li><p>Fort San Pedro</p></li><li><p>Basilica Minore de Sto. Niño de Cebu</p></li><li><p>Magellan\'s Cross</p></li><li><p>Parian Heritage</p></li><li><p>Pasalubong Center</p></li></ul><p><strong>[Drop-off]</strong> SM Cebu City</p><p><strong>[Reminder] </strong>Arrange your own transport back to Hotel</p><h3><strong>[DAY 3] FREE TIME UNTIL DEPARTURE</strong></h3><p>Transfer to Airport for Departure.</p><h1><strong>INCLUSION</strong></h1><ul><li><p>Roundtrip Airport Transfer Private</p></li><li><p>2 Nights Accommodation (Cebu R Hotel or Similar)</p></li><li><p>Daily Breakfast</p></li><li><p>Cebu City Tour-Joiners</p></li><li><p>Driver as Tour Guide</p></li><li><p>Entrance &amp; Environmental Fee</p></li><li><p>Parking Fee</p></li><li><p>Travel Insurance</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><p>&nbsp;</p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/3Y8mZiGOTcDf4Knrmx6kOz8cZlhwaHq3jWmHWXv6.png',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/bG49Y0uNlYVix30pwdslWFoTEtHe7JIWtNcyKT2R.jpg'],
                'slug' => 'cebu-city-budget-tour',
                'base_price' => 6299.00,
            ],
            [
                'title' => 'EXPLORING CEBU',
                'city_name' => 'CEBU',
                'subtitle' => 'Cebu',
                'location' => 'CEBU',
                'duration' => '3 Days 2 Nights',
                'overview' => 'Make a stay at the oldest city in the Philippines!',
                'content' => '<h1><strong>REQUIRED PAX [ No Minimum Required ]<br>DURATION [ 3 Days 2 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>Providing you freedom to explore Cebu City! Please be guided on the date for your Departure. Discover and dive your adventure deeper!</p><p><strong>INCLUSION</strong></p><ul><li><p>Hotel Accommodation</p></li><li><p>Airport Transfer</p></li><li><p>Daily Breakfast</p></li></ul><p><strong>EXCLUSION</strong></p><ul><li><p>Airfare</p></li><li><p>Travel Insurance</p></li><li><p>Sightseeing Tour</p></li><li><p>Entrance and Environmental Fees</p></li><li><p>Others that are not mentioned above</p></li></ul><p><strong>Reminders</strong></p><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><p>&nbsp;</p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/6jio80sCdPDiAPWQTtIEkbznSnsEPIokf1jb1EUd.jpg',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/aVA9R4Vuxd9dGBRh6170dk3gQjHEGassvxfsyZus.png'],
                'slug' => 'exploring-cebu',
                'base_price' => 4699.00,
            ],
            [
                'title' => 'CEBU CITY TOUR + MOALBOAL + OSLOB (3 Days 2 Nights)',
                'city_name' => 'CEBU',
                'subtitle' => 'Cebu',
                'location' => 'CEBU',
                'duration' => '3 Days 2 Nights',
                'overview' => 'Explore great adventures on Cebu City, Moalboal, and Oslob! All-in-one package for 3 Days 2 Nights. Pick-up your gears and start your Adventure!',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]<br>DURATION [ 3 Days 2 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>Moalboal is a southern town famous for its natural marine life encounters, particularly the year-round sardine run and turtle sightings, making it a prime spot for diving and snorkeling. </p><p>Oslob is also located in the south, is renowned for the whale shark watching experience, where visitors can swim or snorkel with the gentle giants.</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL AT CEBU AIRPORT</strong></h3><p>Meet and Greet at the Airport and transfer to Hotel. Proceed to Cebu City Tour.</p><p><strong>PLACES TO VISIT</strong></p><ul><li><p>Sirao Garden</p></li><li><p>Taoist Temple</p></li><li><p>Yap San Diego Ancestral House</p></li><li><p>Plaza Independencia</p></li><li><p>Fort San Pedro</p></li><li><p>Basilica Minore de Sto. Niño de Cebu</p></li><li><p>Pasalubong Center</p></li><li><p>Magellan\'s Cross</p></li><li><p>Temple of Leah</p></li></ul><h3><strong>[ DAY 2 ] TRAVEL TO SOUTH</strong></h3><p><strong>HIGHLIGHTS</strong></p><ul><li><p><em>Moalboal Panagsama Beach</em></p></li><li><p><em>Sardines Run</em></p></li><li><p><em>Chasing Sea Turtles</em></p></li><li><p><em>Accommodation Drop off at Oslob</em></p></li><li><p><em>[Optional to Join] Kawasan Full Course Canyoneering with Lunch (Add 2,200php/pax)</em></p></li></ul><h3><strong>[DAY 3] OSLOB ADVENTURE</strong></h3><p>Travel back to Cebu.</p><p><strong>HIGHLIGHTS</strong></p><ul><li><p><em>Whaleshark Encounter</em></p></li><li><p><em>Oslob Cuartel</em></p></li><li><p><em>Carcar Pasalubong Haunting</em></p></li></ul><p>Then, Drop-off at Cebu Airport for Departure.</p><h1><strong>INCLUSION</strong></h1><ul><li><p>Roundtrip Airport Transfer Private</p></li><li><p>1 Night Accommodation (Cebu R Hotel or Similar)</p></li><li><p>1 Night Accommodation (South Cebu)</p></li><li><p>Daily Breakfast</p></li><li><p>Roundtrip Tour Transfer</p></li><li><p>Cebu City Tour-Private</p></li><li><p>Moalboal Tour-Private</p></li><li><p>Oslob Whaleshark Encounter</p></li><li><p>Driver as Tour Guide</p></li><li><p>Entrance &amp; Environmental Fee</p></li><li><p>Parking Fee</p></li><li><p>Boat Rental with Boat Guide</p></li><li><p>Life Vest and Snorkeling Gear</p></li><li><p>Travel Insurance</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Foreign Surcharge - 800php</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><p>&nbsp;</p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/YrYIkPsXToIk7C5y1u8wm2iXgFd8a1ZhFeM6QXtz.jpg',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/lKKpWlSyAQU7qVBxNku6Y50dgmHe4BflGLYdKA3B.jpg'],
                'slug' => 'cebu-city-tour-moalboal-oslob',
                'base_price' => 13699.00,
            ],
            [
                'title' => 'CEBU CITY TOUR + MOALBOAL + OSLOB (4 Days 3 Nights)',
                'city_name' => 'CEBU',
                'subtitle' => 'Cebu',
                'location' => 'CEBU',
                'duration' => '4 Days 3 Nights',
                'overview' => 'Explore great adventures on Cebu City, Moalboal, and Oslob! All-in-one package for 4 Days 3 Nights. Pick-up your gears and start your Adventure!',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]<br>DURATION [ 4 Days 3 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>Moalboal is a southern town famous for its natural marine life encounters, particularly the year-round sardine run and turtle sightings, making it a prime spot for diving and snorkeling.</p><p>Oslob is also located in the south, is renowned for the whale shark watching experience, where visitors can swim or snorkel with the gentle giants.</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL AT CEBU AIRPORT</strong></h3><p>Meet our representative at the Airport and transfer to Hotel. Free time until Check-In.</p><h3><strong>[ DAY 2 ] CEBU CITY TOUR</strong></h3><p><strong>PLACES TO VISIT</strong></p><ul><li><p>Sirao Flower Garden</p></li><li><p>Taoist Temple</p></li><li><p>Parian Heritage</p></li><li><p>Yap San Diego Ancestral House</p></li><li><p>Plaza Independencia</p></li><li><p>Fort San Pedro</p></li><li><p>Basilica Minore de Sto. Niño de Cebu</p></li><li><p>Magellan\'s Cross</p></li><li><p>Temple of Leah</p></li><li><p>10,000 Roses</p></li></ul><h3><strong>[DAY 3] SOUTH CEBU ADVENTURE</strong></h3><p><strong>HIGHLIGHTS</strong></p><ul><li><p><em>Sardines Run</em></p></li><li><p><em>Chasing Sea Turtles</em></p></li><li><p><em>Moalboal Panagsama Beach</em></p></li><li><p><em>Kawasan Falls only</em></p></li><li><p><em>[Optional] Full Course Canyoneering</em></p></li></ul><h3><strong>[DAY 4] FREE TIME</strong></h3><p>Free time, then travel back to Cebu City for Departure.</p><h1><strong>INCLUSION</strong></h1><ul><li><p>Roundtrip Airport Transfer Private</p></li><li><p>2 Nights Accommodation (Cebu R Hotel)</p></li><li><p>1 Night Accommodation (South Cebu)</p></li><li><p>Daily Breakfast</p></li><li><p>Roundtrip Tour Transfer-Private (Cebu City to South)</p></li><li><p>Cebu City Tour-Private</p></li><li><p>Moalboal Sardine Run</p></li><li><p>Chasing Sea Turtles</p></li><li><p>Entrance &amp; Environmental Fee</p></li><li><p>Travel Insurance</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Optional Activities/Tours</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><p>&nbsp;</p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/uEI1bCATxGCB25OE2heUhtYWtLnyYON2cS4TWulO.jpg',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/riXygjRUG7vnITfzik7v0UvkhFCW0PeNeBBU7OKB.jpg'],
                'slug' => 'cebu-city-tour-moalboal-oslob-1',
                'base_price' => 14399.00,
            ],
            [
                'title' => 'EL NIDO',
                'city_name' => 'PALAWAN',
                'subtitle' => 'Palawan',
                'location' => 'PALAWAN',
                'duration' => '3 Days 2 Nights',
                'overview' => 'A coastal town in Palawan, Philippines, famous for its breathtaking natural scenery, including limestone cliffs, white-sand beaches, and crystal-clear lagoons.',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]</strong><br><strong>DURATION [ 3 Days 2 Nights ]</strong><br><br><strong>DESCRIPTION</strong></h1><p>It is composed of 45 islands and islets within Bacuit Bay<u>,</u> known for diverse marine life and offering numerous activities like island hopping, diving, and kayaking. The area is a top tourist destination that draws visitors with its stunning landscapes, a testament to the "paradise" reputation of Palawan.</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL - PUERTO PRINCESA AIRPORT - EL NIDO</strong></h3><p>Arrive at Puerto Princesa Airport, meet our representative holding a Placard/Name in front of the Arrival Area.<br><strong>(Standard Check-In Time: 2:00 PM - 3:00 PM)</strong></p><h3><strong>[ DAY 2 ] TOUR A</strong></h3><p>Breakfast at Hotel, then proceed to your designated Tour.</p><h4><strong>Tour A</strong></h4><p>Big Lagoon, Simizu Island, Secret Lagoon, Payong Payong Island and Seven Commandos.</p><p><strong>*Please Note: </strong>After Tour drop off at the docking area, make your own transfer going back to the Hotel (You can ride a Tricycle).</p><h3><strong>[DAY 3] DEPARTURE - EL NIDO - PUERTO PRINCESA AIRPORT</strong></h3><p>Breakfast at Hotel, Free time until transfer to Airport.<br><strong>(Standard Check-Out Time: 12:00 NN)</strong></p><h1><strong>INCLUSION</strong></h1><ul><li><p>2 Nights at EL NIDO (Telesfora Beach Cottages or Similar)</p></li><li><p>Daily Breakfast</p></li><li><p>Roundtrip Airport Transfers</p></li><li><p>Tour A (Lunch Included)</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Travel Insurance</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p><p></p></li></ul><h3><em>*VALID UNTIL: December 2025</em></h3><p></p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/aPFH8L3FoFHEb7PBqdSsyteueQAvXNMG0Hdl4GCe.jpg',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/6wjO4Ym5A856ZMfkp4oMD0V3WDhmmFhFbJcZEjSs.jpg'],
                'slug' => 'el-nido',
                'base_price' => 7488.00,
            ],
            [
                'title' => 'CORON',
                'city_name' => 'PALAWAN',
                'subtitle' => 'Palawan',
                'location' => 'PALAWAN',
                'duration' => '3 Days 2 Nights',
                'overview' => 'A tropical island destination in the Philippines known for its stunning natural landscapes, including dramatic limestone cliffs, crystal-clear waters, and vibrant coral reefs.',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]<br>DURATION [ 3 Days 2 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>It is famous for world-class scuba diving, especially at WWII shipwreck sites, as well as for its pristine freshwater lakes and lagoons like Kayangan Lake and Twin Lagoon. The area offers a variety of activities, from island hopping and snorkeling to relaxing on white-sand beaches. &nbsp;</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL</strong></h3><p>Arrive at Busuanga Airport, meet our representative holding a Placard/Name then transfer to Hotel for Check In.<br><strong>(Standard Check In Time: 2:00 PM - 3:00 PM)</strong></p><h3><strong>[ DAY 2 ] CORON ULTIMATE TOUR C</strong></h3><p>Breakfast at Hotel, proceed to your designated Tour.</p><p><strong>Destination:</strong> <strong>(Pick Up Time: 8:00 AM - 8:30 AM)</strong> Kayangan Lake, Twin Lagoon, Siete Pecados Skeleton Wreck or Malwawey Beach, Coron Youth Club Beach, White Beach (Lunch Area).</p><h3><strong>[DAY 3] DEPARTURE</strong></h3><p>Breakfast at Hotel, Free time until transfer to Airport.<br><strong>(Standard Check Out Time: 12:00 NN)</strong></p><h1><strong>INCLUSION</strong></h1><ul><li><p>2 Nights Hotel Accommodation (Acacia Garden Inn or Similar)</p></li><li><p>Daily Breakfast</p></li><li><p>Roundtrip Airport Transfers</p></li><li><p>Coron Ultimate Tour C</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Travel Insurance</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><h3><strong>*VALID UNTIL: December 2025</strong></h3><p></p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/zOwhT4r3qmpYzZ7dslqnLyt0Y7zBjQWIGRUK3Cph.png',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/M3Us5BKDXP9JWFCwhznFJOo7HqOJuYIlXaDl3XOZ.jpg'],
                'slug' => 'coron',
                'base_price' => 6488.00,
            ],
            [
                'title' => 'COUNTRYSIDE',
                'city_name' => 'BOHOL',
                'subtitle' => 'Bohol',
                'location' => 'BOHOL',
                'duration' => '3 Days 2 Nights',
                'overview' => 'Is characterized by rolling hills, unique geological formations like the iconic Chocolate Hills, and lush landscapes.',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]<br>DURATION [ 3 Days 2 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>It is a mix of natural wonders, such as the Tarsier Sanctuary and Loboc River, and cultural sites, including ancient churches and the Bilar Man-Made Forest. The interior is a plateau with irregular landforms, and the region is also known for its rivers, waterfalls, and terraced rice fields.</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL</strong></h3><p>Meet at the Airport, then proceed to the Hotel for Check In.<br><strong>(Standard Check In Time: 3:00 PM)</strong></p><h3><strong>[ DAY 2 ] BOHOL COUNTRYSIDE TOUR</strong></h3><p>Breakfast at Hotel, proceed to your destination Tour.</p><p><strong>PLACES TO VISIT</strong></p><ul><li><p>Chocolate Hills</p></li><li><p>Python Tarsier Conservatory</p></li><li><p>Baclayon Church</p></li><li><p>Man-Made Forest</p></li><li><p>Loboc Floating Resto</p></li><li><p>Blood Compact</p></li></ul><h3><strong>[DAY 3] DEPARTURE</strong></h3><p>Breakfast at Hotel, Free time until transfer to Airport for Departure.<br><strong>(Standard Check-Out Time: 12:00 NN)</strong></p><h1><strong>INCLUSION</strong></h1><ul><li><p>Roundtrip Airport Transfer</p></li><li><p>2 Nights Hotel Accomodation (MGH Alona Resort or Similar)</p></li><li><p>Daily Breakfast</p></li><li><p>Bohol Countryside Tour with Loboc River Lunch</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Travel Insurance</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><h3><strong>*VALID UNTIL: December 2025</strong></h3><p></p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/qyfdpzqFcB9mDiHDtDjtH84sAlbvE6demZsrwbCr.jpg',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/KgeiPCHiMeQWXGn8pQU8T8MyfFJx2pkx6YBMKkhI.jpg'],
                'slug' => 'countryside-tour',
                'base_price' => 8488.00,
            ],
            [
                'title' => 'DUMAGUETE',
                'city_name' => 'NEGROS ORIENTAL',
                'subtitle' => 'Negros Oriental',
                'location' => 'NEGROS ORIENTAL',
                'duration' => '3 Days 2 Nights',
                'overview' => 'A coastal city in the Philippines, capital of Negros Oriental, known as the "City of Gentle People" for its friendly residents and "University City" due to its numerous educational institutions like Silliman University.',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]</strong><br><strong>DURATION [ 3 Days 2 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>It serves as a cultural and commercial hub for the province and a major seaport, situated on the southeastern coast of Negros island. The city is also a gateway for exploring nearby natural attractions, beaches, and diving spots.</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL</strong></h3><p>Meet at the Airport and transfer to Hotel.<br><strong>(Standard Check-In Time: 2:00 PM - 3:00 PM)</strong></p><h3><strong>[ DAY 2 ] FREE TIME</strong></h3><p>Breakfast at Hotel, Free time at your own Leisure.</p><h3><strong>[DAY 3] DEPARTURE</strong></h3><p>Breakfast, Free time until Check Out. Transfer to Airport for Departure.<br><strong>(Standard Check-Out Time: 12:00 NN)</strong></p><h1><strong>INCLUSION</strong></h1><ul><li><p>2 Nights Hotel Accommodation (Hotel Essencia 3 or Similar)</p></li><li><p>Roundtrip Dumaguete Airport transfers on Private Airconditioned Van/Dumaguete Seaport additional Php 500/Pax</p></li><li><p>All Hotel taxes and surcharges</p></li><li><p>Daily Breakfast</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Travel Insurance</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><h3><strong>*VALID UNTIL: December 2025</strong></h3><p></p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/IwZjzcmo3fcBzFrLycTF4sxmnZXk5pqv2ozDwQPz.png',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/qQJErkAqtyHGTjmaTZH2KereRMKciaGnCzEoBOam.png'],
                'slug' => 'dumaguete',
                'base_price' => 6388.00,
            ],
            [
                'title' => 'SIARGAO',
                'city_name' => 'SURIGAO DEL NORTE',
                'subtitle' => 'Surigao Del Norte',
                'location' => 'SURIGAO DEL NORTE',
                'duration' => '3 Days 2 Nights',
                'overview' => 'A teardrop-shaped island in the Philippines, known as the "Surfing Capital of the Philippines" for its world-class waves like Cloud 9.',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]<br>DURATION [ 3 Days 2 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>It is famous for its stunning natural beauty, including white-sand beaches, clear turquoise lagoons, lush palm forests, and unique rock pools. Beyond surfing, the island offers other activities like island hopping, snorkeling, diving, and exploring caves and waterfalls.</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] SIARGAO</strong></h3><p>Arrival at Sayak/Del Carmen Airport. Please proceed to the Parking Area to meet and greet by our Airport Care Representative. Transfer to Hotel for Check In.<br><strong>(Standard Check-In Time: 2:00 PM - 3:00 PM)</strong></p><h3><strong>[ DAY 2 ] TOUR A + LUNCH</strong></h3><p>Breakfast at Hotel, proceed to your destinated Tour.<br><strong>(Standard Check-Out Time: 12:00 NN)</strong></p><p><strong>Highlights</strong><br><em>Trio Island Hopping (Daku, Naked, Guyam)<br>Lake Lagoon</em></p><h3><strong>[DAY 3] DEPARTURE</strong></h3><p>Breakfast at Hotel, Free time until transfer to Airport.<br><strong>(Standard Check-Out Time: 12:00 NN)</strong></p><h1><strong>INCLUSION</strong></h1><ul><li><p>2 Nights Hotel Accommodation (Ocean 101 Resort or Similar) + Breakfast</p></li><li><p>Roundtrip Airport Transfer</p></li><li><p>Lunch + Bottled Water + Softdrinks</p></li><li><p>[Tour A] Island Hopping (Daku, Naked, Guyam)</p></li><li><p>All Entrance Fees</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Travel Insurance</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><h3><strong>*VALID UNTIL: December 2025</strong></h3><p></p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/gr2Naw3t4RG0gr2wkunSHTdmwvjxTj8389ajFFIT.png',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/aFyOQkQZJaRyTadFK2r4VWOVfNxgKyhZo3ezcwS6.png'],
                'slug' => 'siargao',
                'base_price' => 8888.00,
            ],
            [
                'title' => 'NORTH AND SOUTH BATAN',
                'city_name' => 'BATANES',
                'subtitle' => 'Batanes',
                'location' => 'BATANES',
                'duration' => '3 Days 2 Nights',
                'overview' => 'Is the northernmost and smallest province of the Philippines, an archipelagic group of 10 islands known for its stunning landscapes, unique Ivatan culture, and rugged beauty shaped by wind and waves.',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]<br>DURATION [ 3 Days 2 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>It is characterized by scenic waters, dramatic cliffs, rolling hills, and traditional stone houses built to withstand strong winds, with its capital, Basco, located on Batan Island.</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL NORTH BATAN (VIA TRICYCLE)</strong></h3><p>Upon Arrival at Basco Airport, meet our representative then proceed to North Batan after Tour transfer to Hotel for Check In.<br><strong>(Standard Check-In Time: 2:00 PM - 3:00 PM)</strong></p><p><strong>PRIVATE TOURS</strong></p><ul><li><p>North Batan with lunch.</p></li></ul><h3><strong>[ DAY 2 ] SOUTH BATAN (VIA TRICYCLE)</strong></h3><p>Breakfast in Hotel, proceed to North and South Batan Tour inclusions (Via Cogon Tricycle).</p><p><strong>PRIVATE TOURS</strong></p><ul><li><p>South Batan with Lunch</p></li><li><p>Accredited Tour Guide</p></li><li><p>Tour Transport Service</p></li><li><p>Ecotourism Fees</p></li><li><p>PA (Protected Area) Entrance Fee/DENR (Department of Environment and Natural Resources)</p></li><li><p>Mahatao Environmental Fees</p></li></ul><h3><strong>[DAY 3] DEPARTURE</strong></h3><p>Breakfast at Hotel, Free time until transfer to Airport.<br><strong>(Standard Check-Out Time: 9:00 AM)</strong></p><h1><strong>INCLUSION</strong></h1><ul><li><p>2 Nights Hotel Accommodation (Casa Feliciano or Similar)</p></li><li><p>Daily Breakfast</p></li><li><p>Roundtrip Airport Transfers</p></li><li><p>North and South Batan Tour</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Travel Insurance</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><h3><strong>*VALID UNTIL: December 2025</strong></h3><p>&nbsp;</p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/ytahUMhkP0kywJrOV3OhFJOx8odwm6yL4nBmQ7ZH.jpg',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/peWGhfo1MITqadhjyvEGVISixbyCaedy9RmGSFXc.jpg'],
                'slug' => 'north-and-south-batan',
                'base_price' => 8288.00,
            ],
            [
                'title' => 'CEBU CITY TOUR',
                'city_name' => 'CEBU',
                'subtitle' => 'Cebu',
                'location' => 'CEBU',
                'duration' => '3 Days 2 Nights',
                'overview' => 'An island province in the Philippines known as the "Queen City of the South," offering a mix of vibrant city life and natural beauty, from modern urban centers like Cebu City to scenic beaches and mountains.',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]<br>DURATION [ 3 Days 2 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>It is the oldest city in the country and serves as a major commercial, industrial, and cultural hub, while the rest of the island provides opportunities for adventure travel and nature exploration.</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL</strong></h3><p>Meet at the Airport and transfer to Hotel.<br><strong>(Standard Check-In Time: 2:00 PM)</strong></p><h3><strong>[ DAY 2 ] CITY TOUR + UPHILL + 10,000 ROSES</strong></h3><p>Breakfast at Hotel, proceed to your designated Tour. After Tour Drop Off at SM Cebu City (Guest own transfer back to Hotel).</p><p><strong>PLACES TO VISIT</strong></p><ul><li><p>Sirao Garden</p></li><li><p>Basilica Minore del Sto Niño de Cebu</p></li><li><p>Tops Lookout</p></li><li><p>Fort San Pedro</p></li><li><p>Taoist Temple</p></li><li><p>Souvenir Shop</p></li><li><p>Cebu Heritage Tour</p></li><li><p>Running Tour (CCLEX)</p></li><li><p>Magellan\'s Cross</p></li><li><p>10,000 Roses</p></li></ul><h3><strong>[DAY 3] DEPARTURE</strong></h3><p>Breakfast at Hotel, Free time until transfer to Airport for Departure.<br><strong>(Standard Check-Out Time: 12:00 NN)</strong></p><h1><strong>INCLUSION</strong></h1><ul><li><p>2 Nights Hotel Accommodation (Rublin Hotel or Similar)</p></li><li><p>All Hotel Taxes and Surcharges</p></li><li><p>Daily breakfast, roundtrip Airport Transfer (Private)</p></li><li><p>Cebu City Tour + Uphill + 10,000 Roses (Joiners)</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Travel Insurance</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><h3><strong>*VALID UNTIL: December 2025</strong></h3><p>&nbsp;</p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/V5dKCee5MUjXVU7qKPUNWnyXn6rfmQvOzH5m2DrE.jpg',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/LMc1x8PbNBEw2AAFjGCoaulLwutqS4icrhFaUv1r.jpg'],
                'slug' => 'cebu-city-tour',
                'base_price' => 12888.00,
            ],
            [
                'title' => 'CAGAYAN + CAMIGUIN',
                'city_name' => 'CAGAYAN DE ORO + CAMIGUIN ISLAND',
                'subtitle' => 'Cagayan De Oro + Camiguin Island',
                'location' => 'CAGAYAN DE ORO + CAMIGUIN ISLAND',
                'duration' => '4 Days 3 Nights',
                'overview' => 'Cagayan is a province in the northeastern Philippines, situated in the Cagayan Valley region and known as the "Smiling Land of Beauty". Camiguin is often called the "Island Born of Fire" due to its seven volcanoes.',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]<br>DURATION [ 4 Days 3 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>Cagayan De Oro is bordered by mountain ranges, is home to the longest river in the country (the Cagayan River), and offers a diverse landscape of valleys, mountains, and coastal areas.</p><p>Camiguin Island is known for its natural beauty, featuring a mix of volcanic landscapes with pristine beaches, lush forests, waterfalls, and hot and cold springs.</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL</strong></h3><p>Meet at the Airport and transfer to Hotel.<br><strong>(Standard Check-In Time: 2:00 PM - 3:00 PM)</strong></p><h3><strong>[ DAY 2 ] CAGAYAN TO CAMIGUIN</strong></h3><p><strong>(Pick Up Time: 4:00 AM)</strong> Then transfer to Camiguin Island. Upon Arrival in Camiguin Island, proceed to Island Tour. After Tour, transfer to Hotel for Check In. Overnight in Camiguin Island.</p><p><strong>HIGHLIGHTS</strong><br><em>Mantigue Island<br>Katunggan Coastal Eco Park<br>Sunken Cemetery<br>Guiob Church Ruins<br>Sto. Niño Cold Spring<br>Tuasan Falls<br>Beehive Driftwood Cafe</em></p><h3><strong>[DAY 3] CAMIGUIN TO CAGAYAN</strong></h3><p>Proceed to White Island in the early morning. Breakfast at Hotel, <strong>(Standard Check-Out Time: 12:00 NN). </strong>Then transfer to Cagayan De Oro for Check In. Free time at your own Leisure.</p><h3><strong>[DAY 4] DEPARTURE (CAGAYAN)</strong></h3><p>Breakfast, Free time until Check Out. Transfer to Airport for Departure.<br><strong>(Standard Check-Out Time: 12:00 NN)</strong></p><h1><strong>INCLUSION</strong></h1><ul><li><p>2 Days Accommodation in Cagayan De Oro</p></li><li><p>1 Night Accommodation in Camiguin Island</p></li><li><p>Daily Breakfast</p></li><li><p>Roundtrip Airport to Hotel Transfers (Private)</p></li><li><p>Roundtrip Transfers from Cagayan De Oro to Dahilayan (Bukidnon Drop By at Del Monte Plantation for Photo-op)</p></li><li><p>Roundtrip Land Transfers from Cagayan De Oro to Balingoan Port</p></li><li><p>Tours Specified in the Itinerary</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Travel Insurance</p></li><li><p>Roundtrip Ferry to Camiguin Island (Around 750php/pax)</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><h3><strong>*VALID UNTIL: December 2025</strong></h3><p>&nbsp;</p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/gdVMY6Rl6LMPksfjOyamycj4DC755T8UnH3bigmf.jpg',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/0v4JYwL55QG1cpOgqtt5bOLslBw4eL10KQEfid0m.jpg'],
                'slug' => 'cagayan-camiguin',
                'base_price' => 19788.00,
            ],
            [
                'title' => 'BORACAY',
                'city_name' => 'AKLAN',
                'subtitle' => 'Aklan',
                'location' => 'AKLAN',
                'duration' => '4 Days 3 Nights',
                'overview' => 'A small tropical island in the Philippines famous for its powdery white sand, crystal-clear turquoise waters, and stunning sunsets.',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 4 PAX ]<br>DURATION [ 4 Days 3 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>Located in the Western Visayas region, it\'s divided into three main stations along its famous White Beach, each offering a different vibe: Station 1 for upscale resorts, Station 2 for vibrant nightlife, and Station 3 for more budget-friendly and quiet stays. The island offers a wide range of activities, from water sports like island-hopping and parasailing to enjoying the lively atmosphere and various restaurants.</p><h1><strong>INCLUSION</strong></h1><ul><li><p>3 Nights Hotel Accommodation (La Carmela de Boracay)</p></li><li><p>Daily Platted Breakfast (First 2 days)</p></li><li><p>Roundtrip Airport Transfers (Bus, Boat, Multicab)</p></li><li><p>Port Terminal and Environmental Fees</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Breakfast on 3rd day</p></li><li><p>Travel Insurance</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li></ul><p>&nbsp;</p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/RHA42rGH350DziPuFZRclNwHsUjQAUr3aU0zuxzn.jpg',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/6kEfN0XX3LxKMJMXN5Y3CRFzJlpcOmNKkvpPJLDX.webp'],
                'slug' => 'boracay',
                'base_price' => 4388.00,
            ],
            [
                'title' => 'BACOLOD',
                'city_name' => 'NEGROS OCCIDENTAL',
                'subtitle' => 'Negros Occidental',
                'location' => 'NEGROS OCCIDENTAL',
                'duration' => '3 Days 2 Nights',
                'overview' => 'The capital city of Negros Occidental, known as the "City of Smiles", the "Sugar City", and a center for communication, trade, and services in the Philippines.',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]<br>DURATION [ 3 Days 2 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>It\'s situated on a coastal plain on the northwest part of Negros Island, facing the Guimaras Strait, and is home to the famous MassKara Festival. The city is known for its progressive nature, friendly people, and local delicacies like Chicken Inasal.</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL</strong></h3><p>Meet at the Airport and transfer to Hotel.<br><strong>(Standard Check-In Time: 2:00 PM - 3:00 PM)</strong></p><h3><strong>[ DAY 2 ] FREE TIME</strong></h3><p>After breakfast at Hotel, Free time at your own Leisure.</p><h3><strong>[DAY 3] DEPARTURE</strong></h3><p>Breakfast, Free time until Check Out. Transfer to Airport for Departure.<br><strong>(Standard Check-Out Time: 12:00 NN)</strong></p><h1><strong>INCLUSION</strong></h1><ul><li><p>2 Nights Hotel Accommodation (Circle Inn Hotel 3 or Similar)</p></li><li><p>All Hotel taxes and surcharges</p></li><li><p>Daily Breakfast</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Travel Insurance</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><h3><strong>*VALID UNTIL: December 2025</strong></h3><p>&nbsp;</p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/4mPCgazDvdEMhLaS5moFShOFdwEU59IIWmnUbT4Y.jpg',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/duGws9483ZoqBNwsyAE8OSo5WzoYEWSBxvCbau0c.jpg'],
                'slug' => 'bacolod',
                'base_price' => 7488.00,
            ],
            [
                'title' => 'ILO-ILO CITY TOUR WITH GARIN FARM',
                'city_name' => 'ILO-ILO',
                'subtitle' => 'ILO-ILO',
                'location' => 'ILO-ILO',
                'duration' => '3 Days 2 Nights',
                'overview' => 'A province in the Philippines known as the "Heart of the Philippines," renowned for its rich history, vibrant culture, and diverse natural landscapes.',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]<br>DURATION [ 3 Days 2 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>A major regional hub for commerce, education, and governance, with a history as the last capital of the Spanish Empire in Asia and the Pacific. The province is a mix of bustling urban life and tranquil retreats, offering historical sites, old churches, and beautiful beaches and islands.</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL</strong></h3><p>Meet at the Airport and transfer to Hotel.<br><strong>(Standard Check-In Time: 2:00 PM - 3:00 PM)</strong></p><h3><strong>[ DAY 2 ] ILO-ILO CITY TOUR WITH GARIN FARM</strong></h3><p>Breakfast at Hotel, <strong>Pick Up at 8:00 AM</strong> for your ILO-ILO City Tour.</p><p><strong>PLACES TO VISIT</strong></p><ul><li><p>Garin Farm</p></li><li><p>Miagao Church</p></li><li><p>Guimbal Vanishing Mansion</p></li><li><p>Esplanade ILO-ILO</p></li><li><p>Molo Church</p></li><li><p>Brandy Museum</p></li><li><p>Megaworld Business Center</p></li><li><p>ILO-ILO Convention Center</p></li><li><p>Festive Walk</p></li><li><p>Provincial Capitol</p></li><li><p>Museo ILO-ILO</p></li><li><p>Old Prison ILO-ILO</p></li><li><p>Lapaz District</p></li><li><p>Madge Cafe</p></li><li><p>Casa Mariquit</p></li><li><p>Jaro Metropolitan Cathedral</p></li><li><p>Original Biscocho Haus</p></li></ul><h3><strong>[DAY 3] DEPARTURE</strong></h3><p>Breakfast, Free time until Check Out. Transfer to Airport for Departure.<br><strong>(Standard Check-Out Time: 12:00 NN)</strong></p><h1><strong>INCLUSION</strong></h1><ul><li><p>2 Nights Hotel Accommodation (Century 21 Hotel or Similar)</p></li><li><p>Daily Breakfast</p></li><li><p>ILO-ILO City Tour with Garin Farm</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Travel Insurance</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><h3><strong>*VALID UNTIL: December 2025</strong></h3><p>&nbsp;</p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/5jDj5MWAhKChc2mHUavjSbU6ImOKCDldjoMoTBGk.png',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/RxMHQIBFxrzsV4cYq58K7M48d039pHE1Chxg0GKg.jpg'],
                'slug' => 'ilo-ilo-city-tour-with-garin-farm',
                'base_price' => 6988.00,
            ],
            [
                'title' => 'DAVAO CITY TOUR',
                'city_name' => 'DAVAO',
                'subtitle' => 'Davao Region',
                'location' => 'DAVAO',
                'duration' => '3 Days 2 Nights',
                'overview' => 'A highly-urbanized city in the southern Philippines, located on the island of Mindanao. It is known as a regional hub for commerce and is the largest city in the Philippines by land area.',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]<br>DURATION [ 3 Days 2 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>It is known as the "Durian Capital of the Philippines" and is a regional hub for commerce and industry. Its diverse attractions include the Philippine Eagle Center, the Davao Crocodile Park, and the natural beauty of Mount Apo, the Philippines\' highest peak. The city is also characterized by its cultural heritage, vibrant culinary scene, and multicultural population</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL</strong></h3><p>Meet at the Airport and transfer to Hotel.<br><strong>(Standard Check-In Time: 2:00 PM - 3:00 PM)</strong></p><h3><strong>[ DAY 2 ] FREE TIME</strong></h3><p>Breakfast at Hotel, Free time at your own Leisure.</p><h3><strong>[DAY 3] DEPARTURE</strong></h3><p>Breakfast, Free time until Check Out. Transfer to Airport for Departure.<br><strong>(Standard Check-Out Time: 12:00 NN)</strong></p><h1><strong>INCLUSION</strong></h1><ul><li><p>2 Nights Hotel Accommodation (Crevice Hotel or Similar)</p></li><li><p>All Hotel taxes and surcharges</p></li><li><p>Daily Breakfast</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Travel Insurance</p></li><li><p>Roundtrip Ferry to Camiguin Island (Around 750php/pax)</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><h3><strong>*VALID UNTIL: December 2025</strong></h3><p>&nbsp;</p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/BItkMRcVjKlWmHCDWLy3gTkfPNujuASDiSSJkoep.jpg',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/wu6GrH6xab2uBiiFJfeWbf2VQYUe47wuuEsVkgto.jpg'],
                'slug' => 'davao-city-tour',
                'base_price' => 7488.00,
            ],
            [
                'title' => 'CEBU + BOHOL',
                'city_name' => 'CEBU',
                'subtitle' => 'Cebu | Bohol',
                'location' => 'CEBU',
                'duration' => '4 Days 3 Nights',
                'overview' => 'Combines City highlights in Cebu with Bohol\'s natural and historical sites, often including a ferry ride and a day tour of Bohol\'s key attractions like the Chocolate Hills, Loboc River Cruise, and Tarsier sanctuary.',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]<br>DURATION [ 4 Days 3 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>A Cebu and Bohol tour package typically combines city exploration in Cebu with natural attractions in Bohol, allowing you to see historical sites like Magellan\'s Cross in Cebu and natural wonders such as the Chocolate Hills and tarsiers in Bohol. Packages vary, but often include travel between the islands, guided tours of key attractions, and sometimes unique experiences like a Loboc River cruise with lunch. You can find options ranging from a single day trip to Bohol from Cebu, to a multi-day tour that covers more sites on both islands.</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL AT CEBU</strong></h3><p>Meet at the Airport and proceed to Hotel for Check-In.<br><strong>(Standard Check-In Time: 2:00 PM - 3:00 PM)</strong></p><h3><strong>[ DAY 2 ] CEBU CITY + UPHILL + 10,000 ROSES</strong></h3><p>Breakfast at Hotel, proceed to your designated Tour. After Tour Drop-Off at SM Cebu City (Guest own transfer back to Hotel).</p><p><strong>TOUR ITINERARY</strong></p><ul><li><p>Sirao Pictorial Garden and Camping Site</p></li><li><p>Fort San Pedro</p></li><li><p>Temple of Leah</p></li><li><p>Pasalubong Center Souvenir Shop</p></li><li><p>Taoist Temple</p></li><li><p>[Running Tour] Colon Street and CCLEX</p></li><li><p>Cebu Heritage Monument</p></li><li><p>10,000 Roses</p></li><li><p>Magellan\'s Cross</p></li><li><p>Basilica Minore del Sto. Niño de Cebu</p></li></ul><h3><strong>[DAY 3] CEBU TO BOHOL COUNTRYSIDE TOUR</strong></h3><p>Breakfast at Hotel, then proceed to Tagbilaran Port. Arrival in Bohol, Transfer to Bohol Countryside Tour, After Tour transfer to Hotel for Check In.</p><p><strong>PLACES TO VISIT</strong></p><ul><li><p>Chocolate Hills</p></li><li><p>Python Tarsier Conservatory</p></li><li><p>Blood Compact</p></li><li><p>Man-made Forest</p></li><li><p>Baclayon Church</p></li><li><p>Loboc River Floating Restaurant</p></li></ul><p><strong>*IMPORTANT NOTE</strong></p><p><strong>Child Rate:</strong> Less 5,000php/child (3-7 Years Old)</p><h3><strong>[DAY 4] BOHOL DEPARTURE</strong></h3><p>Breakfast, Free time until Check Out. Transfer to Airport for Departure.<br><strong>(Standard Check-Out Time: 12:00 NN)</strong></p><h1><strong>INCLUSION</strong></h1><ul><li><p>2 Nights Hotel Accommodation at Cebu (Rublin Hotel or Similar)</p></li><li><p>1 Night Hotel Accommodation at Bohol (MGH Alona Resort or Similar)</p></li><li><p>All Hotel taxes and surcharges</p></li><li><p>Daily Breakfast</p></li><li><p>Roundtrip Airport Transfer for both Cities (Private)</p></li><li><p>Ocean Jet Ticket (for Cebu To Bohol)</p></li><li><p>Cebu City Tour + Uphill + 10,000 Roses (Joiners)</p></li><li><p>Bohol Countryside Tour with Loboc River Lunch</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Travel Insurance</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><h3><strong>*VALID UNTIL: December 2025</strong></h3><p>&nbsp;</p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/pbUOkLbQnDs8O2TWRMzkM3n5NpKuZNfz9EFngrIE.jpg',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/lYzFuewk4iHSYSD6NBAiMN3x2gf0ExOHAEulqU6h.jpg'],
                'slug' => 'cebu-bohol',
                'base_price' => 12888.00,
            ],
            [
                'title' => 'CEBU + BOHOL',
                'city_name' => 'BOHOL',
                'subtitle' => 'Cebu | Bohol',
                'location' => 'BOHOL',
                'duration' => '4 Days 3 Nights',
                'overview' => 'Combines City highlights in Cebu with Bohol\'s natural and historical sites, often including a ferry ride and a day tour of Bohol\'s key attractions like the Chocolate Hills, Loboc River Cruise, and Tarsier sanctuary.',
                'content' => '<h1><strong>REQUIRED PAX [ Minimum of 2 PAX ]<br>DURATION [ 4 Days 3 Nights ]</strong></h1><h1><strong>DESCRIPTION</strong></h1><p>A Cebu and Bohol tour package typically combines city exploration in Cebu with natural attractions in Bohol, allowing you to see historical sites like Magellan\'s Cross in Cebu and natural wonders such as the Chocolate Hills and tarsiers in Bohol. Packages vary, but often include travel between the islands, guided tours of key attractions, and sometimes unique experiences like a Loboc River cruise with lunch. You can find options ranging from a single day trip to Bohol from Cebu, to a multi-day tour that covers more sites on both islands.</p><h1><strong>ITINERARY</strong></h1><h3><strong>[ DAY 1 ] ARRIVAL AT CEBU</strong></h3><p>Meet at the Airport and proceed to Hotel for Check-In.<br><strong>(Standard Check-In Time: 2:00 PM - 3:00 PM)</strong></p><h3><strong>[ DAY 2 ] CEBU CITY + UPHILL + 10,000 ROSES</strong></h3><p>Breakfast at Hotel, proceed to your designated Tour. After Tour Drop-Off at SM Cebu City (Guest own transfer back to Hotel).</p><p><strong>TOUR ITINERARY</strong></p><ul><li><p>Sirao Pictorial Garden and Camping Site</p></li><li><p>Fort San Pedro</p></li><li><p>Temple of Leah</p></li><li><p>Pasalubong Center Souvenir Shop</p></li><li><p>Taoist Temple</p></li><li><p>[Running Tour] Colon Street and CCLEX</p></li><li><p>Cebu Heritage Monument</p></li><li><p>10,000 Roses</p></li><li><p>Magellan\'s Cross</p></li><li><p>Basilica Minore del Sto. Niño de Cebu</p></li></ul><h3><strong>[DAY 3] CEBU TO BOHOL COUNTRYSIDE TOUR</strong></h3><p>Breakfast at Hotel, then proceed to Tagbilaran Port. Arrival in Bohol, Transfer to Bohol Countryside Tour, After Tour transfer to Hotel for Check In.</p><p><strong>PLACES TO VISIT</strong></p><ul><li><p>Chocolate Hills</p></li><li><p>Python Tarsier Conservatory</p></li><li><p>Blood Compact</p></li><li><p>Man-made Forest</p></li><li><p>Baclayon Church</p></li><li><p>Loboc River Floating Restaurant</p></li></ul><p><strong>*IMPORTANT NOTE</strong></p><p><strong>Child Rate:</strong> Less 5,000php/child (3-7 Years Old)</p><h3><strong>[DAY 4] BOHOL DEPARTURE</strong></h3><p>Breakfast, Free time until Check Out. Transfer to Airport for Departure.<br><strong>(Standard Check-Out Time: 12:00 NN)</strong></p><h1><strong>INCLUSION</strong></h1><ul><li><p>2 Nights Hotel Accommodation at Cebu (Rublin Hotel or Similar)</p></li><li><p>1 Night Hotel Accommodation at Bohol (MGH Alona Resort or Similar)</p></li><li><p>All Hotel taxes and surcharges</p></li><li><p>Daily Breakfast</p></li><li><p>Roundtrip Airport Transfer for both Cities (Private)</p></li><li><p>Ocean Jet Ticket (for Cebu To Bohol)</p></li><li><p>Cebu City Tour + Uphill + 10,000 Roses (Joiners)</p></li><li><p>Bohol Countryside Tour with Loboc River Lunch</p></li></ul><h1><strong>EXCLUSION</strong></h1><ul><li><p>Airfare</p></li><li><p>Travel Insurance</p></li><li><p>Others that are not mentioned above</p></li></ul><h1><strong>Reminders</strong></h1><ul><li><p>Rate is subject to change without prior notice</p></li><li><p>All rooms are subject to availability</p></li><li><p>Not applicable for Christmas, New Year, and Holidays</p></li></ul><h3><strong>*VALID UNTIL: December 2025</strong></h3><p>&nbsp;</p>',
                'image_overview' => 'https://cavitetigertours.com/storage/packages/0IH16DECVrv8enZX8xyLwJ3YnMAcjLs4eMLjVJEx.jpg',
                'image_banner' => ['https://cavitetigertours.com/storage/packages/S2PV0DJO4UT4VNlbRtHIujrI5VfwYlzWhlVyT4lo.jpg'],
                'slug' => 'cebu-bohol-1',
                'base_price' => 12888.00,
            ],
        ];

        // Create all tour packages
        foreach ($packages as $packageData) {
            TourPackage::create([
                'title' => $packageData['title'],
                'city_id' => $cityMap[$packageData['city_name']],
                'subtitle' => $packageData['subtitle'],
                'location' => $packageData['location'],
                'duration' => $packageData['duration'],
                'overview' => $packageData['overview'],
                'content' => $packageData['content'],
                'image_overview' => $packageData['image_overview'],
                'image_banner' => json_encode($packageData['image_banner']),
                'slug' => $packageData['slug'],
                'base_price' => $packageData['base_price'],
            ]);
        }
    }
}
