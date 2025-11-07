<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\Admin\ConfigurationController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\BookingPaymentController;
use App\Http\Controllers\BookNowController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\CustomTripController;
use App\Http\Controllers\CustomTripPaymentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\OtherServiceController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\PackageReviewController;
use App\Http\Controllers\PreferredVanController;
use App\Http\Controllers\VanCategoryController;
use App\Http\Controllers\WishlistController;
use App\Models\TourPackage;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/email/verify', function () {
    return Inertia\Inertia::render('pages/auth/verify-email');
})->middleware('auth')->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect('/dashboard');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('message', 'Verification link sent!');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');

Route::get('/', function () {
    $packages = TourPackage::whereIn('id', [1, 2, 3, 4, 5, 6])->get();

    return Inertia::render('index', [
        'packages' => $packages,
    ]);
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/custom-trip', [DashboardController::class, 'customTrip'])->name('customTrip');
    Route::get('/local-trip', [DashboardController::class, 'localTrip'])->name('localTrip');
    Route::get('/events', [DashboardController::class, 'events'])->name('events');

    Route::resource('bookings', BookingController::class);
    Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

    Route::resource('wishlists', WishlistController::class);
    Route::get('/dashboard/about', [AboutController::class, 'index'])->name('dasboard.about');
    Route::get('/certifications', [AboutController::class, 'certifications'])->name('certifications');
    Route::get('/terms-and-conditions', [AboutController::class, 'termsAndConditions'])->name('termsAndConditions');
    Route::get('/privacy-policy', [AboutController::class, 'privacyPolicy'])->name('privacyPolicy');
    Route::get('/cancellation-policy', [AboutController::class, 'cancellationPolicy'])->name('cancellationPolicy');

    Route::post('/custom-trips', [CustomTripController::class, 'store'])->name('customTrips.store');
    Route::get('/custom-trips', [CustomTripController::class, 'index'])->name('customTrips.index');
    Route::get('/custom-trips/{id}', [CustomTripController::class, 'show'])->name('customTrips.show');
    Route::post('/custom-trips/{id}/cancel', [CustomTripController::class, 'cancel'])->name('customTrips.cancel');

    Route::get('/book-now/{slug}', [BookNowController::class, 'create'])->name('booking.create');
    Route::get('/book-now/{slug}/category/{categorySlug?}', [BookNowController::class, 'create'])->name('booking.create.category');
    Route::post('/book-now/booked', [BookNowController::class, 'store'])->name('booking.store');
    Route::get('/book-now/payment/{booking_id}', [BookingPaymentController::class, 'index'])->name('booking.payment');
    Route::post('/book-now/payment/create', [BookingPaymentController::class, 'store'])->name('booking.payment.store');

    Route::get('/custom-trips/payment/{trip_id}', [CustomTripPaymentController::class, 'index'])->name('customTrips.payment');
    Route::post('/custom-trips/payment/create', [CustomTripPaymentController::class, 'store'])->name('customTrip.payment.store');

    Route::post('/package-reviews', [PackageReviewController::class, 'store'])->name('packageReviews.store');
    Route::get('/package-reviews/{tourPackageId}', [PackageReviewController::class, 'index'])->name('packageReviews.index');
    Route::delete('/package-reviews/{packageReview}', [PackageReviewController::class, 'destroy'])->name('packageReviews.destroy');

});

Route::post('/image/upload', [ImageController::class, 'store'])->name('image.store');
Route::get('/image/{id}', [ImageController::class, 'show'])->name('image.show');

// Route::resource('packages', PackageController::class);
Route::get('/packages/{packageSlug}/category/{categorySlug}', [PackageController::class, 'showCategory'])
    ->name('packages.category.show');
Route::get('/packages', [PackageController::class, 'index'])->name('packages.index');

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/analytics', [BookingController::class, 'analytics'])->name('bookings.analytics');
    Route::resource('users', UserController::class);
});

Route::middleware(['auth', 'admin_or_staff'])->group(function () {
    Route::get('/packages/create', [PackageController::class, 'create'])->name('packages.create');
    Route::get('/packages/{package}/edit', [PackageController::class, 'edit'])->name('packages.edit');
    Route::put('/packages/{package}', [PackageController::class, 'update'])->name('packages.update');
    Route::put('/packages/{package}/image_overview', [PackageController::class, 'updateImageOverview'])->name('packages.image_overview');
    Route::delete('/packages/{package}', [PackageController::class, 'destroy'])->name('packages.destroy');
    Route::post('/packages', [PackageController::class, 'store'])->name('packages.store');
    Route::post('/bookings/{id}/markCompletion', [BookingController::class, 'markCompletion'])->name('bookings.markCompletion');
    Route::post('/custom-trips/{id}/markCompletion', [CustomTripController::class, 'markCompletion'])->name('customTrips.markCompletion');

    // Admin-only resources
    Route::resource('cities', CityController::class);
    Route::resource('countries', CountryController::class);
    Route::put('/preferredvan/update', [PreferredVanController::class, 'update'])->name('preferredvan.update');
    Route::put('/otherservice/update', [OtherServiceController::class, 'update'])->name('otherservice.update');
    Route::resource('/vancategories', VanCategoryController::class);

    Route::get('/configurations/packages', [ConfigurationController::class, 'packages'])->name('configurations.packages');
    Route::get('/configurations/events', [ConfigurationController::class, 'events'])->name('configurations.events');
    Route::get('/configurations/vehicles', [ConfigurationController::class, 'vehicles'])->name('configurations.vehicles');
    Route::get('/configurations/cities', [ConfigurationController::class, 'cities'])->name('configurations.cities');
    Route::get('/configurations/other-services', [ConfigurationController::class, 'otherServices'])->name('configurations.otherServices');
});

Route::middleware(['auth', 'admin_or_driver_or_staff'])->group(function () {
    Route::put('/custom-trips/{id}', [CustomTripController::class, 'update'])->name('customTrips.update');
    Route::post('/bookings/{id}/complete', [BookingController::class, 'complete'])->name('bookings.complete');
    Route::post('/custom-trips/{id}/complete', [CustomTripController::class, 'complete'])->name('customTrips.complete');
});

Route::get('/packages/{slug}', [PackageController::class, 'show'])->name('packages.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
