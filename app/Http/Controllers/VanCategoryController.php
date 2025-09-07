<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreVanCategoryRequest;
use App\Models\VanCategory;

class VanCategoryController extends Controller
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
    public function store(StoreVanCategoryRequest $request)
    {
        $validated = $request->validated();

        // Push all existing categories down
        VanCategory::query()->increment('sort_order');

        // Insert new one at the top
        $category = VanCategory::create([
            ...$validated,
            'sort_order' => 1,
        ]);

        return back(303)->with('success', 'Successfully added category!');
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
        $category = VanCategory::find($id);

        if (!$category) {
            return back(303)->with('error', 'Category not found.');
        }

        $category->preferredVans()->update(['van_category_id' => null]);

        $category->delete();

        return back(303)->with('success', 'Category deleted successfully.');
    }
}
