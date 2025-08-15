<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VanApiController;
use App\Http\Controllers\Api\PackageApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/van/{vanId}/availability', [VanApiController::class, 'availability']);
Route::get('/packages/latest', [PackageApiController::class, 'getLatestPackages']);
Route::get('/packages', [PackageApiController::class, 'search'])->name('packages.search');
