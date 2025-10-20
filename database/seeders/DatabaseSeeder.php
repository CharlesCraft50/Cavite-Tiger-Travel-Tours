<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CountryCitiesTableSeeder::class,
        ]);

        $this->call([
            UsersTableSeeder::class,
        ]);

        $this->call([
            VanCategoryTableSeeder::class,
        ]);

        $this->call([
            PreferredVansTableSeeder::class,
        ]);

        $this->call([
            TourPackagesTableSeeder::class,
            PackagePreferredVanSeeder::class,
        ]);

        $this->call([
            PreferredPreparationSeeder::class,
        ]);

    }
}
