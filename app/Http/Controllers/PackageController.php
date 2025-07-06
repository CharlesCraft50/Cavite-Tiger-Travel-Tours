<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TourPackage;
use App\Models\PackageCategory;
use App\Models\City;
use App\Models\PreferredVan;
use App\Models\Country;
use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use Illuminate\Support\Facades\DB;
use App\Traits\StoresImages;

class PackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    
    use StoresImages;
    
    public function index()
    {
        $selectedCountryName = "Philippines";

        // Get the country by name (or use where('id', ...) if you use IDs)
        $selectedCountry = Country::where('name', $selectedCountryName)->first();

        // Default to empty if country not found
        $cities = $selectedCountry ? $selectedCountry->cities : collect();

        return Inertia::render('packages/index', [
            'packages' => TourPackage::all(),
            'cities' => $cities,
            'countries' => Country::all(),
            'selectedCountry' => $selectedCountry, // optional: pass to show in frontend
        ]);
    }

    public function create(Request $request) {

        $cities = City::all();
        $preferredVans = PreferredVan::with('availabilities')->get();
        
        return (Inertia::render('packages/create', [
            'cities' => $cities,
            'preferredVans' => $preferredVans,
            'editMode' => false,
        ]));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePackageRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('image_overview')) {
            $validated['image_overview'] = asset('storage/' . $this->storeGetImage($request, 'image_overview', 'packages'));
        }

        if ($request->hasFile('image_banner')) {
            $validated['image_banner'] = asset('storage/' . $this->storeGetImage($request, 'image_banner', 'packages'));
        }

        DB::beginTransaction();

        try {
            $package = TourPackage::create($validated);

            if ($request->has('preferred_van_ids')) {
                $package->preferredVans()->sync($request->input('preferred_van_ids'));
            }

            // Categories now come as an array, not a JSON string
            if ($request->has('categories')) {
                $categories = $request->input('categories'); // This is now an array

                foreach ($categories as $category) {
                    PackageCategory::create([
                        'tour_package_id' => $package->id,
                        'name' => $category['name'] ?? '',
                        'content' => $category['content'] ?? '',
                        'has_button' => $category['has_button'] ?? 0,
                        'button_text' => $category['button_text'] ?? 'Book Now',
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

    public function showCategory($packageSlug, $categorySlug)
    {
        $packages = TourPackage::where('slug', $packageSlug)->firstOrFail();

        $category = $packages->categories()
            ->where('slug', $categorySlug)
            ->firstOrFail();

        return Inertia::render('packages/show', [
            'packages' => $packages,
            'categories' => $packages->categories,
            'category' => $category,
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
        $cities = City::all();
        $preferredVans = PreferredVan::with('availabilities')->get();
                
        $package = TourPackage::findOrFail($id);
        return (Inertia::render('packages/create', [
            'cities' => $cities,
            'editMode' => true,
            'packages' => $package,
            'packageCategories' => $package->categories,
            'preferredVans' => $preferredVans,
            'vanIds' => $package->preferredVans->pluck('id'),
        ]));
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePackageRequest $request, string $id)
    {
        $package = TourPackage::findOrFail($id);
        $validated = $request->validated();

        if($request->hasFile('image_banner')) {
            $validated['image_banner'] = asset('storage/' . $this->storeGetImage($request, 'image_banner', 'packages'));
        } else {
            unset($validated['image_banner']);
        }

        if($request->hasFile('image_overview')) {
            $validated['image_overview'] = asset('storage/' . $this->storeGetImage($request, 'image_overview', 'packages'));
        } else {
            unset($validated['image_overview']);
        }

        DB::beginTransaction();

        try {
            $package->update($validated);

            if ($request->has('preferred_van_ids')) {
                $package->preferredVans()->sync($request->input('preferred_van_ids'));
            }

            if ($request->has('categories')) {
                $categories = $request->input('categories');

                $package->categories()->delete();

                foreach ($categories as $category) {
                    PackageCategory::create([
                        'tour_package_id' => $package->id,
                        'name' => $category['name'] ?? '',
                        'content' => $category['content'] ?? '',
                        'has_button' => $category['has_button'] ?? 0,
                        'button_text' => $category['button_text'] ?? 'Book Now',
                    ]);
                }
            }

            DB::commit();

            return Inertia::render('success-page', [
                'title' => 'Package Updated!',
                'description' => 'The package "' . $package->title . '" has been successfully updated.',
                'redirectUrl' => '/packages/' . $package->slug,
                'redirectTimer' => 500,
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to update package. ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
