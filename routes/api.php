<?php

use App\Http\Controllers\Api\NotificationApiController;
use App\Http\Controllers\Api\PackageApiController;
use App\Http\Controllers\Api\VanApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/van/{vanId}/availability', [VanApiController::class, 'availability']);
Route::get('/packages/latest', [PackageApiController::class, 'getLatestPackages']);
Route::get('/events/latest', [PackageApiController::class, 'getLatestEvents']);
Route::get('/packages', [PackageApiController::class, 'index'])->name('api.packages.index');
Route::get('/events', [PackageApiController::class, 'indexEvents'])->name('api.events.index');

Route::get('/notifications/{userId}', [NotificationApiController::class, 'index']);
Route::get('/notifications/{userId}/read', [NotificationApiController::class, 'markAllAsRead']);
