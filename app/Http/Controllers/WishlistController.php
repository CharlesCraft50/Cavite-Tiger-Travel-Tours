<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWishlistRequest;
use Illuminate\Http\Request;
use App\Models\Wishlist;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {

        $wishlist = Wishlist::with(['tourPackage', 'user'])->where('user_id', Auth::id())->get();
        
        return Inertia::render('dashboard/wishlists/index', [
            'wishlists' => $wishlist
        ]);
    }

    public function store(StoreWishlistRequest $request)
    {
        $validated = $request->validated();

        $exists = Wishlist::where('tour_package_id', $validated['tour_package_id'])
            ->where('user_id', $validated['user_id'])
            ->exists();

        if (!$exists) {
            Wishlist::create($validated);
        } else {
            Wishlist::where('tour_package_id', $validated['tour_package_id'])
                ->where('user_id', $validated['user_id'])
                ->delete();
        }

        return redirect()->back();
    }

    public function show(string $id)
    {
        return Wishlist::findOrFail($id);
    }

    public function update(StoreWishlistRequest $request, string $id)
    {
        $wishlist = Wishlist::findOrFail($id);
        $wishlist->update($request->validated());

        return response()->json([
            'success' => true,
            'wishlist' => $wishlist
        ]);
    }

    public function destroy(string $id)
    {
        $wishlist = Wishlist::findOrFail($id);
        $wishlist->delete();

        return response()->json([
            'success' => true
        ]);
    }
}
