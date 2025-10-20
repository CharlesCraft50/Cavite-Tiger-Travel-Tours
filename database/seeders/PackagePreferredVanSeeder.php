<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PackagePreferredVanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [];
        $id = 1;

        for ($package = 1; $package <= 18; $package++) {
            for ($van = 1; $van <= 9; $van++) {
                $data[] = [
                    'id' => $id++,
                    'tour_package_id' => $package,
                    'preferred_van_id' => $van,
                ];
            }
        }

        DB::table('package_preferred_van')->insert($data);
    }
}
