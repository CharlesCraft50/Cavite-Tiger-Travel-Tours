<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            TourPackagesTableSeeder::class,
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
            OtherServicesTableSeeder::class,
        ]);

        $this->call([
            PreferredPreparationSeeder::class,
        ]);

    }
}
