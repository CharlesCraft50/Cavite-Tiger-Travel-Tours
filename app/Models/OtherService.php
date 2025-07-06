<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OtherService extends Model
{
    //
    protected $fillable = [
        'name',
        'price',
    ];

    public function bookings()
    {
        return $this->belongsToMany(Booking::class, 'booking_service');
    }
}
