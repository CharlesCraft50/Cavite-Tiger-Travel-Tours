<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'password' => Hash::make('asdasd'),
            'email_verified_at' => now(),
            'role' => 'admin',
        ]);

        // Add drivers with names
        User::create([
            'name' => 'Juan Dela Cruz',
            'email' => 'juan.delacruz@example.com',
            'password' => Hash::make('driverpass1'),
            'email_verified_at' => now(),
            'role' => 'driver',
        ]);

        User::create([
            'name' => 'Maria Santos',
            'email' => 'maria.santos@example.com',
            'password' => Hash::make('driverpass2'),
            'email_verified_at' => now(),
            'role' => 'driver',
        ]);

        User::create([
            'name' => 'Pedro Reyes',
            'email' => 'pedro.reyes@example.com',
            'password' => Hash::make('driverpass3'),
            'email_verified_at' => now(),
            'role' => 'driver',
        ]);

        User::create([
            'name' => 'Jeff',
            'email' => 'jefherd.lanugan@gmail.com',
            'password' => Hash::make('userpass1'),
            'email_verified_at' => now(),
            'role' => 'user',
        ]);
    }
}
