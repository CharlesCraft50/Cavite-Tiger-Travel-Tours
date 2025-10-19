<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomTripPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'custom_trip_id',
        'payment_method',
        'reference_number',
        'payment_proof_path',
        'status',
    ];

    public function customTrip()
    {
        return $this->belongsTo(CustomTrip::class);
    }
}
