<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use Illuminate\Database\Seeder;

class CountryCitiesTableSeeder extends Seeder
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
    }
}
