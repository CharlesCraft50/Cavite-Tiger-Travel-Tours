<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePackageReviewRequest;
use App\Models\PackageReview;

class PackageReviewController extends Controller
{
    /**
     * Store a newly created review in storage.
     */
    public function store(StorePackageReviewRequest $request)
    {
        $validated = $request->validated();

        $existing = PackageReview::where('user_id', auth()->id())
            ->where('tour_package_id', $validated['tour_package_id'])
            ->first();

        if ($existing) {
            return redirect()->back()->with('error', 'You have already submitted a review for this package.');
        }

        PackageReview::create([
            'user_id' => auth()->id(),
            'tour_package_id' => $validated['tour_package_id'],
            'rating' => $validated['rating'] ?? null,
            'comment' => $validated['comment'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Thank you for your feedback!');
    }

    /**
     * (Optional) Display all reviews for a specific tour package.
     */
    public function index($tourPackageId)
    {
        $reviews = PackageReview::with('user')
            ->where('tour_package_id', $tourPackageId)
            ->latest()
            ->get();

        return response()->json($reviews);
    }

    /**
     * Delete a review (if the user owns it).
     */
    public function destroy(PackageReview $packageReview)
    {
        $this->authorize('delete', $packageReview);

        $packageReview->delete();

        return response()->json(['message' => 'Review deleted successfully.']);
    }
}
