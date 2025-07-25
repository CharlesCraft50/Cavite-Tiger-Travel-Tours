<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TourPackage;
use App\Models\PackageCategory;
use App\Models\OtherService;
use App\Models\PreferredVan;
use App\Models\User;
use App\Models\BookingPayment;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_package_id',
        'package_category_id',
        'user_id',
        'preferred_van_id',
        'first_name',
        'last_name',
        'contact_number',
        'email',
        'departure_date',
        'return_date',
        'pax_adult',
        'pax_kids',
        'notes',
        'payment_method',
        'is_confirmed',
        'status',
        'total_amount',
    ];

    
    protected static function booted()
    {
        static::creating(function ($booking) {
            do {
                $bookingNumber = strtoupper(Str::random(6));
            } while (Booking::where('booking_number', $bookingNumber)->exists());

            $booking->booking_number = $bookingNumber;
        });
    }

    public function tourPackage()
    {
        return $this->belongsTo(TourPackage::class);
    }

    public function packageCategory()
    {
        return $this->belongsTo(PackageCategory::class);
    }

    public function preferredVan()
    {
        return $this->belongsTo(PreferredVan::class);
    }

    public function otherServices()
    {
        return $this->belongsToMany(OtherService::class, 'booking_service');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function payment() {
        return $this->hasOne(BookingPayment::class);
    }
}
