<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TourPackage;

class AvailableDate extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_package_id',
        'travel_date',
        'vans_available'
    ];

    public function tourPackage() {
        return $this->belongsTo(TourPackage::class);
    }
}
