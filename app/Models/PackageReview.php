<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tour_package_id',
        'custom_trip_id',
        'rating',
        'comment',
    ];

    public function tourPackage()
    {
        return $this->belongsTo(TourPackage::class);
    }

    public function tripPackage()
    {
        return $this->belongsTo(CustomTrip::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
