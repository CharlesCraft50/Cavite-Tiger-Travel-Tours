<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateOtherServiceRequest;
use App\Traits\StoresImages;
use App\Models\OtherService;
use Illuminate\Support\Facades\DB;

class OtherServiceController extends Controller
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
    public function update(UpdateOtherServiceRequest $request)
    {
        //
        $validated = $request->validated();

        logger($validated);

        foreach ($validated['services'] as $index => $serviceData) {
            $fileKey = "services.$index.image_url";

            if ($request->hasFile($fileKey)) {
                $validated['services'][$index]['image_url'] = asset('storage/' . $this->storeGetImage($request, $fileKey, 'other_services'));
            }
        }

        DB::transaction(function () use ($validated) {
            foreach ($validated['services'] as $serviceData) {

                $action = $serviceData['action'] ?? 'update';

                if ($action === 'create') {
                    $service = OtherService::create([
                        'name' => $serviceData['name'],
                        'image_url' => $serviceData['image_url'] ?? null,
                        'description' => $serviceData['description'] ?? null,
                        'price' => $serviceData['price'],
                    ]);

                    logger($service);
                } 
                elseif ($action === 'delete') {
                    OtherService::where('id', $serviceData['id'])->delete();
                }
                else {
                    $service = OtherService::find($serviceData['id']);
                    if ($service) {
                        $service->update([
                            'name' => $serviceData['name'],
                            'image_url' => $serviceData['image_url'] ?? $service->image_url,
                            'description' => $serviceData['description'] ?? $service->description,
                            'price' => $serviceData['price'],
                        ]);
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
