<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\City;
use App\Http\Requests\UpdateCityRequest;
use App\Traits\StoresImages;

class CityController extends Controller
{

    use StoresImages;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function update(UpdateCityRequest $request, string $id)
    {
        //
        $city = City::findOrFail($id);
        $validated = $request->validated();

        if($request->hasFile('image_url')) {
            $validated['image_url'] = asset('storage/' . $this->storeGetImage($request, 'image_url'));
        }
        
        $city->update($validated);

        return redirect()->route('cities.index')->with('success', 'City updated.');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
