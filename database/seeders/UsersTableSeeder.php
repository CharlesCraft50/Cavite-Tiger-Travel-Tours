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

        // Additional Users
        User::create([
            'first_name' => 'Alfredo',
            'last_name' => 'Arnaiz Jr',
            'email' => 'alfredoarnaizjr11@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000005',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Earl',
            'last_name' => 'Calda',
            'email' => 'earlcalda1998@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000006',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Daniel',
            'last_name' => 'Coyoca',
            'email' => 'coyocadaniela07@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000007',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Gervacio',
            'last_name' => 'Mercadal',
            'email' => 'mercadalgervacio@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000008',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Juwan',
            'last_name' => 'Karlos',
            'email' => 'pmjuwankarlosz@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000009',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Edgar',
            'last_name' => 'Rendon',
            'email' => 'rendonedgar760@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000010',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Bryan',
            'last_name' => 'Sanchez',
            'email' => 'bryanzhechnas@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000011',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Alwin',
            'last_name' => 'Sanoria',
            'email' => 'alwingiesanoria@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000012',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Analyn',
            'last_name' => 'Angres',
            'email' => 'analynlangres06@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000013',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Mon',
            'last_name' => 'Tejero',
            'email' => 'fmontejero@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000014',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Christian Paul',
            'last_name' => 'Bodiongan',
            'email' => 'christianpaulbodiongan@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000015',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Junar',
            'last_name' => 'Moni II',
            'email' => 'junarmonii@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000016',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Brent Justin',
            'last_name' => 'Fuentes',
            'email' => 'brentjustine.mirafuentes1598@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000017',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Michelle',
            'last_name' => 'Gamolo',
            'email' => 'gamolomichelle18@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000018',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'CG',
            'last_name' => 'Laurina',
            'email' => 'cglaurina@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000019',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Miemie',
            'last_name' => 'Juan',
            'email' => 'miemieone01@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000020',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Vernil',
            'last_name' => 'Ramada',
            'email' => 'vernilramada123@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000021',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Jason',
            'last_name' => 'David',
            'email' => 'jasondaviddensing30@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000022',
            'address' => 'Angeles City, Pampanga',
        ]);

        User::create([
            'first_name' => 'Ciss',
            'last_name' => 'Cortez',
            'email' => 'cortzj3ssic@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'contact_number' => '639170000023',
            'address' => 'Angeles City, Pampanga',
        ]);
    }
}
