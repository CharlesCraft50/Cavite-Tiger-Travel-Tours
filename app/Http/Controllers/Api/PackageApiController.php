<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TourPackage;
use Illuminate\Http\Request;

class PackageApiController extends Controller
{
    public function getLatestPackages()
    {
        $packages = TourPackage::with(['categories', 'city:id,name'])
            ->select('id', 'city_id', 'title', 'subtitle', 'overview', 'base_price', 'slug', 'image_overview')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json($packages);
    }

    public function search(Request $request)
    {
        $search = $request->query('search');

        $packages = TourPackage::with(['city:id,name', 'categories:id,name'])
            ->when($search, function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhereHas('city', function ($cityQuery) use ($search) {
                        $cityQuery->where('name', 'like', "%{$search}%");
                    });
            })
            ->select('id', 'city_id', 'title', 'subtitle', 'overview', 'base_price', 'slug', 'image_overview')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'search' => $search,
            'packages' => $packages->map(function ($package) {
                return [
                    'id' => $package->id,
                    'title' => $package->title,
                    'subtitle' => $package->subtitle,
                    'overview' => $package->overview,
                    'base_price' => $package->base_price,
                    'slug' => $package->slug,
                    'image_overview' => $package->image_overview,
                    'city' => $package->city ? $package->city->name : null,
                    'categories' => $package->categories->pluck('name'),
                ];
            }),
        ]);
    }

    public function index(Request $request)
    {
        $query = TourPackage::with(['city:id,name', 'categories:id,name']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%")
                ->orWhereHas('city', function ($cityQuery) use ($search) {
                    $cityQuery->where('name', 'like', "%{$search}%");
                });
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
