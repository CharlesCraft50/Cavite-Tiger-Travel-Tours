<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Country;
use App\Http\Requests\UpdateCountryRequest;
use App\Traits\StoresImages;

class CountryController extends Controller
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
    public function update(UpdateCountryRequest $request, string $id)
    {
        //
        $country = Country::findOrFail($id);
        $validated = $request->validated();

        if($request->hasFile('image_url')) {
            $validated['image_url'] = asset('storage/' . $this->storeGetImage($request, 'image_url'));
        }

        $country->update($validated);

        return redirect()->route('countries.index')->with('success', 'Country updated.');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
