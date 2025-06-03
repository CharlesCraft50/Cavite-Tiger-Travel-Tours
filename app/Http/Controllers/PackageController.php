<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TourPackage;
use App\Models\PackageCategory;
use App\Models\City;
use App\Http\Requests\StorePackageRequest;
use Illuminate\Support\Facades\DB;

class PackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        return (Inertia::render('packages/index', [
            'packages' => TourPackage::all()
        ]));
    }

    public function create() {
        $cities = City::all();
        return (Inertia::render('packages/create', [
            'cities' => $cities
        ]));
    }
    
    private function storeGetImage($request, $id) {
        $file = $request->file($id);
        $path = $file->store('packages', 'public');
        return $path;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePackageRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('image_overview')) {
            $validated['image_overview'] = asset('storage/' . $this->storeGetImage($request, 'image_overview'));
        }

        if ($request->hasFile('image_banner')) {
            $validated['image_banner'] = asset('storage/' . $this->storeGetImage($request, 'image_banner'));
        }

        DB::beginTransaction();

        try {
            $package = TourPackage::create($validated);

            // Categories now come as an array, not a JSON string
            if ($request->has('categories')) {
                $categories = $request->input('categories'); // This is now an array

                foreach ($categories as $category) {
                    PackageCategory::create([
                        'tour_package_id' => $package->id,
                        'name' => $category['name'] ?? '',
                        'content' => $category['content'] ?? '',
                        'has_button' => $category['has_button'] ?? 0,
                    ]);
                }
            }

            DB::commit();

            return Inertia::render('success-page', [
                'title' => 'Package Created!',
                'description' => 'The package "' . $request->title . '" has been successfully created.',
                'redirectUrl' => '/packages/' . $package->slug,
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to save package. ' . $e->getMessage()]);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        //
        $package = TourPackage::where('slug', $slug)->firstOrFail();
        
        return (inertia::render('packages/show', [
            'packages' => $package,
            'categories' => $package->categories
        ]));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
