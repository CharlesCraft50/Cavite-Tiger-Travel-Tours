<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\VanCategory;

class VanCategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $categories = [
            'GL Grandia',
            'High Roof Van',
            'Commuter Van',
            'Deluxe Van',
            'Traveller XL',
            'VIP Deluxe',
        ];

        foreach ($categories as $index => $name) {
            VanCategory::updateOrCreate(
                ['name' => $name],
                ['sort_order' => $index + 1]
            );
        }
    }
}
