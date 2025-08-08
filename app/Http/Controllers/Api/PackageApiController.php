<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TourPackage;

class PackageApiController extends Controller
{
    public function getLatestPackages() {
        $packages = TourPackage::with('categories')
            ->select('title', 'subtitle', 'overview', 'base_price', 'slug')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json($packages);
    }
}
