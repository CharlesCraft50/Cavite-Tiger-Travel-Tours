<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TourPackage;
use App\Models\PackageCategory;
use App\Models\City;

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

    /**
     * Store a newly created resource in storage.
     */
    public function store($slug)
    {
        //
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
