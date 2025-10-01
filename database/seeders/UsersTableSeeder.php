<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@admin.com',
            'password' => Hash::make('asdasd'),
            'email_verified_at' => now(),
            'role' => 'admin',
            'contact_number' => '639954682734',
            'address' => 'Admin Headquarters',
        ]);

        // Add drivers with names
        User::create([
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'email' => 'juan.delacruz@example.com',
            'password' => Hash::make('driverpass1'),
            'email_verified_at' => now(),
            'role' => 'driver',
            'contact_number' => '639170000001',
            'address' => '123 Driver St, Manila',
        ]);

        User::create([
            'first_name' => 'Maria',
            'last_name' => 'Santos',
            'email' => 'maria.santos@example.com',
            'password' => Hash::make('driverpass2'),
            'email_verified_at' => now(),
            'role' => 'driver',
            'contact_number' => '639170000002',
            'address' => '456 Santos Ave, Quezon City',
        ]);

        User::create([
            'first_name' => 'Pedro',
            'last_name' => 'Reyes',
            'email' => 'pedro.reyes@example.com',
            'password' => Hash::make('driverpass3'),
            'email_verified_at' => now(),
            'role' => 'driver',
            'contact_number' => '639170000003',
            'address' => '789 Reyes St, Cebu City',
        ]);

        User::create([
            'first_name' => 'Jeff',
            'last_name' => 'Lanugan',
            'email' => 'jefherd.lanugan@gmail.com',
            'password' => Hash::make('userpass1'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000004',
            'address' => '101 Lanugan Rd, Davao City',
        ]);

    }
}
