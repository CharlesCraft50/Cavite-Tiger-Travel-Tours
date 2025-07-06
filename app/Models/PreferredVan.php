<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Booking;
use App\Models\PreferredVanAvailability;

class PreferredVan extends Model
{
    protected $fillable = [
        'name',
        'additional_fee',
        'image_url',
        'pax_adult',
        'pax_kids',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function availabilities() {
        return $this->hasMany(PreferredVanAvailability::class);
    }
}
