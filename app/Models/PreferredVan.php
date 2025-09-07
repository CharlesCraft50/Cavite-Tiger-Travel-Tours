<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Booking;
use App\Models\PreferredVanAvailability;
use App\Models\User;
use App\Models\VanCategory;

class PreferredVan extends Model
{
    protected $fillable = [
        'name',
        'additional_fee',
        'image_url',
        'pax_adult',
        'pax_kids',
        'user_id',
        'van_category_id',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function availabilities() {
        return $this->hasMany(PreferredVanAvailability::class);
    }

    public function driver() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category() {
        return $this->belongsTo(VanCategory::class, 'van_category_id');
    }
}
