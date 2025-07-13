<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OtherService extends Model
{
    //
    protected $fillable = [
        'name',
        'image_url',
        'description',
        'price',
    ];

    public function bookings()
    {
        return $this->belongsToMany(Booking::class, 'booking_service');
    }

    public function tourPackages()
    {
        return $this->belongsToMany(TourPackage::class, 'other_service_tour_packages')
            ->withPivot('package_specific_price', 'is_recommended', 'sort_order')
            ->withTimestamps();
    }
}
