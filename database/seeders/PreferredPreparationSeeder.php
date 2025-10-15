<?php

namespace Database\Seeders;

use App\Models\PreferredPreparation;
use Illuminate\Database\Seeder;

class PreferredPreparationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PreferredPreparation::insert([
            [
                'name' => 'land',
                'label' => 'Land Preparation (Airplane ticket is not included; Provided by the Customer)',
                'requires_valid_id' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'all_in',
                'label' => 'ALL-IN Preparation (Airplane ticket is included; Provided by Cavite Tiger)',
                'requires_valid_id' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
