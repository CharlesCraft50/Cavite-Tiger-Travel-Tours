<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePreferredVanRequest;
use App\Models\PreferredVan;
use App\Models\PreferredVanAvailability;
use App\Models\VanCategory;
use App\Traits\StoresImages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PreferredVanController extends Controller
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
    public function update(UpdatePreferredVanRequest $request)
    {
        $validated = $request->validated();

        foreach ($validated['vans'] as $index => $vanData) {
            $fileKey = "vans.$index.image_url";

            if ($request->hasFile($fileKey)) {
                $validated['vans'][$index]['image_url'] = asset('storage/'.$this->storeGetImage($request, $fileKey, 'vans'));
            }
        }

        // Update category sort order
        if (! empty($validated['categories'])) {
            foreach ($validated['categories'] as $categoryData) {
                VanCategory::where('id', $categoryData['id'])
                    ->update(['sort_order' => $categoryData['sort_order']]);
            }
        }

        DB::transaction(function () use ($validated) {
            foreach ($validated['vans'] as $vanData) {

                $action = $vanData['action'] ?? 'update';

                if ($action === 'create') {
                    $van = PreferredVan::create([
                        'name' => $vanData['name'],
                        'image_url' => $vanData['image_url'] ?? null,
                        'user_id' => $vanData['user_id'] ?? null,
                        'additional_fee' => $vanData['additional_fee'],
                        'pax_adult' => $vanData['pax_adult'],
                        'pax_kids' => $vanData['pax_kids'],
                        'plate_number' => $vanData['plate_number'] ?? null,
                        'van_category_id' => $vanData['van_category_id'] ?? null,
                    ]);

                    if (! empty($vanData['availabilities'])) {
                        foreach ($vanData['availabilities'] as $availability) {
                            $van->availabilities()->create([
                                'available_from' => $availability['available_from'],
                                'available_until' => $availability['available_until'],
                                'count' => $availability['count'],
                            ]);
                        }
                    }
                } elseif ($action === 'delete') {
                    PreferredVan::where('id', $vanData['id'])->delete();
                    PreferredVanAvailability::where('preferred_van_id', $vanData['id'])->delete();
                } else { // update
                    $van = PreferredVan::find($vanData['id']);
                    if ($van) {
                        $van->update([
                            'name' => $vanData['name'],
                            'image_url' => $vanData['image_url'] ?? $van->image_url,
                            'user_id' => $vanData['user_id'] ?? null,
                            'additional_fee' => $vanData['additional_fee'],
                            'pax_adult' => $vanData['pax_adult'],
                            'pax_kids' => $vanData['pax_kids'],
                            'plate_number' => $vanData['plate_number'] ?? null,
                            'van_category_id' => $vanData['van_category_id'] ?? null,
                        ]);

                        if (isset($vanData['availabilities'])) {
                            $van->availabilities()->delete(); // only delete if new ones are provided

                            foreach ($vanData['availabilities'] as $availability) {
                                $van->availabilities()->create([
                                    'available_from' => $availability['available_from'],
                                    'available_until' => $availability['available_until'],
                                    'count' => $availability['count'],
                                ]);
                            }
                        }
                    }
                }
            }
        });

        return back(303);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
