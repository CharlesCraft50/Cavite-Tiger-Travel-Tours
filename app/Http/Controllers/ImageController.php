<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
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
        if (!$request->hasFile('image')) {
            return response()->json(['error' => 'No image uploaded'], 400);
        }

        $file = $request->file('image');

        // Store on the 'public' disk inside 'uploads' folder
        $path = $file->store('uploads', 'public');

        // Build the public URL
        $url = asset('storage/' . $path);

        return response()->json(['url' => $url]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Assuming $id is the filename, e.g. 'uploads/image.jpg'
        $filePath = 'public/uploads/' . $id;

        if (!Storage::exists($filePath)) {
            abort(404, 'Image not found');
        }

        // Return the file as a response (with correct content type)
        return response()->file(storage_path('app/' . $filePath));
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
