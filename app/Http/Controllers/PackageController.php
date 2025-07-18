<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TourPackage;
use App\Models\PackageCategory;
use App\Models\City;
use App\Models\PreferredVan;
use App\Models\OtherService;
use App\Models\Country;
use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use Illuminate\Support\Facades\DB;
use App\Traits\StoresImages;
use Illuminate\Pagination\LengthAwarePaginator;

class PackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    
    use StoresImages;
    
    public function index(Request $request)
    {
        $selectedCountryName = "Philippines";
        $selectedCountry = Country::where('name', $selectedCountryName)->first();
        $cities = $selectedCountry ? $selectedCountry->cities : collect();

        $query = TourPackage::query();

        if ($request->has('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        if ($request->boolean('no_paginate')) {
            $packages = $query->get(); // return ALL
        } else {
            $packages = $query->paginate(2);
        }

        return Inertia::render('packages/index', [
            'packages' => $packages,
            'cities' => $cities,
            'countries' => Country::all(),
            'selectedCountry' => $selectedCountry,
        ]);
    }

    public function create(Request $request) {

        $cities = City::all();
        $preferredVans = PreferredVan::with('availabilities')->get();
        $otherServices = OtherService::all();
        
        return (Inertia::render('packages/create', [
            'cities' => $cities,
            'preferredVans' => $preferredVans,
            'otherServices' => $otherServices,
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

            if ($request->has('other_services')) {
                $pivotData = [];

                foreach ($request->input('other_services') as $item) {
                    $pivotData[$item['id']] = [
                        'package_specific_price' => $item['package_specific_price'],
                        'is_recommended' => $item['is_recommended'] ?? false,
                        'sort_order' => $item['sort_order'] ?? 0,
                    ];
                }

                $package->otherServices()->attach($pivotData);
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
                        'use_custom_price' => $category['use_custom_price'] ?? 0,
                        'custom_price' => $category['custom_price'] ?? 0,
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
       
        $package->load([
            'categories', 
            'preferredVans.availabilities', 
            'otherServices' => function ($query) {
                $query->withPivot(['package_specific_price', 'is_recommended', 'sort_order']);
            }
        ]);
        
        return (inertia::render('packages/show', [
            'packages' => $package,
            'categories' => $package->categories,
            'preferredVans' => $package->preferredVans,
            'otherServices' => $package->otherServices,
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
        $cities = City::all();
        $preferredVans = PreferredVan::with('availabilities')->get();

        $package = TourPackage::findOrFail($id);

        $allServices = OtherService::all();
        $selectedServices = $package->otherServices()->withPivot(['package_specific_price', 'is_recommended', 'sort_order'])->get();

        $otherServices = $allServices->map(function ($service) use ($selectedServices) {
            $pivot = $selectedServices->firstWhere('id', $service->id)?->pivot;

            return [
                'id' => $service->id,
                'name' => $service->name,
                'description' => $service->description,
                'image_url' => $service->image_url,
                'package_specific_price' => $pivot->package_specific_price ?? null,
                'is_recommended' => $pivot->is_recommended ?? false,
                'sort_order' => $pivot->sort_order ?? 0,
            ];
        });

        return Inertia::render('packages/create', [
            'cities' => $cities,
            'editMode' => true,
            'packages' => $package,
            'packageCategories' => $package->categories,
            'preferredVans' => $preferredVans,
            'vanIds' => $package->preferredVans->pluck('id'),
            'otherServices' => $otherServices,
            'serviceIds' => $package->otherServices->pluck('id'),
        ]);
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

            if ($request->has('other_services')) {
                $pivotData = [];

                foreach ($request->input('other_services') as $item) {
                    $pivotData[$item['id']] = [
                        'package_specific_price' => $item['package_specific_price'],
                        'is_recommended' => $item['is_recommended'] ?? false,
                        'sort_order' => $item['sort_order'] ?? 0,
                    ];
                }

                $package->otherServices()->sync($pivotData);
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
                        'use_custom_price' => $category['use_custom_price'] ?? 0,
                        'custom_price' => $category['custom_price'] ?? 0,
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
