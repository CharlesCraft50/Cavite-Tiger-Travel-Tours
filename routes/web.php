<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\Settings\ProfileController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // ✅ Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/image/upload', [ImageController::class, 'store'])->name('image.store');
Route::get('/image/{id}', [ImageController::class, 'show'])->name('image.show');

Route::resource('/packages', PackageController::class);
Route::get('/book-now/{slug}', [BookingController::class, 'create'])->name('booking.create');
Route::get('/packages/{slug}', [PackageController::class, 'show'])->name('packages.show');
Route::post('/book-now/booked', [BookingController::class, 'store'])->name('booking.store');

Route::get('/test', function () {
    return Inertia::render('success-page');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
