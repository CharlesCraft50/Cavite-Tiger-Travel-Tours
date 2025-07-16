<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Booking;

class BookingPayment extends Model
{
    protected $fillable = [
        'booking_id',
        'payment_method',
        'reference_number',
        'payment_proof_path',
    ];

    public function booking() {
        return $this->belongsTo(Booking::class);
    }
}
