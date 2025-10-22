<?php

namespace Database\Seeders;

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
    }
}
