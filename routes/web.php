<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::resource('/packages', PackageController::class);
Route::get('/book-now/{slug}', [BookingController::class, 'create'])->name('booking.create');
Route::get('/packages/{slug}', [PackageController::class, 'show'])->name('packages.show');
Route::post('/book-now/booked', [BookingController::class, 'store'])->name('booking.store');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
