<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\TourPackagesTableSeeder;
use Database\Seeders\UsersTableSeeder;
use Database\Seeders\PreferredVansTableSeeder;
use Database\Seeders\OtherServicesTableSeeder;
use Database\Seeders\VanCategoryTableSeeder;

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

    }

    
}