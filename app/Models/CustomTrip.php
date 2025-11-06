<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CustomTrip extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'contact_number',
        'email',
        'date_of_trip',
        'pickup_time',
        'pickup_address',
        'destination',
        'preferred_van_id',
        'driver_id',
        'is_confirmed',
        'booking_number',
        'total_amount',
        'is_final_total',
        'is_completed',
        'status',
        'pax_adult',
        'pax_kids',
        'notes',
        'trip_type',
        'costing_type',
        'duration',
    ];

    protected static function booted()
    {
        static::creating(function ($customTrip) {
            do {
                $tripNumber = strtoupper(Str::random(6));
            } while (CustomTrip::where('booking_number', $tripNumber)->exists());

            $customTrip->booking_number = $tripNumber;
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function preferredVan()
    {
        return $this->belongsTo(PreferredVan::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function payment()
    {
        return $this->hasOne(CustomTripPayment::class);
    }

    public function reviews()
    {
        return $this->hasMany(PackageReview::class);
    }

    public function reviewByUser($userId = null)
    {
        $userId = $userId ?? auth()->id();

        return $this->hasOne(PackageReview::class)
            ->where('user_id', $userId);
    }
}
