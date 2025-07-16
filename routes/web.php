<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\BookNowController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\BookingPaymentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\PreferredVanController;
use App\Http\Controllers\OtherServiceController;
use App\Http\Controllers\Api\VanApiController;
use App\Http\Controllers\Admin\UserController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('index');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // ✅ Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('bookings', BookingController::class);
    Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
});

Route::post('/image/upload', [ImageController::class, 'store'])->name('image.store');
Route::get('/image/{id}', [ImageController::class, 'show'])->name('image.show');


Route::get('/book-now/{slug}', [BookNowController::class, 'create'])->name('booking.create');
Route::get('/book-now/{slug}/category/{categorySlug?}', [BookNowController::class, 'create'])->name('booking.create.category');
Route::post('/book-now/booked', [BookNowController::class, 'store'])->name('booking.store');
Route::get('/book-now/payment/{booking_id}', [BookingPaymentController::class, 'index'])->name('booking.payment');
Route::post('/book-now/payment/create', [BookingPaymentController::class, 'store'])->name('booking.payment.store');
Route::get('/api/van/{vanId}/availability', [VanApiController::class, 'availability']);

//Route::resource('packages', PackageController::class);
Route::get('/packages/{packageSlug}/category/{categorySlug}', [PackageController::class, 'showCategory'])
    ->name('packages.category.show');
Route::get('/packages', [PackageController::class, 'index'])->name('packages.index');

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/packages/create', [PackageController::class, 'create'])->name('packages.create');
    Route::get('/packages/{package}/edit', [PackageController::class, 'edit'])->name('packages.edit');
    Route::put('/packages/{package}', [PackageController::class, 'update'])->name('packages.update');
    Route::delete('/packages/{package}', [PackageController::class, 'destroy'])->name('packages.destroy');
    Route::post('/packages', [PackageController::class, 'store'])->name('packages.store');

    // Admin-only resources
    Route::resource('cities', CityController::class);
    Route::resource('countries', CountryController::class);
    Route::put('/preferredvan/update', [PreferredVanController::class, 'update'])->name('preferredvan.update');
    Route::put('/otherservice/update', [OtherServiceController::class, 'update'])->name('otherservice.update');
    Route::get('/analytics', [BookingController::class, 'analytics'])->name('bookings.analytics');
    Route::resource('users', UserController::class);
});

Route::get('/packages/{slug}', [PackageController::class, 'show'])->name('packages.show');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';