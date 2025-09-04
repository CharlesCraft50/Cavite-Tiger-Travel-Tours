<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TourPackage;
use App\Models\City;

class PackageApiController extends Controller
{
    public function getLatestPackages() {
        $packages = TourPackage::with('categories')
            ->select('title', 'subtitle', 'overview', 'base_price', 'slug', 'image_overview')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json($packages);
    }

    public function search(Request $request)
    {
        $search = $request->query('search');

        $packages = TourPackage::with(['city', 'categories'])
            ->when($search, fn($q) =>
                $q->where(function($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhereHas('city', function($cityQuery) use ($search) {
                            $cityQuery->where('name', 'like', "%{$search}%");
                        });
                })
            )
            ->get();

        return response()->json([
            'packages' => $packages,
            'search' => $search
        ]);
    }

    public function index(Request $request)
    {
        $query = TourPackage::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%");
        }

        $sort = $request->input('sort', 'desc');
        $query->orderBy('created_at', $sort === 'asc' ? 'asc' : 'desc');

        $perPage = $request->input('per_page', 20);
        $packages = $query->paginate($perPage);

        return response()->json([
            'packages' => $packages->items(),
            'current_page' => $packages->currentPage(),
            'last_page' => $packages->lastPage(),
            'total' => $packages->total(),
        ]);
    }
}
