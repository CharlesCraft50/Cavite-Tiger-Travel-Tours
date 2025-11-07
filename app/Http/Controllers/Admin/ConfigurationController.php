<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Country;
use App\Models\OtherService;
use App\Models\PreferredVan;
use App\Models\TourPackage;
use App\Models\User;
use App\Models\VanCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfigurationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $cities = City::all();
        $preferredVans = PreferredVan::with('availabilities')->get();
        $otherServices = OtherService::all();
        $drivers = User::where('role', 'driver')->get();

        return Inertia::render('dashboard/configurations/index', [
            'cities' => $cities,
            'preferredVans' => $preferredVans,
            'drivers' => $drivers,
            'otherServices' => $otherServices,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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

    public function packages(Request $request)
    {
        $selectedCountryName = 'Philippines';
        $selectedCountry = Country::where('name', $selectedCountryName)->first();
        $cities = $selectedCountry ? $selectedCountry->cities : collect();

        $baseQuery = TourPackage::query();

        $baseQuery->where('package_type', 'normal');

        if ($request->has('city_id')) {
            $baseQuery->where('city_id', $request->city_id);
        }

        $mainQuery = (clone $baseQuery);

        $packages = $mainQuery->get();

        return Inertia::render('dashboard/configurations/packages', [
            'packages' => $packages,
            'cities' => $cities,
            'countries' => Country::all(),
            'selectedCountry' => $selectedCountry,
        ]);
    }

    public function events(Request $request)
    {
        $selectedCountryName = 'Philippines';
        $selectedCountry = Country::where('name', $selectedCountryName)->first();
        $cities = $selectedCountry ? $selectedCountry->cities : collect();

        $baseQuery = TourPackage::query();

        $baseQuery->where('package_type', 'event');

        if ($request->has('city_id')) {
            $baseQuery->where('city_id', $request->city_id);
        }

        $mainQuery = (clone $baseQuery);

        $packages = $mainQuery->get();

        return Inertia::render('dashboard/configurations/events', [
            'packages' => $packages,
            'cities' => $cities,
            'countries' => Country::all(),
            'selectedCountry' => $selectedCountry,
        ]);
    }

    public function vehicles()
    {
        $preferredVans = PreferredVan::with(['availabilities', 'category'])->get();
        $vanCategories = VanCategory::all();
        $drivers = User::where('role', 'driver')->get();

        return Inertia::render('dashboard/configurations/vehicles', [
            'preferredVans' => $preferredVans,
            'drivers' => $drivers,
            'vanCategories' => $vanCategories,
        ]);
    }

    public function cities()
    {
        $cities = City::all();

        return Inertia::render('dashboard/configurations/cities', [
            'cities' => $cities,
        ]);
    }

    public function otherServices()
    {
        $otherServices = OtherService::all();

        return Inertia::render('dashboard/configurations/other-services', [
            'otherServices' => $otherServices,
        ]);
    }
}
